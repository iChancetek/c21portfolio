import {genkit} from 'genkit';
import {openAI, gpt4o} from 'genkitx-openai';
import {config} from 'dotenv';
config();

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
});
