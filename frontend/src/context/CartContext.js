import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in', 'takeaway', 'delivery'

  const addToCart = (product, quantity = 1, selectedSize = null, selectedAddons = [], notes = '') => {
    // Generate a unique key for items with custom modifiers
    const addonIds = selectedAddons.map((a) => a.id).sort().join('-');
    const cartItemId = `${product.id}_${selectedSize?.name || 'def'}_${addonIds}`;

    // Calculate unit price including size and addons
    const sizeExtra = selectedSize?.extra || 0;
    const addonsExtra = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPrice = product.price + sizeExtra + addonsExtra;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevItems,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          unitPrice,
          quantity,
          selectedSize,
          selectedAddons,
          notes,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (promo) => {
    setAppliedPromo(promo);
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const percent = appliedPromo.discountPercent || 0;
    return (subtotal * percent) / 100;
  }, [subtotal, appliedPromo]);

  const deliveryFee = useMemo(() => {
    if (orderType !== 'delivery' || items.length === 0) return 0;
    return subtotal > 30 ? 0 : 3.5;
  }, [orderType, subtotal, items]);

  const total = useMemo(() => {
    const finalAmount = subtotal - discount + deliveryFee;
    return Math.max(0, finalAmount);
  }, [subtotal, discount, deliveryFee]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromo,
        removePromo,
        orderType,
        setOrderType,
        subtotal,
        discount,
        deliveryFee,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
