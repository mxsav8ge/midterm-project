import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag, ArrowRight } from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

export default function PromoBanner({ promo, onApply }) {
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: promo.backgroundColor || COLORS.primary },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.tagBadge}>
          <Tag size={12} color={COLORS.white} />
          <Text style={styles.tagText}>{promo.badge || 'PROMO'}</Text>
        </View>
        <Text style={styles.title}>{promo.title}</Text>
        <Text style={styles.subtitle}>{promo.subtitle}</Text>
      </View>

      <TouchableOpacity
        style={styles.codeButton}
        onPress={() => onApply && onApply(promo)}
        activeOpacity={0.8}
      >
        <Text style={styles.codeText}>{promo.code}</Text>
        <ArrowRight size={14} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    marginBottom: 6,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  codeButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    marginRight: 4,
    letterSpacing: 0.5,
  },
});
