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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/utils/supabase";

// --- Components ---

// --- Validation Schema ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Theme Colors (Earnado Palette) ---
  const colors = {
    background: "#0b0d18",
    inputBg: "#1c1e2e",
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textPlaceholder: "#5A5A6E",
    accentPurple: "#D500F9",
    accentBlue: "#651FFF",
    error: "#FF5252",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // --- 1. Email/Password Login ---
  const onEmailSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
      } else {
        // Success: Router automatically handles session state if configured,
        // or manually redirect:
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
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
          {/* --- Header --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.brandTitle}>Earnado</Text>
            <Text style={styles.subHeader}>Welcome back!</Text>
          </View>

          {/* --- Form --- */}
          <View style={styles.formSection}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="player@earnado.com"
                    placeholderTextColor={colors.textPlaceholder}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    selectionColor={colors.accentPurple}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password */}
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
                    selectionColor={colors.accentPurple}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleSubmit(onEmailSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={[colors.accentPurple, colors.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>LOG IN</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* --- Social Section --- */}
          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          {/* --- Footer --- */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            {/* Uses router.replace to avoid nav loops */}
            <TouchableOpacity onPress={() => router.replace("/signup")}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d18", // Matches the Earnado Dark Theme
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "center", // Vertically centers content if screen is tall
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "LilitaOne", // Custom font
    marginBottom: 8,
    textShadowColor: "rgba(213, 0, 249, 0.6)", // Neon Glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  subHeader: {
    fontSize: 16,
    color: "#A0A0B0",
    fontFamily: "Poppins-Regular",
  },
  formSection: {
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
    backgroundColor: "#1c1e2e", // Dark Navy/Gray
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
  forgotPass: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPassText: {
    color: "#A0A0B0",
    fontSize: 13,
  },
  buttonWrapper: {
    marginTop: 20,
    shadowColor: "#D500F9",
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
  socialSection: {
    marginTop: 32,
    marginBottom: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(160, 160, 176, 0.2)",
  },
  dividerText: {
    color: "#A0A0B0",
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#A0A0B0",
    fontSize: 14,
    marginRight: 6,
    fontFamily: "Poppins-Regular",
  },
  linkText: {
    color: "#06B6D4", // Cyan
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
