// src/screens/HomeScreen.tsx - Redesigned to match Figma

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import jiosaavnApi from '../api/jiosaavn';
import { audioService } from '../services/audioService';
import { useQueueStore } from '../store/queueStore';
import { usePlayerStore } from '../store/playerStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('Suggested');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  const { setQueue } = useQueueStore();
  const { currentSong, isPlaying } = usePlayerStore();

  // Dynamic colors
  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
    accent: '#FF8C00',
    tabInactive: isDark ? '#666666' : '#999999',
  };

  useEffect(() => {
    loadTrendingSongs();
    audioService.initialize();
  }, []);

  const loadTrendingSongs = async () => {
    try {
      setLoading(true);
      const response = await jiosaavnApi.getTrendingSongs();
      setSongs(response.data.results);
      setHasMore(response.data.results.length < response.data.total);
    } catch (error) {
      console.error('Error loading trending songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async (query: string, pageNum: number = 1) => {
    if (!query.trim()) {
      loadTrendingSongs();
      return;
    }

    try {
      setLoading(true);
      const response = await jiosaavnApi.searchSongs(query, pageNum);
      
      if (pageNum === 1) {
        setSongs(response.data.results);
      } else {
        setSongs(prev => [...prev, ...response.data.results]);
      }
      
      setHasMore(response.data.results.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setPage(1);
    
    const timer = setTimeout(() => {
      searchSongs(text, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore && searchQuery) {
      searchSongs(searchQuery, page + 1);
    }
  };

  const playSong = async (song: Song, index: number) => {
    setQueue(songs, index);
    await audioService.loadAndPlay(song);
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
            {item.primaryArtists}
          </Text>
          <Text style={[styles.duration, { color: colors.subtext }]}>
            {formatDuration(item.duration)}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.playIconContainer, isCurrentlyPlaying && { backgroundColor: colors.accent }]}
          onPress={() => playSong(item, index)}
        >
          <Ionicons 
            name={isCurrentlyPlaying && isPlaying ? "pause" : "play"} 
            size={18} 
            color={isCurrentlyPlaying ? "#FFF" : colors.accent} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.subtext} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="musical-notes" size={24} color={colors.accent} />
            <Text style={[styles.logo, { color: colors.text }]}>Mume</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Suggested', 'Songs', 'Artists', 'Albums', 'Folders'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab ? colors.accent : colors.tabInactive,
                    fontWeight: activeTab === tab ? '600' : '400',
                  },
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {loading && songs.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {songs.length} songs
              </Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={[styles.sortText, { color: colors.accent }]}>Ascending</Text>
                <Ionicons name="swap-vertical" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={songs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading && songs.length > 0 ? (
                  <ActivityIndicator size="small" color={colors.accent} style={styles.footerLoader} />
                ) : null
              }
            />
          </>
        )}
      </SafeAreaView>

      {/* Mini Player */}
      {currentSong && (
        <TouchableOpacity
          style={[styles.miniPlayer, { backgroundColor: colors.cardBg, borderTopColor: colors.border }]}
          onPress={() => navigation.navigate('Player' as never)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: currentSong.image[0]?.link || '' }}
            style={styles.miniPlayerImage}
          />
          <View style={styles.miniPlayerInfo}>
            <Text style={[styles.miniPlayerTitle, { color: colors.text }]} numberOfLines={1}>
              {currentSong.name}
            </Text>
            <Text style={[styles.miniPlayerArtist, { color: colors.subtext }]} numberOfLines={1}>
              {currentSong.primaryArtists}
            </Text>
          </View>
          
          <View style={styles.miniPlayerControls}>
            <TouchableOpacity
              style={styles.miniPlayerButton}
              onPress={(e) => {
                e.stopPropagation();
                isPlaying ? audioService.pause() : audioService.play();
              }}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.miniPlayerButton}
              onPress={(e) => {
                e.stopPropagation();
                audioService.next();
              }}
            >
              <Ionicons name="play-skip-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={colors.accent} />
          <Text style={[styles.navText, { color: colors.accent }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color={colors.subtext} />
          <Text style={[styles.navText, { color: colors.subtext }]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="list-outline" size={24} color={colors.subtext} />
          <Text style={[styles.navText, { color: colors.subtext }]}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color={colors.subtext} />
          <Text style={[styles.navText, { color: colors.subtext }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 24,
    marginBottom: 20,
  },
  tab: {
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 15,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 180,
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
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
  },
  playIconContainer: {
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
  footerLoader: {
    marginVertical: 20,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  miniPlayerImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  miniPlayerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  miniPlayerArtist: {
    fontSize: 12,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  miniPlayerButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
  },
});