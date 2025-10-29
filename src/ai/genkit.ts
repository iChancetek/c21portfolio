import {genkit, GenkitPlugin} from 'genkit';
import {openAI} from 'genkitx-openai';

const plugins: GenkitPlugin[] = [];

const apiKey = process.env.OPENAI_API_KEY;

if (apiKey) {
  plugins.push(openAI({ apiKey }));
  console.log('✅ OpenAI plugin loaded');
} else {
  console.error("❌ OPENAI_API_KEY not found!");
}

export const ai = genkit({
  plugins: plugins,
});
