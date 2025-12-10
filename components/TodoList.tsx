'use client';

import { Todo, TodoFilters } from '@/types/todo';
import TodoItem from './TodoItem';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import { useMemo } from 'react';

interface TodoListProps {
  todos: Todo[];
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleProgress: (todo: Todo) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export default function TodoList({
  todos,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  onToggleProgress,
  currentPage,
  onPageChange,
  itemsPerPage = 12,
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

  // Calculate pagination
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTodos = todos.slice(startIndex, endIndex);

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Todos</div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl shadow-md border border-emerald-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Completed</div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">In Progress</div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Progress</div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.progressPercentage}%</div>
        </div>
      </div>

      {/* Page Info */}
      {todos.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, todos.length)} of {todos.length} todos
        </div>
      )}

      {/* Todo List - Grid Layout with 4 cards per row */}
      {paginatedTodos.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">No todos found</p>
          <p className="text-gray-500 text-sm">Create your first todo to get started on your MAANG journey!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleProgress={onToggleProgress}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
