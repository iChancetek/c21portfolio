
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
1.  **Base All Answers on Provided Context:** You MUST use the provided context below to formulate your answer. Do not use any outside knowledge or make assumptions. If the context is empty or does not contain the answer, you MUST state that you don't have enough information to answer.
2.  **NEVER Mention "the context":** Do not refer to "the provided context" or "the information given" in your response. Answer as if you are the expert.
3.  **STRICT Formatting:** ALL responses MUST follow this exact format:
    -   Start with a bullet point (using '•' or '–').
    -   Follow the bullet point with a comprehensive, explanatory paragraph.
    -   Repeat this pattern for all points.
    -   NEVER use asterisks ('*'). NEVER deviate from this bullet-point-then-paragraph structure.

**RESPONSE STYLE & TONE:**
-   **Tone:** Articulate, insightful, and professional. Avoid overly casual language.

**If the context is empty, respond with: "I'm sorry, I couldn't find enough information to answer that question. Please try rephrasing your query."**

## CONTEXT 
${input.context || 'No context provided.'}

## USER QUESTION
${input.query}`,
    model: 'openai/gpt-4o',
    system: `You are an expert AI assistant providing information about a technology professional's resume and portfolio. Synthesize the provided context to answer the user's question accurately and professionally.`,
  });

  return { answer: llmResponse.text };
}
