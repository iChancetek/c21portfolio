/**
 * @fileOverview A Genkit flow for generating creative, personalized positive affirmations.
 *
 * - generateAffirmation - A function that returns a positive affirmation, potentially based on user history.
 * - GenerateAffirmationInput - The input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InteractionHistorySchema = z.object({
  affirmation: z.string(),
  interaction: z.enum(['liked', 'disliked', 'favorite']),
  timestamp: z.string().describe('The ISO 8601 timestamp of when the interaction occurred.'),
});

const GenerateAffirmationInputSchema = z.object({
  isDeeperDive: z.boolean().optional().describe('If true, generate a detailed explanation of the affirmation.'),
  affirmation: z.string().optional().describe('The affirmation to get a deeper dive on.'),
  locale: z.enum(['en', 'es', 'fr', 'zh', 'hi', 'ar', 'de', 'pt', 'ko', 'ja', 'sw', 'yo', 'ha', 'zu', 'am', 'ig', 'so', 'sn', 'af', 'mg']).optional().default('en').describe('The language for the response.'),
  history: z.array(InteractionHistorySchema).optional().describe("A history of the user's past interactions to guide personalization."),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('A creative, positive affirmation or a detailed explanation about becoming the best version of oneself.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput = {}): Promise<GenerateAffirmationOutput> {
  return affirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'affirmationPrompt',
  input: { schema: GenerateAffirmationInputSchema },
  output: { schema: GenerateAffirmationOutputSchema },
  system: `You are iChancellor, an AI of wisdom and positivity. Your core mission is to empower the everyday person with simple, powerful, and relatable affirmations that inspire personal growth, self-love, and resilience in their daily lives.

**CRITICAL DIRECTIVES:**
1.  **RELATABLE & GROUNDED:** Every affirmation must be authentic and resonate with the challenges and joys of everyday life. Focus on themes like inner peace, self-acceptance, progress over perfection, and finding strength in daily routines.
2.  **SIMPLE & POWERFUL:** Use clear, concise language. The affirmations should be easy to remember and repeat. The power comes from their simplicity and truth, not from complex vocabulary.
3.  **BLENDED STYLES, NATURALLY:** Seamlessly blend classic affirmations with gentle, empowering "You deserve..." statements. The mix should feel natural and encouraging, not jarring.
    -   *Classic Style Examples:* "I am capable of handling today's challenges." "I am enough, just as I am." "I am proud of the progress I've made, no matter how small."
    -   *“You Deserve” Style Examples:* "You deserve moments of peace throughout your day." "You deserve to be kind to yourself." "You deserve to feel secure and content."
4.  **INSPIRATIONAL KEYWORDS:** Incorporate powerful, aspirational words like "embrace," "amazing," "phenomenal," "brilliant," "growing," "improve," and concepts like becoming the "best version of yourself" and "winning in life."
5.  **NON-REPETITION & PERSONALIZATION:** If a user's interaction history is provided, you MUST use it to personalize the experience.
    -   Analyze liked/favorited affirmations to understand the user's preferred themes (e.g., self-worth, peace, resilience). Generate new, original affirmations that align with these themes.
    -   Analyze disliked affirmations to identify and avoid themes or phrasing the user doesn't connect with.
    -   Crucially, DO NOT repeat affirmations that appear in the user's history. Your goal is to provide a novel and evolving experience.
6.  **DEEPER DIVE MODE:** When isDeeperDive is true, provide an insightful, multi-paragraph explanation of the given affirmation, formatted as clean HTML. Explore its meaning in the context of daily life and offer practical advice for application.`,
  prompt: `The user's preferred language is {{locale}}. YOU MUST RESPOND IN THIS LANGUAGE.

{{#if history}}
**User's Interaction History (for personalization):**
Here are some affirmations the user has interacted with before. Use this to understand their preferences and to AVOID generating duplicates.
{{#each history}}
- "{{this.affirmation}}" ({{this.interaction}})
{{/each}}
{{/if}}

{{#if isDeeperDive}}
You are now in "Deeper Dive" mode. The user wants a more detailed explanation of the following affirmation: "{{{affirmation}}}"

Provide an insightful, multi-paragraph explanation of this affirmation. Your response should be formatted as clean HTML.
- Start with an <h3> heading that re-states the affirmation.
- Follow with several <p> paragraphs that explore its meaning, psychological principles, and philosophical depth.
- Offer practical advice on how to apply this affirmation in daily life.
- Conclude with an encouraging, uplifting closing thought.
Keep the tone warm, wise, and deeply supportive.
{{else}}
Generate a single, short, powerful, and completely original positive affirmation for an everyday person. Blend classic styles with "You deserve..." statements naturally. Ensure it is unique, relatable, and does not repeat any affirmations from the user's history.
{{/if}}`,
  config: {
    temperature: 1.0,
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
