
'use server';

import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, MessagesAnnotation, END } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { SystemMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import type { AIMessage } from '@langchain/core/messages';
import { queryVectorStore } from '@/lib/rag';

// ─── Preserve the existing public interface ───────────────────────────
const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe('The user question for the AI assistant.'),
  context: z.string().optional().describe('Optional manual context override.'),
});

export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The generated answer from the AI assistant.'),
});

export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

// ─── Tool Definitions ────────────────────────────────────────────────
// Wraps the existing RAG vector-store search as a LangChain tool
// so the agent can autonomously decide when to search.
const searchPortfolio = tool(
  async ({ query }: { query: string }) => {
    console.log(`[Agent Tool] search_portfolio called with: "${query}"`);
    try {
      const results = await queryVectorStore(query, 5);
      if (results && results.length > 0) {
        const formatted = results
          .map(
            (r) =>
              `[Source: ${r.metadata.source || 'Unknown'} | Score: ${r.score?.toFixed(2)}]\n${r.metadata.text}`
          )
          .join('\n\n---\n\n');
        console.log(`[Agent Tool] Retrieved ${results.length} chunks.`);
        return formatted;
      }
      return 'No relevant results found in the portfolio knowledge base.';
    } catch (error) {
      console.error('[Agent Tool] search_portfolio error:', error);
      return 'Error searching portfolio knowledge base.';
    }
  },
  {
    name: 'search_portfolio',
    description:
      'Search Chancellor Minus\'s portfolio knowledge base for information about his skills, experience, projects, ventures, certifications, and professional background. Use this tool whenever you need factual information to answer a question.',
    schema: z.object({
      query: z
        .string()
        .describe('The search query to find relevant information in the portfolio.'),
    }),
  }
);

const agentTools = [searchPortfolio];

// ─── LLM Configuration ──────────────────────────────────────────────
const llm = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Bind the tools to the LLM so it knows what is available.
const llmWithTools = llm.bindTools(agentTools);

// ─── System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert AI assistant for Chancellor Minus, a seasoned AI, Data, and DevOps Engineer. Your name is "iSynera".

**Your Core Directives:**
1.  **Answer Concisely and Professionally:** Your primary goal is to answer the user's query directly and accurately. Use the search_portfolio tool to retrieve information from Chancellor's knowledge base when needed.
2.  **Assume the Persona of Chancellor's Assistant:** Speak intelligently and confidently about his skills and experience. Use "he" or "Chancellor" when referring to him.
3.  **Synthesize, Don't Just Repeat:** Do not just copy-paste from tool results. Synthesize the relevant information into a well-written, professional response.
4.  **Handle Irrelevant Queries Gracefully:** If the user's query is unrelated to Chancellor's portfolio, skills, or experience (e.g., "hello", "what is the weather?"), provide a polite, conversational response. You can introduce yourself and offer to answer questions about his professional background.
5.  **CRITICAL RULE: NEVER SAY YOU CAN'T FIND INFORMATION.** If the tool returns no results, do not say "I couldn't find information" or "Based on the context...". Instead, use the graceful handling described in rule 4.
6.  **Always search first:** For any question about Chancellor's background, skills, projects, or experience, ALWAYS use the search_portfolio tool before answering. Do not guess or make up information.`;

// ─── Graph Nodes ─────────────────────────────────────────────────────
// The "agent" node: calls the LLM, which decides whether to use tools or respond.
async function agentNode(state: typeof MessagesAnnotation.State) {
  console.log('[Agent Node] Thinking...');
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}

// The "tools" node: executes any tools the LLM requested.
const toolNode = new ToolNode(agentTools);

// ─── Routing Logic ───────────────────────────────────────────────────
// After the agent responds, decide whether to execute tools or finish.
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  // If the LLM made tool calls, route to the tools node.
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    console.log(`[Router] Agent requested ${lastMessage.tool_calls.length} tool call(s). Routing to tools.`);
    return 'tools';
  }

  // Otherwise the agent is done reasoning.
  console.log('[Router] Agent finished reasoning. Ending.');
  return END;
}

// ─── Graph Assembly ──────────────────────────────────────────────────
const agentGraph = new StateGraph(MessagesAnnotation)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue, ['tools', END])
  .addEdge('tools', 'agent')
  .compile();

// ─── Public Entry Point (preserves existing contract) ────────────────
export async function aiPortfolioAssistant(
  input: AIPortfolioAssistantInput
): Promise<AIPortfolioAssistantOutput> {
  const { query, context: manualContext } = input;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Agentic Assistant] New query: "${query}"`);
  console.log(`${'='.repeat(60)}`);

  // Build the initial messages for the graph.
  const messages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT)];

  // If manual context was passed from actions.ts, include it as
  // additional context so the agent has it immediately.
  if (manualContext) {
    messages.push(
      new HumanMessage(
        `Here is some additional context that may be relevant:\n\n${manualContext}\n\nNow answer the following question: ${query}`
      )
    );
  } else {
    messages.push(new HumanMessage(query));
  }

  // Invoke the compiled graph.
  const result = await agentGraph.invoke({ messages });

  // Extract the final response from the last message.
  const finalMessage = result.messages[result.messages.length - 1];
  const answer =
    typeof finalMessage.content === 'string'
      ? finalMessage.content
      : '';

  console.log(`[Agentic Assistant] Response length: ${answer.length} chars`);
  console.log(`${'='.repeat(60)}\n`);

  return { answer };
}
