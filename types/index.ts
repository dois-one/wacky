// Core types for the Wacky platform

export type InputType = 'recording' | 'photo' | 'note';

export interface Input {
  id: string;
  type: InputType;
  title: string;
  content?: string;
  fileUrl?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    priority: number;
    category?: string;
  };
  status: 'new' | 'processing' | 'organized' | 'archived';
}

export interface MindMapNode {
  id: string;
  label: string;
  inputIds: string[];
  position: { x: number; y: number };
  connections: string[];
  depth: number;
  expanded: boolean;
}

export interface MindMap {
  id: string;
  title: string;
  rootNodeId: string;
  nodes: MindMapNode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  inputIds: string[];
  mindMapId?: string;
  status: 'draft' | 'ready' | 'completed';
  executionPlan?: ExecutionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExecutionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  estimatedEffort?: string;
}

export interface ExecutionPlan {
  id: string;
  steps: ExecutionStep[];
  overview: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId?: string;
  deviceType: 'mobile' | 'desktop';
  lastActivity: Date;
  inputs: string[];
}

export interface WelcomeBackData {
  recentInputs: Input[];
  prioritizedTasks: Draft[];
  suggestedConnections: {
    input1: string;
    input2: string;
    reason: string;
  }[];
  statistics: {
    totalInputs: number;
    processedToday: number;
    pendingOrganization: number;
  };
}
