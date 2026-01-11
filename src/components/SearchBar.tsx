import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

type Props = {
  placeholder?: string;
  onSearch: (q: string) => void;
};

export default function SearchBar({ placeholder = 'Search', onSearch }: Props) {
  const [value, setValue] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  input: { backgroundColor: '#f2f2f2', padding: 10, borderRadius: 8 },
});
