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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

// --- Theme Imports ---
import { useTheme } from "@/context/ThemeContext";

// --- Validation Schema ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme(); // Gets your active color object (light or dark)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("1. Submit button clicked");
    console.log("2. Attempting login with:", data.email);

    setIsSubmitting(true);

    try {
      // Log the specific call
      console.log("3. Calling supabase.auth.signInWithPassword...");

      const { data: responseData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      console.log("4. Supabase responded!");

      if (error) {
        console.error("5. Login Error:", error);
        Alert.alert("Login Failed", error.message);
      } else {
        console.log("5. Login Success:", responseData);
        // Alert.alert("Success", "Logged in!");
      }
    } catch (err) {
      console.error("CRITICAL ERROR:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Styles based on Theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      // No background color here so BlobBackground shows through
    },
    card: {
      backgroundColor: theme.backgroundSecondary, // e.g., Slate 800
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
      fontFamily: "LilitaOne", // Using your custom font
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
      backgroundColor: theme.backgroundTertiary, // e.g., Slate 700
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
      backgroundColor: theme.buttonPrimary, // e.g., Violet 600
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      shadowColor: theme.buttonPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: theme.primaryContent,
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
      color: theme.secondary, // Cyan 500 (Pop color)
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
      <View style={styles.card}>
        <Text style={styles.title}>WELCOME BACK</Text>
        <Text style={styles.subtitle}>Ready to play?</Text>

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
            <ActivityIndicator color={theme.primaryContent} />
          ) : (
            <Text style={styles.buttonText}>LOG IN</Text>
          )}
        </TouchableOpacity>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
