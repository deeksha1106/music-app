// src/screens/AlbumsScreen.tsx - Albums Tab with Bottom Sheet

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
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

type Album = {
  id: string;
  name: string;
  artist: string;
  year: string;
  songCount: number;
  image: string;
};

export default function AlbumsScreen() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('Date Modified');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
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
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const mockAlbums: Album[] = [
        {
          id: '1',
          name: 'Dawn FM',
          artist: 'The Weeknd',
          year: '2022',
          songCount: 16,
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
        {
          id: '2',
          name: 'Sweetener',
          artist: 'Ariana Grande',
          year: '2021',
          songCount: 16,
          image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg',
        },
        {
          id: '3',
          name: 'First Impact',
          artist: 'Treasure',
          year: '2021',
          songCount: 14,
          image: 'https://c.saavncdn.com/584/Jab-Harry-Met-Sejal-Hindi-2017-20170803161007-500x500.jpg',
        },
        {
          id: '4',
          name: 'Pain (Official)',
          artist: 'Ryan Jones',
          year: '2021',
          songCount: 18,
          image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg',
        },
      ];
      setAlbums(mockAlbums);
    } catch (error) {
      console.error('Error loading albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => {
        // Navigate to album details
      }}
      activeOpacity={0.7}
    >
      <View style={styles.albumImageContainer}>
        <Image source={{ uri: item.image }} style={styles.albumImage} />
        <TouchableOpacity 
          style={[styles.moreButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
          onPress={() => {
            setSelectedAlbum(item);
            setOptionsModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.albumInfo}>
        <Text style={[styles.albumName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.albumArtist, { color: colors.subtext }]} numberOfLines={1}>
          {item.artist} | {item.year}
        </Text>
        <Text style={[styles.albumSongs, { color: colors.subtext }]}>
          {item.songCount} songs
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.albumCount, { color: colors.text }]}>
          {albums.length} albums
        </Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={[styles.sortText, { color: colors.accent }]}>{sortBy}</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Albums Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbumItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
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
            {['Date Modified', 'Date Added', 'Artist', 'Album Name'].map((option) => (
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

      {/* Album Options Bottom Sheet */}
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
            
            {selectedAlbum && (
              <View style={[styles.albumModalHeader, { borderBottomColor: colors.border }]}>
                <Image 
                  source={{ uri: selectedAlbum.image }} 
                  style={styles.albumModalImage} 
                />
                <View style={styles.albumModalInfo}>
                  <Text style={[styles.albumModalName, { color: colors.text }]} numberOfLines={1}>
                    {selectedAlbum.name}
                  </Text>
                  <Text style={[styles.albumModalArtist, { color: colors.subtext }]} numberOfLines={1}>
                    {selectedAlbum.artist} • {selectedAlbum.year}
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
              <Ionicons name="shuffle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Shuffle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
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
              <Ionicons name="person-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Go to Artist</Text>
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
  albumCount: {
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
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  albumCard: {
    width: CARD_WIDTH,
  },
  albumImageContainer: {
    position: 'relative',
  },
  albumImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
    marginBottom: 8,
  },
  moreButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumInfo: {
    paddingHorizontal: 4,
  },
  albumName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 13,
    marginBottom: 2,
  },
  albumSongs: {
    fontSize: 12,
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
  albumModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  albumModalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  albumModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  albumModalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumModalArtist: {
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