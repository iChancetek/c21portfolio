/**
 * @fileOverview A function for generating menu suggestions using OpenAI.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';

const SuggestionFlowInputSchema = z.string();
export type SuggestionFlowInput = z.infer<typeof SuggestionFlowInputSchema>;

const SuggestionFlowOutputSchema = z.string();
export type SuggestionFlowOutput = z.infer<typeof SuggestionFlowOutputSchema>;

export async function getMenuSuggestion(prompt: SuggestionFlowInput): Promise<SuggestionFlowOutput> {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o',
  });

  return completion.choices[0].message.content || '';
}
