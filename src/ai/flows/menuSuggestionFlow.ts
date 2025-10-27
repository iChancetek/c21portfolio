'use server';
/**
 * @fileOverview A Genkit flow for generating menu suggestions.
 *
 * - getMenuSuggestion - A function that takes a prompt and returns a menu suggestion.
 * - SuggestionFlowInput - The input type for the getMenuSuggestion function.
 * - SuggestionFlowOutput - The return type for the getMenuSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SuggestionFlowInputSchema = z.string();
export type SuggestionFlowInput = z.infer<typeof SuggestionFlowInputSchema>;

export const SuggestionFlowOutputSchema = z.string();
export type SuggestionFlowOutput = z.infer<typeof SuggestionFlowOutputSchema>;

export async function getMenuSuggestion(prompt: SuggestionFlowInput): Promise<SuggestionFlowOutput> {
    return suggestionFlow(prompt);
}

const suggestionFlow = ai.defineFlow(
  {
    name: 'suggestionFlow',
    inputSchema: SuggestionFlowInputSchema,
    outputSchema: SuggestionFlowOutputSchema,
  },
  async (prompt) => {
    const response = await ai.generate({
      model: 'gpt-4o',
      prompt: prompt,
    });
    return response.text;
  }
);
