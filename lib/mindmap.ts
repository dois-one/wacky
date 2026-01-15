// Service for creating and managing mind maps
// Auto-expands connections between inputs

import { MindMap, MindMapNode, Input } from '@/types';
import { dataStore } from './store';

export class MindMapService {
  // Generate a unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a mind map from inputs
  createMindMap(title: string, inputs: Input[]): MindMap {
    const rootNode: MindMapNode = {
      id: this.generateId(),
      label: title,
      inputIds: [],
      position: { x: 0, y: 0 },
      connections: [],
      depth: 0,
      expanded: true,
    };

    const nodes: MindMapNode[] = [rootNode];
    const nodesByCategory = new Map<string, MindMapNode>();

    // Group inputs by category and create nodes
    inputs.forEach((input, index) => {
      const category = input.metadata.category || 'general';

      if (!nodesByCategory.has(category)) {
        const categoryNode: MindMapNode = {
          id: this.generateId(),
          label: category.charAt(0).toUpperCase() + category.slice(1),
          inputIds: [],
          position: {
            x: Math.cos((nodesByCategory.size * 2 * Math.PI) / 6) * 300,
            y: Math.sin((nodesByCategory.size * 2 * Math.PI) / 6) * 300,
          },
          connections: [rootNode.id],
          depth: 1,
          expanded: true,
        };
        nodes.push(categoryNode);
        nodesByCategory.set(category, categoryNode);
        rootNode.connections.push(categoryNode.id);
      }

      const categoryNode = nodesByCategory.get(category)!;
      const inputNode: MindMapNode = {
        id: this.generateId(),
        label: input.title,
        inputIds: [input.id],
        position: {
          x: categoryNode.position.x + Math.cos(index * 0.5) * 150,
          y: categoryNode.position.y + Math.sin(index * 0.5) * 150,
        },
        connections: [categoryNode.id],
        depth: 2,
        expanded: false,
      };
      nodes.push(inputNode);
      categoryNode.connections.push(inputNode.id);
    });

    const mindMap: MindMap = {
      id: this.generateId(),
      title,
      rootNodeId: rootNode.id,
      nodes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.addMindMap(mindMap);
    return mindMap;
  }

  // Expand a node to show more connections
  expandNode(mindMapId: string, nodeId: string): MindMap | null {
    const mindMap = dataStore.getMindMap(mindMapId);
    if (!mindMap) return null;

    const node = mindMap.nodes.find(n => n.id === nodeId);
    if (!node || node.expanded) return mindMap;

    // Find related inputs
    const relatedInputs = this.findRelatedInputs(node.inputIds);
    const newNodes: MindMapNode[] = [];

    relatedInputs.forEach((input, index) => {
      const newNode: MindMapNode = {
        id: this.generateId(),
        label: input.title,
        inputIds: [input.id],
        position: {
          x: node.position.x + Math.cos(index * 0.8) * 200,
          y: node.position.y + Math.sin(index * 0.8) * 200,
        },
        connections: [nodeId],
        depth: node.depth + 1,
        expanded: false,
      };
      newNodes.push(newNode);
      node.connections.push(newNode.id);
    });

    node.expanded = true;
    mindMap.nodes.push(...newNodes);
    mindMap.updatedAt = new Date();

    dataStore.updateMindMap(mindMapId, mindMap);
    return mindMap;
  }

  // Find related inputs based on tags and category
  private findRelatedInputs(inputIds: string[]): Input[] {
    const allInputs = dataStore.getAllInputs();
    const sourceInputs = inputIds
      .map(id => dataStore.getInput(id))
      .filter((input): input is Input => input !== undefined);

    if (sourceInputs.length === 0) return [];

    const sourceTags = new Set(sourceInputs.flatMap(i => i.metadata.tags));
    const sourceCategory = sourceInputs[0].metadata.category;

    return allInputs
      .filter(input => !inputIds.includes(input.id))
      .filter(input => {
        const hasSharedTag = input.metadata.tags.some(tag => sourceTags.has(tag));
        const sameCategory = input.metadata.category === sourceCategory;
        return hasSharedTag || sameCategory;
      })
      .slice(0, 5);
  }

  // Get all mind maps
  getAllMindMaps(): MindMap[] {
    return dataStore.getAllMindMaps();
  }
}

export const mindMapService = new MindMapService();
