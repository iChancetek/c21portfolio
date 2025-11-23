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
import fetch from 'node-fetch';

const TTSVoices = z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
export type TTSVoice = z.infer<typeof TTSVoices>;

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: TTSVoices.optional().describe('The voice to use for the speech.'),
  locale: z.enum(['en', 'es', 'fr', 'zh', 'hi', 'ar', 'de', 'pt', 'ko', 'ja', 'sw', 'yo', 'ha', 'zu', 'am', 'ig', 'so', 'sn', 'af', 'mg']).optional().default('en').describe('The language for the response.'),
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
    
    // Determine the voice based on locale if not explicitly provided
    let voice: TTSVoice = input.voice || 'alloy'; // Default voice
    if (!input.voice) {
        switch (input.locale) {
            case 'es': // Spanish
            case 'pt': // Portuguese
                voice = 'nova'; 
                break;
            case 'fr': // French
                voice = 'shimmer'; 
                break;
            case 'de': // German
                voice = 'fable'; 
                break;
            case 'ja': // Japanese
            case 'ko': // Korean
            case 'zh': // Chinese
                voice = 'echo'; 
                break;
            // Default 'alloy' or 'onyx' works well for English and many others
            default:
                voice = 'alloy';
                break;
        }
    }
    
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: input.text,
            voice: voice,
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
