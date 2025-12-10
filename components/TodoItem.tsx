'use client';

import { Todo, Priority, Progress } from '@/types/todo';
import { format } from 'date-fns';
import Select from 'react-select';
import { useRouter } from 'next/navigation';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleProgress: (todo: Todo) => void;
}

const progressOptions = [
  { value: 'not_started' as Progress, label: 'Not Started' },
  { value: 'in_progress' as Progress, label: 'In Progress' },
  { value: 'completed' as Progress, label: 'Completed' },
];

export default function TodoItem({ todo, onEdit, onDelete, onToggleProgress }: TodoItemProps) {
  const router = useRouter();

  const getPriorityColor = (priority: Priority) => {
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
        return '#d1fae5'; // emerald-100
      case 'in_progress':
        return '#dbeafe'; // blue-100
      case 'not_started':
        return '#f3f4f6'; // gray-100
      default:
        return '#f3f4f6';
    }
  };

  const getProgressTextColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#047857'; // emerald-700
      case 'in_progress':
        return '#1e40af'; // blue-700
      case 'not_started':
        return '#374151'; // gray-700
      default:
        return '#374151';
    }
  };

  const getProgressBorderColor = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#10b981'; // emerald-500
      case 'in_progress':
        return '#3b82f6'; // blue-500
      case 'not_started':
        return '#9ca3af'; // gray-400
      default:
        return '#9ca3af';
    }
  };

  const getProgressOptionBg = (progress: Progress) => {
    switch (progress) {
      case 'completed':
        return '#10b981'; // emerald-500
      case 'in_progress':
        return '#3b82f6'; // blue-500
      case 'not_started':
        return '#6b7280'; // gray-500
      default:
        return '#6b7280';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.progress !== 'completed';
  const isDueSoon = todo.dueDate && 
    new Date(todo.dueDate) >= new Date() && 
    new Date(todo.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    todo.progress !== 'completed';

  const handleProgressChange = (selectedOption: any) => {
    if (selectedOption && selectedOption.value !== todo.progress) {
      const updatedTodo = {
        ...todo,
        progress: selectedOption.value,
      };
      onToggleProgress(updatedTodo);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('.react-select-container') ||
      target.closest('a')
    ) {
      return;
    }
    router.push(`/todos/${todo.id}`);
  };

  const customSelectStyles = {
    control: (base: any, state: any) => {
      const borderColor = getProgressBorderColor(todo.progress);
      const bgColor = getProgressBgColor(todo.progress);
      return {
        ...base,
        borderColor: state.isFocused ? borderColor : borderColor,
        boxShadow: state.isFocused ? `0 0 0 2px ${borderColor}40` : 'none',
        minHeight: '40px',
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
      color: getProgressTextColor(todo.progress),
      fontWeight: '700',
      fontSize: '0.875rem',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#6b7280',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: getProgressTextColor(todo.progress),
      '&:hover': {
        color: getProgressTextColor(todo.progress),
      },
    }),
    option: (base: any, state: any) => {
      const optionProgress = state.data.value as Progress;
      const bgColor = getProgressOptionBg(optionProgress);
      return {
        ...base,
        backgroundColor: state.isSelected
          ? bgColor
          : state.isFocused
          ? `${bgColor}20`
          : 'white',
        color: state.isSelected ? 'white' : '#1f2937',
        cursor: 'pointer',
        fontWeight: state.isSelected ? '600' : '500',
        '&:active': {
          backgroundColor: bgColor,
          color: 'white',
        },
      };
    },
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 lg:p-5 border border-gray-100 hover:border-blue-200 flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex-1 mb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {todo.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(todo.priority)} whitespace-nowrap`}>
            {todo.priority.toUpperCase()}
          </span>
          {todo.category && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-200 whitespace-nowrap">
              {todo.category}
            </span>
          )}
        </div>
        {todo.description && (
          <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{todo.description}</p>
        )}
      </div>

      {/* Status Section */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2">
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
          <div className={`flex items-center gap-1.5 text-xs font-semibold mt-2 ${
            isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
          }`}>
            {isOverdue && (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {isDueSoon && !isOverdue && (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            )}
            <span className="truncate">Due: {format(new Date(todo.dueDate), 'MMM dd')}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{format(new Date(todo.createdAt), 'MMM dd')}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 cursor-pointer flex items-center justify-center gap-1.5"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 cursor-pointer flex items-center justify-center gap-1.5"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
