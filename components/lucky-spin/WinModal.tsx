import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withDelay,
  Easing,
  withTiming
} from "react-native-reanimated";

type WinModalProps = {
  visible: boolean;
  prize: string | number;
  onClose: () => void;
  theme: any;
};

const { width } = Dimensions.get("window");

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  prize,
  onClose,
  theme,
}) => {
  const { t } = useTranslation();
  
  // Animation Values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const rotate = useSharedValue(0);

useEffect(() => {
    if (visible) {
      // 1. ENTRY: Snappy Spring (High Stiffness = Fast)
      scale.value = withSpring(1, { 
        damping: 15, 
        stiffness: 400, // Was 100. Higher = Faster/Snappier
        mass: 0.8       // Lighter mass = Less inertia
      });
      
      opacity.value = withTiming(1, { duration: 150 });

      // 2. DECORATION: Faster Pulse
      glowScale.value = withSequence(
        withTiming(1.2, { duration: 0 }),
        withDelay(100, // Reduced delay from 300ms
          withSequence(
             withTiming(1.5, { duration: 500 }), // Faster pulse (was 800ms)
             withTiming(1.2, { duration: 500 })
          )
        )
      );

      // 3. DECORATION: Faster Wiggle
      rotate.value = withSequence(
        withTiming(-10, { duration: 50 }), // Faster wiggle (was 100ms)
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

    } else {
      // EXIT: Quick exit
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }]
  }));

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View style={[
            styles.modalContainer, 
            { 
              backgroundColor: theme.backgroundSecondary, 
              borderColor: theme.primary 
            }, 
            modalAnimatedStyle
        ]}>
            {/* --- DECORATIVE GLOW BEHIND ICON --- */}
            <View style={[styles.glowBackground, { backgroundColor: theme.primary }]} />

            {/* --- ICON --- */}
            <Animated.View style={[styles.iconWrapper, iconStyle]}>
                <LinearGradient
                  colors={[theme.secondary, theme.primary]}
                  style={styles.iconGradientCircle}
                >
                   <FontAwesome5 name="trophy" size={40} color="#FFF" />
                </LinearGradient>
            </Animated.View>

            {/* --- TEXT CONTENT --- */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {t("luckySpin.congratulations", "HUGE WIN!")}
                </Text>
                
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {t("luckySpin.youWonLabel", "You've acquired:")}
                </Text>

                <View style={[styles.prizeBox, { backgroundColor: theme.backgroundPrimary, borderColor: theme.backgroundTertiary }]}>
                   <Text style={[styles.prizeText, { color: theme.secondary }]}>
                     {prize}
                   </Text>
                </View>
            </View>

            {/* --- ACTION BUTTON --- */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
               <LinearGradient
                 colors={theme.buttonGradient || [theme.primary, theme.secondary]}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 0 }}
                 style={styles.gradientButton}
               >
                 <Text style={styles.buttonText}>{t("luckySpin.claim", "CLAIM REWARD")}</Text>
                 <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#FFF" style={{ marginLeft: 8 }}/>
               </LinearGradient>
            </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for better contrast
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1.5, // Neon border
    
    // Cyberpunk Glow
    shadowColor: "#7C3AED", // Violet shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Icon Styles
  glowBackground: {
    position: 'absolute',
    top: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
  iconWrapper: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  iconGradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Text Styles
  content: {
    alignItems: "center",
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: "900", // Heavy font
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  
  // Prize Box
  prizeBox: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed', // Ticket/Coupon feel
    alignItems: 'center',
    marginBottom: 24,
  },
  prizeText: {
    fontSize: 28, // Big Prize Text
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Button
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
