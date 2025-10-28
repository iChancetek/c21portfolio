import {genkit, GenkitPlugin} from 'genkit';
import {openAI} from 'genkitx-openai';
import {config} from 'dotenv';
config();

const plugins: GenkitPlugin[] = [];

if (process.env.OPENAI_API_KEY) {
  plugins.push(openAI({ apiKey: process.env.OPENAI_API_KEY }));
} else {
  console.warn("OPENAI_API_KEY is not set. OpenAI-related AI features will be disabled.");
}

export const ai = genkit({
  plugins: plugins,
});
