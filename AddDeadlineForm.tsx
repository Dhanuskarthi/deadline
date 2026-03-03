'use client';

import { useState } from 'react';
import { Deadline, Priority, Category } from '../lib/types';
import { generateId } from '../lib/utils';

interface AddDeadlineFormProps {
  onAdd: (deadline: Deadline) => void;
  onClose: () => void;
}

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontFamily: 'DM Mono, monospace',
  fontSize: 13,
  padding: '10px 12px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
  marginBottom: 6,
};

export default function AddDeadlineForm({ onAdd, onClose }: AddDeadlineFormProps) {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  const defaultDate = now.toISOString().slice(0, 16);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(defaultDate);
  const [priority, setPriority] = useState<Priority>('high');
  const [category, setCategory] = useState<Category>('work');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!dueDate) { setError('Due date is required'); return; }

    const deadline: Deadline = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAdd(deadline);
    onClose();
  };

  const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];
  const categories: Category[] = ['work', 'school', 'personal', 'other'];
  const priorityColors: Record<Priority, string> = {
    critical: '#ff2d2d', high: '#ff4d1c', medium: '#ffb800', low: '#00c853'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeUp 0.2s ease both',
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: 6,
        padding: 28,
        width: '100%', maxWidth: 480,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 22,
            letterSpacing: '0.05em',
            color: 'var(--text)',
          }}>
            NEW DEADLINE
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>TITLE *</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="What needs to be done?"
              style={{ ...inputStyle, borderColor: error && !title ? 'var(--urgent)' : 'var(--border)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = error && !title ? 'var(--urgent)' : 'var(--border)')}
              autoFocus
            />
          </div>

          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>DUE DATE & TIME *</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>PRIORITY</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {priorities.map(p => (
                  <button key={p} onClick={() => setPriority(p)} style={{
                    background: priority === p ? `${priorityColors[p]}18` : 'transparent',
                    border: `1px solid ${priority === p ? priorityColors[p] : 'var(--border)'}`,
                    borderRadius: 3,
                    color: priority === p ? priorityColors[p] : 'var(--text-muted)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    padding: '7px 10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>CATEGORY</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {categories.map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    background: category === c ? 'rgba(240,236,228,0.06)' : 'transparent',
                    border: `1px solid ${category === c ? 'var(--text-muted)' : 'var(--border)'}`,
                    borderRadius: 3,
                    color: category === c ? 'var(--text)' : 'var(--text-muted)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    padding: '7px 10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--urgent)', fontSize: 11 }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 3,
              color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 16,
              letterSpacing: '0.08em',
              padding: '13px',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.1s',
              marginTop: 4,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e63c0e')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ADD DEADLINE
          </button>
        </div>
      </div>
    </div>
  );
}
