import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, ChevronLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

export default function Header({
  title = 'Velvet Brew & Burger',
  subtitle,
  showBack = false,
  showCart = true,
  navigation,
}) {
  const { totalItemCount } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {showCart && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation?.navigate('Cart')}
          activeOpacity={0.8}
        >
          <ShoppingBag size={20} color={COLORS.text} />
          {totalItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItemCount > 99 ? '99+' : totalItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
