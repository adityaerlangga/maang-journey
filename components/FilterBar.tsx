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

  return (
    <div className="bg-white p-5 lg:p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search todos..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-text"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          />
        </div>

        {/* Progress Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 w-fit"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      )}
    </div>
  );
}
