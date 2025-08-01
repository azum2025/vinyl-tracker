import { prisma } from './prisma';
import { Album, Status } from '@prisma/client';
import { discogsAPI } from './discogs';
import { musicAPI } from './musicapi';
import { ParsedAlbum } from './fileParser';

export interface AlbumInput {
  artist: string;
  title: string;
  year?: number;
  format?: string;
  genre?: string;
  label?: string;
  coverImage?: string;
  discogsUrl?: string;
  discogsId?: string;
  appleMusicUrl?: string;
  allMusicUrl?: string;
  status: Status;
  notes?: string;
}

export async function createAlbum(data: AlbumInput): Promise<Album> {
  return await prisma.album.create({
    data,
  });
}

export async function getAllAlbums(): Promise<Album[]> {
  return await prisma.album.findMany({
    orderBy: [
      { artist: 'asc' },
      { title: 'asc' }
    ],
  });
}

export async function getAlbumById(id: string): Promise<Album | null> {
  return await prisma.album.findUnique({
    where: { id },
  });
}

export async function updateAlbum(id: string, data: Partial<AlbumInput>): Promise<Album> {
  return await prisma.album.update({
    where: { id },
    data,
  });
}

export async function deleteAlbum(id: string): Promise<Album> {
  return await prisma.album.delete({
    where: { id },
  });
}

export async function searchAlbums(query: string): Promise<Album[]> {
  return await prisma.album.findMany({
    where: {
      OR: [
        { artist: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } },
        { genre: { contains: query, mode: 'insensitive' } },
        { label: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: [
      { artist: 'asc' },
      { title: 'asc' }
    ],
  });
}

export async function getAlbumsByStatus(status: Status): Promise<Album[]> {
  return await prisma.album.findMany({
    where: { status },
    orderBy: [
      { artist: 'asc' },
      { title: 'asc' }
    ],
  });
}

export async function enrichAlbumWithMusicData(parsedAlbum: ParsedAlbum): Promise<AlbumInput> {
  try {
    const albumData = await musicAPI.findAlbumData(parsedAlbum.artist, parsedAlbum.title);
    
    return {
      artist: parsedAlbum.artist,
      title: parsedAlbum.title,
      status: parsedAlbum.status,
      year: albumData.year,
      coverImage: albumData.coverImage,
      appleMusicUrl: albumData.appleMusicUrl,
      allMusicUrl: albumData.allMusicUrl,
    };
  } catch (error) {
    // Log the error but continue with basic data
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Skipping music lookup for ${parsedAlbum.artist} - ${parsedAlbum.title}: ${errorMessage}`);
    
    // Return basic album data with search URLs
    return {
      artist: parsedAlbum.artist,
      title: parsedAlbum.title,
      status: parsedAlbum.status,
      allMusicUrl: musicAPI.generateAllMusicUrl(parsedAlbum.artist, parsedAlbum.title),
      appleMusicUrl: musicAPI.generateAppleMusicUrl(parsedAlbum.artist, parsedAlbum.title),
    };
  }
}

export async function importAlbumsFromParsedList(parsedAlbums: ParsedAlbum[]): Promise<{
  imported: Album[];
  errors: { album: ParsedAlbum; error: string }[];
}> {
  const imported: Album[] = [];
  const errors: { album: ParsedAlbum; error: string }[] = [];

  for (const parsedAlbum of parsedAlbums) {
    try {
      // Check if album already exists
      const existing = await prisma.album.findFirst({
        where: {
          artist: parsedAlbum.artist,
          title: parsedAlbum.title,
        },
      });

      if (existing) {
        // Update status if different
        if (existing.status !== parsedAlbum.status) {
          const updated = await updateAlbum(existing.id, { status: parsedAlbum.status });
          imported.push(updated);
        }
        continue;
      }

      // Enrich with MusicBrainz data and add music service links
      const enrichedAlbum = await enrichAlbumWithMusicData(parsedAlbum);
      
      // Create new album
      const newAlbum = await createAlbum(enrichedAlbum);
      imported.push(newAlbum);

      // Small delay to be respectful to MusicBrainz API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      errors.push({
        album: parsedAlbum,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { imported, errors };
}