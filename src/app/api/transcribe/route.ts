'use server';

import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/ai/flows/whisper-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioDataUri } = body;

    if (!audioDataUri) {
      return NextResponse.json(
        { error: 'Missing audioDataUri in request body' },
        { status: 400 }
      );
    }

    const result = await transcribeAudio({ audioDataUri });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}
