import axios from 'axios';

export interface MusicBrainzSearchResult {
  releases: MusicBrainzRelease[];
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  'artist-credit': Array<{
    name: string;
    artist: {
      name: string;
    };
  }>;
}

export interface AlbumData {
  artist: string;
  title: string;
  year?: number;
  coverImage?: string;
  appleMusicUrl?: string;
  allMusicUrl: string;
}

const MUSICBRAINZ_API_BASE = 'https://musicbrainz.org/ws/2';
const COVERART_API_BASE = 'https://coverartarchive.org';

class MusicAPI {
  async searchMusicBrainz(artist: string, album: string): Promise<MusicBrainzRelease[]> {
    try {
      const query = `release:"${album}" AND artist:"${artist}"`;
      const response = await axios.get<MusicBrainzSearchResult>(`${MUSICBRAINZ_API_BASE}/release`, {
        params: {
          query: query,
          fmt: 'json',
          limit: 5,
        },
        headers: {
          'User-Agent': 'VinylTracker/1.0 (contact@example.com)',
        },
        timeout: 10000,
      });

      return response.data.releases || [];
    } catch (error) {
      console.error('Error searching MusicBrainz:', error);
      return [];
    }
  }

  async getCoverArt(mbid: string): Promise<string | null> {
    try {
      const response = await axios.get(`${COVERART_API_BASE}/release/${mbid}`, {
        timeout: 5000,
      });

      const images = response.data.images;
      if (images && images.length > 0) {
        // Get the front cover, or the first image if no front cover
        const frontCover = images.find((img: any) => img.front) || images[0];
        return frontCover.image || null;
      }
    } catch (error) {
      // Cover art not found is common, don't log as error
      return null;
    }
    return null;
  }

  async findAlbumData(artist: string, album: string): Promise<AlbumData> {
    const baseData: AlbumData = {
      artist,
      title: album,
      allMusicUrl: this.generateAllMusicUrl(artist, album),
      appleMusicUrl: this.generateAppleMusicUrl(artist, album),
    };

    try {
      const releases = await this.searchMusicBrainz(artist, album);
      
      if (releases.length > 0) {
        const release = releases[0];
        
        // Extract year from date
        if (release.date) {
          const year = parseInt(release.date.substring(0, 4));
          if (year > 1900 && year <= new Date().getFullYear()) {
            baseData.year = year;
          }
        }

        // Try to get cover art
        const coverImage = await this.getCoverArt(release.id);
        if (coverImage) {
          baseData.coverImage = coverImage;
        }
      }
    } catch (error) {
      console.warn(`Could not enrich data for ${artist} - ${album}:`, error);
    }

    return baseData;
  }

  generateAllMusicUrl(artist: string, album: string): string {
    // Generate AllMusic.com search URL
    const query = `${artist} ${album}`.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
    return `https://www.allmusic.com/search/albums/${encodeURIComponent(query)}`;
  }

  generateAppleMusicUrl(artist: string, album: string): string {
    // Generate Apple Music search URL
    const query = `${artist} ${album}`.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
    return `https://music.apple.com/search?term=${encodeURIComponent(query)}`;
  }

  generateSpotifyUrl(artist: string, album: string): string {
    // Generate Spotify search URL
    const query = `artist:"${artist}" album:"${album}"`;
    return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
  }
}

export const musicAPI = new MusicAPI();