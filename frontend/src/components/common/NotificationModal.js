import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import {
  X,
  Bell,
  Bike,
  Coffee,
  Tag,
  CheckCheck,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const { height } = Dimensions.get('window');

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    category: 'order',
    title: 'Order on the way! 🛵',
    message: 'Kuya Mark is delivering your order to 123 Coffee Street, BGC. Arriving in ~15 mins.',
    time: 'Just now',
    isUnread: true,
    actionType: 'track',
    actionLabel: 'Track Order',
    icon: Bike,
    iconBg: '#E8F5E9',
    iconColor: '#16A34A',
  },
  {
    id: 'notif_2',
    category: 'order',
    title: 'Brewing your coffee ☕',
    message: 'Your Caramel Latte & Flat White are being hand-crafted by our Manila barista.',
    time: '12m ago',
    isUnread: true,
    actionType: null,
    icon: Coffee,
    iconBg: '#F5EBE1',
    iconColor: COLORS.primary,
  },
  {
    id: 'notif_3',
    category: 'promo',
    title: 'Flash Promo: 20% OFF! 🎟️',
    message: 'Use code COFFEE20 on all handcrafted beverages today in Metro Manila.',
    time: '2h ago',
    isUnread: true,
    actionType: 'promo',
    actionLabel: 'Use Promo',
    icon: Tag,
    iconBg: '#FDF2E9',
    iconColor: COLORS.accent,
  },
  {
    id: 'notif_4',
    category: 'promo',
    title: 'Double Bean Points 🌟',
    message: 'Earn 2x Beans for every iced drink order today! Check your rewards tab.',
    time: 'Yesterday',
    isUnread: false,
    actionType: 'rewards',
    actionLabel: 'View Rewards',
    icon: Sparkles,
    iconBg: '#FEF9C3',
    iconColor: '#CA8A04',
  },
  {
    id: 'notif_5',
    category: 'order',
    title: 'Order Completed',
    message: 'Your Espresso Single Shot was successfully delivered. Enjoy your day!',
    time: '2 days ago',
    isUnread: false,
    actionType: null,
    icon: ShoppingBag,
    iconBg: '#F3ECE2',
    iconColor: COLORS.primary,
  },
];

export default function NotificationModal({
  visible,
  onClose,
  navigation,
  onUnreadCountChange,
}) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'order' | 'promo'

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleItemPress = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
    );

    if (item.actionType === 'track') {
      handleClose();
      setTimeout(() => {
        navigation?.navigate('OrderTracking');
      }, 250);
    } else if (item.actionType === 'rewards') {
      handleClose();
      setTimeout(() => {
        navigation?.navigate('Main', { screen: 'Rewards' });
      }, 250);
    }
  };

  const filteredNotifs = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Notification Sheet */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
        {/* Top Handle */}
        <View style={styles.sheetHandle} />

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.sheetTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadCountBadge}>
                <Text style={styles.unreadCountText}>{unreadCount} New</Text>
              </View>
            )}
          </View>

          <View style={styles.headerActionsRow}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.markReadBtn}
                onPress={handleMarkAllRead}
                activeOpacity={0.7}
              >
                <CheckCheck size={16} color={COLORS.primary} />
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterTabsRow}>
          {[
            { id: 'all', label: 'All' },
            { id: 'order', label: 'Orders ☕' },
            { id: 'promo', label: 'Promos 🎟️' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                activeTab === tab.id && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === tab.id && styles.tabBtnTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredNotifs.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={40} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySub}>
                We'll notify you when your coffee is brewing or when exciting promos drop!
              </Text>
            </View>
          ) : (
            filteredNotifs.map((item) => {
              const IconComp = item.icon || Bell;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notifCard,
                    item.isUnread && styles.notifCardUnread,
                  ]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.85}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: item.iconBg || '#F5EBE1' },
                    ]}
                  >
                    <IconComp size={18} color={item.iconColor || COLORS.primary} />
                  </View>

                  {/* Body */}
                  <View style={styles.notifBody}>
                    <View style={styles.notifTopRow}>
                      <Text
                        style={[
                          styles.notifTitle,
                          item.isUnread && styles.notifTitleUnread,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>

                    <Text style={styles.notifMessage}>{item.message}</Text>

                    {/* Inline Action Button if applicable */}
                    {item.actionLabel && (
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={styles.inlineActionBtn}
                          onPress={() => handleItemPress(item)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.inlineActionText}>
                            {item.actionLabel}
                          </Text>
                          <ChevronRight size={13} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Unread dot indicator */}
                  {item.isUnread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })
          )}
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
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: height * 0.78,
    backgroundColor: '#F8F4EE',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 25,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFD5C8',
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_800ExtraBold',
    color: COLORS.text,
  },
  unreadCountBadge: {
    backgroundColor: '#FDE8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    marginLeft: 8,
  },
  unreadCountText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#E02424',
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: '#EAE1D5',
  },
  markReadText: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAE1D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: '#EAE1D5',
    marginRight: 8,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: SPACING.lg,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: '#EFE9DF',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFD2C2',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  notifBody: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.text,
    flex: 1,
    paddingRight: 6,
  },
  notifTitleUnread: {
    color: COLORS.primary,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: COLORS.textSecondary,
  },
  notifMessage: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#65574D',
    lineHeight: 18,
  },
  actionRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  inlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  inlineActionText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    marginRight: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E02424',
    position: 'absolute',
    top: 14,
    right: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
