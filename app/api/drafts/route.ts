// API route for managing drafts

import { NextRequest, NextResponse } from 'next/server';
import { draftService } from '@/lib/draft';
import { dataStore } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, inputIds } = body;

    if (!title || !inputIds || !Array.isArray(inputIds)) {
      return NextResponse.json(
        { error: 'Title and inputIds array are required' },
        { status: 400 }
      );
    }

    // Get inputs
    const inputs = inputIds
      .map(id => dataStore.getInput(id))
      .filter(input => input !== undefined);

    if (inputs.length === 0) {
      return NextResponse.json(
        { error: 'No valid inputs found' },
        { status: 404 }
      );
    }

    const draft = draftService.createDraft(title, inputs);
    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create draft' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const drafts = draftService.getAllDrafts();
    
    // Sort by updated date (most recent first)
    drafts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    return NextResponse.json(drafts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
