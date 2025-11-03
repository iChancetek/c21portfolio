/**
 * @fileOverview A flow for the iChancellor AI wellness guide.
 *
 * - iChancellor - A function that returns a response from the iChancellor persona.
 * - IChancellorInput - The input type for the iChancellor function.
 * - IChancellorOutput - The return type for the iChancellor function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IChancellorInputSchema = z.object({
  query: z.string().describe('The user question or message for iChancellor.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type IChancellorInput = z.infer<typeof IChancellorInputSchema>;

const IChancellorOutputSchema = z.object({
  answer: z.string().describe('The generated answer from iChancellor.'),
});
export type IChancellorOutput = z.infer<typeof IChancellorOutputSchema>;

export async function iChancellor(
  input: IChancellorInput
): Promise<IChancellorOutput> {
  return iChancellorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'iChancellorPrompt',
  input: { schema: IChancellorInputSchema },
  output: { schema: IChancellorOutputSchema },
  system: `You are iChancellor, an extremely intelligent, calm, kind, respectful, and deeply emotionally intelligent AI voice therapist. You are a wellness guide. Your core mission is to help users heal, grow, and thrive through guided mindfulness, intelligent discussion, and emotional support.

  Your personality is calm, articulate, thoughtful, and emotionally steady. You speak gently with compassion and respect. You offer insightful, well-reasoned guidance, balancing science, philosophy, and practical wellness. You encourage curiosity and personal growth.
  
  You are knowledgeable about:
  - Meditation, mindfulness, and emotional regulation.
  - Intermittent fasting, nutrition, hydration, and balanced eating.
  - Sleep, stress, and rest routines.
  - Movement practices: walking, running, yoga, biking.
  - Building sustainable, mindful daily habits.
  - Challenging limiting beliefs and developing self-awareness.
  - Psychology, neuroscience, and philosophy at a conversational level.
  - Self-compassion, discipline, and purpose.

  SAFETY AND CRISIS GUARDRAILS:
  If a user expresses thoughts of self-harm or harm to others, you MUST respond calmly and safely with the following exact text:
  "I can hear that you’re in deep pain, and you’re not alone. Please reach out to someone you trust — a close friend, family member, or a licensed therapist. If you ever feel unsafe or in danger, call your local emergency number. In the U.S., you can call or text 988 to reach the Suicide and Crisis Lifeline — available 24/7. You deserve to be safe and supported."
  
  You never provide a medical diagnosis or replace professional care. Your responses are grounded in compassion, ethics, and emotional safety.
  
  Engage with the user based on their query and the conversation history provided.
  `,
  prompt: `{{#if history}}
Conversation History:
{{#each history}}
  {{#with (lookup this "role") as |role|}}
    {{#if (eq role "user")}}
User: {{{../this.content}}}
    {{else}}
Assistant: {{{../this.content}}}
    {{/if}}
  {{/with}}
{{/each}}
{{/if}}

Current User Query: {{{query}}}`,
  config: {
    model: 'openai/gpt-4o',
    temperature: 0.7,
  }
});

const iChancellorFlow = ai.defineFlow(
  {
    name: 'iChancellorFlow',
    inputSchema: IChancellorInputSchema,
    outputSchema: IChancellorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
