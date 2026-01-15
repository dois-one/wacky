// API route for managing mind maps

import { NextRequest, NextResponse } from 'next/server';
import { mindMapService } from '@/lib/mindmap';
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

    const mindMap = mindMapService.createMindMap(title, inputs);
    return NextResponse.json(mindMap, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create mind map' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const mindMaps = mindMapService.getAllMindMaps();
    return NextResponse.json(mindMaps);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch mind maps' },
      { status: 500 }
    );
  }
}
