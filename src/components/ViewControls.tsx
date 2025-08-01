'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useView } from '@/contexts/ViewContext';
import { Moon, Sun, Grid3X3, List, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function ViewControls() {
  const { theme, toggleTheme } = useTheme();
  const { 
    viewType, 
    setViewType, 
    sortField, 
    setSortField, 
    sortDirection, 
    setSortDirection 
  } = useView();

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortFieldChange = (field: 'artist' | 'title' | 'year') => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'artist' | 'title' | 'year' }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Left side - View and Sort controls */}
      <div className="flex items-center space-x-4">
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewType('card')}
              className={`p-2 rounded-md transition-colors ${
                viewType === 'card'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Card view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-md transition-colors ${
                viewType === 'list'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleSortFieldChange('artist')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center ${
                sortField === 'artist'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Artist
              <SortIcon field="artist" />
            </button>
            <button
              onClick={() => handleSortFieldChange('title')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center ${
                sortField === 'title'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Album
              <SortIcon field="title" />
            </button>
            <button
              onClick={() => handleSortFieldChange('year')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center ${
                sortField === 'year'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Year
              <SortIcon field="year" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Dark mode toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}