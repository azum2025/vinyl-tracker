'use client'

import { useState, useEffect, useCallback } from 'react';
import { Album } from '@prisma/client';
import { AlbumGrid } from '@/components/AlbumGrid';
import { AlbumList } from '@/components/AlbumList';
import { SearchBar } from '@/components/SearchBar';
import { FileUpload } from '@/components/FileUpload';
import { FilterTabs } from '@/components/FilterTabs';
import { ViewControls } from '@/components/ViewControls';
import { useView } from '@/contexts/ViewContext';
import { Music } from 'lucide-react';

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WANT' | 'HAVE'>('ALL');
  const [loading, setLoading] = useState(true);
  
  const { viewType, sortAlbums } = useView();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const filterAlbums = useCallback(() => {
    let filtered = albums;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(album => album.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(album => 
        album.artist.toLowerCase().includes(query) ||
        album.title.toLowerCase().includes(query) ||
        album.genre?.toLowerCase().includes(query) ||
        album.label?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = sortAlbums(filtered);

    setFilteredAlbums(filtered);
  }, [albums, searchQuery, statusFilter, sortAlbums]);

  useEffect(() => {
    filterAlbums();
  }, [filterAlbums]);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleStatusChange = async (albumId: string, newStatus: 'WANT' | 'HAVE') => {
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedAlbum = await response.json();
        setAlbums(albums.map(album => 
          album.id === albumId ? updatedAlbum : album
        ));
      }
    } catch (error) {
      console.error('Error updating album status:', error);
    }
  };

  const handleImportComplete = () => {
    fetchAlbums();
  };

  const handleEnrichAlbums = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enrich', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        console.log(`Enriched ${result.updated} albums`);
        fetchAlbums(); // Refresh the list
      } else {
        console.error('Enrichment failed:', result.error);
      }
    } catch (error) {
      console.error('Error enriching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your vinyl collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Vinyl Tracker
              </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {albums.length} albums • {albums.filter(a => a.status === 'HAVE').length} owned • {albums.filter(a => a.status === 'WANT').length} wanted
            </div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Keep track of your vinyl want list and collection
          </p>
        </div>

        {/* View Controls */}
        <ViewControls />

        {/* Import Section */}
        <div className="mb-8">
          <FileUpload onImportComplete={handleImportComplete} />
          
          {/* Enrich Albums Button */}
          {albums.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleEnrichAlbums}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Album Art...
                  </>
                ) : (
                  '🎨 Add Album Art & Links'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <FilterTabs 
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            albumCounts={{
              all: albums.length,
              want: albums.filter(a => a.status === 'WANT').length,
              have: albums.filter(a => a.status === 'HAVE').length,
            }}
          />
        </div>

        {/* Albums Display */}
        {viewType === 'card' ? (
          <AlbumGrid 
            albums={filteredAlbums}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <AlbumList 
            albums={filteredAlbums}
            onStatusChange={handleStatusChange}
          />
        )}

        {filteredAlbums.length === 0 && albums.length > 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No albums match your current filters</p>
          </div>
        )}

        {albums.length === 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your vinyl collection is empty</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Upload your want list to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}