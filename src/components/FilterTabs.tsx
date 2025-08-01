interface FilterTabsProps {
  activeFilter: 'ALL' | 'WANT' | 'HAVE';
  onFilterChange: (filter: 'ALL' | 'WANT' | 'HAVE') => void;
  albumCounts: {
    all: number;
    want: number;
    have: number;
  };
}

export function FilterTabs({ activeFilter, onFilterChange, albumCounts }: FilterTabsProps) {
  const tabs = [
    { key: 'ALL' as const, label: 'All Albums', count: albumCounts.all },
    { key: 'WANT' as const, label: 'Want List', count: albumCounts.want },
    { key: 'HAVE' as const, label: 'Collection', count: albumCounts.have },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeFilter === tab.key
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {tab.label}
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}