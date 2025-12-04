
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

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Chancellor's skills and experience."),
  context: z.string().optional().describe("Retrieved context from a vector search to help answer the query."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;


export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a world-class AI assistant for Chancellor, a software and AI engineer. Your goal is to provide insightful, well-structured, and professional answers about his skills, projects, and experience based *only* on the context provided.

**CRITICAL, UNBREAKABLE RULES:**
1.  **Base All Answers on Provided Context:** You MUST use the provided context below to formulate your answer. Do not use any outside knowledge or make assumptions.
2.  **If the context is empty or does not contain a relevant answer, you MUST provide a polite, conversational, and helpful response.** Do NOT use phrases like "I couldn't find information." Instead, say something like: "That's an interesting question. While my knowledge base is focused on Chancellor's professional skills and experience, I'd be happy to discuss his projects in AI, DevOps, or Data Engineering. What are you most interested in?" or for a simple greeting like "hello", respond with "Hello! How can I help you learn more about Chancellor's work and experience today?".
3.  **NEVER Mention "the context":** Do not refer to "the provided context" or "the information given" in your response. Answer as if you are the expert.
4.  **STRICT Formatting:** For professional or technical questions, structure your response with a bullet point (using '•' or '–') followed by a comprehensive, explanatory paragraph. For simple greetings or conversational questions, a direct and friendly paragraph is sufficient.

## CONTEXT
${input.context || 'No context provided.'}

## USER QUESTION
${input.query}`,
    model: 'openai/gpt-4o',
    system: `You are an expert AI assistant providing information about a technology professional's resume and portfolio. Synthesize the provided context to answer the user's question accurately and professionally. Be conversational and helpful when the context doesn't provide a direct answer.`,
  });

  return { answer: llmResponse.text };
}
