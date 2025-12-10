'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoInput, Priority, Progress } from '@/types/todo';
import Select from 'react-select';

interface TodoFormProps {
  todo?: Todo | null;
  onSave: (todo: TodoInput) => void;
  onCancel: () => void;
  existingCategories: string[];
}

const priorityOptions = [
  { value: 'low' as Priority, label: 'Low' },
  { value: 'medium' as Priority, label: 'Medium' },
  { value: 'high' as Priority, label: 'High' },
];

const progressOptions = [
  { value: 'not_started' as Progress, label: 'Not Started' },
  { value: 'in_progress' as Progress, label: 'In Progress' },
  { value: 'completed' as Progress, label: 'Completed' },
];

export default function TodoForm({ todo, onSave, onCancel, existingCategories }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoInput>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    progress: 'not_started',
  });

  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        category: todo.category || '',
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        progress: todo.progress,
      });
      setNewCategory('');
      setUseNewCategory(false);
    } else {
      // Reset form when creating new todo
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: '',
        progress: 'not_started',
      });
      setNewCategory('');
      setUseNewCategory(false);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryToUse = useNewCategory && newCategory.trim() 
      ? newCategory.trim() 
      : formData.category || undefined;

    onSave({
      ...formData,
      category: categoryToUse,
      dueDate: formData.dueDate || undefined,
    });
  };

  const handleChange = (field: keyof TodoInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categoryOptions = existingCategories.map(cat => ({
    value: cat,
    label: cat,
  }));

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: '#d1d5db',
      boxShadow: 'none',
      minHeight: '42px',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#eff6ff'
        : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-200 animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {todo ? 'Edit Todo' : 'Create New Todo'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
            aria-label="Close"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <form onSubmit={handleSubmit} id="todo-form" className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
                placeholder="e.g., Complete LeetCode problem #1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none cursor-text"
                placeholder="Add detailed notes about this task..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useNewCategory"
                    checked={useNewCategory}
                    onChange={(e) => setUseNewCategory(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="useNewCategory" className="text-sm text-gray-600 font-medium cursor-pointer">
                    Create new category
                  </label>
                </div>
                {useNewCategory ? (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
                  />
                ) : (
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === formData.category) || null}
                    onChange={(option) => handleChange('category', option?.value || '')}
                    placeholder="Select category"
                    isClearable
                    styles={customSelectStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  />
                )}
              </div>
            </div>

            {/* Priority and Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  options={priorityOptions}
                  value={priorityOptions.find(opt => opt.value === formData.priority) || null}
                  onChange={(option) => handleChange('priority', option?.value || 'medium')}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Progress
                </label>
                <Select
                  options={progressOptions}
                  value={progressOptions.find(opt => opt.value === formData.progress) || null}
                  onChange={(option) => handleChange('progress', option?.value || 'not_started')}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-3 p-6 lg:p-8 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="todo-form"
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          >
            {todo ? 'Update Todo' : 'Create Todo'}
          </button>
        </div>
      </div>
    </div>
  );
}
