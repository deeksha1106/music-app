// src/screens/ArtistsScreen.tsx - Artists Tab with Bottom Sheet

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
import { useNavigation } from '@react-navigation/native';

type Artist = {
  id: string;
  name: string;
  image: string;
  albumCount: number;
  songCount: number;
};

export default function ArtistsScreen() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('Date Added');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    accent: '#FF8C00',
    modalBg: isDark ? '#2A2A2A' : '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const mockArtists: Artist[] = [
        {
          id: '1',
          name: 'Ariana Grande',
          image: 'https://c.saavncdn.com/artists/Ariana_Grande_002_20230608115213_500x500.jpg',
          albumCount: 1,
          songCount: 20,
        },
        {
          id: '2',
          name: 'The Weeknd',
          image: 'https://c.saavncdn.com/artists/The_Weeknd_002_20230613084933_500x500.jpg',
          albumCount: 1,
          songCount: 16,
        },
        {
          id: '3',
          name: 'Acidrap',
          image: 'https://c.saavncdn.com/artists/Chance_The_Rapper_500x500.jpg',
          albumCount: 2,
          songCount: 28,
        },
        {
          id: '4',
          name: 'Ania Szarmach',
          image: 'https://c.saavncdn.com/editorial/logo/Anirudh_Ravichander_20210325093555_500x500.jpg',
          albumCount: 1,
          songCount: 12,
        },
        {
          id: '5',
          name: 'Troye Sivan',
          image: 'https://c.saavncdn.com/artists/Troye_Sivan_002_20191220090007_500x500.jpg',
          albumCount: 1,
          songCount: 14,
        },
        {
          id: '6',
          name: 'Ryan Jones',
          image: 'https://c.saavncdn.com/artists/Tom_Jones_500x500.jpg',
          albumCount: 2,
          songCount: 24,
        },
      ];
      setArtists(mockArtists);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() => {
        // Navigate to artist details
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <View style={styles.artistInfo}>
        <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.artistStats, { color: colors.subtext }]}>
          {item.albumCount} Album{item.albumCount > 1 ? 's' : ''} | {item.songCount} Songs
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => {
          setSelectedArtist(item);
          setOptionsModalVisible(true);
        }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={colors.subtext} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.artistCount, { color: colors.text }]}>
          {artists.length} artists
        </Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={[styles.sortText, { color: colors.accent }]}>{sortBy}</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Artists List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={artists}
          renderItem={renderArtistItem}
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
            {['Ascending', 'Descending', 'Date Added'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option);
                  setSortModalVisible(false);
                }}
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

      {/* Artist Options Bottom Sheet */}
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
            
            {selectedArtist && (
              <View style={[styles.artistModalHeader, { borderBottomColor: colors.border }]}>
                <Image 
                  source={{ uri: selectedArtist.image }} 
                  style={styles.artistModalImage} 
                />
                <View style={styles.artistModalInfo}>
                  <Text style={[styles.artistModalName, { color: colors.text }]} numberOfLines={1}>
                    {selectedArtist.name}
                  </Text>
                  <Text style={[styles.artistModalStats, { color: colors.subtext }]} numberOfLines={1}>
                    {selectedArtist.albumCount} Album | {selectedArtist.songCount} Songs
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="play-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="play-forward-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Play Next</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="add-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Playing Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="list-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Share</Text>
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
  artistCount: {
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
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  artistImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  artistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistStats: {
    fontSize: 13,
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
    maxHeight: '70%',
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
  artistModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  artistModalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  artistModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  artistModalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistModalStats: {
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