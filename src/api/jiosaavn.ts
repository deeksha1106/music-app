// src/api/jiosaavn.ts

import axios from 'axios';
import { SearchResponse, SongDetailsResponse, Song } from '../types';

const BASE_URL = 'https://saavn.sumit.co';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jiosaavnApi = {
  /**
   * Search songs by query
   * @param query Search term
   * @param page Page number (1-indexed)
   * @param limit Results per page (default 20)
   */
  searchSongs: async (
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get('/api/search/songs', {
        params: { query, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Search songs error:', error);
      throw error;
    }
  },

  /**
   * Search all content (songs, albums, artists, playlists)
   * @param query Search term
   * @param limit Results limit
   */
  searchAll: async (query: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get('/api/search', {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Search all error:', error);
      throw error;
    }
  },

  /**
   * Search albums by query
   * @param query Search term
   * @param limit Results limit
   */
  searchAlbums: async (query: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get('/api/search/albums', {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Search albums error:', error);
      throw error;
    }
  },

  /**
   * Search artists by query
   * @param query Search term
   * @param limit Results limit
   */
  searchArtists: async (query: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get('/api/search/artists', {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Search artists error:', error);
      throw error;
    }
  },

  /**
   * Search playlists by query
   * @param query Search term
   * @param limit Results limit
   */
  searchPlaylists: async (query: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get('/api/search/playlists', {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Search playlists error:', error);
      throw error;
    }
  },

  /**
   * Get song details by ID
   * @param id Song ID
   */
  getSongById: async (id: string): Promise<SongDetailsResponse> => {
    try {
      const response = await apiClient.get<SongDetailsResponse>(
        `/api/songs/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Get song error:', error);
      throw error;
    }
  },

  /**
   * Get song suggestions based on song ID
   * @param id Song ID
   * @param limit Results limit
   */
  getSongSuggestions: async (
    id: string,
    limit: number = 20
  ): Promise<SongDetailsResponse> => {
    try {
      const response = await apiClient.get<SongDetailsResponse>(
        `/api/songs/${id}/suggestions`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Get song suggestions error:', error);
      throw error;
    }
  },

  /**
   * Get artist details by ID
   * @param id Artist ID
   */
  getArtistById: async (id: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/artists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get artist error:', error);
      throw error;
    }
  },

  /**
   * Get artist songs by artist ID
   * @param id Artist ID
   * @param limit Results limit
   */
  getArtistSongs: async (id: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/artists/${id}/songs`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get artist songs error:', error);
      throw error;
    }
  },

  /**
   * Get artist albums by artist ID
   * @param id Artist ID
   * @param limit Results limit
   */
  getArtistAlbums: async (id: string, limit: number = 20): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/artists/${id}/albums`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get artist albums error:', error);
      throw error;
    }
  },

  /**
   * Get trending songs
   * @param limit Results limit
   */
  getTrendingSongs: async (limit: number = 20): Promise<SearchResponse> => {
    try {
      // Trending songs using popular search term
      const response = await apiClient.get('/api/search/songs', {
        params: { query: 'arijit singh', limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get trending songs error:', error);
      throw error;
    }
  },

  /**
   * Get multiple songs by IDs
   * @param ids Array of song IDs
   */
  getSongsByIds: async (ids: string[]): Promise<SongDetailsResponse> => {
    try {
      const response = await apiClient.get<SongDetailsResponse>('/api/songs', {
        params: { ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Get songs by ids error:', error);
      throw error;
    }
  },
};

export default jiosaavnApi;