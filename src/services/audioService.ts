// src/services/audioService.ts

import { Audio, AVPlaybackStatus } from 'expo-av';
import { Song } from '../types';
import { usePlayerStore } from '../store/playerStore';
import { useQueueStore } from '../store/queueStore';

class AudioService {
  private sound: Audio.Sound | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async loadAndPlay(song: Song) {
    try {
      const { setIsLoading, setIsPlaying, setDuration, setCurrentSong } = usePlayerStore.getState();
      
      setIsLoading(true);
      setCurrentSong(song);

      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Get highest quality download URL
      const downloadUrl = this.getHighestQualityUrl(song.downloadUrl);
      
      if (!downloadUrl) {
        throw new Error('No download URL available');
      }

      // Create and load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: downloadUrl },
        { shouldPlay: true },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      setIsLoading(false);
      setIsPlaying(true);

      // Get duration
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }
    } catch (error) {
      console.error('Error loading song:', error);
      usePlayerStore.getState().setIsLoading(false);
      usePlayerStore.getState().setIsPlaying(false);
    }
  }

  async play() {
    if (!this.sound) return;

    try {
      await this.sound.playAsync();
      usePlayerStore.getState().setIsPlaying(true);
    } catch (error) {
      console.error('Error playing:', error);
    }
  }

  async pause() {
    if (!this.sound) return;

    try {
      await this.sound.pauseAsync();
      usePlayerStore.getState().setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }

  async seekTo(positionSeconds: number) {
    if (!this.sound) return;

    try {
      await this.sound.setPositionAsync(positionSeconds * 1000);
      usePlayerStore.getState().setPosition(positionSeconds);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  async next() {
    const { queue, currentIndex, setCurrentIndex } = useQueueStore.getState();
    const { repeat } = usePlayerStore.getState();

    if (repeat === 'one') {
      // Replay current song
      await this.seekTo(0);
      await this.play();
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      setCurrentIndex(nextIndex);
      await this.loadAndPlay(queue[nextIndex]);
    } else if (repeat === 'all' && queue.length > 0) {
      // Loop back to first song
      setCurrentIndex(0);
      await this.loadAndPlay(queue[0]);
    } else {
      // End of queue
      await this.pause();
    }
  }

  async previous() {
    const { queue, currentIndex, setCurrentIndex } = useQueueStore.getState();
    const { position } = usePlayerStore.getState();

    // If more than 3 seconds into song, restart it
    if (position > 3) {
      await this.seekTo(0);
      return;
    }

    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      await this.loadAndPlay(queue[prevIndex]);
    } else {
      // Restart current song
      await this.seekTo(0);
    }
  }

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const { setPosition, setIsPlaying } = usePlayerStore.getState();

    // Update position
    if (status.positionMillis !== undefined) {
      setPosition(status.positionMillis / 1000);
    }

    // Update playing state
    setIsPlaying(status.isPlaying);

    // Handle song end
    if (status.didJustFinish && !status.isLooping) {
      this.next();
    }
  };

  private getHighestQualityUrl(downloadUrls: Array<{ quality: string; link?: string; url?: string }>): string | null {
    // Priority: 320kbps > 160kbps > 96kbps > 48kbps > 12kbps
    const priorities = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    
    for (const quality of priorities) {
      const found = downloadUrls.find(d => d.quality === quality);
      if (found) {
        return found.link || found.url || null;
      }
    }

    // Fallback to first available
    const first = downloadUrls[0];
    return first ? (first.link || first.url || null) : null;
  }

  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  getSound() {
    return this.sound;
  }
}

export const audioService = new AudioService();