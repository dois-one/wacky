'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface WelcomeBackData {
  recentInputs: any[];
  prioritizedTasks: any[];
  suggestedConnections: any[];
  statistics: {
    totalInputs: number;
    processedToday: number;
    pendingOrganization: number;
  };
}

export default function Home() {
  const [welcomeData, setWelcomeData] = useState<WelcomeBackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/welcome')
      .then(res => res.json())
      .then(data => {
        setWelcomeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load welcome data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome Back to Wacky</h1>
        <p className={styles.tagline}>
          Capture, organize, and refine your ideas with simplicity
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{welcomeData?.statistics.totalInputs || 0}</div>
          <div className={styles.statLabel}>Total Inputs</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{welcomeData?.statistics.processedToday || 0}</div>
          <div className={styles.statLabel}>Processed Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{welcomeData?.statistics.pendingOrganization || 0}</div>
          <div className={styles.statLabel}>Pending Organization</div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.actions}>
            <Link href="/inputs/new" className={styles.actionButton}>
              <span className={styles.icon}>📝</span>
              <span>Add Note</span>
            </Link>
            <Link href="/inputs/new?type=photo" className={styles.actionButton}>
              <span className={styles.icon}>📷</span>
              <span>Upload Photo</span>
            </Link>
            <Link href="/inputs/new?type=recording" className={styles.actionButton}>
              <span className={styles.icon}>🎤</span>
              <span>Record Audio</span>
            </Link>
            <Link href="/mindmaps/new" className={styles.actionButton}>
              <span className={styles.icon}>🗺️</span>
              <span>Create Mind Map</span>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Recent Inputs ({welcomeData?.recentInputs.length || 0})</h2>
          <div className={styles.list}>
            {welcomeData?.recentInputs.length === 0 ? (
              <p className={styles.empty}>No recent inputs. Start by adding a note, photo, or recording!</p>
            ) : (
              welcomeData?.recentInputs.map(input => (
                <div key={input.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemType}>{input.type}</span>
                    <span className={styles.itemCategory}>{input.metadata.category}</span>
                  </div>
                  <h3>{input.title}</h3>
                  <div className={styles.itemTags}>
                    {input.metadata.tags.map((tag: string) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/inputs" className={styles.viewAll}>View All Inputs →</Link>
        </section>

        <section className={styles.section}>
          <h2>Prioritized Tasks ({welcomeData?.prioritizedTasks.length || 0})</h2>
          <div className={styles.list}>
            {welcomeData?.prioritizedTasks.length === 0 ? (
              <p className={styles.empty}>No tasks yet. Create drafts from your inputs!</p>
            ) : (
              welcomeData?.prioritizedTasks.map(draft => (
                <div key={draft.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemStatus}>{draft.status}</span>
                  </div>
                  <h3>{draft.title}</h3>
                  <p className={styles.itemMeta}>
                    {draft.executionPlan?.steps.length || 0} steps
                  </p>
                </div>
              ))
            )}
          </div>
          <Link href="/drafts" className={styles.viewAll}>View All Drafts →</Link>
        </section>

        <section className={styles.section}>
          <h2>Suggested Connections</h2>
          <div className={styles.list}>
            {welcomeData?.suggestedConnections.length === 0 ? (
              <p className={styles.empty}>No connections found. Add more inputs to see suggestions!</p>
            ) : (
              welcomeData?.suggestedConnections.slice(0, 5).map((conn, idx) => (
                <div key={idx} className={styles.connection}>
                  <p>{conn.reason}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
