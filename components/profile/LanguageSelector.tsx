import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {LANGUAGES} from "@/constants/Languages"

const LanguageSelector: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { i18n } = useTranslation();

  const currentLangCode = i18n.language;
  const activeLang =
    LANGUAGES.find((l) => currentLangCode.startsWith(l.code)) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setVisible(false);
  };

  return (
    <View>
      {/* --- TRIGGER BUTTON --- */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.triggerButton,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.backgroundTertiary,
          },
        ]}
      >
        <Text style={styles.flag}>{activeLang.flag}</Text>
        <Text style={[styles.triggerText, { color: theme.textSecondary }]}>
          {activeLang.code.toUpperCase()}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={theme.textTertiary}
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {/* --- SELECTION MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent={true} // <--- FIX: Covers the status bar on Android
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setVisible(false)}
        >
          {/* Prevent clicks inside the card from closing the modal */}
          <Pressable 
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.backgroundTertiary,
                shadowColor: "#000",
              },
            ]}
            onPress={(e) => e.stopPropagation()} 
          >
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: theme.backgroundTertiary },
              ]}
            >
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
                          {
                            color: isActive ? theme.primary : theme.textPrimary,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.secondary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  
  // --- MODAL STYLES ---
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker for better focus
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 260,
    borderRadius: 16,
    borderWidth: 1,
    paddingBottom: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    padding: 14,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionFlag: {
    fontSize: 18,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LanguageSelector;
