import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer"; // Ensure you have: npm install base64-arraybuffer

import { supabase } from "@/utils/supabase";
import { useTheme } from "@/context/ThemeContext";
import { UserProfile } from "@/types";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdate: () => void; // Callback to refresh parent data
  currentUser: UserProfile | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onProfileUpdate,
  currentUser,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    avatarUri: "", // Local preview URI
    base64: null as string | null | undefined,
    hasNewAvatar: false,
  });

  // Hydrate form when modal opens
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Required for Supabase upload
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

    // validation
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
          .from("assets") // Ensure this bucket exists in Supabase
          .upload(fileName, decode(formData.base64), {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) throw uploadError;
        avatarPath = fileName;
      }

      // 2. Prepare Database Updates
      // Note: We deliberately exclude fields like coins/level/referral_code
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
        // Handle unique constraint violation for username
        if (updateError.code === "23505") {
          throw new Error("This username is already taken.");
        }
        throw updateError;
      }

      Alert.alert("Success", "Profile updated successfully!");
      onProfileUpdate(); // Trigger refresh in parent
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center" }}>
            {/* Avatar Picker */}
            <TouchableOpacity
              onPress={pickImage}
              style={styles.avatarContainer}
            >
              <Image
                source={{
                  uri: formData.avatarUri || "https://via.placeholder.com/150",
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "flex-end", // Bottom sheet style or "center" for dialog
    },
    modalContent: {
      backgroundColor: theme.backgroundSecondary || "#1e1e1e",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 24,
      paddingBottom: 50,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
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
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 30,
      position: "relative",
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
    },
    saveButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
