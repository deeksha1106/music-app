// src/store/queueStore.ts

import { create } from 'zustand';
import { Song } from '../types';
import { storageService } from '../services/storageService';

interface QueueStore {
  // State
  queue: Song[];
  currentIndex: number;
  originalQueue: Song[]; // For shuffle mode

  // Actions
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setCurrentIndex: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  shuffleQueue: () => void;
  restoreOriginalQueue: () => void;
  loadQueue: () => Promise<void>;
  
  // Computed
  getCurrentSong: () => Song | null;
  getNextSong: () => Song | null;
  getPreviousSong: () => Song | null;
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  // Initial state
  queue: [],
  currentIndex: 0,
  originalQueue: [],

  // Set entire queue
  setQueue: (songs, startIndex = 0) => {
    set({ 
      queue: songs, 
      currentIndex: startIndex,
      originalQueue: songs // Save original order
    });
    storageService.saveQueue(songs, startIndex);
  },

  // Add song to end of queue
  addToQueue: (song) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue, song];
    set({ queue: newQueue });
    storageService.saveQueue(newQueue, currentIndex);
  },

  // Remove song from queue
  removeFromQueue: (index) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    const newIndex = index < currentIndex ? currentIndex - 1 : currentIndex;
    set({ queue: newQueue, currentIndex: newIndex });
    storageService.saveQueue(newQueue, newIndex);
  },

  // Clear entire queue
  clearQueue: () => {
    set({ queue: [], currentIndex: 0, originalQueue: [] });
    storageService.clearQueue();
  },

  // Set current playing index
  setCurrentIndex: (index) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      set({ currentIndex: index });
      storageService.saveQueue(queue, index);
    }
  },

  // Reorder queue (drag and drop)
  reorderQueue: (fromIndex, toIndex) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    const [removed] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, removed);
    
    // Update current index if needed
    let newIndex = currentIndex;
    if (fromIndex === currentIndex) {
      newIndex = toIndex;
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      newIndex = currentIndex - 1;
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      newIndex = currentIndex + 1;
    }
    
    set({ queue: newQueue, currentIndex: newIndex });
    storageService.saveQueue(newQueue, newIndex);
  },

  // Shuffle queue
  shuffleQueue: () => {
    const { queue, currentIndex, originalQueue } = get();
    const currentSong = queue[currentIndex];
    
    // Save original if not already saved
    if (originalQueue.length === 0) {
      set({ originalQueue: queue });
    }
    
    // Fisher-Yates shuffle
    const shuffled = [...queue];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Ensure current song stays at current position
    const currentSongNewIndex = shuffled.findIndex(s => s.id === currentSong.id);
    if (currentSongNewIndex !== -1 && currentSongNewIndex !== currentIndex) {
      [shuffled[currentIndex], shuffled[currentSongNewIndex]] = 
      [shuffled[currentSongNewIndex], shuffled[currentIndex]];
    }
    
    set({ queue: shuffled });
    storageService.saveQueue(shuffled, currentIndex);
  },

  // Restore original queue order
  restoreOriginalQueue: () => {
    const { originalQueue, currentIndex } = get();
    if (originalQueue.length > 0) {
      set({ queue: originalQueue, originalQueue: [] });
      storageService.saveQueue(originalQueue, currentIndex);
    }
  },

  // Load queue from storage
  loadQueue: async () => {
    const saved = await storageService.loadQueue();
    if (saved) {
      set({ 
        queue: saved.queue, 
        currentIndex: saved.currentIndex 
      });
    }
  },

  // Get current song
  getCurrentSong: () => {
    const { queue, currentIndex } = get();
    return queue[currentIndex] || null;
  },

  // Get next song
  getNextSong: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;
    return queue[nextIndex] || null;
  },

  // Get previous song
  getPreviousSong: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex - 1;
    return queue[prevIndex] || null;
  },
}));