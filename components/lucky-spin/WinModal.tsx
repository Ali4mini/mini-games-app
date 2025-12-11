import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
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
  withTiming,
  runOnJS, // Required to call JS functions (onClose) from UI thread
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

  // --- Animation Values ---
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // --- Effect: Handle Entrance Animations ---
  useEffect(() => {
    if (visible) {
      // 1. Reset values (Start invisible)
      scale.value = 0;
      opacity.value = 0;
      rotate.value = 0;
      glowScale.value = 1;

      // 2. ENTRY: Snappy Spring
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
        mass: 0.8,
      });

      opacity.value = withTiming(1, { duration: 150 });

      // 3. DECORATION: Pulse the background glow
      glowScale.value = withSequence(
        withTiming(1.2, { duration: 0 }),
        withDelay(
          100,
          withSequence(
            withTiming(1.5, { duration: 500 }),
            withTiming(1.2, { duration: 500 }),
          ),
        ),
      );

      // 4. DECORATION: Wiggle the Trophy
      rotate.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [visible]);

  // --- Function: Handle Exit Animation ---
  const handleClose = () => {
    // 1. Fade Out
    opacity.value = withTiming(0, { duration: 150 });

    // 2. Shrink Out
    scale.value = withTiming(0, { duration: 150 }, (finished) => {
      // 3. ONLY after animation finishes, tell parent to hide Modal
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  // --- Styles ---
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none" // We handle animation manually via Reanimated
      onRequestClose={handleClose} // Handle Android Back Button
    >
      <View style={styles.overlay}>
        {/* Backdrop: Tap to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.primary,
            },
            modalAnimatedStyle,
          ]}
        >
          {/* --- DECORATIVE GLOW BEHIND ICON --- */}
          <Animated.View
            style={[
              styles.glowBackground,
              { backgroundColor: theme.primary },
              glowStyle,
            ]}
          />

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

            <View
              style={[
                styles.prizeBox,
                {
                  backgroundColor: theme.backgroundPrimary,
                  borderColor: theme.backgroundTertiary,
                },
              ]}
            >
              <Text style={[styles.prizeText, { color: theme.secondary }]}>
                {prize}
              </Text>
            </View>
          </View>

          {/* --- ACTION BUTTON --- */}
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={theme.buttonGradient || [theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {t("luckySpin.claim", "CLAIM REWARD")}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right-circle"
                size={20}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    borderWidth: 1.5,
    // Shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 100,
  },
  // Icon Styles
  glowBackground: {
    position: "absolute",
    top: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.25,
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  // Text Styles
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
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
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 24,
  },
  prizeText: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Button
  buttonWrapper: {
    width: "100%",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
