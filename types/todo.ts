export type Priority = 'low' | 'medium' | 'high';
export type Progress = 'not_started' | 'in_progress' | 'completed';

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  priority: Priority;
  dueDate: string | null;
  progress: Progress;
  createdAt: string;
  updatedAt: string;
}

export interface TodoInput {
  title: string;
  description?: string;
  category?: string;
  priority?: Priority;
  dueDate?: string;
  progress?: Progress;
}

export interface TodoFilters {
  category?: string;
  priority?: Priority;
  progress?: Progress;
  search?: string;
}

