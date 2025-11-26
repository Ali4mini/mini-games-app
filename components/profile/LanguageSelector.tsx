import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next"; // <--- Direct connection to i18n

// Adjust this import path to match your file structure
import { useTheme } from "@/context/ThemeContext"; 

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العریبه", flag: "🇸🇦" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
];

const LanguageSelector: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  // 1. Get Theme
  const theme = useTheme(); 
  
  // 2. Get Language from i18n
  const { i18n } = useTranslation();
  
  // Handle cases where language might be "en-US" vs "en"
  const currentLangCode = i18n.language; 
  const activeLang = LANGUAGES.find((l) => currentLangCode.startsWith(l.code)) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // This triggers a re-render automatically
    setVisible(false);
  };

  return (
    <View>
      {/* --- TRIGGER BUTTON (Compact Pill) --- */}
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.8}>
        <LinearGradient
          colors={theme.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.triggerButton, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={styles.flag}>{activeLang.flag}</Text>
            <Text style={[styles.triggerText, { color: theme.textPrimary }]}>
              {activeLang.code.toUpperCase()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={theme.textTertiary}
              style={{ marginLeft: 6 }}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* --- SELECTION MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.backgroundTertiary,
                shadowColor: theme.primary, // Neon glow
              },
            ]}
          >
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.backgroundTertiary }]}>
              <Text style={[styles.modalTitle, { color: theme.textSecondary }]}>
                Select Language
              </Text>
            </View>

            {/* List */}
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isActive = currentLangCode.startsWith(item.code);
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isActive && { backgroundColor: theme.backgroundTertiary },
                    ]}
                    onPress={() => handleLanguageChange(item.code)}
                  >
                    <View style={styles.optionRow}>
                      <Text style={styles.optionFlag}>{item.flag}</Text>
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: isActive ? theme.primary : theme.textPrimary },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {isActive && (
                      <Ionicons name="checkmark-circle" size={20} color={theme.secondary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Trigger
  gradientBorder: {
    borderRadius: 20,
    padding: 1.5,
  },
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 19,
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 280,
    borderRadius: 16,
    borderWidth: 1,
    paddingBottom: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default LanguageSelector;
