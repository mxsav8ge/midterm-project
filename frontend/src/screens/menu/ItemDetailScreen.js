import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Heart,
  Star,
  Plus,
  Minus,
  Check,
} from 'lucide-react-native';
import { menuService } from '../../api/services/menuService';
import { useCart } from '../../context/CartContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';

export default function ItemDetailScreen({ route, navigation }) {
  const { itemId } = route.params || { itemId: 1 };

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('m');
  const [selectedMilk, setSelectedMilk] = useState('dairy');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await menuService.getMenuItemById(itemId);
        setItem(data);
      } catch (err) {
        console.error('Error fetching item details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const toggleExtra = (extra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const calculateUnitTotal = () => {
    if (!item) return 0;
    const base = item.price;
    const sizeObj = item.sizes?.find((s) => s.id === selectedSize);
    const sizeExtra = sizeObj?.extra || 0;
    const milkObj = item.milks?.find((m) => m.id === selectedMilk);
    const milkExtra = milkObj?.extra || 0;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return base + sizeExtra + milkExtra + extrasTotal;
  };

  const calculateGrandTotal = () => {
    return calculateUnitTotal() * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;
    const sizeObj = item.sizes?.find((s) => s.id === selectedSize) || null;
    const milkObj = item.milks?.find((m) => m.id === selectedMilk) || null;
    const allAddons = [...(milkObj ? [milkObj] : []), ...selectedExtras];

    addToCart(item, quantity, sizeObj, allAddons);
    navigation.navigate('Cart');
  };

  if (loading || !item) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Floating Buttons */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ChevronLeft size={22} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
          >
            <Heart
              size={20}
              color={isFavorite ? '#EF4444' : COLORS.text}
              fill={isFavorite ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Title & Price Header */}
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={15} color={COLORS.star} fill={COLORS.star} />
          <Text style={styles.ratingText}>
            {item.rating} <Text style={styles.reviewText}>({item.reviews} reviews)</Text>
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Size Selection */}
        {item.sizes && item.sizes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.sizeRow}>
              {item.sizes.map((s) => {
                const isSelected = selectedSize === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.sizePill,
                      isSelected ? styles.sizePillActive : styles.sizePillInactive,
                    ]}
                    onPress={() => setSelectedSize(s.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sizeLabel,
                        isSelected ? styles.sizeLabelActive : styles.sizeLabelInactive,
                      ]}
                    >
                      {s.label}
                    </Text>
                    <Text
                      style={[
                        styles.sizeOz,
                        isSelected ? styles.sizeOzActive : styles.sizeOzInactive,
                      ]}
                    >
                      {s.oz}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Milk Selection */}
        {item.milks && item.milks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Milk</Text>
            <View style={styles.milkRow}>
              {item.milks.map((m) => {
                const isSelected = selectedMilk === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.milkPill,
                      isSelected ? styles.milkPillActive : styles.milkPillInactive,
                    ]}
                    onPress={() => setSelectedMilk(m.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.milkLabel,
                        isSelected ? styles.milkLabelActive : styles.milkLabelInactive,
                      ]}
                    >
                      {m.name}
                    </Text>
                    {m.extra > 0 && (
                      <Text
                        style={[
                          styles.milkExtra,
                          isSelected ? styles.milkExtraActive : styles.milkExtraInactive,
                        ]}
                      >
                        +{formatCurrency(m.extra)}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Add Extras */}
        {item.extras && item.extras.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Extras</Text>
            {item.extras.map((extra) => {
              const isChecked = selectedExtras.some((e) => e.id === extra.id);
              return (
                <TouchableOpacity
                  key={extra.id}
                  style={styles.extraRow}
                  onPress={() => toggleExtra(extra)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.extraLabel}>{extra.name}</Text>
                  <View style={styles.extraRight}>
                    <Text style={styles.extraPrice}>
                      +{formatCurrency(extra.price)}
                    </Text>
                    <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                      {isChecked && <Check size={12} color={COLORS.white} />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityStepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            activeOpacity={0.8}
          >
            <Minus size={16} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepVal}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity(quantity + 1)}
            activeOpacity={0.8}
          >
            <Plus size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.88}
        >
          <Text style={styles.addToCartText}>
            Add to Cart {formatCurrency(calculateGrandTotal())}
          </Text>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#EAE1D5',
    marginVertical: SPACING.md,
    ...SHADOWS.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviewText: {
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm + 2,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizePill: {
    flex: 1,
    height: 60,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizePillActive: {
    backgroundColor: COLORS.primary,
  },
  sizePillInactive: {
    backgroundColor: '#EFE9DF',
  },
  sizeLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  sizeLabelActive: {
    color: COLORS.white,
  },
  sizeLabelInactive: {
    color: COLORS.text,
  },
  sizeOz: {
    fontSize: 10,
    marginTop: 2,
  },
  sizeOzActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sizeOzInactive: {
    color: COLORS.textSecondary,
  },
  milkRow: {
    flexDirection: 'row',
    gap: 10,
  },
  milkPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milkPillActive: {
    backgroundColor: COLORS.primary,
  },
  milkPillInactive: {
    backgroundColor: '#EFE9DF',
  },
  milkLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  milkLabelActive: {
    color: COLORS.white,
  },
  milkLabelInactive: {
    color: COLORS.text,
  },
  milkExtra: {
    fontSize: 10,
    marginTop: 1,
  },
  milkExtraActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  milkExtraInactive: {
    color: COLORS.textSecondary,
  },
  extraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  extraLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  extraRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D4C9BC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE9DF',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    height: 52,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepVal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 10,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
