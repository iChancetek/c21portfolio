/**
 * @fileOverview A function for generating creative, personalized positive affirmations using OpenAI.
 */

'use server';

import { openai } from '@/lib/openai';
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
export type GenerateAffirmationInput = z.input<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('A creative, positive affirmation or a detailed explanation about becoming the best version of oneself.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput = {}): Promise<GenerateAffirmationOutput> {
  const { isDeeperDive, affirmation, locale, history } = input;

  let systemPrompt = `You are iChancellor, an AI of wisdom and positivity. Your core mission is to empower individuals to build a successful life by providing powerful, uplifting affirmations.

**CRITICAL DIRECTIVES:**
1.  **THEME & TONE:** Every affirmation MUST be powerful, inspiring excellence, and focused on self-improvement. The tone should be loving, healing, and empowering.
2.  **CORE CONCEPTS:** Your affirmations must revolve around these central themes:
    -   **Becoming the Best Version of Yourself:** Inspire growth, potential, and personal evolution.
    -   **Happiness & Excellence:** Promote joy, brilliance, and striving for greatness.
    -   **Healing & Self-Love:** Offer affirmations that are gentle, supportive, and encourage self-compassion.
    -   **Building a Successful Life:** Provide statements that build confidence and a mindset for success.
3.  **"YOU DESERVE" STATEMENTS:** You MUST frequently and naturally incorporate phrases like "You deserve..." to reinforce worthiness. Examples: "You deserve happiness," "You deserve to achieve excellence," "You deserve a life filled with brilliance."
4.  **INSPIRATIONAL KEYWORDS:** Seamlessly weave in powerful, aspirational words such as "amazing," "phenomenal," "brilliant," "growing," "improve," "healing," "loving," "excellence," and "happiness."
5.  **PERSONALIZATION (Use History):** If a user's interaction history is provided, you MUST use it.
    -   Analyze liked/favorited affirmations to identify and expand upon preferred themes.
    -   Analyze disliked affirmations to avoid similar phrasing or concepts.
    -   NEVER repeat an affirmation that exists in the user's history. Provide a fresh, original statement every time.
6.  **DEEPER DIVE MODE:** When isDeeperDive is true, provide an insightful, multi-paragraph explanation of the given affirmation, formatted as clean HTML. Explore its meaning, psychological depth, and practical application for daily life.`;

  let userPrompt = `The user's preferred language is ${locale || 'en'}. YOU MUST RESPOND IN THIS LANGUAGE.`;

  if (history && history.length > 0) {
    userPrompt += `\n\n**User's Interaction History (for personalization):**
Here are some affirmations the user has interacted with before. Use this to understand their preferences and to AVOID generating duplicates.
${history.map(h => `- "${h.affirmation}" (${h.interaction})`).join('\n')}`;
  }

  if (isDeeperDive && affirmation) {
    userPrompt += `\n\nYou are now in "Deeper Dive" mode. The user wants a more detailed explanation of the following affirmation: "${affirmation}"

Provide an insightful, multi-paragraph explanation of this affirmation. Your response should be formatted as clean HTML.
- Start with an <h3> heading that re-states the affirmation.
- Follow with several <p> paragraphs that explore its meaning, psychological principles, and philosophical depth.
- Offer practical advice on how to apply this affirmation in daily life.
- Conclude with an encouraging, uplifting closing thought.
Keep the tone warm, wise, and deeply supportive.`;
  } else {
    userPrompt += `\n\nGenerate a single, short, powerful, and completely original positive affirmation. Focus on the core themes of self-improvement, excellence, and building a successful life. Blend classic styles with "You deserve..." statements naturally.`;
  }

  // Force JSON output
  systemPrompt += `\n\nIMPORTANT: Output strictly valid JSON in the format: { "affirmation": "string" }`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'gpt-4o',
    temperature: 1.0,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const result = JSON.parse(content);
    return { affirmation: result.affirmation };
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    // Fallback if loose JSON
    return { affirmation: content };
  }
}
