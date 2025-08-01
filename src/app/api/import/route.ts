import { NextRequest, NextResponse } from 'next/server';
import { parseVinylList, parseRTFContent } from '@/lib/fileParser';
import { importAlbumsFromParsedList } from '@/lib/albums';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder('utf-8').decode(buffer);

    // Parse content based on file type
    let plainText: string;
    if (file.name.toLowerCase().endsWith('.rtf')) {
      plainText = parseRTFContent(content);
    } else {
      plainText = content;
    }

    // Parse albums from the text
    const parsedAlbums = parseVinylList(plainText);

    if (parsedAlbums.length === 0) {
      return NextResponse.json(
        { error: 'No albums found in the file. Please check the format.' },
        { status: 400 }
      );
    }

    // Import albums with Discogs enrichment
    const { imported, errors } = await importAlbumsFromParsedList(parsedAlbums);

    return NextResponse.json({
      success: true,
      importedCount: imported.length,
      errorCount: errors.length,
      errors: errors.slice(0, 10).map(e => e.error), // Limit error messages
      albums: imported,
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}