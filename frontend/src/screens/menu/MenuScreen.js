import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchX } from 'lucide-react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import CategoryPill from '../../components/features/CategoryPill';
import MenuItemCard from '../../components/features/MenuItemCard';
import { menuService } from '../../api/services/menuService';
import { useCart } from '../../context/CartContext';
import { COLORS, SPACING } from '../../constants/theme';

export default function MenuScreen({ route, navigation }) {
  const initialCategory = route?.params?.categoryId || 'all';

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { addToCart } = useCart();

  const loadMenuData = async (catId) => {
    try {
      setLoading(true);
      const [cats, items] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(catId),
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch (err) {
      console.error('MenuScreen error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMenuData(selectedCategory);
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMenuData(selectedCategory);
  };

  const handleSelectCategory = (id) => {
    setSelectedCategory(id);
  };

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { itemId: item.id });
  };

  const handleQuickAdd = (item) => {
    addToCart(item, 1, item.sizes?.[0] || null, []);
    alert(`Added ${item.name} to cart!`);
  };

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    const query = searchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Full Menu"
        subtitle="Crafted Fresh to Order"
        showBack={true}
        navigation={navigation}
      />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, ingredients..."
        />
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              item={cat}
              isSelected={selectedCategory === cat.id}
              onSelect={handleSelectCategory}
            />
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onPress={handleItemPress}
              onQuickAdd={handleQuickAdd}
            />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.resultsCount}>
                Showing {filteredItems.length} item{filteredItems.length === 1 ? '' : 's'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SearchX size={44} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No Items Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query or category filter.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.card,
  },
  categoryContainer: {
    backgroundColor: COLORS.card,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
    backgroundColor: COLORS.background,
  },
  listHeader: {
    marginBottom: SPACING.sm,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
