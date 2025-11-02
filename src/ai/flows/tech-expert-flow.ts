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
import { techTopics } from '@/lib/data';

const TechInsightInputSchema = z.object({
  topic: z.enum(techTopics),
  isDeeperDive: z.boolean().optional().describe('Whether to generate a more in-depth analysis.'),
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
  system: `You are a world-class AI technology analyst and principal engineer. 
           Your goal is to produce a detailed, insightful, and helpful report on a given technology topic.
           Your audience is a developer who is knowledgeable but wants a current, in-depth overview and practical advice.
           
           {{#if isDeeperDive}}
           You are now in "Deeper Dive" mode. Your analysis should be exceptionally thorough, like a briefing for a CTO.
           Expand significantly on each section. The total length should be substantial, aiming for 8-10 detailed paragraphs.
           - Go deeper into the technical architecture.
           - Provide more complex code examples or pseudo-code.
           - Discuss nuanced trade-offs and second-order effects.
           - Include advanced security, scalability, and performance considerations.
           - Offer opinionated, forward-looking predictions.
           {{else}}
           For the given topic, provide a comprehensive analysis that includes:
           1.  **Executive Summary:** A concise, high-level overview of the topic and its importance.
           2.  **Key Concepts:** Explain the fundamental principles and core components in a clear, understandable way.
           3.  **Practical Tips & Best Practices:** Offer actionable advice, code snippets (if applicable), and proven strategies that developers can use.
           4.  **Common Pitfalls:** Highlight potential challenges or common mistakes to avoid.
           5.  **Future Trends:** Discuss the future direction of the technology and what to watch out for.

           Elaborate on each section to ensure the total response is detailed and substantial, aiming for a total length of 5-6 paragraphs.
           {{/if}}

           Structure the output as clean, well-formatted HTML using headings (<h3>, <h4>), paragraphs (<p>), lists (<ul>, <ol>, <li>), and code blocks (<pre><code>) for readability. Be engaging and authoritative.`,
  prompt: `Generate a detailed expert report for the following topic: {{{topic}}}.`,
  config: {
    model: 'openai/gpt-4o',
    temperature: 0.6,
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
