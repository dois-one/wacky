// API route for creating inputs (notes, recordings, photos)

import { NextRequest, NextResponse } from 'next/server';
import { Input } from '@/types';
import { dataStore } from '@/lib/store';
import { organizationService } from '@/lib/organization';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, fileUrl } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const input: Input = {
      id: generateId(),
      type,
      title,
      content,
      fileUrl,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        priority: 50,
      },
      status: 'new',
    };

    // Auto-organize the input
    const organizedInput = organizationService.organizeInput(input);
    dataStore.addInput(organizedInput);

    return NextResponse.json(organizedInput, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create input' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let inputs = dataStore.getAllInputs();

    // Filter by status
    if (status) {
      inputs = inputs.filter(i => i.status === status);
    }

    // Filter by category
    if (category) {
      inputs = inputs.filter(i => i.metadata.category === category);
    }

    // Sort by priority (highest first) and then by creation date
    inputs.sort((a, b) => {
      if (b.metadata.priority !== a.metadata.priority) {
        return b.metadata.priority - a.metadata.priority;
      }
      return b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime();
    });

    return NextResponse.json(inputs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inputs' },
      { status: 500 }
    );
  }
}
