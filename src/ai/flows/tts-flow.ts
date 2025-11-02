/**
 * @fileOverview A Genkit flow for generating speech from text.
 *
 * - generateGreeting - A function that takes a name and returns audio data of a greeting.
 * - GreetingInput - The input type for the generateGreeting function.
 * - GreetingOutput - The return type for the generateGreeting function.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from 'genkitx-openai';

const GreetingInputSchema = z.object({
  name: z.string().describe('The name of the person to greet.'),
});
export type GreetingInput = z.infer<typeof GreetingInputSchema>;

const GreetingOutputSchema = z.object({
  audioDataUri: z.string().describe("A data URI of the WAV audio file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GreetingOutput = z.infer<typeof GreetingOutputSchema>;

export async function generateGreeting(input: GreetingInput): Promise<GreetingOutput> {
  return ttsFlow(input);
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

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: GreetingInputSchema,
    outputSchema: GreetingOutputSchema,
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
      prompt: `Hello ${input.name}, welcome to your AI dashboard.`,
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
