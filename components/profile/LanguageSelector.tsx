import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet, 
  I18nManager
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

    if (isRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  };

  return (
    <>
      {/* --- COMPACT TRIGGER BUTTON --- */}
      <TouchableOpacity 
        style={[
          styles.compactTrigger, 
          { backgroundColor: theme.backgroundTertiary }
        ]} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{currentLang.flag}</Text>
        <Text style={[styles.compactLabel, { color: theme.textPrimary }]}>
          {currentLang.label}
        </Text>
        <Ionicons name="chevron-down" size={14} color={theme.textSecondary} style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* --- SELECTION MODAL (Kept mostly the same) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { backgroundColor: theme.backgroundSecondary }
          ]}>
            
            <View style={[styles.modalHeader, { borderBottomColor: theme.backgroundTertiary }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                {t('profile.language', 'Select Language')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={theme.textTertiary} />
              </TouchableOpacity>
            </View>

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
  // Compact Trigger Styles
  compactTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Ensures it wraps content width
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  flag: { 
    fontSize: 16 
  },
  compactLabel: { 
    fontSize: 14, 
    fontWeight: '600' 
  },

  // Modal Styles (Unchanged mostly)
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
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
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
