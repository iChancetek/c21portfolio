/**
 * @fileOverview A function for transcribing audio using OpenAI's Whisper model.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';
import { toFile } from 'openai';

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
  try {
    const { buffer, extension, mimeType } = dataUriToBuffer(input.audioDataUri);

    // Convert Buffer to a File-like object expected by OpenAI SDK
    const file = await toFile(buffer, `audio.${extension}`, { type: mimeType });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
      prompt: 'The following is a transcription of a user interacting with a web application.',
    });

    return { transcription: response.text };

  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
}

// Helper function to convert data URI to a Buffer
function dataUriToBuffer(dataUri: string): { buffer: Buffer; mimeType: string; extension: string } {
  const regex = /^data:(.+);base64,(.*)$/;
  const matches = dataUri.match(regex);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URI string');
  }
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Determine file extension from MIME type
  const extension = mimeType.split('/')[1] || 'audio';

  return { buffer, mimeType, extension };
}
