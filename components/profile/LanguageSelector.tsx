import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet, 
  I18nManager,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { LANGUAGES } from '@/constants/Languages';

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme(); 
  const [modalVisible, setModalVisible] = useState(false);

  // Find current language object
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = async (langCode: string, isRTL: boolean) => {
    await i18n.changeLanguage(langCode);
    setModalVisible(false);

    // Optional: Handle RTL layout changes
    if (isRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      // Note: You usually need to reload the app here for RTL to take full effect
    }
  };

  return (
    <>
      {/* --- 1. THE TRIGGER BUTTON --- */}
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.backgroundSecondary, // Card Background
            borderColor: theme.backgroundTertiary,      // Subtle Border
          }
        ]} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSide}>
          {/* Icon Container */}
          <View style={[
            styles.iconContainer, 
            { backgroundColor: theme.backgroundTertiary }
          ]}>
            <Ionicons name="globe-outline" size={20} color={theme.primary} />
          </View>
          
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            {t('profile.language', 'Language')}
          </Text>
        </View>

        <View style={styles.rightSide}>
          <Text style={styles.flag}>{currentLang.flag}</Text>
          <Text style={[styles.currentLangText, { color: theme.textSecondary }]}>
            {currentLang.label}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
        </View>
      </TouchableOpacity>

      {/* --- 2. THE SELECTION MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Modal Content */}
          <View style={[
            styles.modalContent, 
            { backgroundColor: theme.backgroundSecondary }
          ]}>
            
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.backgroundTertiary }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Language
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={theme.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isActive = item.code === currentLang.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.langItem,
                      { borderBottomColor: theme.backgroundTertiary },
                      // Highlight active item slightly
                      isActive && { backgroundColor: theme.backgroundTertiary }
                    ]}
                    onPress={() => handleLanguageChange(item.code, item.isRTL)}
                  >
                    <View style={styles.langRow}>
                      <Text style={styles.itemFlag}>{item.flag}</Text>
                      <Text style={[
                        styles.itemLabel, 
                        { color: isActive ? theme.primary : theme.textPrimary }
                      ]}>
                        {item.label}
                      </Text>
                    </View>
                    
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Trigger Styles
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
  },
  leftSide: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { padding: 8, borderRadius: 50 },
  label: { fontSize: 16, fontWeight: '600' },
  rightSide: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flag: { fontSize: 18 },
  currentLangText: { fontSize: 14, fontWeight: '500' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%', 
    // Shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  langRow: { flexDirection: 'row', alignItems: 'center' },
  itemFlag: { fontSize: 24, marginRight: 16 },
  itemLabel: { fontSize: 16, fontWeight: '500' },
});
