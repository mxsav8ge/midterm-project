import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const bottomInset = insets?.bottom || 0;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleStart = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Top Hero Image Area */}
      <View style={styles.heroSection}>
        <Image
          source={require('../../../assets/getstarted/image.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              top: Math.max(insets?.top || 0, 40) + SPACING.lg,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image
            source={require('../../../assets/logo/image.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Smooth Warm Cream Bottom Sheet directly over photo */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            paddingBottom: Math.max(bottomInset, 20) + SPACING.lg,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Soft subtle handle */}
        <View style={styles.sheetHandle} />

        <View style={styles.textContent}>
          <Text style={styles.taglineTitle}>Fuel Your Day.</Text>
          <Text style={styles.taglineSubtitle}>
            Your perfect cup, just a tap away. Crafted with passion, delivered to you.
          </Text>
        </View>

        {/* Deep Roasted Coffee CTA Button from reference */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.88}
        >
          <Text style={styles.startText}>Get Started</Text>
          <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4EE',
  },
  heroSection: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: 200,
    height: 200,
  },
  bottomSheet: {
    backgroundColor: '#F8F4EE',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -36, // Overlaps directly over the photo so no background leaks behind
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFD5C8',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  textContent: {
    marginBottom: SPACING.xl,
  },
  taglineTitle: {
    color: '#2B1A12', // Rich, smooth espresso brown from reference
    fontSize: 34,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  taglineSubtitle: {
    color: '#827165', // Soothing warm muted mocha
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#2B1A12', // Signature deep roast brown button from reference
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: RADIUS.pill,
    width: '100%',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  startText: {
    color: '#FAF6F0',
    fontSize: 17,
    fontFamily: 'Outfit_700Bold',
    marginRight: SPACING.sm,
    letterSpacing: 0.3,
  },
});