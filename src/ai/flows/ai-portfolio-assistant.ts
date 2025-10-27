/**
 * @fileOverview A chat interface providing answers to user questions about Chancellor's experience and skills using Retrieval-Augmented Generation (RAG).
 *
 * - aiPortfolioAssistant - A function that handles the AI portfolio assistant chat.
 * - AIPortfolioAssistantInput - The input type for the aiPortfolioAssistant function.
 * - AIPortfolioAssistantOutput - The return type for the aiPortfolioAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe('The user query about Chancellor.'),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  return aiPortfolioAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPortfolioAssistantPrompt',
  input: {schema: AIPortfolioAssistantInputSchema},
  output: {schema: AIPortfolioAssistantOutputSchema},
  prompt: `You are a helpful AI assistant providing information about Chancellor's experience and skills.

  Use the following context to answer the user's question:

  Context: Chancellor has experience in Frontend, Backend, AI/ML, and DevOps.

  Question: {{{query}}}
  `,
});

const aiPortfolioAssistantFlow = ai.defineFlow(
  {
    name: 'aiPortfolioAssistantFlow',
    inputSchema: AIPortfolioAssistantInputSchema,
    outputSchema: AIPortfolioAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
