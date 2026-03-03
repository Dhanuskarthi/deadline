'use client';

import { useState, useEffect } from 'react';
import { Deadline } from '../lib/types';
import { getTimeRemaining, formatDate, PRIORITY_COLORS, CATEGORY_LABELS } from '../lib/utils';

interface DeadlineCardProps {
  deadline: Deadline;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export default function DeadlineCard({ deadline, onComplete, onDelete, index }: DeadlineCardProps) {
  const [time, setTime] = useState(() => getTimeRemaining(deadline.dueDate));
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (deadline.completed) return;
    const interval = setInterval(() => {
      setTime(getTimeRemaining(deadline.dueDate));
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, [deadline.dueDate, deadline.completed]);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(deadline.id), 300);
  };

  const priorityColor = PRIORITY_COLORS[deadline.priority];

  return (
    <div
      style={{
        opacity: deleting ? 0 : 1,
        transform: deleting ? 'translateX(-20px)' : 'translateX(0)',
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${index * 60}ms`,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <div style={{
        background: deadline.completed ? 'rgba(255,255,255,0.02)' : 'var(--surface)',
        border: `1px solid ${deadline.completed ? 'var(--border)' : time.overdue ? 'rgba(255,45,45,0.4)' : time.urgent ? 'rgba(255,184,0,0.3)' : 'var(--border)'}`,
        borderLeft: `3px solid ${deadline.completed ? 'var(--text-dim)' : priorityColor}`,
        borderRadius: 'var(--radius)',
        padding: '16px 18px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}>
        {/* Urgency glow */}
        {!deadline.completed && time.overdue && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at left, rgba(255,45,45,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Checkbox */}
        <button
          onClick={() => onComplete(deadline.id)}
          title="Mark complete"
          style={{
            width: 18, height: 18, minWidth: 18,
            border: `1.5px solid ${deadline.completed ? 'var(--safe)' : priorityColor}`,
            borderRadius: 3,
            background: deadline.completed ? 'var(--safe)' : 'transparent',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2,
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {deadline.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 18,
              letterSpacing: '0.03em',
              color: deadline.completed ? 'var(--text-dim)' : 'var(--text)',
              textDecoration: deadline.completed ? 'line-through' : 'none',
              lineHeight: 1,
            }}>
              {deadline.title}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: 'var(--bg)',
              background: priorityColor,
              padding: '2px 6px',
              borderRadius: 2,
              opacity: deadline.completed ? 0.4 : 1,
            }}>
              {deadline.priority.toUpperCase()}
            </span>
            <span style={{
              fontSize: 9,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              padding: '2px 6px',
              borderRadius: 2,
            }}>
              {CATEGORY_LABELS[deadline.category]}
            </span>
          </div>

          {deadline.description && (
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 12,
              marginBottom: 8,
              opacity: deadline.completed ? 0.5 : 1,
            }}>
              {deadline.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>
              {formatDate(deadline.dueDate)}
            </span>
            {!deadline.completed && (
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                color: time.overdue ? 'var(--urgent)' : time.urgent ? 'var(--warning)' : 'var(--safe)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: time.overdue ? 'var(--urgent)' : time.urgent ? 'var(--warning)' : 'var(--safe)',
                  display: 'inline-block',
                  animation: time.urgent ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
                }} />
                {time.label}
              </span>
            )}
            {deadline.completed && (
              <span style={{ fontSize: 11, color: 'var(--safe)' }}>✓ completed</span>
            )}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          title="Delete"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: '2px 4px',
            borderRadius: 2,
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--urgent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
        >
          ×
        </button>
      </div>
    </div>
  );
}
