import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LayoutGrid, Coffee, Sparkles, CupSoda, Zap } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const ICON_MAP = {
  'layout-grid': LayoutGrid,
  'coffee': Coffee,
  'cup-soda': CupSoda,
  'zap': Zap,
};

export default function CategoryPill({ item, isSelected, onSelect }) {
  const IconComponent = ICON_MAP[item.icon] || Sparkles;
  const iconColor = isSelected ? COLORS.white : COLORS.textSecondary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
      onPress={() => onSelect(item.id)}
      activeOpacity={0.8}
    >
      <IconComponent size={16} color={iconColor} style={styles.icon} />
      <Text
        style={[
          styles.text,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    marginRight: SPACING.sm,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  unselectedContainer: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedText: {
    color: COLORS.white,
  },
  unselectedText: {
    color: COLORS.text,
  },
});
