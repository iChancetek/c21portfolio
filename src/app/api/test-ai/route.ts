import { NextResponse } from 'next/server';
import { getMenuSuggestion } from '@/ai/flows/menuSuggestionFlow';

export async function GET() {
  try {
    const result = await getMenuSuggestion('Suggest a healthy breakfast');
    
    return NextResponse.json({
      success: true,
      result: result,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
