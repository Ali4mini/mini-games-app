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
  runOnJS,
} from "react-native-reanimated";

type WinModalProps = {
  visible: boolean;
  prizeLabel: string; // e.g. "+50 Coins"
  prizeValue: number; // e.g. 50
  onClose: () => void;
  onDoubleClaim: () => void; // <--- NEW PROP
  isAdLoaded: boolean; // <--- NEW PROP
  theme: any;
};

const { width } = Dimensions.get("window");

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  prizeLabel,
  prizeValue,
  onClose,
  onDoubleClaim,
  isAdLoaded,
  theme,
}) => {
  const { t } = useTranslation();

  // --- Animations ---
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 0;
      opacity.value = 0;
      rotate.value = 0;
      glowScale.value = 1;

      scale.value = withSpring(1, { damping: 15, stiffness: 200, mass: 0.8 });
      opacity.value = withTiming(1, { duration: 150 });

      // Trophy Wiggle
      rotate.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [visible]);

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
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
          {/* Trophy Icon */}
          <Animated.View style={[styles.iconWrapper, iconStyle]}>
            <LinearGradient
              colors={[theme.secondary, theme.primary]}
              style={styles.iconGradientCircle}
            >
              <FontAwesome5 name="trophy" size={40} color="#FFF" />
            </LinearGradient>
          </Animated.View>

          {/* Texts */}
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
                {prizeLabel}
              </Text>
            </View>
          </View>

          {/* --- ACTION BUTTONS --- */}
          <View style={{ width: "100%", gap: 12 }}>
            {/* 1. DOUBLE REWARD (Ad) */}
            <TouchableOpacity
              onPress={onDoubleClaim}
              disabled={!isAdLoaded}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                // Gold/Orange for Ads, Grey if loading
                colors={
                  isAdLoaded ? ["#F59E0B", "#D97706"] : ["#94a3b8", "#64748b"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <MaterialCommunityIcons
                  name="play-box-outline"
                  size={24}
                  color="#FFF"
                  style={{ marginRight: 8 }}
                />
                <View>
                  <Text style={styles.buttonText}>
                    {isAdLoaded ? "DOUBLE REWARD" : "LOADING AD..."}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    Get {prizeValue * 2} Coins
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* 2. SIMPLE CLAIM */}
            <TouchableOpacity
              onPress={handleClose}
              style={{ alignItems: "center", padding: 10 }}
            >
              <Text
                style={{
                  color: theme.textSecondary,
                  textDecorationLine: "underline",
                  fontSize: 12,
                }}
              >
                No thanks, just claim {prizeValue}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Keep your existing styles for modalContainer, etc.
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
    elevation: 20,
  },
  iconWrapper: { marginBottom: 20, elevation: 8 },
  iconGradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  content: { alignItems: "center", width: "100%" },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
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
  buttonWrapper: { width: "100%", borderRadius: 16, elevation: 5 },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
