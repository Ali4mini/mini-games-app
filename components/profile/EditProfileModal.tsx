import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

import { supabase } from "@/utils/supabase";
import { useTheme } from "@/context/ThemeContext";
import { UserProfile, Theme } from "@/types";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdate: () => void;
  currentUser: UserProfile | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onProfileUpdate,
  currentUser,
}) => {
  const theme = useTheme();

  // 1. RESPONSIVE SETUP
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  // 2. MEMOIZED STYLES
  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    avatarUri: "",
    base64: null as string | null | undefined,
    hasNewAvatar: false,
  });

  useEffect(() => {
    if (visible && currentUser) {
      setFormData({
        name: currentUser.name || "",
        username: currentUser.username || "",
        avatarUri: currentUser.avatar || "",
        base64: null,
        hasNewAvatar: false,
      });
    }
  }, [visible, currentUser]);

  const pickImage = async () => {
    // Check permissions on mobile (Web doesn't strictly need this step)
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need camera roll permissions.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Needed for Supabase Upload
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        avatarUri: result.assets[0].uri,
        hasNewAvatar: true,
        base64: result.assets[0].base64,
      }));
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    if (!formData.username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      let avatarPath = null;

      // 1. Upload new avatar if changed
      if (formData.hasNewAvatar && formData.base64) {
        const fileName = `${currentUser.id}/${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(fileName, decode(formData.base64), {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) throw uploadError;
        avatarPath = fileName;
      }

      // 2. Prepare Database Updates
      const updates: any = {
        name: formData.name,
        username: formData.username,
      };

      if (avatarPath) {
        updates.avatar_url = avatarPath;
      }

      // 3. Update 'profiles' table
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", currentUser.id);

      if (updateError) {
        if (updateError.code === "23505") {
          throw new Error("This username is already taken.");
        }
        throw updateError;
      }

      Alert.alert("Success", "Profile updated successfully!");
      onProfileUpdate();
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType={isDesktop ? "fade" : "slide"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        {/* ScrollView added to prevent keyboard blocking inputs on small screens */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: isDesktop ? "center" : "flex-end",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdropTouch}
            onPress={onClose}
          >
            {/* 
                  Stop propagation: Clicking the modal content shouldn't close it.
                  Using a dummy View to catch clicks inside the content area.
                */}
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={onClose}
                  disabled={loading}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: "center" }}>
                {/* Avatar Picker */}
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.avatarContainer}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        formData.avatarUri || "https://via.placeholder.com/150",
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.cameraIconOverlay}>
                    <Ionicons name="camera" size={24} color="#fff" />
                  </View>
                </TouchableOpacity>

                {/* Inputs */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Display Name</Text>
                  <TextInput
                    style={styles.inputField}
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter name"
                    placeholderTextColor={theme.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    style={styles.inputField}
                    value={formData.username}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, username: text }))
                    }
                    placeholder="Enter username"
                    placeholderTextColor={theme.textTertiary}
                    autoCapitalize="none"
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    backdropTouch: {
      flex: 1,
      width: "100%",
      // Desktop: Center the modal. Mobile: Align bottom
      justifyContent: isDesktop ? "center" : "flex-end",
      alignItems: isDesktop ? "center" : undefined,
    },
    modalContent: {
      backgroundColor: theme.backgroundSecondary || "#1e1e1e",
      // Desktop: Fixed width and full radius
      width: isDesktop ? 450 : "100%",
      borderRadius: isDesktop ? 24 : 30,
      borderBottomLeftRadius: isDesktop ? 24 : 0,
      borderBottomRightRadius: isDesktop ? 24 : 0,

      padding: 24,
      paddingBottom: isDesktop ? 24 : 50, // More bottom padding on mobile for home bar
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",

      // Shadow for Desktop Pop-up feel
      ...Platform.select({
        web: {
          boxShadow: "0px 10px 40px rgba(0,0,0,0.5)",
          cursor: "default",
        },
      }),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    closeButton: {
      padding: 4,
      cursor: "pointer", // Web pointer
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 30,
      position: "relative",
      cursor: "pointer", // Web pointer
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    cameraIconOverlay: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    inputGroup: {
      width: "100%",
      marginBottom: 20,
    },
    inputLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: 8,
      marginLeft: 4,
      fontWeight: "600",
    },
    inputField: {
      backgroundColor: theme.backgroundPrimary,
      borderRadius: 12,
      padding: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      fontSize: 16,
      // On web, remove outline on focus
      ...Platform.select({
        web: { outlineStyle: "none" } as any,
      }),
    },
    saveButton: {
      backgroundColor: theme.primary,
      width: "100%",
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 20,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      cursor: "pointer", // Web pointer
    },
    saveButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
