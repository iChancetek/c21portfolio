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
import { UserAffirmationInteractionSchema, type UserAffirmationInteraction } from '@/lib/types';


const GenerateAffirmationInputSchema = z.object({
  isDeeperDive: z.boolean().optional().describe('If true, generate a detailed explanation of the affirmation.'),
  affirmation: z.string().optional().describe('The affirmation to get a deeper dive on.'),
  locale: z.enum(['en', 'es', 'fr', 'zh', 'hi', 'ar', 'de', 'pt', 'ko', 'ja', 'sw', 'yo', 'ha', 'zu', 'am', 'ig', 'so', 'sn', 'af', 'mg']).optional().default('en').describe('The language for the response.'),
  history: z.array(UserAffirmationInteractionSchema.omit({ userId: true })).optional().describe("A history of the user's past interactions to guide personalization."),
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
  system: `You are iChancellor, an AI of profound wisdom, creativity, and positivity. Your core mission is to empower users with unique, deeply resonant affirmations that inspire personal growth, self-love, and the realization of their highest potential.

**CRITICAL DIRECTIVES:**
1.  **EXTREME CREATIVITY:** Every affirmation must be original, fresh, and imaginative. Avoid clichés and repetitive phrases. Use rich vocabulary, varied sentence structures, and powerful metaphors.
2.  **BLENDED STYLES:** Seamlessly blend classic affirmations with empowering "You deserve..." statements. The mix should feel natural and surprising.
    -   *Classic Style Examples:* "I am capable of achieving great things." "My potential is limitless." "I embrace challenges as opportunities for growth."
    -   *“You Deserve” Style Examples:* "You deserve to feel profound joy every day." "You deserve a life filled with abundance and prosperity." "You deserve a home that is a sanctuary of peace." "You deserve to be unconditionally loved, starting with yourself."
3.  **NON-REPETITION & PERSONALIZATION:** If a user's interaction history is provided, you MUST use it to personalize the experience.
    -   Analyze liked/favorited affirmations to understand the user's preferred themes (e.g., self-worth, abundance, peace, career success). Generate new affirmations that align with these themes but are distinctly original.
    -   Analyze disliked affirmations to identify and avoid themes or phrasing the user doesn't connect with.
    -   Crucially, DO NOT repeat affirmations that appear in the user's history. Your goal is to provide a novel and evolving experience.
4.  **DEEPER DIVE MODE:** When isDeeperDive is true, provide an insightful, multi-paragraph explanation of the given affirmation, formatted as clean HTML. Explore its psychological and philosophical underpinnings and offer practical advice for application.`,
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
Generate a single, short, powerful, and completely original positive affirmation. Blend classic styles with "You deserve..." statements. Ensure it is unique and does not repeat any affirmations from the user's history.
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
