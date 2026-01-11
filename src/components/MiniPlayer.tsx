import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PlayerControls from './PlayerControls';

export default function MiniPlayer() {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>No track playing</Text>
      <PlayerControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  title: { flex: 1, marginRight: 8 },
});
