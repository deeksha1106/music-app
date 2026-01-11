// src/screens/SearchScreen.tsx - Search Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type SearchResult = {
  id: string;
  name: string;
  artist: string;
  image: string;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Songs');
  const [recentSearches, setRecentSearches] = useState([
    'Ariana Grande',
    'Morgan Wallen',
    'Justin Bieber',
    'Drake',
    'Olivia Rodrigo',
    'The Weeknd',
    'Taylor Swift',
    'Juice Wrld',
    'Memories',
  ]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    cardBg: isDark ? '#2A2A2A' : '#F8F8F8',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subtext: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
    accent: '#FF8C00',
    inputBg: isDark ? '#2A2A2A' : '#F5F5F5',
  };

  const tabs = ['Songs', 'Artists', 'Albums', 'Folders'];

  const clearRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(item => item !== search));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
  };

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
          
          <View style={[styles.searchBar, { backgroundColor: colors.inputBg }]}>
            <Ionicons name="search" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Abcdefghijklm"
              placeholderTextColor={colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchQuery.length === 0 ? (
          // Recent Searches
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={[styles.recentTitle, { color: colors.text }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearAllSearches}>
                  <Text style={[styles.clearAll, { color: colors.accent }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>

              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={[styles.recentText, { color: colors.text }]}>
                    {search}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => clearRecentSearch(search)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={20} color={colors.subtext} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : searchResults.length === 0 ? (
          // No Results
          <View style={styles.noResultsContainer}>
            <View style={[styles.noResultsIcon, { backgroundColor: colors.cardBg }]}>
              <Ionicons name="sad-outline" size={60} color={colors.accent} />
            </View>
            <Text style={[styles.noResultsTitle, { color: colors.text }]}>
              Not Found
            </Text>
            <Text style={[styles.noResultsText, { color: colors.subtext }]}>
              Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
            </Text>
          </View>
        ) : (
          // Search Results
          <>
            {/* Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tabsContainer}
              contentContainerStyle={styles.tabsContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    activeTab === tab && [styles.activeTab, { backgroundColor: colors.accent }]
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === tab ? '#FFF' : colors.text }
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results List */}
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.resultItem, { backgroundColor: colors.cardBg }]}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: item.image }} style={styles.resultImage} />
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultName, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.resultArtist, { color: colors.subtext }]} numberOfLines={1}>
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
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  recentText: {
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  tabsContainer: {
    maxHeight: 60,
    paddingVertical: 12,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultArtist: {
    fontSize: 13,
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