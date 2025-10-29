'use server';

import { NextRequest, NextResponse } from 'next/server';
import { enhanceText } from '@/ai/flows/whisper-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text in request body' },
        { status: 400 }
      );
    }

    const result = await enhanceText({ text });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enhancement failed' },
      { status: 500 }
    );
  }
}
