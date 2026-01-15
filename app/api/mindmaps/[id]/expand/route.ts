// API route for expanding mind map nodes

import { NextRequest, NextResponse } from 'next/server';
import { mindMapService } from '@/lib/mindmap';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nodeId } = body;

    if (!nodeId) {
      return NextResponse.json(
        { error: 'nodeId is required' },
        { status: 400 }
      );
    }

    const mindMap = mindMapService.expandNode(params.id, nodeId);

    if (!mindMap) {
      return NextResponse.json(
        { error: 'Mind map not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mindMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to expand node' },
      { status: 500 }
    );
  }
}
