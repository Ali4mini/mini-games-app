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
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Required for the button
import { supabase } from "@/utils/supabase";

// --- Validation Schema ---
const signupSchema = z.object({
  username: z.string().min(3, "Username must be 3+ chars"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be 6+ chars"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Earnado Theme Palette ---
  const colors = {
    background: "#0b0d18", // Deep Navy
    inputBg: "#1c1e2e", // Input Background
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textPlaceholder: "#5A5A6E",
    // Cyan to Blue Gradient Colors for Signup
    gradientStart: "#06B6D4",
    gradientEnd: "#2979FF",
    error: "#FF5252",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
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
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.brandTitle}>Earnado</Text>
            <Text style={styles.headerTitle}>JOIN THE GAME</Text>
            <Text style={styles.subtitle}>Create your legend.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
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
                    placeholderTextColor={colors.textPlaceholder}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    selectionColor={colors.gradientStart}
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
                    placeholderTextColor={colors.textPlaceholder}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    selectionColor={colors.gradientStart}
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
                    placeholderTextColor={colors.textPlaceholder}
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    selectionColor={colors.gradientStart}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Gradient Action Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>START PLAYING</Text>
                )}
              </LinearGradient>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d18", // Deep Navy
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "LilitaOne",
    opacity: 0.8,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "LilitaOne",
    textAlign: "center",
    textShadowColor: "rgba(6, 182, 212, 0.5)", // Cyan glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0B0",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#A0A0B0",
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Poppins-Medium",
  },
  input: {
    backgroundColor: "#1c1e2e", // Dark Navy
    color: "#FFFFFF",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: "#FF5252",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  buttonWrapper: {
    marginTop: 20,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    height: 58,
    borderRadius: 29, // Pill shape
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "Poppins-Bold",
  },
  footer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#A0A0B0",
    fontSize: 14,
    marginRight: 6,
    fontFamily: "Poppins-Regular",
  },
  linkText: {
    color: "#D500F9", // Purple for the Login link
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
