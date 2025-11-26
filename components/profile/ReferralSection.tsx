import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Share, 
  Alert, 
  Platform 
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

interface ReferralSectionProps {
  code: string;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ code }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const message = t("profile.shareMessage", { 
        defaultValue: `🚀 Join me on this app! Use my code to get started: ${code}`, 
        code: code 
      });
      
      await Share.share({ message });
    } catch (error: any) {
      // Updated to use translation for "Error"
      Alert.alert(t("common.error", "Error"), error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative 'screws' */}
      <View style={[styles.screw, styles.screwTopLeft]} />
      <View style={[styles.screw, styles.screwTopRight]} />
      <View style={[styles.screw, styles.screwBottomLeft]} />
      <View style={[styles.screw, styles.screwBottomRight]} />

      {/* --- Header Section --- */}
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>{t("profile.inviteFriends", "INVITE CREW")}</Text>
            <Text style={styles.subtitle}>{t("profile.inviteSubtitle", "Share code & level up")}</Text>
        </View>
        <View style={styles.iconCircle}>
            <FontAwesome5 name="gift" size={20} color={theme.primaryContent} />
        </View>
      </View>

      {/* --- The Code Display --- */}
      <View style={styles.codeDisplay}>
        <Text style={styles.codeLabel}>{t("profile.yourCode", "ACCESS KEY")}</Text>
        <Text style={styles.codeText}>{code}</Text>
      </View>

      {/* --- Action Buttons --- */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.button, styles.shareButton]}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="share-alt" size={16} color={theme.textPrimary} />
          <Text style={styles.shareButtonText}>{t("profile.share", "Share")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyCode}
          style={[styles.button, styles.copyButton]}
          activeOpacity={0.7}
        >
          {copied ? (
            <FontAwesome5 name="check" size={16} color={theme.primaryContent} />
          ) : (
            <MaterialCommunityIcons name="content-copy" size={18} color={theme.primaryContent} />
          )}
          <Text style={styles.copyButtonText}>
            {copied ? t("profile.copied", "COPIED!") : t("profile.copy", "COPY")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferralSection;

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 20,
      marginHorizontal: 20,
      padding: 20,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary,
      shadowColor: theme.primary, 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    screw: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.textTertiary,
        opacity: 0.5,
    },
    screwTopLeft: { top: 10, left: 10 },
    screwTopRight: { top: 10, right: 10 },
    screwBottomLeft: { bottom: 10, left: 10 },
    screwBottomRight: { bottom: 10, right: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'Roboto',
    },
    subtitle: {
        fontSize: 12,
        color: theme.textSecondary,
        marginTop: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    codeDisplay: {
        backgroundColor: theme.backgroundPrimary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.backgroundTertiary,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    codeLabel: {
        fontSize: 10,
        color: theme.textTertiary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    codeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.secondary,
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    shareButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.textTertiary,
    },
    shareButtonText: {
        color: theme.textPrimary,
        fontWeight: '600',
        marginLeft: 8,
    },
    copyButton: {
        backgroundColor: theme.primary,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    copyButtonText: {
        color: theme.primaryContent,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 0.5,
    },
  });
