/**
 * @fileOverview An AI flow for generating expert insights on tech topics.
 *
 * - getTechInsight - A function that takes a topic and returns an AI-generated insight.
 * - TechInsightInput - The input type for the getTechInsight function.
 * - TechInsightOutput - The return type for the getTechInsight function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const techTopics = [
  'GenAI',
  'Data Science',
  'Data Engineering',
  'DevOps',
  'MLOps',
  'BioTech',
  'Neural Networks',
  'Deep Learning',
  'LLMs',
  'OpenAI',
  'Claude',
  'Meta Llama',
  'Deepseek',
  'Hugging Face',
  'AWS',
  'Azure',
  'GCP',
  'Machine Learning',
] as const;

const TechInsightInputSchema = z.object({
  topic: z.enum(techTopics),
});
export type TechInsightInput = z.infer<typeof TechInsightInputSchema>;

const TechInsightOutputSchema = z.object({
  insight: z.string().describe('A helpful, current summary and tips on the given tech topic. Formatted as clean HTML.'),
});
export type TechInsightOutput = z.infer<typeof TechInsightOutputSchema>;

export async function getTechInsight(
  input: TechInsightInput
): Promise<TechInsightOutput> {
  return techExpertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'techExpertPrompt',
  input: { schema: TechInsightInputSchema },
  output: { schema: TechInsightOutputSchema },
  system: `You are an expert AI technology analyst. Your goal is to provide a concise, up-to-date summary and actionable tips about a given technology topic.
           Present the information in a clear, well-structured HTML format. Use headings (<h3>), paragraphs (<p>), and lists (<ul><li>) to organize the content.
           Assume the user is a fellow developer who is knowledgeable but wants the latest high-level summary and practical advice.`,
  prompt: `Generate an expert summary and tips for the following topic: {{{topic}}}.`,
  config: {
    model: 'openai/gpt-4o',
    temperature: 0.5,
  }
});

const techExpertFlow = ai.defineFlow(
  {
    name: 'techExpertFlow',
    inputSchema: TechInsightInputSchema,
    outputSchema: TechInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
