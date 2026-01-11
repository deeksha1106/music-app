// src/screens/QueueScreen.tsx - Redesigned to match Figma

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQueueStore } from '../store/queueStore';
import { audioService } from '../services/audioService';
import { Song } from '../types';

export default function QueueScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { queue, currentIndex, removeFromQueue, setCurrentIndex, clearQueue } = useQueueStore();

  // Dynamic colors
  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
    accent: '#FF8C00',
    currentBg: isDark ? 'rgba(255, 140, 0, 0.1)' : 'rgba(255, 140, 0, 0.05)',
  };

  const playSongFromQueue = async (index: number) => {
    setCurrentIndex(index);
    await audioService.loadAndPlay(queue[index]);
    navigation.goBack();
  };

  const handleRemove = (index: number) => {
    if (index === currentIndex) {
      Alert.alert(
        'Remove Current Song',
        'This song is currently playing. Remove it anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              removeFromQueue(index);
              if (queue.length > 1) {
                audioService.next();
              }
            },
          },
        ]
      );
    } else {
      removeFromQueue(index);
    }
  };

  const handleClearQueue = () => {
    Alert.alert(
      'Clear Queue',
      'Are you sure you want to clear the entire queue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearQueue();
            audioService.cleanup();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatDuration = (seconds: number | string) => {
    const num = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    const mins = Math.floor(num / 60);
    const secs = num % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQueueItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = index === currentIndex;
    const imageUrl = item.image.find(img => img.quality === '150x150')?.link || 
                     item.image[0]?.link || '';

    return (
      <TouchableOpacity
        style={[
          styles.queueItem, 
          { backgroundColor: isCurrentSong ? colors.currentBg : colors.cardBg }
        ]}
        onPress={() => playSongFromQueue(index)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUrl }} style={styles.songImage} />
        
        <View style={styles.songInfo}>
          <Text 
            style={[
              styles.songName, 
              { color: isCurrentSong ? colors.accent : colors.text }
            ]} 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.artistName, { color: colors.subtext }]} numberOfLines={1}>
            {item.primaryArtists}
          </Text>
        </View>

        <Text style={[styles.duration, { color: colors.subtext }]}>
          {formatDuration(item.duration)}
        </Text>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            handleRemove(index);
          }}
        >
          <Ionicons name="close" size={20} color={colors.subtext} />
        </TouchableOpacity>

        {isCurrentSong && (
          <View style={[styles.playingIndicator, { backgroundColor: colors.accent }]} />
        )}
      </TouchableOpacity>
    );
  };

  if (queue.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Queue</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={80} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Queue is empty</Text>
            <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
              Add songs from the home screen to start listening
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Queue</Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
              {queue.length} songs
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleClearQueue}
          >
            <Ionicons name="trash-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={queue}
          renderItem={renderQueueItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    position: 'relative',
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
  duration: {
    fontSize: 12,
    marginRight: 12,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});