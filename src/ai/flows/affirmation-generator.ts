/**
 * @fileOverview A Genkit flow for generating positive affirmations.
 *
 * - generateAffirmation - A function that returns a positive affirmation.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('A positive affirmation about becoming the best version of oneself.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(): Promise<GenerateAffirmationOutput> {
  return affirmationFlow();
}

const prompt = ai.definePrompt({
  name: 'affirmationPrompt',
  output: { schema: GenerateAffirmationOutputSchema },
  system: 'You are a source of positivity and inspiration. Your purpose is to provide users with affirmations that empower them to be their best selves.',
  prompt: `Generate a short, powerful, and positive affirmation or quote about becoming the best version of yourself. The message should be inspiring, encouraging, and focus on personal growth, self-love, or realizing one's potential.`,
  config: {
    temperature: 0.9,
  }
});

const affirmationFlow = ai.defineFlow(
  {
    name: 'affirmationFlow',
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
