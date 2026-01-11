import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Song } from '../types';

type Props = {
  song: Song;
  onPress?: (s: Song) => void;
};

export default function SongCard({ song, onPress }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress?.(song)} style={styles.container}>
      {song.artwork && song.artwork.trim() ? <Image source={{ uri: song.artwork }} style={styles.art} /> : null}
      <View style={styles.meta}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  art: { width: 48, height: 48, borderRadius: 4, marginRight: 12 },
  meta: { flex: 1 },
  title: { fontWeight: '600' },
  artist: { color: '#666', marginTop: 4 },
});
