'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoInput, TodoFilters } from '@/types/todo';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.progress) queryParams.append('progress', filters.progress);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/todos?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create todo
  const handleCreate = async (todoInput: TodoInput) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoInput),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      setShowForm(false);
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating todo:', err);
    }
  };

  // Update todo
  const handleUpdate = async (todoInput: TodoInput) => {
    if (!editingTodo) return;

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoInput),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      setEditingTodo(null);
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting todo:', err);
    }
  };

  // Toggle progress
  const handleToggleProgress = async (todo: Todo) => {
    const nextProgress = 
      todo.progress === 'not_started' ? 'in_progress' :
      todo.progress === 'in_progress' ? 'completed' : 'not_started';

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          progress: nextProgress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating todo:', err);
    }
  };

  // Edit todo
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  // Get existing categories
  const existingCategories = Array.from(
    new Set(todos.filter(t => t.category).map(t => t.category!))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 MAANG Journey Tracker
          </h1>
          <p className="text-gray-600">
            Track your progress toward becoming a world-class software engineer
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            + Create New Todo
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            filters={filters}
            onFilterChange={setFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleProgress={handleToggleProgress}
          />
        )}

        {/* Todo Form Modal */}
        {(showForm || editingTodo) && (
          <TodoForm
            todo={editingTodo}
            onSave={editingTodo ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingTodo(null);
            }}
            existingCategories={existingCategories}
          />
        )}
      </div>
    </div>
  );
}
