'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Album } from '@prisma/client';

type ViewType = 'card' | 'list';
type SortField = 'artist' | 'title' | 'year';
type SortDirection = 'asc' | 'desc';

interface ViewContextType {
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  sortAlbums: (albums: Album[]) => Album[];
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewType, setViewType] = useState<ViewType>('card');
  const [sortField, setSortField] = useState<SortField>('artist');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedView = localStorage.getItem('viewType') as ViewType;
    const savedSortField = localStorage.getItem('sortField') as SortField;
    const savedSortDirection = localStorage.getItem('sortDirection') as SortDirection;

    if (savedView) setViewType(savedView);
    if (savedSortField) setSortField(savedSortField);
    if (savedSortDirection) setSortDirection(savedSortDirection);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('viewType', viewType);
    }
  }, [viewType, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sortField', sortField);
    }
  }, [sortField, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sortDirection', sortDirection);
    }
  }, [sortDirection, mounted]);

  const sortAlbums = (albums: Album[]): Album[] => {
    return [...albums].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'artist':
          aValue = a.artist.toLowerCase();
          bValue = b.artist.toLowerCase();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'year':
          aValue = a.year || 0;
          bValue = b.year || 0;
          break;
        default:
          aValue = a.artist.toLowerCase();
          bValue = b.artist.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ViewContext.Provider value={{
      viewType,
      setViewType,
      sortField,
      setSortField,
      sortDirection,
      setSortDirection,
      sortAlbums,
    }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}