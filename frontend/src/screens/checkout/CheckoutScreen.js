import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
  CreditCard,
  Banknote,
  Lock,
} from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../api/services/orderService';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, clearCart } = useCart();

  const [deliveryOption, setDeliveryOption] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod'
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = deliveryOption === 'standard' ? 49.00 : 99.00;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);

      const orderPayload = {
        customerName: 'Isha',
        orderType: deliveryOption === 'standard' ? 'Standard Delivery' : 'Express Delivery',
        tableOrAddress: '123 Coffee Street, BGC, Taguig, Metro Manila, Philippines',
        items: items.map((i) => ({
          id: i.productId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          size: i.selectedSize?.label || 'M',
          addons: i.selectedAddons?.map((a) => a.name) || [],
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: 0,
        total: parseFloat(grandTotal.toFixed(2)),
      };

      const result = await orderService.createOrder(orderPayload);

      clearCart();
      navigation.replace('OrderTracking', {
        orderReceipt: {
          ...result.data,
          items: items,
          total: grandTotal,
          subtotal: subtotal,
          deliveryFee: deliveryFee,
        },
      });
    } catch (err) {
      console.error('Error placing order:', err);
      Alert.alert('Order Failed', err.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressCard} activeOpacity={0.8}>
            <View style={styles.iconCircle}>
              <MapPin size={18} color={COLORS.text} />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                123 Coffee Street, BGC, Taguig, Metro Manila, Philippines
              </Text>
            </View>
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Delivery Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Option</Text>

          {/* Standard Delivery */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              deliveryOption === 'standard' && styles.optionCardActive,
            ]}
            onPress={() => setDeliveryOption('standard')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Clock size={18} color={COLORS.text} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Standard Delivery</Text>
                <Text style={styles.optionSubtitle}>20-25 min</Text>
              </View>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionPrice}>{formatCurrency(49)}</Text>
              <View
                style={[
                  styles.radio,
                  deliveryOption === 'standard' && styles.radioActive,
                ]}
              >
                {deliveryOption === 'standard' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* Express Delivery */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              deliveryOption === 'express' && styles.optionCardActive,
            ]}
            onPress={() => setDeliveryOption('express')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Zap size={18} color={COLORS.text} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Express Delivery</Text>
                <Text style={styles.optionSubtitle}>10-15 min</Text>
              </View>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionPrice}>{formatCurrency(99)}</Text>
              <View
                style={[
                  styles.radio,
                  deliveryOption === 'express' && styles.radioActive,
                ]}
              >
                {deliveryOption === 'express' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* Card Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              paymentMethod === 'card' && styles.optionCardActive,
            ]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <CreditCard size={18} color={COLORS.text} />
              </View>
              <Text style={styles.optionTitle}>•••• •••• 4242</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              paymentMethod === 'cod' && styles.optionCardActive,
            ]}
            onPress={() => setPaymentMethod('cod')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Banknote size={18} color={COLORS.text} />
              </View>
              <Text style={styles.optionTitle}>Cash on Delivery</Text>
            </View>
            <View
              style={[
                styles.radio,
                paymentMethod === 'cod' && styles.radioActive,
              ]}
            >
              {paymentMethod === 'cod' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>{formatCurrency(deliveryFee)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Place Order Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, submitting && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting}
          activeOpacity={0.88}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.placeOrderText}>
              Place Order {formatCurrency(grandTotal)}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.secureFooter}>
          <Lock size={12} color={COLORS.textSecondary} />
          <Text style={styles.secureText}>Your payment is 100% secure</Text>
        </View>
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 130,
    paddingTop: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE9DF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE9DF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionCardActive: {
    borderColor: COLORS.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4C9BC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  summaryContainer: {
    marginTop: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginTop: 4,
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
    alignItems: 'center',
  },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 54,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  secureText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});
