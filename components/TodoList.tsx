'use client';

import { Todo, TodoFilters } from '@/types/todo';
import TodoItem from './TodoItem';
import FilterBar from './FilterBar';
import { useState, useMemo } from 'react';

interface TodoListProps {
  todos: Todo[];
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleProgress: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  onToggleProgress,
}: TodoListProps) {
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    todos.forEach(todo => {
      if (todo.category) {
        categorySet.add(todo.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.progress === 'completed').length;
    const inProgress = todos.filter(t => t.progress === 'in_progress').length;
    const notStarted = todos.filter(t => t.progress === 'not_started').length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, notStarted, progressPercentage };
  }, [todos]);

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Total Todos</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Progress</div>
          <div className="text-2xl font-bold text-purple-600">{stats.progressPercentage}%</div>
        </div>
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">No todos found. Create your first todo to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleProgress={onToggleProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}

