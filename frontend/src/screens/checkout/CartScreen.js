import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl } from '../../utils/imageUrl';

export default function CartScreen({ navigation }) {
  const {
    items,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    appliedPromo,
    applyPromo,
  } = useCart();

  const handleProceed = () => {
    navigation.navigate('Checkout');
  };

  const handlePromoPress = () => {
    if (!appliedPromo) {
      applyPromo({
        code: 'COFFEE20',
        title: 'Coffee Special',
        discountPercent: 10,
      });
      alert('Voucher COFFEE20 applied! 10% discount added.');
    } else {
      alert('Promo already applied!');
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.emptyContainer}>
          <ShoppingBag size={52} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some artisan coffee to get started.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
            activeOpacity={0.85}
          >
            <Text style={styles.browseBtnText}>Explore Coffees</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main', { screen: 'HomeTab' });
            }
          }}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Item Cards */}
        {items.map((item) => (
          <View key={item.cartItemId} style={styles.cartCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: getImageUrl(item.imageUrl) }} style={styles.cartImage} />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <Text style={styles.itemSubtitle}>
                  {item.selectedAddons[0].name}
                </Text>
              )}
              {item.selectedSize && (
                <Text style={styles.itemSpec}>
                  {item.selectedSize.label === 'M'
                    ? 'Medium'
                    : item.selectedSize.label === 'L'
                    ? 'Large'
                    : 'Small'}{' '}
                  • {item.selectedSize.oz}
                </Text>
              )}
            </View>

            <View style={styles.rightContainer}>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.unitPrice * item.quantity)}
              </Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  activeOpacity={0.7}
                >
                  <Minus size={12} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.stepVal}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Plus size={12} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Promo Code Row */}
        <TouchableOpacity
          style={styles.promoRow}
          onPress={handlePromoPress}
          activeOpacity={0.8}
        >
          <Text style={styles.promoText}>
            {appliedPromo ? `Promo: ${appliedPromo.code}` : 'Have a promo code?'}
          </Text>
          <ChevronRight size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Calculation Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>
              {formatCurrency(deliveryFee > 0 ? deliveryFee : 49)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>
              {formatCurrency(total + (deliveryFee === 0 ? 49 : 0))}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleProceed}
          activeOpacity={0.88}
        >
          <Plus size={18} color={COLORS.white} />
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <ArrowRight size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 110,
    paddingTop: SPACING.sm,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9DF',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#EAE1D5',
  },
  cartImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemSpec: {
    fontSize: 11,
    color: '#B0A499',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 52,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D4C9BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 8,
  },
  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9DF',
  },
  promoText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  summaryContainer: {
    marginTop: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: RADIUS.pill,
    ...SHADOWS.card,
    gap: 8,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
  },
  browseBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
