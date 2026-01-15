'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './new.module.css';

export default function NewInputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  
  const [type, setType] = useState<'note' | 'photo' | 'recording'>(
    (typeFromUrl as any) || 'note'
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let fileUrl = '';

      // Upload file if present
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload failed');

        const uploadData = await uploadRes.json();
        fileUrl = uploadData.fileUrl;
        setUploading(false);
      }

      // Create input
      const res = await fetch('/api/inputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          content: content || undefined,
          fileUrl: fileUrl || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to create input');

      // Redirect to inputs page
      router.push('/inputs');
    } catch (err) {
      console.error('Error creating input:', err);
      alert('Failed to create input. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Create New Input</h1>
        <Link href="/inputs" className={styles.backLink}>← Cancel</Link>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Type</label>
          <div className={styles.typeButtons}>
            <button
              type="button"
              onClick={() => setType('note')}
              className={`${styles.typeButton} ${type === 'note' ? styles.active : ''}`}
            >
              📝 Note
            </button>
            <button
              type="button"
              onClick={() => setType('photo')}
              className={`${styles.typeButton} ${type === 'photo' ? styles.active : ''}`}
            >
              📷 Photo
            </button>
            <button
              type="button"
              onClick={() => setType('recording')}
              className={`${styles.typeButton} ${type === 'recording' ? styles.active : ''}`}
            >
              🎤 Recording
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter a descriptive title"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add details, thoughts, or description..."
            rows={8}
            className={styles.textarea}
          />
        </div>

        {(type === 'photo' || type === 'recording') && (
          <div className={styles.formGroup}>
            <label htmlFor="file">
              {type === 'photo' ? 'Upload Photo' : 'Upload Recording'}
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept={type === 'photo' ? 'image/*' : 'audio/*'}
              className={styles.fileInput}
            />
            {file && (
              <div className={styles.fileName}>
                Selected: {file.name}
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={saving || uploading || !title}
            className={styles.submitButton}
          >
            {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Create Input'}
          </button>
          <Link href="/inputs" className={styles.cancelButton}>
            Cancel
          </Link>
        </div>
      </form>

      <div className={styles.info}>
        <h3>Auto-Organization Features</h3>
        <p>Your input will be automatically:</p>
        <ul>
          <li>Tagged based on content keywords</li>
          <li>Categorized (technical, design, business, ideas, tasks)</li>
          <li>Assigned a priority score</li>
          <li>Connected to related inputs</li>
        </ul>
      </div>
    </div>
  );
}
