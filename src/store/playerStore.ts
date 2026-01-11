// src/store/playerStore.ts

import { create } from 'zustand';
import { Song } from '../types';

interface PlayerStore {
  // State
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isLoading: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  // Initial state
  currentSong: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  isLoading: false,
  shuffle: false,
  repeat: 'off',

  // Actions
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  
  toggleRepeat: () => set((state) => {
    const repeatModes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = repeatModes.indexOf(state.repeat);
    const nextIndex = (currentIndex + 1) % repeatModes.length;
    return { repeat: repeatModes[nextIndex] };
  }),

  reset: () => set({
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    isLoading: false,
  }),
}));