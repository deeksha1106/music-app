// src/screens/PlayerScreen.tsx - Complete Redesign

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/playerStore';
import { useQueueStore } from '../store/queueStore';
import { audioService } from '../services/audioService';

const { width, height } = Dimensions.get('window');
const ALBUM_ART_SIZE = width * 0.75;

export default function PlayerScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const {
    currentSong,
    isPlaying,
    position,
    duration,
    isLoading,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const { queue, currentIndex } = useQueueStore();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    cardBg: isDark ? '#282828' : '#F5F5F5',
    text: isDark ? '#FFFFFF' : '#000000',
    subtext: isDark ? '#A0A0A0' : '#666666',
    accent: '#FF8C00',
    iconBg: isDark ? '#2A2A2A' : '#F0F0F0',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(position);
    }
  }, [position, isSeeking]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isPlaying, scaleAnim]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioService.pause();
    } else {
      await audioService.play();
    }
  };

  const handleNext = async () => {
    await audioService.next();
  };

  const handlePrevious = async () => {
    await audioService.previous();
  };

  const handleSeek = (value: number) => {
    setIsSeeking(true);
    setSeekPosition(value);
  };

  const handleSeekComplete = async (value: number) => {
    await audioService.seekTo(value);
    setIsSeeking(false);
  };

  const handleSkipForward = async () => {
    const newPosition = Math.min(duration, position + 10);
    await audioService.seekTo(newPosition);
  };

  const handleSkipBackward = async () => {
    const newPosition = Math.max(0, position - 10);
    await audioService.seekTo(newPosition);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (repeat === 'one') return 'repeat-outline';
    if (repeat === 'all') return 'repeat';
    return 'repeat-outline';
  };

  if (!currentSong) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.cardBg }]}>
              <Ionicons name="musical-notes-outline" size={60} color={colors.subtext} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No song playing
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
              Select a song from your library to start listening
            </Text>
            <TouchableOpacity
              style={[styles.goBackButton, { backgroundColor: colors.accent }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.goBackButtonText}>Browse Music</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const albumArt = currentSong?.image?.find(img => img.quality === '500x500')?.link || 
                   currentSong?.image?.find(img => img.quality === '150x150')?.link ||
                   currentSong?.image?.[0]?.link || '';

  const hasNext = currentIndex < queue.length - 1 || repeat === 'all';
  const hasPrev = currentIndex > 0 || position > 3;
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
              NOW PLAYING
            </Text>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
              {currentSong.album?.name || 'Unknown Album'}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="search-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Album Art */}
          <View style={styles.albumArtContainer}>
            <Animated.View 
              style={[
                styles.albumArtShadow,
                { 
                  transform: [{ scale: scaleAnim }],
                  shadowColor: colors.accent,
                  shadowOpacity: isPlaying ? 0.3 : 0.1,
                }
              ]}
            >
              <Image
                source={{ uri: albumArt }}
                style={[styles.albumArt, { backgroundColor: colors.cardBg }]}
                resizeMode="cover"
              />
            </Animated.View>
          </View>

          {/* Song Info */}
          <View style={styles.songInfoContainer}>
            <View style={styles.songTitleRow}>
              <View style={styles.songTitleContent}>
                <Text style={[styles.songName, { color: colors.text }]} numberOfLines={2}>
                  {currentSong.name}
                </Text>
                <Text style={[styles.artistName, { color: colors.subtext }]} numberOfLines={1}>
                  {currentSong.primaryArtists}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.favoriteButton, { backgroundColor: colors.cardBg }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="heart-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.cardBg }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      backgroundColor: colors.accent,
                      width: `${progressPercentage}%`,
                    }
                  ]} 
                />
              </View>
              <Slider
                style={styles.progressSlider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={isSeeking ? seekPosition : position}
                onValueChange={handleSeek}
                onSlidingComplete={handleSeekComplete}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor={colors.accent}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: colors.subtext }]}>
                {formatTime(isSeeking ? seekPosition : position)}
              </Text>
              <Text style={[styles.timeText, { color: colors.subtext }]}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View style={styles.mainControls}>
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.controlButton, !hasPrev && styles.disabledControl]}
              disabled={!hasPrev}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="play-back"
                size={32}
                color={hasPrev ? colors.text : colors.subtext}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skipControlButton]}
              onPress={handleSkipBackward}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="refresh" size={26} color={colors.text} />
              <Text style={[styles.skipLabel, { color: colors.text }]}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayPause}
              style={[styles.playPauseButton, { backgroundColor: colors.accent }]}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skipControlButton]}
              onPress={handleSkipForward}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="refresh" size={26} color={colors.text} />
              <Text style={[styles.skipLabel, { color: colors.text }]}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.controlButton, !hasNext && styles.disabledControl]}
              disabled={!hasNext}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="play-forward"
                size={32}
                color={hasNext ? colors.text : colors.subtext}
              />
            </TouchableOpacity>
          </View>

          {/* Secondary Controls */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: colors.cardBg }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="heart-outline" size={22} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: colors.cardBg }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="timer-outline" size={22} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: colors.cardBg }]}
              onPress={toggleShuffle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name="shuffle" 
                size={22} 
                color={shuffle ? colors.accent : colors.text} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: colors.cardBg }]}
              onPress={toggleRepeat}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={getRepeatIcon()} 
                size={22} 
                color={repeat !== 'off' ? colors.accent : colors.text} 
              />
              {repeat === 'one' && (
                <View style={[styles.repeatBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.repeatBadgeText}>1</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Lyrics Toggle */}
          <TouchableOpacity 
            style={styles.lyricsButton}
            onPress={() => setShowLyrics(!showLyrics)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={showLyrics ? "chevron-down" : "chevron-up"} 
              size={20} 
              color={colors.text} 
            />
            <Text style={[styles.lyricsText, { color: colors.text }]}>
              Lyrics
            </Text>
          </TouchableOpacity>

          {showLyrics && (
            <View style={[styles.lyricsContainer, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.lyricsContent, { color: colors.subtext }]}>
                Lyrics not available for this song
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 36,
  },
  albumArtShadow: {
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 20,
  },
  albumArt: {
    width: ALBUM_ART_SIZE,
    height: ALBUM_ART_SIZE,
    borderRadius: 16,
  },
  songInfoContainer: {
    marginBottom: 28,
  },
  songTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  songTitleContent: {
    flex: 1,
  },
  songName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 28,
  },
  artistName: {
    fontSize: 16,
    lineHeight: 22,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 32,
  },
  progressBarContainer: {
    position: 'relative',
    height: 40,
    marginBottom: 4,
  },
  progressBarBg: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipControlButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  playPauseButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledControl: {
    opacity: 0.3,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 28,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  repeatBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lyricsButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  lyricsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lyricsContainer: {
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsContent: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  goBackButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});