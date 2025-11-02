import { NextResponse, type NextRequest } from 'next/server';
import { iSkylarSearch } from '@/ai/flows/iskylar-search-flow';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json(
      { answer: 'Please enter a search query.' },
      { status: 400 }
    );
  }

  try {
    const answer = await iSkylarSearch({ query: q });
    return NextResponse.json({ answer: answer.answer });
  } catch (error) {
    console.error('Error in iSkylar search flow:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { answer: `An error occurred while fetching results: ${errorMessage}` },
      { status: 500 }
    );
  }
}
