// src/screens/SongsScreen.tsx - Songs Tab with Bottom Sheet

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import jiosaavnApi from '../api/jiosaavn';
import { audioService } from '../services/audioService';
import { useQueueStore } from '../store/queueStore';
import { usePlayerStore } from '../store/playerStore';

type SortOption = 'Ascending' | 'Descending' | 'Artist' | 'Album' | 'Year' | 'Date Added' | 'Date Modified' | 'Composer';

export default function SongsScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('Ascending');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { setQueue } = useQueueStore();
  const { currentSong, isPlaying } = usePlayerStore();

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
    accent: '#FF8C00',
    modalBg: isDark ? '#2A2A2A' : '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const response = await jiosaavnApi.getTrendingSongs();
      setSongs(response.data.results);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const playSong = async (song: Song, index: number) => {
    setQueue(songs, index);
    await audioService.loadAndPlay(song);
  };

  const sortOptions: SortOption[] = [
    'Ascending',
    'Descending',
    'Artist',
    'Album',
    'Year',
    'Date Added',
    'Date Modified',
    'Composer',
  ];

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setSortModalVisible(false);
  };

  const formatDuration = (seconds: number | string) => {
    const num = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    const mins = Math.floor(num / 60);
    const secs = num % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentlyPlaying = currentSong?.id === item.id;
    const imageUrl = item.image.find(img => img.quality === '150x150')?.link || 
                     item.image[0]?.link || '';

    return (
      <TouchableOpacity
        style={[styles.songItem, { backgroundColor: colors.cardBg }]}
        onPress={() => playSong(item, index)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={styles.songImage} />
        
        <View style={styles.songInfo}>
          <Text style={[styles.songName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.artistName, { color: colors.subtext }]} numberOfLines={1}>
            {item.primaryArtists} • {formatDuration(item.duration)}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.playButton, isCurrentlyPlaying && { backgroundColor: colors.accent }]}
          onPress={() => playSong(item, index)}
        >
          <Ionicons 
            name={isCurrentlyPlaying && isPlaying ? "pause" : "play"} 
            size={16} 
            color={isCurrentlyPlaying ? "#FFF" : colors.accent} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => {
            setSelectedSong(item);
            setOptionsModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.subtext} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.songCount, { color: colors.text }]}>
          {songs.length} songs
        </Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={[styles.sortText, { color: colors.accent }]}>{sortBy}</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          onPress={() => setSortModalVisible(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? '#555' : '#D1D1D6' }]} />
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => handleSort(option)}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }]}>
                  {option}
                </Text>
                {sortBy === option && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Song Options Bottom Sheet */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          onPress={() => setOptionsModalVisible(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? '#555' : '#D1D1D6' }]} />
            
            {selectedSong && (
              <View style={[styles.songModalHeader, { borderBottomColor: colors.border }]}>
                <Image 
                  source={{ uri: selectedSong.image[0]?.link }} 
                  style={styles.songModalImage} 
                />
                <View style={styles.songModalInfo}>
                  <Text style={[styles.songModalName, { color: colors.text }]} numberOfLines={1}>
                    {selectedSong.name}
                  </Text>
                  <Text style={[styles.songModalArtist, { color: colors.subtext }]} numberOfLines={1}>
                    {selectedSong.primaryArtists}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="play-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Play Next</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Playing Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="list-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="albums-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Go to Album</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="person-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Go to Artist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="information-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="musical-note-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Set as Ringtone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="ban-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Blocklist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete from Device</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  songCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 13,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE8D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortOptionText: {
    fontSize: 16,
  },
  songModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  songModalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  songModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songModalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songModalArtist: {
    fontSize: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  optionText: {
    fontSize: 16,
  },
});