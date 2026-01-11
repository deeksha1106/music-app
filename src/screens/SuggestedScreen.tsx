// src/screens/SuggestedScreen.tsx - Suggested Tab (Home)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Song } from '../types';
import jiosaavnApi from '../api/jiosaavn';
import { audioService } from '../services/audioService';
import { useQueueStore } from '../store/queueStore';
import { usePlayerStore } from '../store/playerStore';

const { width } = Dimensions.get('window');

type Album = {
  id: string;
  name: string;
  artist: string;
  image: string;
};

type Artist = {
  id: string;
  name: string;
  image: string;
};

export default function SuggestedScreen() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [mostPlayed, setMostPlayed] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { setQueue } = useQueueStore();
  const { currentSong, isPlaying } = usePlayerStore();

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    accent: '#FF8C00',
  };

  useEffect(() => {
    loadSuggestedContent();
  }, []);

  const loadSuggestedContent = async () => {
    try {
      setLoading(true);
      
      // Mock Recently Played
      setRecentlyPlayed([
        {
          id: '1',
          name: 'Shades of Love',
          artist: 'Ania Szarmach',
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
        {
          id: '2',
          name: 'Without You',
          artist: 'The Kid LAROI',
          image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg',
        },
        {
          id: '3',
          name: 'Save Your Tears',
          artist: 'The Weeknd',
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
      ]);

      // Mock Artists
      setArtists([
        {
          id: '1',
          name: 'Ariana Grande',
          image: 'https://c.saavncdn.com/artists/Ariana_Grande_002_20230608115213_500x500.jpg',
        },
        {
          id: '2',
          name: 'The Weeknd',
          image: 'https://c.saavncdn.com/artists/The_Weeknd_002_20230613084933_500x500.jpg',
        },
        {
          id: '3',
          name: 'Acidrap',
          image: 'https://c.saavncdn.com/artists/Chance_The_Rapper_500x500.jpg',
        },
      ]);

      // Mock Most Played
      setMostPlayed([
        {
          id: '1',
          name: 'Starboy',
          artist: 'The Weeknd',
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
        {
          id: '2',
          name: 'Bang Bang',
          artist: 'Ariana Grande',
          image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg',
        },
        {
          id: '3',
          name: 'Save Your Tears',
          artist: 'The Weeknd',
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
      ]);
    } catch (error) {
      console.error('Error loading suggested content:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAlbumCard = (item: Album) => (
    <TouchableOpacity
      key={item.id}
      style={styles.albumCard}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.albumImage} />
      <Text style={[styles.albumName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.albumArtist, { color: colors.subtext }]} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderArtistCard = (item: Artist) => (
    <TouchableOpacity
      key={item.id}
      style={styles.artistCard}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recently Played Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recently Played
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recentlyPlayed.map(renderAlbumCard)}
          </ScrollView>
        </View>

        {/* Artists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Artists
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {artists.map(renderArtistCard)}
          </ScrollView>
        </View>

        {/* Most Played Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Most Played
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {mostPlayed.map(renderAlbumCard)}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  albumCard: {
    width: 140,
  },
  albumImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  albumName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 12,
  },
  artistCard: {
    width: 120,
    alignItems: 'center',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});