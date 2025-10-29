/**
 * @fileOverview Semantic project search flow.
 *
 * This file defines a Genkit flow that allows users to search for projects
 * using natural language queries. The flow uses embeddings to find relevant
 * projects and returns a ranked list of project IDs and match reasons.
 *
 * @fileOverview Semantic project search flow.
 *
 * @function semanticProjectSearch - The main function that handles the semantic project search process.
 * @interface SemanticProjectSearchInput - The input type for the semanticProjectSearch function.
 * @interface SemanticProjectSearchOutput - The return type for the semanticProjectSearch function.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SemanticProjectSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type SemanticProjectSearchInput = z.infer<typeof SemanticProjectSearchInputSchema>;

const SemanticProjectSearchOutputSchema = z.array(
  z.object({
    projectId: z.string().describe('The ID of the project.'),
    matchReason: z.string().describe('The reason why the project matches the query.'),
  })
);
export type SemanticProjectSearchOutput = z.infer<typeof SemanticProjectSearchOutputSchema>;

export async function semanticProjectSearch(input: SemanticProjectSearchInput): Promise<SemanticProjectSearchOutput> {
  return semanticProjectSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticProjectSearchPrompt',
  input: {schema: SemanticProjectSearchInputSchema},
  output: {schema: SemanticProjectSearchOutputSchema},
  prompt: `You are a search assistant that helps users find projects based on their natural language query. 
  Return a ranked list of project IDs and a brief reason why each project matches the query.

  Query: {{{query}}}
  `,
  config: {
    model: 'openai/gpt-4o',
  }
});

const semanticProjectSearchFlow = ai.defineFlow(
  {
    name: 'semanticProjectSearchFlow',
    inputSchema: SemanticProjectSearchInputSchema,
    outputSchema: SemanticProjectSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
