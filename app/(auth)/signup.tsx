import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useTheme } from "@/context/ThemeContext";

// --- Validation Schema ---
const signupSchema = z.object({
  username: z.string().min(3, "Username must be 3+ chars"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);

    // Sign up with Metadata for the Trigger
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          // Generate a cool avatar based on username
          avatarUrl: `https://api.dicebear.com/9.x/avataaars/png?seed=${data.username}&backgroundColor=b6e3f4`,
        },
      },
    });

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      Alert.alert(
        "Account Created!",
        "Please check your email to verify your account.",
      );
    }
    setIsSubmitting(false);
  };

  // Dynamic Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },
    card: {
      backgroundColor: theme.backgroundSecondary,
      padding: 30,
      borderRadius: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,
    },
    title: {
      fontFamily: "LilitaOne",
      fontSize: 32,
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 6,
      fontWeight: "600",
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      color: theme.textPrimary,
      height: 50,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.tabBarInactive,
      fontSize: 16,
    },
    inputError: {
      borderColor: theme.error,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    button: {
      backgroundColor: theme.buttonSecondary, // Cyan 500 for Signup (Different from Login)
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      shadowColor: theme.buttonSecondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: theme.secondaryContent,
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "LilitaOne",
    },
    footer: {
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "center",
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    linkText: {
      color: theme.primary, // Violet for the link here
      fontSize: 14,
      fontWeight: "bold",
      marginLeft: 5,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>JOIN THE GAME</Text>
          <Text style={styles.subtitle}>Create your legend.</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="GamerTag123"
                  placeholderTextColor={theme.textTertiary}
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="player@example.com"
                  placeholderTextColor={theme.textTertiary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.textTertiary}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.secondaryContent} />
            ) : (
              <Text style={styles.buttonText}>START PLAYING</Text>
            )}
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a player?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
