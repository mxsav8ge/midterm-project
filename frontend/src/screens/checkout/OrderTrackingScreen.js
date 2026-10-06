import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Check,
  Coffee,
  Bike,
  Package,
  Headphones,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import DriverChatModal from '../../components/features/DriverChatModal';
import LiveTrackingMap from '../../components/features/LiveTrackingMap';

export default function OrderTrackingScreen({ route, navigation }) {
  const { orderReceipt } = route.params || {};

  const [chatVisible, setChatVisible] = useState(false);

  const orderCode = orderReceipt?.orderId || '#COF123456';
  const items = orderReceipt?.items && orderReceipt.items.length > 0
    ? orderReceipt.items
    : [
        {
          id: 1,
          name: 'Cappuccino',
          spec: 'Medium • Oat Milk',
          price: 165.00,
          quantity: 1,
          imageUrl:
            'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=80',
        },
        {
          id: 2,
          name: 'Caramel Latte',
          spec: 'Large • Almond Milk',
          price: 195.00,
          quantity: 1,
          imageUrl:
            'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
        },
        {
          id: 4,
          name: 'Espresso',
          spec: 'Single Shot',
          price: 120.00,
          quantity: 1,
          imageUrl:
            'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80',
        },
      ];

  const handleCallDriver = () => {
    Alert.alert(
      'Call Delivery Rider',
      'Kuya Mark Santos (+63 999 999 9999)\nHonda Click 125 • NAI 2024',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Animated GPS Tracking Map */}
        <LiveTrackingMap />

        {/* Estimated Delivery Header & Illustration */}
        <View style={styles.estimateSection}>
          <View>
            <Text style={styles.estimateLabel}>Estimated Delivery</Text>
            <Text style={styles.estimateTime}>25-30 min</Text>
          </View>
          <View style={styles.scooterCircle}>
            <Bike size={32} color={COLORS.primary} />
          </View>
        </View>

        {/* 4-Step Progress Indicator */}
        <View style={styles.stepperSection}>
          <View style={styles.stepIconsRow}>
            {/* Step 1: Confirmed */}
            <View style={[styles.stepCircle, styles.stepCircleDone]}>
              <Check size={14} color={COLORS.white} />
            </View>
            <View style={[styles.stepBar, styles.stepBarDone]} />

            {/* Step 2: Preparing */}
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Coffee size={14} color={COLORS.white} />
            </View>
            <View style={styles.stepBar} />

            {/* Step 3: On the way */}
            <View style={styles.stepCircle}>
              <Bike size={14} color={COLORS.textSecondary} />
            </View>
            <View style={styles.stepBar} />

            {/* Step 4: Delivered */}
            <View style={styles.stepCircle}>
              <Package size={14} color={COLORS.textSecondary} />
            </View>
          </View>

          <View style={styles.stepLabelsRow}>
            <Text style={[styles.stepLabelText, styles.stepLabelDone]}>
              Order{'\n'}Confirmed
            </Text>
            <Text style={[styles.stepLabelText, styles.stepLabelActive]}>
              Preparing{'\n'}your order
            </Text>
            <Text style={styles.stepLabelText}>On the way</Text>
            <Text style={styles.stepLabelText}>Delivered</Text>
          </View>
        </View>

        {/* Driver Profile & Chat Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverTopRow}>
            <View style={styles.driverAvatarContainer}>
              <Bike size={22} color="#FFFFFF" strokeWidth={2.4} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.driverMeta}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverNameText}>Kuya Mark Santos</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ 4.9</Text>
                </View>
              </View>
              <Text style={styles.vehicleText}>Honda Click 125 • NAI 2024</Text>
              <Text style={styles.etaText}>🛵 Picking up order at Opol Branch</Text>
            </View>
          </View>

          <View style={styles.driverActionButtons}>
            <TouchableOpacity
              style={styles.chatDriverBtn}
              onPress={() => setChatVisible(true)}
              activeOpacity={0.88}
            >
              <MessageCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.chatDriverBtnText}>Chat with Driver</Text>
              <View style={styles.chatBadge}>
                <Text style={styles.chatBadgeText}>1</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callDriverBtn}
              onPress={handleCallDriver}
              activeOpacity={0.8}
            >
              <Phone size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Details Header */}
        <View style={styles.orderHeaderRow}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.orderCode}>{orderCode}</Text>
        </View>

        {/* Item Rows */}
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={styles.itemImageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSpec}>
                {item.spec ||
                  `${item.selectedSize?.label === 'L' ? 'Large' : 'Medium'} • ${
                    item.selectedAddons?.[0]?.name || 'Standard'
                  }`}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatCurrency(item.unitPrice || item.price || 165)}
            </Text>
          </View>
        ))}

        {/* Need Help Section */}
        <TouchableOpacity style={styles.helpCard} activeOpacity={0.8}>
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSubtitle}>
              Contact our support team we're here to help you.
            </Text>
          </View>
          <View style={styles.headsetCircle}>
            <Headphones size={22} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Driver Interactive Chat Modal */}
      <DriverChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        driverName="Kuya Mark"
      />
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
    paddingBottom: SPACING.xl * 2,
    paddingTop: SPACING.sm,
  },
  estimateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  estimateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  estimateTime: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  scooterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFE9DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    ...SHADOWS.soft,
  },
  stepIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFE9DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: COLORS.primary,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#EFE9DF',
    marginHorizontal: 4,
  },
  stepBarDone: {
    backgroundColor: COLORS.primary,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepLabelText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    width: 60,
    lineHeight: 13,
  },
  stepLabelDone: {
    color: COLORS.text,
    fontWeight: '700',
  },
  stepLabelActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  orderCode: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9DF',
  },
  itemImageContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: '#EAE1D5',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemSpec: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE9DF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  helpTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  helpSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  headsetCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#EFE9DF',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  driverAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: SPACING.md,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  driverMeta: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverNameText: {
    fontSize: 15,
    fontFamily: 'Outfit_800ExtraBold',
    color: COLORS.text,
  },
  ratingBadge: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#854D0E',
  },
  vehicleText: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  etaText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.accent,
    marginTop: 2,
  },
  driverActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatDriverBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: RADIUS.pill,
    marginRight: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  chatDriverBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Outfit_700Bold',
  },
  chatBadge: {
    backgroundColor: '#E02424',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  chatBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Outfit_800ExtraBold',
  },
  callDriverBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3ECE2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8DFD3',
  },
});
