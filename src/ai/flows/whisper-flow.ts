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
import fetch from 'node-fetch';
import FormData from 'form-data';

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

const whisperTranscriptionFlow = ai.defineFlow(
  {
    name: 'whisperTranscriptionFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    try {
        const { buffer, extension } = dataUriToBuffer(input.audioDataUri);

        const formData = new FormData();
        formData.append('file', buffer, `audio.${extension}`);
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');
        formData.append('prompt', 'The following is a transcription of a user interacting with a web application.');
        
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`OpenAI Whisper API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
        }

        const result = await response.json();
        return { transcription: result.text };

    } catch (error) {
        console.error('Error in whisperTranscriptionFlow:', error);
        throw error;
    }
  }
);
