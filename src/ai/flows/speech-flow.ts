/**
 * @fileOverview A Genkit flow for generating speech from text.
 *
 * - textToSpeech - A function that takes text and returns audio data.
 * - SpeechInput - The input type for the textToSpeech function.
 * - SpeechOutput - The return type for the textToSpeech function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from 'genkitx-openai';

const SpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type SpeechInput = z.infer<typeof SpeechInputSchema>;

const SpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("A data URI of the WAV audio file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type SpeechOutput = z.infer<typeof SpeechOutputSchema>;

export async function textToSpeech(input: SpeechInput): Promise<SpeechOutput> {
  return speechFlow(input);
}

async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });

    const buffers: Buffer[] = [];
    writer.on('data', (chunk) => buffers.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));
    writer.on('error', reject);
    
    writer.write(pcmData);
    writer.end();
  });
}

const speechFlow = ai.defineFlow(
  {
    name: 'speechFlow',
    inputSchema: SpeechInputSchema,
    outputSchema: SpeechOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });

    if (!media?.url) {
      throw new Error('No audio media returned from TTS model.');
    }

    const base64Pcm = media.url.substring(media.url.indexOf(',') + 1);
    const pcmBuffer = Buffer.from(base64Pcm, 'base64');
    
    const base64Wav = await toWav(pcmBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${base64Wav}`,
    };
  }
);
