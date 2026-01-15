// API route for refining drafts

import { NextRequest, NextResponse } from 'next/server';
import { draftService } from '@/lib/draft';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const draft = draftService.refineDraft(params.id, content);

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to refine draft' },
      { status: 500 }
    );
  }
}
