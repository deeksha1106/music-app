// src/screens/ArtistDetailScreen.tsx - Artist Detail Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  useColorScheme,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Song = {
  id: string;
  name: string;
  artist: string;
  image: string;
};

export default function ArtistDetailScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    accent: '#FF8C00',
  };

  // Mock data
  const artist = {
    name: 'Ariana Grande',
    image: 'https://c.saavncdn.com/artists/Ariana_Grande_002_20230608115213_500x500.jpg',
    albumCount: 1,
    songCount: 20,
    duration: '01:25:43',
  };

  const songs: Song[] = [
    { id: '1', name: 'Bang Bang', artist: 'Ariana Grande', image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-150x150.jpg' },
    { id: '2', name: 'The Light Is Coming', artist: 'Ariana Grande', image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-150x150.jpg' },
    { id: '3', name: 'Dangerous Woman', artist: 'Ariana Grande', image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-150x150.jpg' },
  ];

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={[styles.songItem, { backgroundColor: colors.cardBg }]}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={[styles.songName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.artistName, { color: colors.subtext }]} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={[styles.playButton, { backgroundColor: '#FFE8D6' }]}>
        <Ionicons name="play" size={16} color={colors.accent} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.subtext} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Artist Header */}
          <View style={styles.artistHeader}>
            <Image source={{ uri: artist.image }} style={styles.artistImage} />
            <Text style={[styles.artistName, { color: colors.text }]}>
              {artist.name}
            </Text>
            <Text style={[styles.artistStats, { color: colors.subtext }]}>
              {artist.albumCount} Album | {artist.songCount} Songs | {artist.duration} mins
            </Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.shuffleButton, { backgroundColor: colors.accent }]}
              >
                <Ionicons name="shuffle" size={20} color="#FFF" />
                <Text style={styles.shuffleText}>Shuffle</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.playAllButton, { backgroundColor: colors.cardBg }]}
              >
                <Ionicons name="play-circle" size={20} color={colors.accent} />
                <Text style={[styles.playAllText, { color: colors.accent }]}>Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Songs Section */}
          <View style={styles.songsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Songs</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: colors.accent }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {songs.map((song, index) => (
              <View key={song.id}>
                {renderSongItem({ item: song, index })}
              </View>
            ))}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistStats: {
    fontSize: 14,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  shuffleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  songsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
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
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
});