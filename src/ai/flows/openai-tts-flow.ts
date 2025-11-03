/**
 * @fileOverview A Genkit flow for generating speech from text using OpenAI's TTS model.
 *
 * - textToSpeech - A function that takes text and returns audio data.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { openAI } from 'genkitx-openai';
import fetch from 'node-fetch';

const TTSVoices = z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
export type TTSVoice = z.infer<typeof TTSVoices>;

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: TTSVoices.optional().default('alloy').describe('The voice to use for the speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("A data URI of the audio file. Expected format: 'data:audio/mpeg;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return speechFlow(input);
}

const speechFlow = ai.defineFlow(
  {
    name: 'openAISpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: input.text,
            voice: input.voice,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI TTS API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return {
      audioDataUri: `data:audio/mpeg;base64,${base64Audio}`,
    };
  }
);
