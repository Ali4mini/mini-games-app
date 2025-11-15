// components/lucky-spin/WinModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // Add translation hook
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";

type WinModalProps = {
  visible: boolean;
  prize: string | number;
  onClose: () => void;
  theme: any;
};

export const WinModal: React.FC<WinModalProps> = ({
  visible,
  prize,
  onClose,
  theme,
}) => {
  const { t } = useTranslation(); // Add translation hook
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withSpring(0, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(0, { damping: 15, stiffness: 200 });
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={[styles.modalContainer, { backgroundColor: theme.card }]}
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when clicking inside modal
        >
          <Animated.View style={[styles.content, modalStyle]}>
            <Text style={[styles.title, { color: theme.tint }]}>
              🎉 {t("luckySpin.congratulations")} 🎉
            </Text>
            <Text style={[styles.prizeText, { color: theme.text }]}>
              {t("luckySpin.youWon", { prize })}
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.tint }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>{t("luckySpin.great")}</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: "80%",
    maxWidth: 300,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  prizeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#F43F5E",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
