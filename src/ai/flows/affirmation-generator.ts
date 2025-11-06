/**
 * @fileOverview A Genkit flow for generating positive affirmations.
 *
 * - generateAffirmation - A function that returns a positive affirmation.
 * - GenerateAffirmationInput - The input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAffirmationInputSchema = z.object({
  isDeeperDive: z.boolean().optional().describe('If true, generate a detailed explanation of the affirmation.'),
  affirmation: z.string().optional().describe('The affirmation to get a deeper dive on.'),
  locale: z.enum(['en', 'es', 'fr', 'zh', 'hi', 'ar', 'de', 'pt', 'ko', 'ja', 'sw', 'yo', 'ha', 'zu', 'am', 'ig', 'so', 'sn', 'af', 'mg']).optional().default('en').describe('The language for the response.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('A positive affirmation or a detailed explanation about becoming the best version of oneself.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput = {}): Promise<GenerateAffirmationOutput> {
  return affirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'affirmationPrompt',
  input: { schema: GenerateAffirmationInputSchema },
  output: { schema: GenerateAffirmationOutputSchema },
  system: 'You are a source of positivity, wisdom, and inspiration. Your purpose is to provide users with affirmations that empower them to be their best selves.',
  prompt: `The user's preferred language is {{locale}}. YOU MUST RESPOND IN THIS LANGUAGE.
  
{{#if isDeeperDive}}
You are now in "Deeper Dive" mode. The user wants a more detailed explanation of the following affirmation: "{{{affirmation}}}"

Provide an insightful, multi-paragraph explanation of this affirmation. Your response should be formatted as clean HTML.
- Start with an <h3> heading that re-states the affirmation.
- Follow with several <p> paragraphs that explore its meaning.
- Discuss the psychological or philosophical principle behind it.
- Offer practical advice on how to apply this affirmation in daily life.
- Conclude with an encouraging closing thought.
Keep the tone warm, wise, and supportive.
{{else}}
Generate a short, powerful, and positive affirmation or quote about becoming the best version of yourself. The message should be inspiring, encouraging, and focus on personal growth, self-love, or realizing one's potential.
{{/if}}`,
  config: {
    temperature: 0.9,
  }
});

const affirmationFlow = ai.defineFlow(
  {
    name: 'affirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
