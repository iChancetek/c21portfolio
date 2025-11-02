
import {genkit, GenkitPlugin} from 'genkit';
import {openAI} from 'genkitx-openai';
import {googleAI} from 'genkitx-openai';

const plugins: GenkitPlugin[] = [];

const apiKey = process.env.OPENAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  plugins.push(openAI({ apiKey }));
  console.log('✅ OpenAI plugin loaded');
} else {
  console.warn("❌ OPENAI_API_KEY not found! Some AI features may not work.");
}

if(geminiApiKey) {
    plugins.push(googleAI({apiKey: geminiApiKey}));
    console.log('✅ Google AI plugin loaded');
} else {
    console.warn('❌ GEMINI_API_KEY not found! Some AI features may not work.');
}

export const ai = genkit({
  plugins: plugins,
  model: 'openai/gpt-4o',
  embedder: 'openai/text-embedding-ada-002',
});
