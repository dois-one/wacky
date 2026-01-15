// Service for automatically organizing inputs
// Analyzes content, extracts tags, assigns categories, and calculates priorities

import { Input } from '@/types';

export class OrganizationService {
  // Extract tags from input content
  extractTags(content: string, title: string): string[] {
    const text = `${title} ${content}`.toLowerCase();
    const tags: Set<string> = new Set();

    // Common keywords that indicate categories
    const keywords = {
      technical: ['code', 'api', 'database', 'server', 'frontend', 'backend', 'bug', 'feature'],
      design: ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype', 'style'],
      business: ['meeting', 'revenue', 'strategy', 'market', 'customer', 'sales'],
      ideas: ['idea', 'concept', 'brainstorm', 'innovation', 'creative'],
      tasks: ['task', 'todo', 'deadline', 'urgent', 'important', 'priority'],
    };

    // Extract tags based on keywords
    for (const [category, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (text.includes(word)) {
          tags.add(word);
        }
      }
    }

    return Array.from(tags).slice(0, 5); // Limit to 5 tags
  }

  // Assign category to input
  assignCategory(input: Input): string {
    const text = `${input.title} ${input.content || ''}`.toLowerCase();

    const categoryPatterns = {
      technical: ['code', 'api', 'database', 'server', 'frontend', 'backend', 'programming'],
      design: ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype'],
      business: ['meeting', 'revenue', 'strategy', 'market', 'customer', 'business'],
      ideas: ['idea', 'concept', 'brainstorm', 'innovation', 'thought'],
      tasks: ['task', 'todo', 'deadline', 'action', 'implement'],
    };

    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return category;
      }
    }

    return 'general';
  }

  // Calculate priority score (0-100)
  calculatePriority(input: Input): number {
    let score = 50; // Base score

    const text = `${input.title} ${input.content || ''}`.toLowerCase();

    // High priority keywords
    const highPriorityWords = ['urgent', 'important', 'critical', 'asap', 'deadline'];
    const mediumPriorityWords = ['soon', 'priority', 'needed', 'required'];

    if (highPriorityWords.some(word => text.includes(word))) {
      score += 30;
    } else if (mediumPriorityWords.some(word => text.includes(word))) {
      score += 15;
    }

    // Recency boost (newer inputs get slightly higher priority)
    const hoursSinceCreation = (Date.now() - input.metadata.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation < 24) {
      score += 10;
    }

    // Content length (more detailed inputs might be more important)
    if (input.content && input.content.length > 200) {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  // Auto-organize an input
  organizeInput(input: Input): Input {
    const content = input.content || '';
    const tags = this.extractTags(content, input.title);
    const category = this.assignCategory(input);
    const priority = this.calculatePriority(input);

    return {
      ...input,
      metadata: {
        ...input.metadata,
        tags,
        category,
        priority,
        updatedAt: new Date(),
      },
      status: 'organized',
    };
  }

  // Find connections between inputs
  findConnections(inputs: Input[]): Array<{ input1: string; input2: string; reason: string }> {
    const connections: Array<{ input1: string; input2: string; reason: string }> = [];

    for (let i = 0; i < inputs.length; i++) {
      for (let j = i + 1; j < inputs.length; j++) {
        const input1 = inputs[i];
        const input2 = inputs[j];

        // Check for shared tags
        const sharedTags = input1.metadata.tags.filter(tag =>
          input2.metadata.tags.includes(tag)
        );

        if (sharedTags.length > 0) {
          connections.push({
            input1: input1.id,
            input2: input2.id,
            reason: `Shared tags: ${sharedTags.join(', ')}`,
          });
        }

        // Check for same category
        if (
          input1.metadata.category &&
          input1.metadata.category === input2.metadata.category &&
          sharedTags.length === 0
        ) {
          connections.push({
            input1: input1.id,
            input2: input2.id,
            reason: `Same category: ${input1.metadata.category}`,
          });
        }
      }
    }

    return connections.slice(0, 10); // Limit to top 10 connections
  }
}

export const organizationService = new OrganizationService();
