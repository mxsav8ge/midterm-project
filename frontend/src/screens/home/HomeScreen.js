import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu,
  Bell,
  MapPin,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Heart,
  Plus,
  Coffee,
  LayoutGrid,
  CupSoda,
  Zap,
} from 'lucide-react-native';

const ICON_MAP = {
  'layout-grid': LayoutGrid,
  'coffee': Coffee,
  'cup-soda': CupSoda,
  'zap': Zap,
};
import { storeService } from '../../api/services/storeService';
import { menuService } from '../../api/services/menuService';
import { useCart } from '../../context/CartContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import SidebarDrawer from '../../components/common/SidebarDrawer';
import NotificationModal from '../../components/common/NotificationModal';

export default function HomeScreen({ navigation }) {
  const [storeInfo, setStoreInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [favorites, setFavorites] = useState([1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sidebar & Notifications state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);

  // Entrance animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { addToCart } = useCart();

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 150, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.delay(400),
        ])
      ).start();
    }
  }, [loading, shakeAnim]);

  const loadData = useCallback(async () => {
    try {
      const [storeData, catsData, itemsData] = await Promise.all([
        storeService.getStoreInfo(),
        menuService.getCategories(),
        menuService.getMenuItems('all'),
      ]);
      setStoreInfo(storeData);
      setCategories(catsData);
      setMenuItems(itemsData);
    } catch (err) {
      console.error('HomeScreen fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      
      // Trigger entrance animation once loading finishes
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuickAdd = (item) => {
    addToCart(
      item,
      1,
      item.sizes?.find((s) => s.label === 'M') || item.sizes?.[0] || null,
      item.milks?.find((m) => m.name === 'Dairy Milk') ? [item.milks[0]] : []
    );
  };

  const popularItems = menuItems.filter((i) => i.isPopular);
  const specialItem = menuItems.find((i) => i.isSpecial) || menuItems[2];

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Animated.Image 
          source={require('../../../assets/drinks/drinks2.png')}
          style={{
            width: 100,
            height: 100,
            transform: [{
              rotate: shakeAnim.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-15deg', '15deg']
              })
            }]
          }}
          resizeMode="contain"
        />
        <Text style={{ marginTop: 16, fontFamily: 'Outfit_500Medium', color: COLORS.textSecondary, fontSize: 16 }}>
          Brewing your menu...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setDrawerVisible(true)}
          activeOpacity={0.65}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Menu size={22} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
          <Text style={styles.locationLabel}>Location</Text>
          <View style={styles.locationValueRow}>
            <Text style={styles.locationText}>
              {storeInfo?.location || 'Opol, Misamis Oriental, Philippines'}
            </Text>
            <ChevronDown size={14} color={COLORS.text} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setNotifVisible(true)}
          activeOpacity={0.65}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Bell size={22} color={COLORS.text} />
          {unreadNotifCount > 0 && <View style={styles.bellDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* User Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            Good Morning,{' '}
            <Text style={styles.greetingName}>
              {storeInfo?.customerName || 'Isha'}
            </Text>{' '}
            👋
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your favorite coffee..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <SlidersHorizontal size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Categories Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComponent = ICON_MAP[cat.icon] || Coffee;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <IconComponent
                  size={16}
                  color={isSelected ? COLORS.white : COLORS.textSecondary}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextActive : styles.categoryTextInactive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Popular Now Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Now</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularScroll}
        >
          {popularItems.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.coffeeCard}
                onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
                activeOpacity={0.9}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(item.id)}
                    activeOpacity={0.8}
                  >
                    <Heart
                      size={15}
                      color={isFav ? '#EF4444' : COLORS.textSecondary}
                      fill={isFav ? '#EF4444' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.coffeeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.coffeeSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleQuickAdd(item)}
                    activeOpacity={0.8}
                  >
                    <Plus size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Special For You Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special For You</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {specialItem && (
          <TouchableOpacity
            style={styles.specialCard}
            onPress={() => navigation.navigate('ItemDetail', { itemId: specialItem.id })}
            activeOpacity={0.9}
          >
            <View style={styles.specialTextContainer}>
              <Text style={styles.specialName}>{specialItem.name}</Text>
              <Text style={styles.specialSubtitle}>{specialItem.subtitle}</Text>
              <Text style={styles.specialPrice}>
                {formatCurrency(specialItem.price)}
              </Text>
            </View>

            <View style={styles.specialImageContainer}>
              <Image
                source={{ uri: specialItem.imageUrl }}
                style={styles.specialImage}
              />
            </View>
          </TouchableOpacity>
        )}
        </Animated.View>
      </ScrollView>

      {/* Interactive Sidebar Drawer */}
      <SidebarDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        customerName={storeInfo?.customerName || 'Isha'}
        location={storeInfo?.location || 'Opol, Misamis Oriental, Philippines'}
        navigation={navigation}
        onSelectFavoriteFilter={() => {
          setSelectedCategory('all');
        }}
      />

      {/* Interactive Notification Center */}
      <NotificationModal
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
        navigation={navigation}
        onUnreadCountChange={setUnreadNotifCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    zIndex: 10,
    elevation: 10,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  locationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 4,
  },
  greetingSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  greetingName: {
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Premium white look
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    height: 52, // Slightly taller
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  filterBtn: {
    padding: 6,
  },
  categoryScroll: {
    paddingBottom: SPACING.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    marginRight: SPACING.sm,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
  },
  categoryPillInactive: {
    backgroundColor: '#EFE9DF',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  categoryTextInactive: {
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  popularScroll: {
    paddingBottom: SPACING.sm,
  },
  coffeeCard: {
    width: 165,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 2,
    marginRight: SPACING.md,
    ...SHADOWS.card,
  },
  cardImageContainer: {
    width: '100%',
    height: 125,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAE1D5',
    marginBottom: SPACING.sm,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coffeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  coffeeSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialCard: {
    backgroundColor: '#EFE9DF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specialTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  specialName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  specialSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  specialPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  specialImageContainer: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  specialImage: {
    width: '100%',
    height: '100%',
  },
});
