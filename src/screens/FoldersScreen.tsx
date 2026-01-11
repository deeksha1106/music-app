// src/screens/FoldersScreen.tsx - Folders Tab

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Folder = {
  id: string;
  name: string;
  songCount: number;
  path: string;
};

export default function FoldersScreen() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

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
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      // Mock folders data
      const mockFolders: Folder[] = [
        {
          id: '1',
          name: 'Downloads',
          songCount: 45,
          path: '/storage/emulated/0/Music/Downloads',
        },
        {
          id: '2',
          name: 'Favorites',
          songCount: 28,
          path: '/storage/emulated/0/Music/Favorites',
        },
        {
          id: '3',
          name: 'Party Mix',
          songCount: 32,
          path: '/storage/emulated/0/Music/Party Mix',
        },
        {
          id: '4',
          name: 'Workout',
          songCount: 18,
          path: '/storage/emulated/0/Music/Workout',
        },
        {
          id: '5',
          name: 'Chill Vibes',
          songCount: 52,
          path: '/storage/emulated/0/Music/Chill Vibes',
        },
      ];
      setFolders(mockFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFolderItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={[styles.folderItem, { backgroundColor: colors.cardBg }]}
      activeOpacity={0.7}
    >
      <View style={[styles.folderIcon, { backgroundColor: colors.accent + '20' }]}>
        <Ionicons name="folder" size={28} color={colors.accent} />
      </View>
      <View style={styles.folderInfo}>
        <Text style={[styles.folderName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.folderSongCount, { color: colors.subtext }]}>
          {item.songCount} songs
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => {
          setSelectedFolder(item);
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
        <Text style={[styles.folderCount, { color: colors.text }]}>
          {folders.length} folders
        </Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={[styles.sortText, { color: colors.accent }]}>{sortBy}</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Folders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.cardBg }]}>
            <Ionicons name="folder-open-outline" size={60} color={colors.subtext} />
          </View>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No Folders Found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
            Create folders to organize your music collection
          </Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
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
            {['Name', 'Date Modified', 'Song Count'].map((option) => (
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

      {/* Folder Options Bottom Sheet */}
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
            
            {selectedFolder && (
              <View style={[styles.folderModalHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.folderModalIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="folder" size={32} color={colors.accent} />
                </View>
                <View style={styles.folderModalInfo}>
                  <Text style={[styles.folderModalName, { color: colors.text }]} numberOfLines={1}>
                    {selectedFolder.name}
                  </Text>
                  <Text style={[styles.folderModalCount, { color: colors.subtext }]} numberOfLines={1}>
                    {selectedFolder.songCount} songs
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="play-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Play All</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Ionicons name="shuffle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Shuffle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="add-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Add to Playing Queue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Folder</Text>
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
  folderCount: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
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
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  folderIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  folderSongCount: {
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
  folderModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  folderModalIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  folderModalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  folderModalCount: {
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