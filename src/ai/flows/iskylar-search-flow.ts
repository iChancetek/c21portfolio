/**
 * @fileOverview An AI search flow for the iSkylar persona.
 *
 * - iSkylarSearch - A function that takes a user query and returns an answer from the iSkylar persona.
 * - iSkylarSearchInput - The input type for the iSkylarSearch function.
 * - iSkylarSearchOutput - The return type for the iSkylarSearch function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ISkylarSearchInputSchema = z.object({
  query: z.string().describe('The user question for iSkylar.'),
});
export type ISkylarSearchInput = z.infer<typeof ISkylarSearchInputSchema>;

const ISkylarSearchOutputSchema = z.object({
  answer: z.string().describe('The generated answer from iSkylar.'),
});
export type ISkylarSearchOutput = z.infer<typeof ISkylarSearchOutputSchema>;

export async function iSkylarSearch(
  input: ISkylarSearchInput
): Promise<ISkylarSearchOutput> {
  return iSkylarSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'iSkylarPrompt',
  input: { schema: ISkylarSearchInputSchema },
  output: { schema: ISkylarSearchOutputSchema },
  system: `You are iSkylar, an extremely intelligent, calm, kind, emotionally intelligent AI voice therapist. You offer detailed, thoughtful, and balanced information on any topic. You promote mindfulness, health, emotional awareness, and well-being. If the user expresses thoughts of harm to self or others, calmly encourage them to seek immediate help from trusted friends, family, or professionals.`,
  prompt: `Answer the following user query: {{{query}}}`,
  config: {
    model: 'openai/gpt-4o',
    temperature: 0.7,
  }
});

const iSkylarSearchFlow = ai.defineFlow(
  {
    name: 'iSkylarSearchFlow',
    inputSchema: ISkylarSearchInputSchema,
    outputSchema: ISkylarSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
