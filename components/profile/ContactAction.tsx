import React, { useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface ContactActionProps {
  onPress: () => void;
}

export const ContactAction: React.FC<ContactActionProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress} 
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <FontAwesome5 name="headset" size={20} color={theme.textPrimary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("profile.contactSupport", "NEED BACKUP?")}</Text>
          <Text style={styles.subtitle}>{t("profile.contactSubtitle", "Contact Support HQ")}</Text>
        </View>

        <FontAwesome5 name="chevron-right" size={14} color={theme.textTertiary} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginTop: 30,
      marginBottom: 50,
      paddingHorizontal: 24,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,
      // Subtle Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.textPrimary,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 12,
      color: theme.textTertiary,
      marginTop: 2,
    },
  });
