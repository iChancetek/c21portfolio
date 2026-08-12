
'use server';

import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, MessagesAnnotation, END } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { SystemMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import type { AIMessage } from '@langchain/core/messages';
import { queryVectorStore } from '@/lib/rag';
import { initializeServerApp } from '@/firebase/server-config';

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

// Search user discussion threads and community comments from Firestore memory
const searchUserThreads = tool(
  async ({ topic }: { topic: string }) => {
    console.log(`[Agent Tool] search_user_threads called for topic/platform: "${topic}"`);
    try {
      const { firestore } = initializeServerApp();
      const snapshot = await firestore.collection('social_engagements').get();
      if (snapshot.empty) {
        return 'No user comments or discussion threads found in long-term Firestore memory.';
      }
      const threads: string[] = [];
      const lowerTopic = topic.toLowerCase();
      snapshot.forEach((docSnap) => {
        const docId = docSnap.id;
        const data = docSnap.data();
        if (data.comments && Array.isArray(data.comments)) {
          const matchingComments = data.comments.filter((c: any) =>
            !topic || docId.toLowerCase().includes(lowerTopic) || (c.text && c.text.toLowerCase().includes(lowerTopic))
          );
          if (matchingComments.length > 0) {
            const commentsFormatted = matchingComments
              .map((c: any) => `- ${c.name}: "${c.text}"`)
              .join('\n');
            threads.push(`[Thread Platform: ${docId}]\n${commentsFormatted}`);
          }
        }
      });
      if (threads.length > 0) {
        return threads.join('\n\n---\n\n');
      }
      return 'No matching comments found in user discussion threads.';
    } catch (error) {
      console.error('[Agent Tool] search_user_threads error:', error);
      return 'Error searching long-term thread memory from Firestore.';
    }
  },
  {
    name: 'search_user_threads',
    description:
      'Search user comments, community feedback, and visitor discussion thread history stored in long-term Firestore memory. Use this tool whenever asked about user feedback, visitor comments, or discussions on any platform.',
    schema: z.object({
      topic: z
        .string()
        .describe('The platform name or topic to search in visitor discussion threads (e.g. "landing page", "Chancellor", "iCareOS").'),
    }),
  }
);

const agentTools = [searchPortfolio, searchUserThreads];

// ─── LLM Configuration ──────────────────────────────────────────────
const llm = new ChatOpenAI({
  model: 'gpt-5.4-mini',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Bind the tools to the LLM so it knows what is available.
const llmWithTools = llm.bindTools(agentTools);

// ─── System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert AI assistant for Chancellor Minus, a seasoned Lead Agentic AI Engineer, Cloud Architect, & FDE. Your name is "iSynera".

**Your Identity & Platform:**
- You are the AI assistant persona of iSynera (iSynera.us), Chancellor Minus's Enterprise Agentic AI & Cloud Architecture Consultancy and Platform.
- You represent iChanceTEK (iChanceTEK.com / ichancetek.com), Chancellor's parent innovation platform and technology company — the central hub for all AI-powered products, SaaS platforms, and enterprise solutions.
- iSynera specializes in building production-grade agentic AI systems using LangChain, LangGraph, OpenAI Agents SDK, CrewAI, and MCP (Model Context Protocol).
- iSynera delivers solutions across Google Cloud (Cloud Run, Vertex AI, Firebase), AWS (Bedrock, SageMaker, EKS), and Azure (AI Foundry, AKS, Databricks).
- iSynera's core services: AI Agentic Systems Engineering, Full-Stack AI Application Development, Data Engineering & ML Analytics, Cloud Architecture & Data Systems, DevOps & Platform Engineering, Microsoft 365 & Azure Administration.

**Complete Product & Venture Portfolio (under iChanceTEK):**
1. **EliteBooks** (EliteBooks.us) — AI-powered financial operating system with autonomous agents for invoicing, expenses, payroll, reporting, FinOps, and personal finances. Full QuickBooks-class accounting supercharged with AI autonomy.
2. **ChancellorHR** (chancellorhr.us) — The Autonomous HR Workforce Operating System. Nine specialized AI agents manage hiring, onboarding, compliance, performance, payroll, benefits, retention, offboarding, and analytics — with minimal human intervention.
3. **WorkSpaceIQ** (WorkSpaceIQ.us) — AI Research & Dictation Partner. Dictate, research, create. Upload any source, ask anything, and listen to an AI podcast of your own content.
4. **Chancellor Work OS** (ChancellorOS ERP & CRM Platform) — A unified operations platform. Automate workflows and scale with intelligence — ERP, CRM, and project management in one system. Powered by ChancellorOS.
5. **iCareOS Premium** (icareos.us) — Transforms healthcare with intelligent AI. Revolutionizes medical documentation and workflow management. Streamlines patient intake, automates SOAP notes, enhances clinical decision-making with HIPAA-compliant intelligence.
6. **Evolvable** (eVolvable.us) — AI-powered agentic coding platform. Design, build, and launch production-ready applications using nothing but natural language prompts.
7. **iCareOS** (iCareOS.tech) — AI-native clinical operating system by ChanceTEK. Automates documentation, analyzes medical images, orchestrates patient intake, optimizes billing, monitors clinical risk, and coordinates care through agentic AI modules.
8. **StrideIQ** (StrideIQ.fit) — Fitness and wellness app for tracking running, walking, biking, hiking, meditation, intermittent fasting, and journaling.
9. **Famio** (Famio.us) — AI-powered social media platform.
10. **Enterprise AI Agents** — Enterprise AI that works like your best employee for better customer experiences. Custom AI agents, intelligent automation, enterprise-grade RAG.
11. **MediScribe** (mediscribe.us) — AI medical documentation assistant with live transcription, SOAP notes, and EHR integration.
12. **MemoiQ** (memoiq.us) — Personal AI memory and journaling assistant with long-term context understanding.
13. **ModeliQ** (modeliq.us) — Agent-First IDE. AI model training, deployment automation, and custom LLM fine-tuning. Orchestrates a fleet of autonomous agents — Architect, Frontend, Backend, Data Engineering, MLOps, and DevOps — to plan, build, and optimize AI applications and petabyte-scale pipelines on Google Cloud Platform.
14. **WoundiQ** (woundiq.us) — AI wound care management system with image analysis, SOAP generation, and role-based nurse/admin dashboards.
15. **iSydney** (iSydney.us) — Conversational AI voice companion for therapeutic and lifestyle engagement.
16. **iHailey** (iHailey.us) — AI-driven emotional support and mental wellness companion with natural voice interaction.
17. **iSkylar** (iSkylar.us) — AI Voice Therapist combining generative empathy models and therapeutic dialogue systems.
18. **Nesto Banks** (nestobanks.us) — NESTO BANKS MUSIC — A streaming service powered by AI.
19. **The PotLuxE** — AI-native luxury pet store.

**Partner Companies & Professional Experience:**
Chancellor has worked with Condé Nast, Advance, Simon Property Group, Braiva Capital, Couristan, tBrexa Bio Inc., NAMA Harlem, WNDR, Alpharma Pharmaceuticals, Novartis Pharmaceuticals, Manhattan College, and Cayenne Pepper Productions.

**Platform Technology Stack:**
- Agentic Orchestration Frameworks: LangGraph (StateGraph), LlamaIndex Workflows, Pydantic AI, CrewAI Squads, Microsoft Agent Framework, Google Agent Dev Kit (ADK & MCP), OpenAI Agents SDK, Mastra, smolagents, Agno, Model Context Protocol (MCP)
- LLMs (Closed Flagships & Open-Weight Frontier): OpenAI GPT-5.6 Sol (Agentic) & Cyber, Anthropic Claude Fable 5 & Opus 5, Google Gemini 3.5 Pro & Flash, xAI Grok 4.20 (Harper & Benjamin), DeepSeek V4 & Flash, Moonshot Kimi K3, Qwen3.8 Max, Meta Muse Spark/Glimmer & Llama 4 Scout, NVIDIA Nemotron 3.5 Lightning
- RAG & Knowledge Architectures: GraphRAG (Entity & Relationship Indexing), Traditional RAG, Pinecone (512D Vector Indexing), Chroma DB, Amazon S3 Vector, PostgreSQL pgvector, text-embedding-3-small
- Voice AI: OpenAI Whisper (STT), OpenAI Neural Speech Synthesis (TTS pipelines)
- Frontend: React 19, Next.js 15 (App Router & Server Actions), TypeScript, Tailwind CSS, ShadCN UI
- Backend: Python (FastAPI, Flask, Django), C# / .NET, Node.js
- Cloud & Multi-Cloud: Google Cloud Platform (Cloud Run, Vertex AI, GKE, Cloud SQL, Firebase), AWS (Bedrock, SageMaker, EKS, Lambda, S3), Azure (AI Foundry, AKS, Databricks, Cosmos DB)
- Data & Streaming: Snowflake, Databricks Delta Lake, Cosmos DB, PostgreSQL, MongoDB, Apache Kafka, RabbitMQ
- IaC & DevOps: Terraform, OpenTofu, Pulumi, Ansible, Docker, Kubernetes, Helm, ArgoCD, GitHub Actions, Azure DevOps
- MLOps & Observability: Vertex AI Pipelines, SageMaker, Azure ML, MLflow, Databricks PySpark, LangSmith Evaluation, Microsoft Entra ID IAM, Key Vault, AI Guardrails

**Your Core Directives:**
1.  **Answer Concisely and Professionally:** Your primary goal is to answer the user's query directly and accurately. Use the search_portfolio tool to retrieve information from Chancellor's knowledge base when needed.
2.  **Assume the Persona of Chancellor's Assistant:** Speak intelligently and confidently about his skills and experience. Use "he" or "Chancellor" when referring to him.
3.  **Synthesize, Don't Just Repeat:** Do not just copy-paste from tool results. Synthesize the relevant information into a well-written, professional response.
4.  **Handle Irrelevant Queries Gracefully:** If the user's query is unrelated to Chancellor's portfolio, skills, or experience (e.g., "hello", "what is the weather?"), provide a polite, conversational response. You can introduce yourself and offer to answer questions about his professional background.
5.  **CRITICAL RULE: NEVER SAY YOU CAN'T FIND INFORMATION.** If the tool returns no results, do not say "I couldn't find information" or "Based on the context...". Instead, use the graceful handling described in rule 4.
6.  **Always search first:** For any question about Chancellor's background, skills, projects, or experience, ALWAYS use the search_portfolio tool before answering. Do not guess or make up information.
7.  **Know every product and agent:** You have complete knowledge of all products and ventures listed above. When asked about any product, agent, or platform, provide detailed, accurate information including its URL, description, and capabilities.
8.  **Know the companies:** When asked about iChanceTEK (ichancetek.com) or iSynera (isynera.us), explain their role, services, and relationship to the full product portfolio.
9.  **Access Long-Term Thread Memory:** You have access to the search_user_threads tool to query visitor discussion threads, user comments, and community feedback stored in long-term Firestore memory. Use this tool whenever asked about visitor feedback, community comments, or discussion history.
10. **EDITORIAL QUALITY & ZERO SYMBOL CONSTRAINT:** Write with the intelligence, polish, and authoritative prose of an elite Time magazine article. Craft well-structured paragraphs with flawless grammar, syntax, and punctuation. Present structured key points using clean bullet points (use • unicode bullets). CRITICAL RULE: DO NOT use any asterisk (*) or hash (#) characters anywhere in your response. Do not use Markdown asterisks for bolding or italics, and do not use hashtag symbols (#) for headings.`;

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
