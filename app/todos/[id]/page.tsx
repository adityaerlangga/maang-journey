'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Todo, TodoInput, Progress } from '@/types/todo';
import { format } from 'date-fns';
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Link from 'next/link';

const progressOptions = [
  { value: 'not_started' as Progress, label: 'Not Started' },
  { value: 'in_progress' as Progress, label: 'In Progress' },
  { value: 'completed' as Progress, label: 'Completed' },
];

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchTodo();
    }
  }, [params.id]);

  const fetchTodo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/todos/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todo');
      }
      const data = await response.json();
      setTodo(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!todo) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${todo.title}"? This action cannot be undone.`,
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
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      toast.success('Todo deleted successfully!');
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
      console.error('Error deleting todo:', err);
    }
  };

  const handleProgressChange = async (selectedOption: any) => {
    if (!todo || !selectedOption) return;

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
          progress: selectedOption.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodo(updatedTodo);
      toast.success(`Progress updated to ${selectedOption.value.replace('_', ' ')}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
      console.error('Error updating todo:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-200';
    }
  };

  const getProgressBgColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#d1fae5';
      case 'in_progress':
        return '#dbeafe';
      case 'not_started':
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  };

  const getProgressTextColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#047857';
      case 'in_progress':
        return '#1e40af';
      case 'not_started':
        return '#374151';
      default:
        return '#374151';
    }
  };

  const getProgressBorderColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'not_started':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  };

  const customSelectStyles = {
    control: (base: any, state: any) => {
      if (!todo) return base;
      const borderColor = getProgressBorderColor(todo.progress);
      const bgColor = getProgressBgColor(todo.progress);
      return {
        ...base,
        borderColor: state.isFocused ? borderColor : borderColor,
        boxShadow: state.isFocused ? `0 0 0 2px ${borderColor}40` : 'none',
        minHeight: '42px',
        cursor: 'pointer',
        backgroundColor: bgColor,
        borderWidth: '2px',
        '&:hover': {
          borderColor: borderColor,
        },
      };
    },
    singleValue: (base: any) => ({
      ...base,
      color: todo ? getProgressTextColor(todo.progress) : '#374151',
      fontWeight: '700',
      fontSize: '0.875rem',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: todo ? getProgressTextColor(todo.progress) : '#374151',
    }),
    option: (base: any, state: any) => {
      const optionProgress = state.data.value as Progress;
      const bgColor = optionProgress === 'completed' ? '#10b981' : optionProgress === 'in_progress' ? '#3b82f6' : '#6b7280';
      return {
        ...base,
        backgroundColor: state.isSelected ? bgColor : state.isFocused ? `${bgColor}20` : 'white',
        color: state.isSelected ? 'white' : '#1f2937',
        cursor: 'pointer',
        fontWeight: state.isSelected ? '600' : '500',
      };
    },
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Todo Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The todo you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.progress !== 'completed';
  const isDueSoon = todo.dueDate && 
    new Date(todo.dueDate) >= new Date() && 
    new Date(todo.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    todo.progress !== 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Todos
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Todo Details</h1>
        </div>

        {/* Todo Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
          {/* Title and Badges */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-gray-900">{todo.title}</h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(todo.priority)}`}>
                {todo.priority.toUpperCase()}
              </span>
              {todo.category && (
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-200">
                  {todo.category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {todo.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{todo.description}</p>
            </div>
          )}

          {/* Status and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Status</label>
              <Select
                options={progressOptions}
                value={progressOptions.find(opt => opt.value === todo.progress) || null}
                onChange={handleProgressChange}
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                isSearchable={false}
              />
            </div>

            {todo.dueDate && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Due Date</label>
                <div className={`flex items-center gap-2 text-lg font-semibold ${
                  isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-700'
                }`}>
                  {isOverdue && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isDueSoon && !isOverdue && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{format(new Date(todo.dueDate), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Created</label>
              <p className="text-gray-600">{format(new Date(todo.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Last Updated</label>
              <p className="text-gray-600">{format(new Date(todo.updatedAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push(`/?edit=${todo.id}`)}
              className="px-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 cursor-pointer flex items-center gap-2"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Todo
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 cursor-pointer flex items-center gap-2"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

