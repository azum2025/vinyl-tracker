import { Album } from '@prisma/client';
import { ExternalLink, Heart, Check, Calendar, Music } from 'lucide-react';
import Image from 'next/image';

interface AlbumListProps {
  albums: Album[];
  onStatusChange: (albumId: string, newStatus: 'WANT' | 'HAVE') => void;
}

export function AlbumList({ albums, onStatusChange }: AlbumListProps) {
  const handleStatusToggle = (album: Album) => {
    const newStatus = album.status === 'WANT' ? 'HAVE' : 'WANT';
    onStatusChange(album.id, newStatus);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Album
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Artist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Links
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {albums.map((album) => (
              <tr key={album.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      {album.coverImage ? (
                        <Image
                          src={album.coverImage}
                          alt={`${album.artist} - ${album.title}`}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Music className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {album.title}
                      </p>
                      {album.format && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {album.format}
                        </p>
                      )}
                      {album.label && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {album.label}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{album.artist}</div>
                  {album.genre && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{album.genre}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {album.year && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {album.year}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusToggle(album)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      album.status === 'HAVE'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                    }`}
                    title={album.status === 'HAVE' ? 'I have this' : 'I want this'}
                  >
                    {album.status === 'HAVE' ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Have
                      </>
                    ) : (
                      <>
                        <Heart className="h-3 w-3 mr-1" />
                        Want
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {album.appleMusicUrl && (
                      <a
                        href={album.appleMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Apple Music"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {album.allMusicUrl && (
                      <a
                        href={album.allMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="AllMusic"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {album.discogsUrl && (
                      <a
                        href={album.discogsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        title="Discogs"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}