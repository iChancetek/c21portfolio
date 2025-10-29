/**
 * @fileOverview A text enhancement flow using an AI model.
 *
 * - enhanceText - A function that enhances a given text string.
 * - EnhanceTextInput - The input type for the enhanceText function.
 * - EnhanceTextOutput - The return type for the enhanceText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EnhanceTextInputSchema = z.object({
  text: z
    .string()
    .describe(
      "The text to be enhanced."
    ),
});
export type EnhanceTextInput = z.infer<typeof EnhanceTextInputSchema>;

const EnhanceTextOutputSchema = z.object({
  enhancedText: z.string().describe('The enhanced text from the model.'),
});
export type EnhanceTextOutput = z.infer<typeof EnhanceTextOutputSchema>;

export async function enhanceText(
  input: EnhanceTextInput
): Promise<EnhanceTextOutput> {
  return textEnhancementFlow(input);
}

const textEnhancementFlow = ai.defineFlow(
  {
    name: 'textEnhancementFlow',
    inputSchema: EnhanceTextInputSchema,
    outputSchema: EnhanceTextOutputSchema,
  },
  async (input) => {
    const enhanceResponse = await ai.generate({
      model: 'openai/gpt-4o',
      prompt: `Enhance the following text to be more clear, concise, and professional: ${input.text}`,
    });

    return { enhancedText: enhanceResponse.text };
  }
);
