import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search burgers, drinks, sides...' }) {
  return (
    <View style={styles.container}>
      <Search size={18} color={COLORS.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
          <X size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
});
