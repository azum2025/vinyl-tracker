import { Album } from '@prisma/client';
import { ExternalLink, Heart, Check, Calendar, Music } from 'lucide-react';
import Image from 'next/image';

interface AlbumCardProps {
  album: Album;
  onStatusChange: (albumId: string, newStatus: 'WANT' | 'HAVE') => void;
}

export function AlbumCard({ album, onStatusChange }: AlbumCardProps) {
  const handleStatusToggle = () => {
    const newStatus = album.status === 'WANT' ? 'HAVE' : 'WANT';
    onStatusChange(album.id, newStatus);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt={`${album.artist} - ${album.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleStatusToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              album.status === 'HAVE'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title={album.status === 'HAVE' ? 'I have this' : 'I want this'}
          >
            {album.status === 'HAVE' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 line-clamp-2">
          {album.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1">
          {album.artist}
        </p>

        {/* Details */}
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          {album.year && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{album.year}</span>
            </div>
          )}
          {album.format && (
            <div className="line-clamp-1">{album.format}</div>
          )}
          {album.label && (
            <div className="line-clamp-1">{album.label}</div>
          )}
        </div>

        {/* External Links */}
        <div className="mt-3 flex flex-wrap gap-2">
          {album.appleMusicUrl && (
            <a
              href={album.appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Apple Music</span>
            </a>
          )}
          {album.allMusicUrl && (
            <a
              href={album.allMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              <ExternalLink className="h-3 w-3" />
              <span>AllMusic</span>
            </a>
          )}
          {album.discogsUrl && (
            <a
              href={album.discogsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Discogs</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}