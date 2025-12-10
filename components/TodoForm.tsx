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
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
    }),
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {todo ? 'Edit Todo' : 'Create New Todo'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Complete LeetCode problem #1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / Notes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add detailed notes about this task..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="useNewCategory"
                    checked={useNewCategory}
                    onChange={(e) => setUseNewCategory(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="useNewCategory" className="text-sm text-gray-600">
                    Create new category
                  </label>
                </div>
                {useNewCategory ? (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  />
                )}
              </div>
            </div>

            {/* Priority and Progress */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  options={priorityOptions}
                  value={priorityOptions.find(opt => opt.value === formData.priority) || null}
                  onChange={(option) => handleChange('priority', option?.value || 'medium')}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress
                </label>
                <Select
                  options={progressOptions}
                  value={progressOptions.find(opt => opt.value === formData.progress) || null}
                  onChange={(option) => handleChange('progress', option?.value || 'not_started')}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {todo ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
