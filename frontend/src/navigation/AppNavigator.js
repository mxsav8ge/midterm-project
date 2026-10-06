import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, Star, User } from 'lucide-react-native';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import HomeScreen from '../screens/home/HomeScreen';
import CartScreen from '../screens/checkout/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import ItemDetailScreen from '../screens/menu/ItemDetailScreen';
import OrderTrackingScreen from '../screens/checkout/OrderTrackingScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import { useCart } from '../context/CartContext';
import { COLORS, RADIUS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder screens for Rewards and Profile tabs
function RewardsScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.tabPlaceholderTitle}>Rewards & Perks</Text>
      <Text style={styles.tabPlaceholderSubtitle}>You have 240 Coffee Beans points!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.tabPlaceholderTitle}>User's Profile</Text>
      <Text style={styles.tabPlaceholderSubtitle}>123 Coffee Street, Opol, Misamis Oriental, Philippines</Text>
    </View>
  );
}

function MainTabs() {
  const { totalItemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#B0A499',
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: '#EFE9DF',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Order"
        component={CartScreen}
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconWrapper}>
              <ClipboardList size={22} color={color} />
              {totalItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color, size }) => <Star size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="HomeTab" component={MainTabs} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  tabPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  tabPlaceholderSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
});
