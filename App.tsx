// App.tsx - With Theme Support

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { useQueueStore } from './src/store/queueStore';
import { audioService } from './src/services/audioService';

function AppContent() {
  const { loadQueue } = useQueueStore();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initializeApp = async () => {
      await audioService.initialize();
      await loadQueue();
    };

    initializeApp();

    return () => {
      audioService.cleanup();
    };
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}