'use server';
/**
 * @fileOverview A Genkit flow for generating menu suggestions.
 *
 * - suggestionFlow - A function that takes a prompt and returns a menu suggestion.
 * - SuggestionFlowInput - The input type for the suggestionFlow function.
 * - SuggestionFlowOutput - The return type for the suggestionFlow function.
 */

import { ai } from '@/ai/genkit';
import { openAI } from 'genkitx-openai';
import { z } from 'zod';

export const SuggestionFlowInputSchema = z.string();
export type SuggestionFlowInput = z.infer<typeof SuggestionFlowInputSchema>;

export const SuggestionFlowOutputSchema = z.string();
export type SuggestionFlowOutput = z.infer<typeof SuggestionFlowOutputSchema>;

const suggestionFlow = ai.defineFlow(
  {
    name: 'suggestionFlow',
    inputSchema: SuggestionFlowInputSchema,
    outputSchema: SuggestionFlowOutputSchema,
  },
  async (prompt) => {
    const response = await ai.generate({
      model: openAI.model('gpt-4o'),
      prompt: prompt,
    });
    return response.text;
  }
);

export async function getMenuSuggestion(prompt: SuggestionFlowInput): Promise<SuggestionFlowOutput> {
    return suggestionFlow(prompt);
}
