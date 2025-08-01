import { NextRequest, NextResponse } from 'next/server';
import { getAllAlbums, searchAlbums } from '@/lib/albums';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let albums;
    if (query) {
      albums = await searchAlbums(query);
    } else {
      albums = await getAllAlbums();
    }

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}