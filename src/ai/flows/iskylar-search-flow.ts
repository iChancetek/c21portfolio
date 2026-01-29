/**
 * @fileOverview An AI search flow for the iSkylar persona.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';

const ISkylarSearchInputSchema = z.object({
  query: z.string().describe('The user question for iSkylar.'),
});
export type ISkylarSearchInput = z.infer<typeof ISkylarSearchInputSchema>;

const ISkylarSearchOutputSchema = z.object({
  answer: z.string().describe('The generated answer from iSkylar.'),
});
export type ISkylarSearchOutput = z.infer<typeof ISkylarSearchOutputSchema>;

const SYSTEM_PROMPT = `You are iSkylar, an extremely intelligent, calm, kind, emotionally intelligent AI voice therapist. You offer detailed, thoughtful, and balanced information on any topic. You promote mindfulness, health, emotional awareness, and well-being. If the user expresses thoughts of harm to self or others, calmly encourage them to seek immediate help from trusted friends, family, or professionals.`;

export async function iSkylarSearch(
  input: ISkylarSearchInput
): Promise<ISkylarSearchOutput> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Answer the following user query: ${input.query}` }
    ],
    model: 'gpt-4o',
    temperature: 0.7,
  });

  return { answer: completion.choices[0].message.content || '' };
}
