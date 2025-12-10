'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoInput, TodoFilters } from '@/types/todo';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      // Reset to page 1 when filters change
      setCurrentPage(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
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
      toast.success('Todo created successfully!');
      fetchTodos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
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
      setShowForm(false);
      toast.success('Todo updated successfully!');
      fetchTodos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    const todoTitle = todo?.title || 'this todo';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${todoTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      toast.success('Todo deleted successfully!');
      fetchTodos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting todo:', err);
    }
  };

  // Toggle progress - now accepts a todo with updated progress
  const handleToggleProgress = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          category: todo.category,
          priority: todo.priority,
          dueDate: todo.dueDate,
          progress: todo.progress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      toast.success(`Progress updated to ${todo.progress.replace('_', ' ')}`);
      fetchTodos();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
      console.error('Error updating todo:', err);
    }
  };

  // Edit todo
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  // Close form and reset
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get existing categories
  const existingCategories = Array.from(
    new Set(todos.filter(t => t.category).map(t => t.category!))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.5rem',
            padding: '12px 16px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 lg:mb-12 text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MAANG Journey Tracker
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-medium">
            Track your progress toward becoming a world-class software engineer
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold">Error: {error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 font-medium text-sm underline cursor-pointer transition-colors"
                type="button"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Create Button */}
        <div className="mb-6 flex justify-center lg:justify-start">
          <button
            onClick={() => {
              setEditingTodo(null);
              setShowForm(true);
            }}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            type="button"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Todo
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            filters={filters}
            onFilterChange={setFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleProgress={handleToggleProgress}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Todo Form Modal */}
        {showForm && (
          <TodoForm
            todo={editingTodo}
            onSave={editingTodo ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
            existingCategories={existingCategories}
          />
        )}
      </div>
    </div>
  );
}
