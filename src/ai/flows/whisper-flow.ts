/**
 * @fileOverview A flow for transcribing audio using OpenAI's Whisper model.
 *
 * - transcribeAudio - A function that transcribes an audio data URI.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A Base64 encoded audio file as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return whisperTranscriptionFlow(input);
}

const whisperTranscriptionFlow = ai.defineFlow(
  {
    name: 'whisperTranscriptionFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { text } = await ai.transcribe({
      model: 'openai/whisper-1',
      media: {
        url: input.audioDataUri,
      },
      config: {
        language: 'en',
        prompt: 'The following is a transcription of a user interacting with a web application.',
      },
    });

    return { transcription: text };
  }
);
