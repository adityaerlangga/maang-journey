'use client';

import { TodoFilters, Priority, Progress } from '@/types/todo';
import Select from 'react-select';

interface FilterBarProps {
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
  categories: string[];
}

const priorityOptions = [
  { value: 'high' as Priority, label: 'High' },
  { value: 'medium' as Priority, label: 'Medium' },
  { value: 'low' as Priority, label: 'Low' },
];

const progressOptions = [
  { value: 'not_started' as Progress, label: 'Not Started' },
  { value: 'in_progress' as Progress, label: 'In Progress' },
  { value: 'completed' as Progress, label: 'Completed' },
];

export default function FilterBar({ filters, onFilterChange, categories }: FilterBarProps) {
  const handleChange = (key: keyof TodoFilters, value: string | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.priority || filters.progress || filters.search
  );

  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: cat,
  }));

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: '#d1d5db',
      boxShadow: 'none',
      minHeight: '38px',
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search todos..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === filters.category) || null}
            onChange={(option) => handleChange('category', option?.value)}
            placeholder="All Categories"
            isClearable
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            options={priorityOptions}
            value={priorityOptions.find(opt => opt.value === filters.priority) || null}
            onChange={(option) => handleChange('priority', option?.value)}
            placeholder="All Priorities"
            isClearable
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Progress Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Progress
          </label>
          <Select
            options={progressOptions}
            value={progressOptions.find(opt => opt.value === filters.progress) || null}
            onChange={(option) => handleChange('progress', option?.value)}
            placeholder="All Status"
            isClearable
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
