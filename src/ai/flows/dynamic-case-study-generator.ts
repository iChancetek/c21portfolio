
/**
 * @fileOverview Dynamic case study generator avoiding GenKit tool calling complexities.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';
import { allVentures } from '@/lib/data';

const GenerateDeepDiveInputSchema = z.object({
  productId: z.string().describe('The ID of the product to generate a deep dive for.'),
});
export type GenerateDeepDiveInput = z.infer<typeof GenerateDeepDiveInputSchema>;

const GenerateDeepDiveOutputSchema = z.object({
  deepDive: z.string().describe('The detailed technical deep-dive for the product.'),
});
export type GenerateDeepDiveOutput = z.infer<typeof GenerateDeepDiveOutputSchema>;

// Helper to get project details directly
function getProductDetails(productId: string) {
  const product = allVentures.find(v => v.id === productId || v.name.toLowerCase() === productId.toLowerCase());

  if (!product) {
    throw new Error(`Product with ID ${productId} not found.`);
  }

  return {
    name: product.name,
    description: product.description,
    href: product.href,
  };
}

export async function generateDeepDive(input: GenerateDeepDiveInput): Promise<GenerateDeepDiveOutput> {
  const { productId } = input;

  // Directly retrieve data
  const product = getProductDetails(productId);

  const systemPrompt = `You are an expert technical writer, specializing in creating deep-dive case studies of software products.

The user has requested a deep-dive for the following product:
Name: ${product.name}
Description: ${product.description}
Link: ${product.href}

Write a detailed technical deep-dive, covering the following aspects:
- Product overview and goals
- Key Features and Functionality
- Potential technical implementation details (be creative and infer a possible tech stack if not provided)
- Challenges that might have been faced and how they could be solved
- Business impact and value proposition

Write in a clear, concise, and engaging style. Format the output as clean HTML markup, using headings (h3), paragraphs (p), and lists (ul/li) for readability.

IMPORTANT: Output strictly valid JSON in the format: { "deepDive": "html_string" }`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate deep dive for ${product.name}` }
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const result = JSON.parse(content);
    return { deepDive: result.deepDive };
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    return { deepDive: content };
  }
}