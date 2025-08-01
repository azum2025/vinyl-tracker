import { NextResponse } from 'next/server';
import { getAllAlbums, updateAlbum } from '@/lib/albums';
import { musicAPI } from '@/lib/musicapi';

export async function POST() {
  try {
    const albums = await getAllAlbums();
    const updated: any[] = [];
    const errors: string[] = [];

    for (const album of albums) {
      try {
        // Skip if already has cover image and music URLs
        if (album.coverImage && album.appleMusicUrl && album.allMusicUrl) {
          continue;
        }

        const albumData = await musicAPI.findAlbumData(album.artist, album.title);
        
        const updateData: any = {};

        // Always add/update music service URLs
        updateData.allMusicUrl = albumData.allMusicUrl;
        updateData.appleMusicUrl = albumData.appleMusicUrl;

        // Add cover image if found
        if (albumData.coverImage) {
          updateData.coverImage = albumData.coverImage;
        }
        
        // Add year if not present and found
        if (!album.year && albumData.year) {
          updateData.year = albumData.year;
        }

        const updatedAlbum = await updateAlbum(album.id, updateData);
        updated.push(updatedAlbum);

        // Small delay to be respectful to MusicBrainz API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errors.push(`Failed to enrich ${album.artist} - ${album.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      updated: updated.length,
      errors: errors.length,
      errorMessages: errors.slice(0, 5), // Limit error messages
    });

  } catch (error) {
    console.error('Bulk enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich albums' },
      { status: 500 }
    );
  }
}