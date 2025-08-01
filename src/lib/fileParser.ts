export interface ParsedAlbum {
  artist: string;
  title: string;
  status: 'WANT' | 'HAVE';
  originalLine: string;
}

export function parseVinylList(content: string): ParsedAlbum[] {
  const lines = content.split('\n');
  const albums: ParsedAlbum[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and lines that don't start with checkbox pattern
    if (!trimmedLine || (!trimmedLine.includes('- [ ]') && !trimmedLine.includes('- [x]'))) {
      continue;
    }

    // Determine status based on checkbox
    const status = trimmedLine.includes('- [x]') ? 'HAVE' : 'WANT';
    
    // Extract the album text after the checkbox
    let albumText = trimmedLine.replace(/^.*?- \[[ x]\]\s*/, '');
    
    // Remove RTF formatting artifacts
    albumText = albumText.replace(/\\[^\\]*\\/g, ''); // Remove RTF control sequences
    albumText = albumText.replace(/\{|\}/g, ''); // Remove RTF braces
    albumText = albumText.replace(/\\\'/g, "'"); // Fix escaped quotes
    albumText = albumText.trim();

    if (!albumText) continue;

    // Parse artist and title
    const dashIndex = albumText.indexOf(' - ');
    if (dashIndex === -1) {
      // If no dash found, try to guess or skip
      console.warn(`Could not parse artist/title from: ${albumText}`);
      continue;
    }

    const artist = albumText.substring(0, dashIndex).trim();
    let title = albumText.substring(dashIndex + 3).trim();

    // Remove any additional info in parentheses at the end (like year, label)
    title = title.replace(/\s*\([^)]*\)\s*$/, '').trim();

    if (artist && title) {
      albums.push({
        artist,
        title,
        status,
        originalLine: line
      });
    }
  }

  return albums;
}

export function parseRTFContent(rtfContent: string): string {
  // Basic RTF to plain text conversion
  let plainText = rtfContent;
  
  // Remove RTF header
  plainText = plainText.replace(/\{\\rtf[^}]*\}/g, '');
  
  // Remove font table
  plainText = plainText.replace(/\{\\fonttbl[^}]*\}/g, '');
  
  // Remove color table  
  plainText = plainText.replace(/\{\\colortbl[^}]*\}/g, '');
  
  // Remove other RTF control groups but preserve content
  plainText = plainText.replace(/\{\\[^}]*\}([^{]*)/g, '$1');
  
  // Convert RTF line breaks to actual line breaks BEFORE removing control words
  plainText = plainText.replace(/\\line/g, '\n');
  plainText = plainText.replace(/\\par/g, '\n');
  plainText = plainText.replace(/\\\\/g, '\n'); // Double backslash often used for line breaks
  
  // Remove RTF control words but preserve structure
  plainText = plainText.replace(/\\[a-z]+[0-9]*\s?/gi, '');
  
  // Remove remaining braces
  plainText = plainText.replace(/[\{\}]/g, '');
  
  // Fix escaped characters
  plainText = plainText.replace(/\\\'/g, "'");
  plainText = plainText.replace(/\\"/g, '"');
  
  // Clean up but preserve line breaks
  plainText = plainText.replace(/[ \t]+/g, ' '); // Replace multiple spaces/tabs with single space
  plainText = plainText.replace(/\n\s+/g, '\n'); // Remove spaces at start of lines
  plainText = plainText.replace(/\s+\n/g, '\n'); // Remove spaces at end of lines
  plainText = plainText.replace(/\n+/g, '\n'); // Replace multiple newlines with single newline
  plainText = plainText.trim();
  
  return plainText;
}