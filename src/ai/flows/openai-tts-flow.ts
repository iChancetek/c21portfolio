/**
 * @fileOverview A function for generating speech from text using OpenAI's TTS model.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';

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

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: input.text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  const base64Audio = buffer.toString('base64');

  return {
    audioDataUri: `data:audio/mpeg;base64,${base64Audio}`,
  };
}
