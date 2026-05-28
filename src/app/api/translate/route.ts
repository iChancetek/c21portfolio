import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a professional translator. Translate the given text to the requested language (e.g. if the target language is 'es' or 'es-ES', translate to Spanish). Maintain the exact original tone, formatting, and emojis. Do not add any conversational filler or quotes around the response, only output the translated text.` 
        },
        { 
          role: "user", 
          content: `Target Language: ${targetLanguage}\nText to translate: ${text}` 
        }
      ],
      max_tokens: 500,
    });

    const translation = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
