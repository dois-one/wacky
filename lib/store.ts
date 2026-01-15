// In-memory data store for the platform
// In a production environment, this would be replaced with a proper database

import { Input, MindMap, Draft, Session } from '@/types';

class DataStore {
  private inputs: Map<string, Input> = new Map();
  private mindMaps: Map<string, MindMap> = new Map();
  private drafts: Map<string, Draft> = new Map();
  private sessions: Map<string, Session> = new Map();

  // Inputs
  addInput(input: Input): void {
    this.inputs.set(input.id, input);
  }

  getInput(id: string): Input | undefined {
    return this.inputs.get(id);
  }

  getAllInputs(): Input[] {
    return Array.from(this.inputs.values());
  }

  updateInput(id: string, updates: Partial<Input>): void {
    const input = this.inputs.get(id);
    if (input) {
      this.inputs.set(id, { ...input, ...updates });
    }
  }

  deleteInput(id: string): void {
    this.inputs.delete(id);
  }

  // Mind Maps
  addMindMap(mindMap: MindMap): void {
    this.mindMaps.set(mindMap.id, mindMap);
  }

  getMindMap(id: string): MindMap | undefined {
    return this.mindMaps.get(id);
  }

  getAllMindMaps(): MindMap[] {
    return Array.from(this.mindMaps.values());
  }

  updateMindMap(id: string, updates: Partial<MindMap>): void {
    const mindMap = this.mindMaps.get(id);
    if (mindMap) {
      this.mindMaps.set(id, { ...mindMap, ...updates });
    }
  }

  // Drafts
  addDraft(draft: Draft): void {
    this.drafts.set(draft.id, draft);
  }

  getDraft(id: string): Draft | undefined {
    return this.drafts.get(id);
  }

  getAllDrafts(): Draft[] {
    return Array.from(this.drafts.values());
  }

  updateDraft(id: string, updates: Partial<Draft>): void {
    const draft = this.drafts.get(id);
    if (draft) {
      this.drafts.set(id, { ...draft, ...updates });
    }
  }

  // Sessions
  addSession(session: Session): void {
    this.sessions.set(session.id, session);
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  updateSession(id: string, updates: Partial<Session>): void {
    const session = this.sessions.get(id);
    if (session) {
      this.sessions.set(id, { ...session, ...updates });
    }
  }
}

export const dataStore = new DataStore();
