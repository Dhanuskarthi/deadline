export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Category = 'work' | 'school' | 'personal' | 'other';

export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
}
