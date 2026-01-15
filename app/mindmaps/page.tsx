'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './mindmaps.module.css';

interface MindMapNode {
  id: string;
  label: string;
  inputIds: string[];
  position: { x: number; y: number };
  connections: string[];
  depth: number;
  expanded: boolean;
}

interface MindMap {
  id: string;
  title: string;
  rootNodeId: string;
  nodes: MindMapNode[];
  createdAt: string;
  updatedAt: string;
}

export default function MindMapsPage() {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<MindMap | null>(null);

  useEffect(() => {
    loadMindMaps();
  }, []);

  const loadMindMaps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mindmaps');
      const data = await res.json();
      setMindMaps(data);
      if (data.length > 0) {
        setSelectedMap(data[0]);
      }
    } catch (err) {
      console.error('Failed to load mind maps:', err);
    }
    setLoading(false);
  };

  const expandNode = async (nodeId: string) => {
    if (!selectedMap) return;

    try {
      const res = await fetch(`/api/mindmaps/${selectedMap.id}/expand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });

      if (!res.ok) throw new Error('Failed to expand node');

      const updatedMap = await res.json();
      setSelectedMap(updatedMap);
      
      // Update in list
      setMindMaps(maps => maps.map(m => m.id === updatedMap.id ? updatedMap : m));
    } catch (err) {
      console.error('Failed to expand node:', err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Mind Maps</h1>
        <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading mind maps...</div>
      ) : mindMaps.length === 0 ? (
        <div className={styles.empty}>
          <p>No mind maps yet. Create your first mind map from inputs!</p>
          <Link href="/inputs" className={styles.emptyButton}>
            View Inputs
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <h3>Available Mind Maps</h3>
            <div className={styles.mapList}>
              {mindMaps.map(map => (
                <button
                  key={map.id}
                  onClick={() => setSelectedMap(map)}
                  className={`${styles.mapItem} ${selectedMap?.id === map.id ? styles.active : ''}`}
                >
                  <div className={styles.mapTitle}>{map.title}</div>
                  <div className={styles.mapMeta}>
                    {map.nodes.length} nodes
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedMap && (
            <div className={styles.visualization}>
              <h2>{selectedMap.title}</h2>
              <div className={styles.canvas}>
                <svg className={styles.svg} viewBox="-600 -400 1200 800">
                  {/* Draw connections */}
                  {selectedMap.nodes.map(node =>
                    node.connections.map(connId => {
                      const targetNode = selectedMap.nodes.find(n => n.id === connId);
                      if (!targetNode) return null;
                      return (
                        <line
                          key={`${node.id}-${connId}`}
                          x1={node.position.x}
                          y1={node.position.y}
                          x2={targetNode.position.x}
                          y2={targetNode.position.y}
                          stroke="#0070f3"
                          strokeWidth="2"
                          opacity="0.3"
                        />
                      );
                    })
                  )}

                  {/* Draw nodes */}
                  {selectedMap.nodes.map(node => {
                    const colors = ['#0070f3', '#667eea', '#764ba2', '#f093fb', '#4facfe'];
                    const color = colors[node.depth % colors.length];
                    
                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r={node.depth === 0 ? 60 : 40}
                          fill={color}
                          opacity="0.9"
                          style={{ cursor: 'pointer' }}
                          onClick={() => !node.expanded && expandNode(node.id)}
                        />
                        <text
                          x={node.position.x}
                          y={node.position.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={node.depth === 0 ? '14' : '12'}
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          {node.label.length > 15
                            ? node.label.substring(0, 15) + '...'
                            : node.label}
                        </text>
                        {!node.expanded && node.inputIds.length > 0 && (
                          <text
                            x={node.position.x}
                            y={node.position.y + 55}
                            textAnchor="middle"
                            fill="#666"
                            fontSize="10"
                            style={{ cursor: 'pointer' }}
                            onClick={() => expandNode(node.id)}
                          >
                            + Expand
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className={styles.legend}>
                <h4>How to use:</h4>
                <ul>
                  <li>Click on nodes with &apos;+ Expand&apos; to reveal connections</li>
                  <li>Nodes are automatically organized by category</li>
                  <li>Line thickness indicates connection strength</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
