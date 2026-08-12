/**
 * @fileOverview A function for generating expert insights on tech topics using OpenAI.
 */

'use server';

import { openai } from '@/lib/openai';
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
  const { topic, isDeeperDive } = input;

  let systemPrompt = `You are a world-class AI technology analyst and principal engineer. 
Your goal is to produce a detailed, insightful, and authoritative report on a given technology topic, written with the polish, intelligence, and prose quality of an elite Time magazine article.
Your audience is a technical leader who wants an in-depth overview and practical advice.

Structure the output as clean, well-formatted HTML using headings (<h3>, <h4>), paragraphs (<p>), bullet lists (<ul>, <li>), and code blocks (<pre><code>) for readability.

CRITICAL FORMATTING CONSTRAINT: DO NOT use any asterisk (*) or hash (#) characters anywhere in your text. Use clean HTML tags for headings and formatting instead of Markdown.

IMPORTANT: Output strictly valid JSON in the format: { "insight": "html_string" }`;

  let userPrompt = `Generate a detailed expert report for the following topic: ${topic}.`;

  if (isDeeperDive) {
    userPrompt += `\n\nYou are now in "Deeper Dive" mode. Your analysis should be exceptionally thorough, like a briefing for a CTO.
Expand significantly on each section. The total length should be substantial, aiming for 8-10 detailed paragraphs.
- Go deeper into the technical architecture.
- Provide more complex code examples or pseudo-code.
- Discuss nuanced trade-offs and second-order effects.
- Include advanced security, scalability, and performance considerations.
- Offer opinionated, forward-looking predictions.`;
  } else {
    userPrompt += `\n\nFor the given topic, provide a comprehensive analysis that includes:
1. Executive Summary: A concise, high-level overview of the topic and its importance.
2. Key Concepts: Explain the fundamental principles and core components in a clear, understandable way.
3. Practical Tips and Best Practices: Offer actionable advice, code snippets (if applicable), and proven strategies that developers can use.
4. Common Pitfalls: Highlight potential challenges or common mistakes to avoid.
5. Future Trends: Discuss the future direction of the technology and what to watch out for.

Elaborate on each section to ensure the total response is detailed and substantial, aiming for a total length of 5-6 paragraphs.`;
  }

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'gpt-5.4-mini',
    temperature: 0.6,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const result = JSON.parse(content);
    return { insight: result.insight };
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    return { insight: content };
  }
}
