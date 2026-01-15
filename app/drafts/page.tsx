'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { parseEffort } from '@/lib/draft';
import styles from './drafts.module.css';

interface ExecutionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: string;
  estimatedEffort?: string;
}

interface Draft {
  id: string;
  title: string;
  content: string;
  inputIds: string[];
  status: string;
  executionPlan?: {
    id: string;
    steps: ExecutionStep[];
    overview: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      setDrafts(data);
    } catch (err) {
      console.error('Failed to load drafts:', err);
    }
    setLoading(false);
  };

  const toggleExpand = (draftId: string) => {
    setExpandedDraft(expandedDraft === draftId ? null : draftId);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Implementation Drafts</h1>
        <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading drafts...</div>
      ) : drafts.length === 0 ? (
        <div className={styles.empty}>
          <p>No drafts yet. Create drafts from your inputs!</p>
          <Link href="/inputs" className={styles.emptyButton}>
            View Inputs
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {drafts.map(draft => (
            <div key={draft.id} className={styles.draftCard}>
              <div className={styles.draftHeader}>
                <h2>{draft.title}</h2>
                <span className={`${styles.status} ${styles[draft.status]}`}>
                  {draft.status}
                </span>
              </div>

              <div className={styles.draftMeta}>
                <span>📝 Based on {draft.inputIds.length} input{draft.inputIds.length !== 1 ? 's' : ''}</span>
                <span>📅 Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
              </div>

              {draft.executionPlan && (
                <div className={styles.planSummary}>
                  <strong>Execution Plan:</strong> {draft.executionPlan.steps.length} steps
                  <span className={styles.effort}>
                    Est. {draft.executionPlan.steps.reduce((sum, step) => 
                      sum + parseEffort(step.estimatedEffort || '1'), 0
                    )} days
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleExpand(draft.id)}
                className={styles.expandButton}
              >
                {expandedDraft === draft.id ? '▼ Hide Details' : '▶ Show Details'}
              </button>

              {expandedDraft === draft.id && (
                <div className={styles.expandedContent}>
                  <div className={styles.content}>
                    <h3>Content</h3>
                    <div className={styles.markdown}>
                      {draft.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={idx}>{line.substring(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={idx}>{line.substring(3)}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={idx}>{line.substring(4)}</h3>;
                        } else if (line.trim() === '') {
                          return <br key={idx} />;
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                  </div>

                  {draft.executionPlan && (
                    <div className={styles.executionPlan}>
                      <h3>Execution Plan</h3>
                      <p className={styles.overview}>{draft.executionPlan.overview}</p>
                      <div className={styles.steps}>
                        {draft.executionPlan.steps.map(step => (
                          <div key={step.id} className={styles.step}>
                            <div className={styles.stepHeader}>
                              <span className={styles.stepNumber}>{step.order}</span>
                              <h4>{step.title}</h4>
                              <span className={styles.stepEffort}>{step.estimatedEffort}</span>
                            </div>
                            <p className={styles.stepDescription}>{step.description}</p>
                            <span className={`${styles.stepStatus} ${styles[step.status]}`}>
                              {step.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
