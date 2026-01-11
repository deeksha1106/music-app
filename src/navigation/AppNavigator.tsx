// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import QueueScreen from '../screens/QueueScreen';
import AlbumDetailScreen from '../screens/AlbumDetailScreen';
import ArtistDetailScreen from '../screens/ArtistDetailScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      >
        {/* Tab Navigator as main home screen */}
        <Stack.Screen 
          name="HomeTabs" 
          component={TabNavigator}
          options={{
            presentation: 'card',
          }}
        />

        {/* Detail Screens */}
        <Stack.Screen 
          name="AlbumDetail" 
          component={AlbumDetailScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="ArtistDetail" 
          component={ArtistDetailScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />

        {/* Modal Screens */}
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="Queue" 
          component={QueueScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}