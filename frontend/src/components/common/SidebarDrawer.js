import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  X,
  User,
  MapPin,
  ClipboardList,
  Heart,
  Tag,
  CreditCard,
  Coffee,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Sparkles,
  Phone,
} from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.82, 330);

export default function SidebarDrawer({
  visible,
  onClose,
  customerName = 'Occian',
  location = 'Opol, Misamis Oriental, Philippines',
  navigation,
  onSelectFavoriteFilter,
}) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-DRAWER_WIDTH);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleNavigate = (action) => {
    handleClose();
    setTimeout(() => {
      if (action === 'orders') {
        navigation?.navigate('Main', { screen: 'Order' });
      } else if (action === 'tracking') {
        navigation?.navigate('OrderTracking');
      } else if (action === 'rewards') {
        navigation?.navigate('Main', { screen: 'Rewards' });
      } else if (action === 'favorites') {
        onSelectFavoriteFilter?.();
      } else if (action === 'vouchers') {
        Alert.alert(
          'Active Voucher: COFFEE20',
          'Get 20% OFF on your handcrafted coffees! The code will automatically apply at checkout.',
          [{ text: 'Awesome' }]
        );
      } else if (action === 'address') {
        Alert.alert(
          'Saved Address',
          'Opol, Misamis Oriental, Philippines\n\nDefault delivery location.',
          [{ text: 'OK' }]
        );
      } else if (action === 'payment') {
        Alert.alert(
          'Payment Methods',
          '• GCash (Connected)\n• Maya\n• Visa / Mastercard\n• Cash on Delivery (COD)',
          [{ text: 'Got it' }]
        );
      } else if (action === 'logout') {
        Alert.alert('Log Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => navigation?.replace('Onboarding'),
          },
        ]);
      }
    }, 280);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Dimmed Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Slide-in Drawer Container */}
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.profileHeader}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarContainer}>
                <Coffee size={24} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{customerName}</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color={COLORS.textSecondary} />
              <Text style={styles.locationText}>{location}</Text>
            </View>

            {/* Member Tier Card */}
            <View style={styles.tierCard}>
              <View style={styles.tierRow}>
                <View style={styles.tierBadge}>
                  <Sparkles size={12} color="#FFFFFF" />
                  <Text style={styles.tierBadgeText}>Gold Bean</Text>
                </View>
                <Text style={styles.pointsText}>240 Pts</Text>
              </View>
              <View style={styles.tierProgressTrack}>
                <View style={[styles.tierProgressBar, { width: '70%' }]} />
              </View>
              <Text style={styles.tierSubtext}>60 pts away from free Caramel Latte</Text>
            </View>
          </View>

          {/* Navigation Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeader}>Quick Actions</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('orders')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <ClipboardList size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>My Orders</Text>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>Active</Text>
              </View>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('tracking')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <Sparkles size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Live Order Tracking</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('vouchers')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <Tag size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Vouchers & Promos</Text>
              <View style={[styles.badgePill, { backgroundColor: '#E7F5E9' }]}>
                <Text style={[styles.badgePillText, { color: '#16A34A' }]}>20% OFF</Text>
              </View>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('rewards')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <Award size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Rewards & Perks</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Preferences & Account */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeader}>Preferences</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('address')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <MapPin size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Delivery Addresses</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate('payment')}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <CreditCard size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Payment Methods</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                Alert.alert(
                  'Support & Help',
                  'Hotline: (02) 8888-BREW\nEmail: hello@brewandbite.ph\nAvailable 7:00 AM - 10:00 PM PHT',
                  [{ text: 'Close' }]
                );
              }}
              activeOpacity={0.75}
            >
              <View style={styles.menuIconBox}>
                <HelpCircle size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Help & Support</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Log Out */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => handleNavigate('logout')}
            activeOpacity={0.75}
          >
            <LogOut size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* Version Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Brew & Bite • Opol Edition</Text>
            <Text style={styles.footerSub}>v1.2.0 • Handcrafted with passion</Text>
          </View>
        </ScrollView>
      </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 14, 10, 0.45)',
    zIndex: 999,
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#F8F4EE',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 25,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 54,
    paddingBottom: 32,
    paddingHorizontal: SPACING.lg,
  },
  profileHeader: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DFD3',
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAE1D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Outfit_800ExtraBold',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: '#EFE9DF',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    marginLeft: 4,
  },
  pointsText: {
    fontSize: 13,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.text,
  },
  tierProgressTrack: {
    height: 6,
    backgroundColor: '#F3ECE2',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  tierProgressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  tierSubtext: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: COLORS.textSecondary,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs + 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderRadius: RADIUS.sm,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1E9DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.text,
  },
  badgePill: {
    backgroundColor: '#FDE8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    marginRight: 6,
  },
  badgePillText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#E02424',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FBEBEB',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    marginLeft: SPACING.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.textSecondary,
  },
  footerSub: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: '#A89B8F',
    marginTop: 2,
  },
});
