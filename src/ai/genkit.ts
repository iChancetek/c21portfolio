import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from 'genkitx-openai';
import {config} from 'dotenv';
config();

export const ai = genkit({
  plugins: [
    openAI(),
    googleAI(),
  ],
});
