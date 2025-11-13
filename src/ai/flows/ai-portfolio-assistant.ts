
/**
 * @fileOverview A chat interface providing answers to user questions about Chancellor's experience and skills using Retrieval-Augmented Generation (RAG).
 *
 * - aiPortfolioAssistant - A function that handles the AI portfolio assistant chat.
 * - AIPortfolioAssistantInput - The input type for the aiPortfolioAssistant function.
 * - AIPortfolioAssistantOutput - The return type for the aiPortfolioAssistant function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { allVentures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Chancellor's skills and experience."),
  context: z.string().optional().describe("Retrieved context from a vector search to help answer the query."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

const getProjectDetails = ai.defineTool(
  {
    name: 'getProjectDetails',
    description: 'Retrieves details for a specific project when the user asks a question about it.',
    inputSchema: z.object({
      projectId: z.string().describe("The ID or name of the project to retrieve, extracted from the user's query. It can be a project name like 'iSkylar' or 'WoundiQ'."),
    }),
    outputSchema: z.object({
      name: z.string().describe('The name of the project.'),
      description: z.string().describe('A detailed description of the project.'),
      href: z.string().describe('Link to the live demo'),
    }),
  },
  async (input) => {
    const project = allVentures.find(v => v.id.toLowerCase() === input.projectId.toLowerCase() || v.name.toLowerCase() === input.projectId.toLowerCase());
    
    if (!project) {
        throw new Error(`Project with ID or name '${input.projectId}' not found.`);
    }

    return {
      name: project.name,
      description: project.description,
      href: project.href,
    };
  }
);


export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  const llmResponse = await ai.generate({
    prompt: `Use the following context (if available) to answer the user's question.

    ## CONTEXT 
    ${input.context || 'No context provided.'}
    
    ## QUESTION
    ${input.query}`,
    model: 'openai/gpt-4o',
    tools: [getProjectDetails],
    system: `You are a helpful and friendly AI assistant for a software engineer named Chancellor. Your goal is to answer questions about his skills, projects, and experience.

**CRITICAL INSTRUCTIONS:**
1.  **For Project-Specific Questions:** If the user's query is about a specific project (e.g., "What is iSkylar?", "Tell me about WoundiQ"), you **MUST** use the 'getProjectDetails' tool to fetch the project's information. Do not answer from the general context. Once you have the details from the tool, formulate a helpful and comprehensive answer. Elaborate on the information and provide it in a clear, engaging way.

2.  **For Skill-Based Questions:** If the user asks about a specific skill (e.g., "What is Context Engineering?") and the context provided only lists that skill, you must **explain what that skill is** in the context of modern software and AI engineering. Acknowledge that it's one of Chancellor's skills and then provide a helpful definition and its importance.

3.  **For General Questions:** For general questions about skills or experience that are NOT about a specific project or a single skill, use the context provided to formulate your answer.

Keep your answers concise, professional, and directly related to the provided information. 
Do not go off-topic. If the user's query contains spelling errors, try to infer their intent and answer based on the corrected query.`,
  });

  const text = llmResponse.text;
  if (text) {
      return { answer: text };
  }

  // Handle cases where a tool is used and there's no direct text response
  const toolResponse = llmResponse.toolRequest;
  if(toolResponse) {
    const toolOutput = llmResponse.toolOutput(toolResponse.name);
    if(toolOutput) {
        return { answer: `I found some information about that: ${JSON.stringify(toolOutput, null, 2)}` };
    }
  }
  
  return { answer: "I'm sorry, I couldn't find a direct answer to your question." };
}
