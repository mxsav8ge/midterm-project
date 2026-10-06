import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import {
  X,
  Send,
  Phone,
  Bike,
  ShieldCheck,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const { height } = Dimensions.get('window');

const QUICK_REPLIES = [
  'Leave at the lobby guard po',
  'Please call when you arrive',
  'Take your time Kuya, ride safe! 🛵',
  'Thank you po Kuya Mark!',
];

export default function DriverChatModal({ visible, onClose, driverName = 'Kuya Mark' }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Magandang araw po ma\'am, sir! Picked up your order from Brew & Bite. Safe po sa thermal box, papunta na po! ☕🛵',
      time: '2:24 PM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          stiffness: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, visible]);

  if (!visible) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate driver typing and auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Noted po ma\'am, sir! Malapit na po ako dyan. Text or call po ako pag nasa tapat na ng building. Ingat po!';
      if (text.toLowerCase().includes('lobby') || text.toLowerCase().includes('guard')) {
        replyText = 'Sige po ma\'am, ibilin ko po sa lobby guard. Picture-an ko na lang din po pag naiwan na. Salamat po!';
      } else if (text.toLowerCase().includes('call')) {
        replyText = 'Opo ma\'am tatawag po ako pag dating ko po sa drop-off point.';
      } else if (text.toLowerCase().includes('thank') || text.toLowerCase().includes('salamat')) {
        replyText = 'Walang anuman po ma\'am! Happy to deliver your favorite coffee!';
      }

      const driverReply = {
        id: (Date.now() + 1).toString(),
        sender: 'driver',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, driverReply]);
    }, 1400);
  };

  const handleCall = () => {
    Alert.alert(
      `Call ${driverName}`,
      '+63 917 892 4521\n(Delivery Partner)',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

      {/* Slide-up Chat Container */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.driverInfoRow}>
              <View style={styles.driverAvatar}>
                <Bike size={20} color="#FFFFFF" strokeWidth={2.4} />
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.driverTextContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.driverName}>{driverName}</Text>
                  <ShieldCheck size={14} color="#16A34A" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.driverStatus}>Honda Click 125 • On the way (1.2 km)</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Phone size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerBtn, { marginLeft: 8 }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Notice Banner */}
          <View style={styles.safetyBanner}>
            <Text style={styles.safetyText}>
              ☕ Your drinks are sealed and placed in an insulated thermal carrier.
            </Text>
          </View>

          {/* Messages Stream */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.messageRowUser : styles.messageRowDriver,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.smallAvatar}>
                      <Bike size={12} color="#FFFFFF" />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleDriver,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        isUser ? styles.bubbleTextUser : styles.bubbleTextDriver,
                      ]}
                    >
                      {m.text}
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text
                        style={[
                          styles.timeText,
                          isUser ? styles.timeTextUser : styles.timeTextDriver,
                        ]}
                      >
                        {m.time}
                      </Text>
                      {isUser && (
                        <CheckCheck size={13} color="#FAF6F0" style={{ marginLeft: 4 }} />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <View style={[styles.messageRow, styles.messageRowDriver]}>
                <View style={styles.smallAvatar}>
                  <Bike size={12} color="#FFFFFF" />
                </View>
                <View style={[styles.bubble, styles.bubbleDriver, styles.typingBubble]}>
                  <Text style={styles.typingText}>Kuya Mark is typing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Reply Chips */}
          <View style={styles.quickRepliesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesScroll}
            >
              {QUICK_REPLIES.map((reply, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickReplyChip}
                  onPress={() => handleSend(reply)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Message Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Message ${driverName}...`}
              placeholderTextColor="#9B8E84"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 14, 10, 0.45)',
    zIndex: 999,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.84,
    backgroundColor: '#F8F4EE',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 25,
    overflow: 'hidden',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DFD3',
    backgroundColor: '#FFFFFF',
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineBadge: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  driverTextContainer: {
    marginLeft: SPACING.sm + 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'Outfit_800ExtraBold',
    color: COLORS.text,
  },
  driverStatus: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3ECE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyBanner: {
    backgroundColor: '#FFF8EE',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5D5',
  },
  safetyText: {
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
    color: '#8C6C38',
    textAlign: 'center',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowDriver: {
    justifyContent: 'flex-start',
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleDriver: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    shadowColor: '#2B1A12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bubbleTextDriver: {
    color: COLORS.text,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
  },
  timeTextUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextDriver: {
    color: COLORS.textSecondary,
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  quickRepliesContainer: {
    paddingVertical: 6,
    backgroundColor: '#F4ECE2',
    borderTopWidth: 1,
    borderTopColor: '#EBE2D7',
  },
  quickRepliesScroll: {
    paddingHorizontal: SPACING.md,
  },
  quickReplyChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2D8CC',
  },
  quickReplyText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8DFD3',
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.sm + 2,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8F4EE',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#EFE9DF',
    marginRight: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: '#DDD2C5',
    shadowOpacity: 0,
    elevation: 0,
  },
});
