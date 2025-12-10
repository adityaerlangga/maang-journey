'use client';

import { Todo, Priority, Progress } from '@/types/todo';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleProgress: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit, onDelete, onToggleProgress }: TodoItemProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProgressColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'not_started':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getProgressText = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Not Started';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.progress !== 'completed';
  const isDueSoon = todo.dueDate && 
    new Date(todo.dueDate) >= new Date() && 
    new Date(todo.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    todo.progress !== 'completed';

  const getNextProgress = (current: Progress): Progress => {
    if (current === 'not_started') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return 'not_started';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(todo.priority)}`}>
              {todo.priority.toUpperCase()}
            </span>
            {todo.category && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-300">
                {todo.category}
              </span>
            )}
          </div>
          {todo.description && (
            <p className="text-gray-600 mb-3">{todo.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleProgress(todo)}
            className={`px-3 py-1 text-sm font-medium rounded text-white ${getProgressColor(todo.progress)} hover:opacity-90 transition-opacity`}
          >
            {getProgressText(todo.progress)}
          </button>
          <span className="text-sm text-gray-500">
            Next: {getProgressText(getNextProgress(todo.progress))}
          </span>
        </div>

        {todo.dueDate && (
          <div className={`text-sm font-medium ${
            isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {isOverdue && '⚠️ '}
            {isDueSoon && '⏰ '}
            Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

