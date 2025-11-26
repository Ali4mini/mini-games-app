import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Linking,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Optional if you have translations
import { useNavigation } from "@react-navigation/native"; // Or useRouter from expo-router

import { useTheme } from "@/context/ThemeContext";
import { USER_DATA } from "@/data/dummyData"; // To get User ID

export const ContactUs: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();
  // const { t } = useTranslation(); // Use if needed

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // --- Actions ---
  const handleSend = () => {
    if (!message.trim()) {
        Alert.alert("Error", "Transmission empty. Please input data.");
        return;
    }
    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
        setSending(false);
        setSubject("");
        setMessage("");
        Alert.alert("Success", "Transmission received by HQ.");
    }, 1500);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link"));
  };

  return (
    <View style={styles.mainContainer}>
        <SafeAreaView style={styles.safeArea}>
            
            {/* --- CUSTOM HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>SUPPORT HQ</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>SYSTEM ONLINE</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* --- QUICK ACTIONS GRID --- */}
                    <Text style={styles.sectionLabel}>CHANNELS //</Text>
                    <View style={styles.grid}>
                        <TouchableOpacity 
                            style={styles.gridItem}
                            onPress={() => openLink("mailto:support@mystryclub.com")}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(6, 182, 212, 0.1)' }]}>
                                <FontAwesome5 name="envelope" size={20} color={theme.secondary} />
                            </View>
                            <Text style={styles.gridText}>EMAIL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.gridItem}
                            onPress={() => openLink("https://discord.gg/test")}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(88, 101, 242, 0.1)' }]}>
                                <FontAwesome5 name="discord" size={20} color="#5865F2" />
                            </View>
                            <Text style={styles.gridText}>DISCORD</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.gridItem}
                            onPress={() => openLink("https://twitter.com/test")}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(29, 161, 242, 0.1)' }]}>
                                <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
                            </View>
                            <Text style={styles.gridText}>TWITTER</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- TERMINAL FORM --- */}
                    <Text style={[styles.sectionLabel, { marginTop: 30 }]}>NEW TRANSMISSION //</Text>
                    
                    <View style={styles.formCard}>
                        {/* User Metadata Display */}
                        <View style={styles.metaDataRow}>
                            <Text style={styles.metaLabel}>FROM:</Text>
                            <Text style={styles.metaValue}>{USER_DATA.name}</Text>
                            <Text style={[styles.metaLabel, { marginLeft: 10 }]}>ID:</Text>
                            <Text style={styles.metaValue}>#{Math.floor(Math.random()*9000)+1000}</Text>
                        </View>

                        {/* Subject Input */}
                        <Text style={styles.inputLabel}>SUBJECT</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Report bug / Feature request..."
                            placeholderTextColor={theme.textTertiary}
                            value={subject}
                            onChangeText={setSubject}
                        />

                        {/* Message Input */}
                        <Text style={styles.inputLabel}>MESSAGE DATA</Text>
                        <TextInput 
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your issue..."
                            placeholderTextColor={theme.textTertiary}
                            multiline
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* --- BOTTOM ACTION BAR --- */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={handleSend}
                    disabled={sending}
                >
                    {sending ? (
                        <Text style={styles.sendButtonText}>TRANSMITTING...</Text>
                    ) : (
                        <>
                            <Text style={styles.sendButtonText}>INITIATE UPLINK</Text>
                            <MaterialCommunityIcons name="console-network" size={20} color={theme.primaryContent} />
                        </>
                    )}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    safeArea: {
        flex: 1,
    },
    // Custom Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.backgroundTertiary,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
        borderRadius: 8,
        backgroundColor: theme.backgroundSecondary,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: theme.textPrimary,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.success, // Green
        marginRight: 6,
        shadowColor: theme.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    statusText: {
        fontSize: 10,
        color: theme.success,
        fontWeight: '700',
        letterSpacing: 1,
    },

    // Content
    scrollContent: {
        padding: 24,
        paddingBottom: 240, // Space for footer
    },
    sectionLabel: {
        fontSize: 12,
        color: theme.textTertiary,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: 1.5,
    },

    // Grid Actions
    grid: {
        flexDirection: 'row',
        gap: 12,
    },
    gridItem: {
        flex: 1,
        backgroundColor: theme.backgroundSecondary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.backgroundTertiary,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    gridText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.textSecondary,
    },

    // Form
    formCard: {
        backgroundColor: theme.backgroundSecondary,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.primary, // Violet border for the main area
    },
    metaDataRow: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.backgroundTertiary,
        borderStyle: 'dashed',
    },
    metaLabel: {
        fontSize: 10,
        color: theme.textTertiary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    metaValue: {
        fontSize: 10,
        color: theme.secondary,
        fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
        marginLeft: 4,
    },

    inputLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 8,
        marginTop: 4,
    },
    input: {
        backgroundColor: theme.backgroundPrimary, // Dark input background
        borderRadius: 12,
        padding: 14,
        color: theme.textPrimary,
        fontSize: 14,
        borderWidth: 1,
        borderColor: theme.backgroundTertiary,
        marginBottom: 16,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Terminal feel
    },
    textArea: {
        height: 120,
    },

    // Footer Button
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: theme.backgroundPrimary,
        borderTopWidth: 1,
        borderTopColor: theme.backgroundTertiary,
    },
    sendButton: {
        backgroundColor: theme.primary, // Violet
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        // Glow
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    sendButtonText: {
        color: theme.primaryContent,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
  });
