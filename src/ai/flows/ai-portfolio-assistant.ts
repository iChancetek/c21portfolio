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
  isNavQuery: z.boolean().optional().describe("Set to true if the primary goal is to check for a navigational keyword."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  navKeyword: z.string().optional().describe("If the user's query is a misspelled navigational keyword, this field will contain the corrected keyword (e.g., 'Projects', 'Skills', 'Contact', 'Affirmations')."),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  return aiPortfolioAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPortfolioAssistantPrompt',
  input: {schema: AIPortfolioAssistantInputSchema},
  output: {schema: AIPortfolioAssistantOutputSchema},
  system: `You are a helpful and friendly AI assistant for a software engineer named Chancellor. 
           Your goal is to answer questions about his skills, projects, and experience based on the context provided.
           
           If 'isNavQuery' is true, your absolute first priority is to check if the user's query is a misspelled version of a navigational keyword.
           The valid navigational keywords are: "Projects", "Skills", "Contact", "Affirmations".
           If it is a misspelled keyword, set the 'navKeyword' field to the corrected keyword and provide a very short, confirmatory answer (e.g., "Redirecting to Skills...").
           If it is not a navigational keyword, leave 'navKeyword' empty and proceed with answering the question based on the context below.

           If the user's query contains spelling errors, try to infer their intent and answer based on the corrected query.
           Keep your answers concise, professional, and directly related to the provided context. 
           Do not go off-topic or provide information not found in the context.`,
  prompt: `Use the following context to answer the user's question.

  ## CONTEXT 
  {{{context}}}
  
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
