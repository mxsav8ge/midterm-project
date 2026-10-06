import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {
  Bike,
  MapPin,
  Coffee,
  Navigation,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - SPACING.lg * 2;
const MAP_HEIGHT = 230;

// Coordinates along streets for the delivery path
// Store (Brew & Bite): { x: 45, y: 175 }
// Waypoints through 5th Ave & 28th St
// Destination (123 Coffee St): { x: MAP_WIDTH - 55, y: 55 }
const ROUTE_POINTS = [
  { x: 50, y: 175 },
  { x: 110, y: 175 },
  { x: 110, y: 115 },
  { x: 190, y: 115 },
  { x: 190, y: 65 },
  { x: MAP_WIDTH - 60, y: 65 },
];

export default function LiveTrackingMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [distanceKm, setDistanceKm] = useState('1.2');
  const [currentStreet, setCurrentStreet] = useState('5th Ave near 28th St');

  // Animation progress along route (0 to 1)
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Radar pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Route progression animation (simulating real-time delivery movement)
  useEffect(() => {
    const loopDelivery = () => {
      progressAnim.setValue(0.15);
      Animated.timing(progressAnim, {
        toValue: 0.85,
        duration: 18000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setTimeout(loopDelivery, 2000);
        }
      });
    };

    loopDelivery();

    // Telemetry updates as rider moves
    const listener = progressAnim.addListener(({ value }) => {
      const remaining = (1.8 * (1 - value)).toFixed(1);
      setDistanceKm(remaining);
      if (value < 0.35) {
        setCurrentStreet('5th Avenue, Opol, Misamis Oriental');
      } else if (value < 0.65) {
        setCurrentStreet('28th Street corner 7th Ave');
      } else {
        setCurrentStreet('11th Ave near Coffee St');
      }
    });

    return () => {
      progressAnim.removeListener(listener);
    };
  }, [progressAnim]);

  // Interpolate rider coordinates based on waypoints
  const riderX = progressAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ROUTE_POINTS.map((p) => p.x),
  });

  const riderY = progressAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ROUTE_POINTS.map((p) => p.y),
  });

  const radarScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.2],
  });

  const radarOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.35, 0],
  });

  // SVG route path string
  const routePathD = `M ${ROUTE_POINTS[0].x} ${ROUTE_POINTS[0].y} ` +
    ROUTE_POINTS.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');

  const currentHeight = isExpanded ? 340 : MAP_HEIGHT;

  return (
    <View style={[styles.cardContainer, { height: currentHeight }]}>
      {/* Interactive Map Canvas */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_WIDTH} ${currentHeight}`}>
          <Defs>
            <SvgGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#C67C4E" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#2B1A12" stopOpacity="1" />
            </SvgGradient>
          </Defs>

          {/* Map Base Surface */}
          <Rect x="0" y="0" width={MAP_WIDTH} height={currentHeight} fill="#F5EFE7" />

          {/* City Parks / Green Spaces */}
          <Rect x="15" y="20" width="65" height="55" rx="8" fill="#E4ECE0" />
          <SvgText x="47" y="52" fill="#78926F" fontSize="9" fontWeight="700" textAnchor="middle">
            TERRA 28th
          </SvgText>

          <Rect x={MAP_WIDTH - 95} y={currentHeight - 75} width="80" height="55" rx="8" fill="#E4ECE0" />
          <SvgText x={MAP_WIDTH - 55} y={currentHeight - 44} fill="#78926F" fontSize="9" fontWeight="700" textAnchor="middle">
            TRACK 30th
          </SvgText>

          {/* Opol Street Grid (Roads) */}
          {/* Horizontal Streets */}
          <Rect x="0" y="55" width={MAP_WIDTH} height="20" fill="#FFFFFF" />
          <Rect x="0" y="105" width={MAP_WIDTH} height="20" fill="#FFFFFF" />
          <Rect x="0" y="165" width={MAP_WIDTH} height="20" fill="#FFFFFF" />

          {/* Vertical Avenues */}
          <Rect x="40" y="0" width="20" height={currentHeight} fill="#FFFFFF" />
          <Rect x="100" y="0" width="20" height={currentHeight} fill="#FFFFFF" />
          <Rect x="180" y="0" width="20" height={currentHeight} fill="#FFFFFF" />
          <Rect x={MAP_WIDTH - 70} y="0" width="20" height={currentHeight} fill="#FFFFFF" />

          {/* Street Name Labels */}
          <SvgText x="10" y="68" fill="#B3A395" fontSize="8" fontWeight="600">
            26th St
          </SvgText>
          <SvgText x="10" y="118" fill="#B3A395" fontSize="8" fontWeight="600">
            28th St
          </SvgText>
          <SvgText x="10" y="178" fill="#B3A395" fontSize="8" fontWeight="600">
            30th St
          </SvgText>
          <SvgText x="50" y={currentHeight - 8} fill="#B3A395" fontSize="8" fontWeight="600" textAnchor="middle">
            5th Ave
          </SvgText>
          <SvgText x="110" y={currentHeight - 8} fill="#B3A395" fontSize="8" fontWeight="600" textAnchor="middle">
            7th Ave
          </SvgText>
          <SvgText x="190" y={currentHeight - 8} fill="#B3A395" fontSize="8" fontWeight="600" textAnchor="middle">
            9th Ave
          </SvgText>

          {/* Planned Delivery Path (Background Outline & Dashes) */}
          <Path
            d={routePathD}
            stroke="#E1D1C1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d={routePathD}
            stroke="url(#routeGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6, 4"
            fill="none"
          />

          {/* Store Origin Marker (Point A) */}
          <Circle cx={ROUTE_POINTS[0].x} cy={ROUTE_POINTS[0].y} r="14" fill="#2B1A12" />
          <Circle cx={ROUTE_POINTS[0].x} cy={ROUTE_POINTS[0].y} r="5" fill="#FFFFFF" />

          {/* Destination Marker (Point B) */}
          <Circle cx={ROUTE_POINTS[ROUTE_POINTS.length - 1].x} cy={ROUTE_POINTS[ROUTE_POINTS.length - 1].y} r="14" fill="#C67C4E" />
          <Circle cx={ROUTE_POINTS[ROUTE_POINTS.length - 1].x} cy={ROUTE_POINTS[ROUTE_POINTS.length - 1].y} r="5" fill="#FFFFFF" />
        </Svg>
      </View>

      {/* Store Badge Callout */}
      <View style={[styles.mapCallout, { left: 16, bottom: currentHeight - 165 + 14 }]}>
        <View style={styles.calloutIcon}>
          <Coffee size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.calloutText}>Brew & Bite</Text>
      </View>

      {/* Delivery Destination Badge Callout */}
      <View style={[styles.mapCallout, styles.destCallout, { right: 12, top: 22 }]}>
        <View style={[styles.calloutIcon, { backgroundColor: COLORS.accent }]}>
          <MapPin size={12} color="#FFFFFF" />
        </View>
        <Text style={styles.calloutText}>123 Coffee St</Text>
      </View>

      {/* Live Animated Rider Vehicle (Motorcycle + Radar Pulse) */}
      <Animated.View
        style={[
          styles.riderContainer,
          {
            transform: [
              { translateX: Animated.subtract(riderX, 22) },
              { translateY: Animated.subtract(riderY, 22) },
            ],
          },
        ]}
        pointerEvents="none"
      >
        {/* Pulsing Signal Radar */}
        <Animated.View
          style={[
            styles.riderRadar,
            {
              transform: [{ scale: radarScale }],
              opacity: radarOpacity,
            },
          ]}
        />
        {/* Rider Icon Marker */}
        <View style={styles.riderCircle}>
          <Bike size={16} color="#FFFFFF" strokeWidth={2.4} />
        </View>
      </Animated.View>

      {/* Top Floating Telemetry HUD */}
      <View style={styles.hudOverlay}>
        <View style={styles.hudLiveBadge}>
          <View style={styles.liveBlinkingDot} />
          <Text style={styles.liveBadgeText}>LIVE GPS</Text>
        </View>
        <Text style={styles.hudStreetText} numberOfLines={1}>
          {currentStreet}
        </Text>
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          {isExpanded ? (
            <Minimize2 size={16} color={COLORS.text} />
          ) : (
            <Maximize2 size={16} color={COLORS.text} />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Distance & ETA Pill */}
      <View style={styles.bottomHudPill}>
        <View style={styles.hudStatItem}>
          <Text style={styles.hudStatLabel}>RIDER DISTANCE</Text>
          <Text style={styles.hudStatValue}>{distanceKm} km</Text>
        </View>
        <View style={styles.hudDivider} />
        <View style={styles.hudStatItem}>
          <Text style={styles.hudStatLabel}>SPEED</Text>
          <Text style={styles.hudStatValue}>28 km/h</Text>
        </View>
        <View style={styles.hudDivider} />
        <View style={styles.hudStatItem}>
          <Text style={styles.hudStatLabel}>ROUTE</Text>
          <Text style={[styles.hudStatValue, { color: '#16A34A' }]}>Fastest</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8DFD3',
    backgroundColor: '#F5EFE7',
    marginBottom: SPACING.md,
    position: 'relative',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  mapCallout: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EFE9DF',
  },
  destCallout: {
    borderColor: '#F3ECE2',
  },
  calloutIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  calloutText: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    color: COLORS.text,
  },
  riderContainer: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  riderRadar: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(198, 124, 78, 0.4)',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  riderCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E120C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  hudOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EDE4D8',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hudLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    marginRight: 8,
  },
  liveBlinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 9,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#03543F',
    letterSpacing: 0.5,
  },
  hudStreetText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.text,
  },
  expandBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3ECE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  bottomHudPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#EDE4D8',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hudStatItem: {
    alignItems: 'center',
  },
  hudStatLabel: {
    fontSize: 9,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
  },
  hudStatValue: {
    fontSize: 13,
    fontFamily: 'Outfit_800ExtraBold',
    color: COLORS.text,
    marginTop: 1,
  },
  hudDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#EBE1D5',
  },
});
