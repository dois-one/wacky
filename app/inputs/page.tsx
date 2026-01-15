'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './inputs.module.css';

interface Input {
  id: string;
  type: string;
  title: string;
  content?: string;
  fileUrl?: string;
  metadata: {
    createdAt: string;
    tags: string[];
    priority: number;
    category?: string;
  };
  status: string;
}

export default function InputsPage() {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadInputs();
  }, [filter]);

  const loadInputs = async () => {
    setLoading(true);
    try {
      const url = filter !== 'all' ? `/api/inputs?category=${filter}` : '/api/inputs';
      const res = await fetch(url);
      const data = await res.json();
      setInputs(data);
    } catch (err) {
      console.error('Failed to load inputs:', err);
    }
    setLoading(false);
  };

  const categories = ['all', 'technical', 'design', 'business', 'ideas', 'tasks', 'general'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>All Inputs</h1>
        <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`${styles.filterButton} ${filter === cat ? styles.active : ''}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <Link href="/inputs/new" className={styles.addButton}>
          + Add Input
        </Link>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading inputs...</div>
      ) : inputs.length === 0 ? (
        <div className={styles.empty}>
          <p>No inputs found. Start by creating your first input!</p>
          <Link href="/inputs/new" className={styles.emptyButton}>
            Create First Input
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {inputs.map(input => (
            <div key={input.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.type}>{input.type}</span>
                <span className={styles.priority}>Priority: {input.metadata.priority}</span>
              </div>
              <h3>{input.title}</h3>
              {input.content && (
                <p className={styles.content}>
                  {input.content.substring(0, 150)}
                  {input.content.length > 150 ? '...' : ''}
                </p>
              )}
              {input.fileUrl && (
                <div className={styles.file}>
                  📎 Attachment available
                </div>
              )}
              <div className={styles.meta}>
                <span className={styles.category}>{input.metadata.category}</span>
                <span className={styles.status}>{input.status}</span>
              </div>
              <div className={styles.tags}>
                {input.metadata.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
