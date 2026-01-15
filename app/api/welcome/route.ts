// API route for Welcome Back experience

import { NextRequest, NextResponse } from 'next/server';
import { WelcomeBackData } from '@/types';
import { dataStore } from '@/lib/store';
import { organizationService } from '@/lib/organization';

export async function GET(request: NextRequest) {
  try {
    const allInputs = dataStore.getAllInputs();
    const allDrafts = dataStore.getAllDrafts();

    // Get recent inputs (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentInputs = allInputs
      .filter(i => i.metadata.createdAt >= oneDayAgo)
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime())
      .slice(0, 10);

    // Get prioritized drafts
    const prioritizedTasks = allDrafts
      .filter(d => d.status === 'draft' || d.status === 'ready')
      .sort((a, b) => {
        // Sort by status (ready before draft) and then by update time
        if (a.status === 'ready' && b.status !== 'ready') return -1;
        if (a.status !== 'ready' && b.status === 'ready') return 1;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      })
      .slice(0, 5);

    // Find suggested connections
    const suggestedConnections = organizationService.findConnections(allInputs);

    // Calculate statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const processedToday = allInputs.filter(
      i => i.status === 'organized' && i.metadata.updatedAt >= today
    ).length;
    const pendingOrganization = allInputs.filter(i => i.status === 'new').length;

    const welcomeBackData: WelcomeBackData = {
      recentInputs,
      prioritizedTasks,
      suggestedConnections,
      statistics: {
        totalInputs: allInputs.length,
        processedToday,
        pendingOrganization,
      },
    };

    return NextResponse.json(welcomeBackData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch welcome back data' },
      { status: 500 }
    );
  }
}
