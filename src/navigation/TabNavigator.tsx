// src/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import SuggestedScreen from '../screens/SuggestedScreen';
import SongsScreen from '../screens/SongsScreen';
import AlbumsScreen from '../screens/AlbumsScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import FoldersScreen from '../screens/FoldersScreen';
import SearchScreen from '../screens/SearchScreen';

type TabParamList = {
  Suggested: undefined;
  Songs: undefined;
  Albums: undefined;
  Artists: undefined;
  Folders: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    inactiveText: isDark ? '#888888' : '#999999',
    accent: '#FF8C00',
    border: isDark ? '#3A3A3A' : '#E8E8E8',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Suggested') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Songs') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Albums') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Artists') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Folders') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inactiveText,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Suggested"
        component={SuggestedScreen}
        options={{
          title: 'Suggested',
        }}
      />
      <Tab.Screen
        name="Songs"
        component={SongsScreen}
        options={{
          title: 'Songs',
        }}
      />
      <Tab.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
        }}
      />
      <Tab.Screen
        name="Artists"
        component={ArtistsScreen}
        options={{
          title: 'Artists',
        }}
      />
      <Tab.Screen
        name="Folders"
        component={FoldersScreen}
        options={{
          title: 'Folders',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
    </Tab.Navigator>
  );
}
