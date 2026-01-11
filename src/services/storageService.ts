// src/services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

const QUEUE_KEY = '@music_player_queue';
const CURRENT_INDEX_KEY = '@music_player_current_index';
const DOWNLOADED_SONGS_KEY = '@music_player_downloads';

export const storageService = {
  // Save queue to storage
  saveQueue: async (queue: Song[], currentIndex: number): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        [QUEUE_KEY, JSON.stringify(queue)],
        [CURRENT_INDEX_KEY, currentIndex.toString()],
      ]);
    } catch (error) {
      console.error('Error saving queue:', error);
    }
  },

  // Load queue from storage
  loadQueue: async (): Promise<{ queue: Song[]; currentIndex: number } | null> => {
    try {
      const [[, queueStr], [, indexStr]] = await AsyncStorage.multiGet([
        QUEUE_KEY,
        CURRENT_INDEX_KEY,
      ]);

      if (queueStr && indexStr) {
        return {
          queue: JSON.parse(queueStr),
          currentIndex: parseInt(indexStr, 10),
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading queue:', error);
      return null;
    }
  },

  // Clear queue from storage
  clearQueue: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([QUEUE_KEY, CURRENT_INDEX_KEY]);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  },

  // Save downloaded songs
  saveDownloadedSong: async (song: Song, filePath: string): Promise<void> => {
    try {
      const existing = await storageService.getDownloadedSongs();
      const updated = {
        ...existing,
        [song.id]: { song, filePath, downloadedAt: Date.now() },
      };
      await AsyncStorage.setItem(DOWNLOADED_SONGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving downloaded song:', error);
    }
  },

  // Get all downloaded songs
  getDownloadedSongs: async (): Promise<Record<string, any>> => {
    try {
      const data = await AsyncStorage.getItem(DOWNLOADED_SONGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting downloaded songs:', error);
      return {};
    }
  },

  // Check if song is downloaded
  isSongDownloaded: async (songId: string): Promise<boolean> => {
    try {
      const downloads = await storageService.getDownloadedSongs();
      return !!downloads[songId];
    } catch (error) {
      return false;
    }
  },

  // Remove downloaded song
  removeDownloadedSong: async (songId: string): Promise<void> => {
    try {
      const existing = await storageService.getDownloadedSongs();
      delete existing[songId];
      await AsyncStorage.setItem(DOWNLOADED_SONGS_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error removing downloaded song:', error);
    }
  },
};