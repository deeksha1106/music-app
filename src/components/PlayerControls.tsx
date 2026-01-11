import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PlayerControls() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn}><Text>Prev</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn}><Text>Play</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn}><Text>Next</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
});
