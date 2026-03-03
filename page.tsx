'use client';

import { useState, useEffect, useMemo } from 'react';
import { Deadline, Priority, Category } from '../lib/types';
import { sortDeadlines, PRIORITY_COLORS } from '../lib/utils';
import DeadlineCard from '../components/DeadlineCard';
import AddDeadlineForm from '../components/AddDeadlineForm';

const STORAGE_KEY = 'deadlines-v1';

const SAMPLE_DEADLINES: Deadline[] = [
  {
    id: 'demo1',
    title: 'Q4 Report Submission',
    description: 'Final revenue analysis and projections deck',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    priority: 'critical',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo2',
    title: 'System Design Assignment',
    description: 'Distributed cache architecture writeup',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
    priority: 'high',
    category: 'school',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo3',
    title: 'Gym Registration Renewal',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    priority: 'low',
    category: 'personal',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo4',
    title: 'API Integration PR Review',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

type FilterCategory = 'all' | Category;
type FilterStatus = 'active' | 'completed' | 'all';

export default function Home() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDeadlines(JSON.parse(stored));
      } else {
        setDeadlines(SAMPLE_DEADLINES);
      }
    } catch {
      setDeadlines(SAMPLE_DEADLINES);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
    }
  }, [deadlines, mounted]);

  const handleAdd = (deadline: Deadline) => {
    setDeadlines(prev => [deadline, ...prev]);
  };

  const handleComplete = (id: string) => {
    setDeadlines(prev =>
      prev.map(d => d.id === id ? { ...d, completed: !d.completed } : d)
    );
  };

  const handleDelete = (id: string) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const filtered = useMemo(() => {
    let list = deadlines;
    if (filterCategory !== 'all') list = list.filter(d => d.category === filterCategory);
    if (filterStatus === 'active') list = list.filter(d => !d.completed);
    if (filterStatus === 'completed') list = list.filter(d => d.completed);
    if (filterPriority !== 'all') list = list.filter(d => d.priority === filterPriority);
    return sortDeadlines(list);
  }, [deadlines, filterCategory, filterStatus, filterPriority]);

  const stats = useMemo(() => {
    const active = deadlines.filter(d => !d.completed);
    const overdue = active.filter(d => new Date(d.dueDate) < new Date());
    const urgent = active.filter(d => {
      const h = (new Date(d.dueDate).getTime() - Date.now()) / 3600000;
      return h >= 0 && h <= 48;
    });
    return { total: deadlines.length, active: active.length, overdue: overdue.length, urgent: urgent.length };
  }, [deadlines]);

  const categories: { value: FilterCategory; label: string }[] = [
    { value: 'all', label: 'ALL' },
    { value: 'work', label: 'WORK' },
    { value: 'school', label: 'SCHOOL' },
    { value: 'personal', label: 'PERSONAL' },
    { value: 'other', label: 'OTHER' },
  ];

  const priorities: { value: Priority | 'all'; label: string }[] = [
    { value: 'all', label: 'ALL' },
    { value: 'critical', label: 'CRITICAL' },
    { value: 'high', label: 'HIGH' },
    { value: 'medium', label: 'MEDIUM' },
    { value: 'low', label: 'LOW' },
  ];

  const chipStyle = (active: boolean, color?: string) => ({
    background: active ? (color ? `${color}18` : 'rgba(240,236,228,0.08)') : 'transparent',
    border: `1px solid ${active ? (color || 'var(--text-muted)') : 'var(--border)'}`,
    borderRadius: 3,
    color: active ? (color || 'var(--text)') : 'var(--text-dim)',
    fontFamily: 'DM Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.1em',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  });

  if (!mounted) return null;

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.4s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(48px, 10vw, 72px)',
            letterSpacing: '0.02em',
            lineHeight: 0.9,
            color: 'var(--text)',
          }}>
            DEADLINE
          </h1>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 3,
              color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 15,
              letterSpacing: '0.08em',
              padding: '10px 18px',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.1s',
              marginBottom: 4,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e63c0e')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            + NEW
          </button>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 11, letterSpacing: '0.1em' }}>
          TRACK WHAT MATTERS. MISS NOTHING.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        marginBottom: 28,
        background: 'var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
        animation: 'fadeUp 0.4s ease 0.05s both',
      }}>
        {[
          { label: 'TOTAL', value: stats.total, color: 'var(--text)' },
          { label: 'ACTIVE', value: stats.active, color: 'var(--text)' },
          { label: 'URGENT', value: stats.urgent, color: 'var(--warning)' },
          { label: 'OVERDUE', value: stats.overdue, color: 'var(--urgent)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)',
            padding: '14px 16px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 28,
              color: stat.color,
              lineHeight: 1,
            }}>{stat.value}</div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-dim)', marginTop: 3 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
        {/* Status */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['active', 'all', 'completed'] as FilterStatus[]).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={chipStyle(filterStatus === s)}>
              {s.toUpperCase()}
            </button>
          ))}
          <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
          {categories.map(c => (
            <button key={c.value} onClick={() => setFilterCategory(c.value)}
              style={chipStyle(filterCategory === c.value)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {priorities.map(p => (
            <button key={p.value} onClick={() => setFilterPriority(p.value)}
              style={chipStyle(
                filterPriority === p.value,
                p.value !== 'all' ? PRIORITY_COLORS[p.value as Priority] : undefined
              )}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-dim)',
            animation: 'fadeUp 0.3s ease both',
          }}>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 32,
              letterSpacing: '0.05em',
              marginBottom: 8,
              color: 'var(--border)',
            }}>
              {filterStatus === 'completed' ? 'NOTHING COMPLETED YET' : 'ALL CLEAR'}
            </div>
            <p style={{ fontSize: 12 }}>
              {filterStatus === 'completed'
                ? 'Mark deadlines as done to see them here.'
                : 'No deadlines match your filters. Add one above.'}
            </p>
          </div>
        ) : (
          filtered.map((deadline, i) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              onComplete={handleComplete}
              onDelete={handleDelete}
              index={i}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48,
        paddingTop: 20,
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          {deadlines.length} DEADLINE{deadlines.length !== 1 ? 'S' : ''} STORED LOCALLY
        </span>
        <button
          onClick={() => {
            if (confirm('Clear all deadlines?')) setDeadlines([]);
          }}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace',
            fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--urgent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
        >
          CLEAR ALL
        </button>
      </div>

      {showForm && <AddDeadlineForm onAdd={handleAdd} onClose={() => setShowForm(false)} />}
    </main>
  );
}
