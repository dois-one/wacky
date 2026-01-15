// Service for generating drafts and execution plans
// Converts high-level ideas into implementation-ready documents

import { Draft, ExecutionPlan, ExecutionStep, Input } from '@/types';
import { dataStore } from './store';

// Helper function to parse effort strings like "1-2 days" or "3-5 days"
export function parseEffort(effort: string): number {
  const match = effort.match(/(\d+)(?:-(\d+))?/);
  if (!match) return 1;
  
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : min;
  // Use the average of the range
  return Math.ceil((min + max) / 2);
}

export class DraftService {
  // Generate a unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Create a draft from inputs
  createDraft(title: string, inputs: Input[]): Draft {
    const content = this.generateDraftContent(inputs);
    const executionPlan = this.generateExecutionPlan(title, inputs);

    const draft: Draft = {
      id: this.generateId(),
      title,
      content,
      inputIds: inputs.map(i => i.id),
      status: 'draft',
      executionPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.addDraft(draft);
    return draft;
  }

  // Generate draft content from inputs
  private generateDraftContent(inputs: Input[]): string {
    let content = '# Overview\n\n';

    // Group inputs by category
    const byCategory = new Map<string, Input[]>();
    inputs.forEach(input => {
      const category = input.metadata.category || 'general';
      if (!byCategory.has(category)) {
        byCategory.set(category, []);
      }
      byCategory.get(category)!.push(input);
    });

    // Generate content sections
    byCategory.forEach((categoryInputs, category) => {
      content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      categoryInputs.forEach(input => {
        content += `### ${input.title}\n\n`;
        if (input.content) {
          content += `${input.content}\n\n`;
        }
        if (input.metadata.tags.length > 0) {
          content += `*Tags: ${input.metadata.tags.join(', ')}*\n\n`;
        }
      });
    });

    content += '\n## Next Steps\n\n';
    content += 'See execution plan below for detailed implementation steps.\n';

    return content;
  }

  // Generate an execution plan
  private generateExecutionPlan(title: string, inputs: Input[]): ExecutionPlan {
    const steps: ExecutionStep[] = [];

    // Analyze inputs to determine steps
    const hasDesign = inputs.some(i => i.metadata.category === 'design');
    const hasTechnical = inputs.some(i => i.metadata.category === 'technical');
    const hasBusiness = inputs.some(i => i.metadata.category === 'business');

    let order = 1;

    // Research and planning phase
    steps.push({
      id: this.generateId(),
      order: order++,
      title: 'Research and Planning',
      description: 'Gather requirements, research similar solutions, and create project plan',
      status: 'pending',
      estimatedEffort: '1-2 days',
    });

    // Design phase
    if (hasDesign || inputs.length > 0) {
      steps.push({
        id: this.generateId(),
        order: order++,
        title: 'Design Phase',
        description: 'Create wireframes, mockups, and design specifications',
        status: 'pending',
        estimatedEffort: '2-3 days',
      });
    }

    // Technical setup
    if (hasTechnical || inputs.length > 0) {
      steps.push({
        id: this.generateId(),
        order: order++,
        title: 'Technical Setup',
        description: 'Set up development environment, initialize project structure',
        status: 'pending',
        estimatedEffort: '1 day',
      });

      steps.push({
        id: this.generateId(),
        order: order++,
        title: 'Core Implementation',
        description: 'Implement main features and functionality',
        status: 'pending',
        estimatedEffort: '3-5 days',
      });

      steps.push({
        id: this.generateId(),
        order: order++,
        title: 'Testing',
        description: 'Write and run tests, fix bugs',
        status: 'pending',
        estimatedEffort: '1-2 days',
      });
    }

    // Business/deployment phase
    if (hasBusiness || inputs.length > 3) {
      steps.push({
        id: this.generateId(),
        order: order++,
        title: 'Business Strategy',
        description: 'Define go-to-market strategy, pricing, and marketing plan',
        status: 'pending',
        estimatedEffort: '2-3 days',
      });
    }

    steps.push({
      id: this.generateId(),
      order: order++,
      title: 'Deployment and Launch',
      description: 'Deploy to production, announce launch, monitor metrics',
      status: 'pending',
      estimatedEffort: '1-2 days',
    });

    const overview = `Implementation plan for "${title}" based on ${inputs.length} input${inputs.length !== 1 ? 's' : ''}. ` +
      `Estimated total time: ${steps.reduce((sum, step) => sum + parseEffort(step.estimatedEffort || '1'), 0)} days.`;

    return {
      id: this.generateId(),
      steps,
      overview,
      createdAt: new Date(),
    };
  }

  // Refine a draft with additional details
  refineDraft(draftId: string, additionalContent: string): Draft | null {
    const draft = dataStore.getDraft(draftId);
    if (!draft) return null;

    const updatedContent = draft.content + '\n\n## Refinements\n\n' + additionalContent;
    const updates = {
      content: updatedContent,
      updatedAt: new Date(),
      status: 'ready' as const,
    };

    dataStore.updateDraft(draftId, updates);
    return { ...draft, ...updates };
  }

  // Get all drafts
  getAllDrafts(): Draft[] {
    return dataStore.getAllDrafts();
  }
}

export const draftService = new DraftService();
