import axios from 'axios';

export interface DiscogsRelease {
  id: number;
  title: string;
  year?: number;
  format?: string;
  genre?: string[];
  label?: string[];
  thumb?: string;
  cover_image?: string;
  uri: string;
  resource_url: string;
}

export interface DiscogsSearchResult {
  id: number;
  title: string;
  year?: number;
  format?: string[];
  genre?: string[];
  label?: string[];
  thumb?: string;
  cover_image?: string;
  uri: string;
  resource_url: string;
  type: string;
}

export interface DiscogsSearchResponse {
  results: DiscogsSearchResult[];
  pagination: {
    pages: number;
    page: number;
    per_page: number;
    items: number;
    urls: Record<string, string>;
  };
}

const DISCOGS_API_BASE = 'https://api.discogs.com';

class DiscogsAPI {
  private token: string;

  constructor(token?: string) {
    this.token = token || process.env.DISCOGS_API_TOKEN || '';
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'User-Agent': 'VinylTracker/1.0',
    };
    
    if (this.token) {
      headers['Authorization'] = `Discogs token=${this.token}`;
    }
    
    return headers;
  }

  async searchReleases(artist: string, title: string): Promise<DiscogsSearchResult[]> {
    try {
      const query = `artist:"${artist}" release_title:"${title}"`;
      const response = await axios.get<DiscogsSearchResponse>(
        `${DISCOGS_API_BASE}/database/search`,
        {
          params: {
            q: query,
            type: 'release',
            format: 'vinyl',
            per_page: 10,
          },
          headers: this.getHeaders(),
        }
      );

      return response.data.results;
    } catch (error) {
      console.error('Error searching Discogs:', error);
      throw new Error('Failed to search Discogs API');
    }
  }

  async getRelease(releaseId: number): Promise<DiscogsRelease> {
    try {
      const response = await axios.get<DiscogsRelease>(
        `${DISCOGS_API_BASE}/releases/${releaseId}`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching release from Discogs:', error);
      throw new Error('Failed to fetch release from Discogs API');
    }
  }

  async findBestMatch(artist: string, title: string): Promise<DiscogsSearchResult | null> {
    try {
      const results = await this.searchReleases(artist, title);
      
      if (results.length === 0) {
        return null;
      }

      // Filter for exact artist matches first
      const exactArtistMatches = results.filter(result => 
        result.title.toLowerCase().includes(artist.toLowerCase())
      );

      // Return the first result (most popular/relevant)
      return exactArtistMatches.length > 0 ? exactArtistMatches[0] : results[0];
    } catch (error) {
      console.error(`Error finding best match for ${artist} - ${title}:`, error);
      return null;
    }
  }

  generateDiscogsUrl(uri: string): string {
    return `https://www.discogs.com${uri}`;
  }
}

export const discogsAPI = new DiscogsAPI();