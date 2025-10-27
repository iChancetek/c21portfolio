'use server';
/**
 * @fileOverview An audio transcription flow using OpenAI's Whisper model.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const TranscribeAudioInputSchema = z.object({
  audioDataUri: z.string().describe("A base64-encoded audio file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe("The transcribed text from the audio."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { text } = await ai.transcribe({
      model: 'whisper-1',
      media: {
        url: input.audioDataUri,
      },
    });

    return { text };
  }
);

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
    return transcribeAudioFlow(input);
}
