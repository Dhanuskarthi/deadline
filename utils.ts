import { Deadline } from './types';

export function getTimeRemaining(dueDate: string): {
  label: string;
  urgent: boolean;
  overdue: boolean;
  hoursLeft: number;
} {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  const hoursLeft = diff / (1000 * 60 * 60);

  if (diff < 0) {
    const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    return {
      label: overdueDays > 0 ? `${overdueDays}d overdue` : `${overdueHours}h overdue`,
      urgent: true,
      overdue: true,
      hoursLeft,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days === 0 && hours === 0) {
    return { label: `${minutes}m left`, urgent: true, overdue: false, hoursLeft };
  }
  if (days === 0) {
    return { label: `${hours}h ${minutes}m left`, urgent: true, overdue: false, hoursLeft };
  }
  if (days <= 2) {
    return { label: `${days}d ${hours}h left`, urgent: true, overdue: false, hoursLeft };
  }
  return { label: `${days} days left`, urgent: false, overdue: false, hoursLeft };
}

export function sortDeadlines(deadlines: Deadline[]): Deadline[] {
  return [...deadlines].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const PRIORITY_COLORS = {
  critical: '#ff2d2d',
  high: '#ff4d1c',
  medium: '#ffb800',
  low: '#00c853',
};

export const CATEGORY_LABELS = {
  work: 'WORK',
  school: 'SCHOOL',
  personal: 'PERSONAL',
  other: 'OTHER',
};
