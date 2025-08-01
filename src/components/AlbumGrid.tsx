import { Album } from '@prisma/client';
import { AlbumCard } from './AlbumCard';

interface AlbumGridProps {
  albums: Album[];
  onStatusChange: (albumId: string, newStatus: 'WANT' | 'HAVE') => void;
}

export function AlbumGrid({ albums, onStatusChange }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}