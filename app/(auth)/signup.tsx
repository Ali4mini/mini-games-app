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
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";

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
  const [focusedField, setFocusedField] = useState<
    "username" | "email" | "password" | null
  >(null);

  // --- Theme Colors ---
  const colors = {
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textPlaceholder: "#B0B0C0",
    accentPurple: "#D500F9",
    accentBlue: "#651FFF",
    accentCyan: "#06B6D4",
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

  const GradientText = (props: any) => {
    return (
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={[colors.accentCyan, colors.accentPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text {...props} style={[props.style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
        >
          {/* --- Header --- */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.headerContainer}
          >
            <View style={styles.iconContainer}>
              {/* Changed icon to Person Add for signup context */}
              <Ionicons name="person-add" size={40} color="#fff" />
            </View>
            <GradientText style={styles.brandTitle}>Mysteryplay</GradientText>
            <Text style={styles.headerTitle}>JOIN THE GAME</Text>
            <Text style={styles.subtitle}>Create your legend.</Text>
          </Animated.View>

          {/* --- Form Section --- */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.formContainer}
          >
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <BlurView
                    intensity={30}
                    tint="dark"
                    style={[
                      styles.blurContainer,
                      focusedField === "username" && styles.blurFocused,
                      errors.username && styles.blurError,
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.textPlaceholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="GamerTag123"
                      placeholderTextColor={colors.textPlaceholder}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                      cursorColor={colors.accentCyan}
                      selectionColor={colors.accentCyan}
                    />
                  </BlurView>
                )}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <BlurView
                    intensity={30}
                    tint="dark"
                    style={[
                      styles.blurContainer,
                      focusedField === "email" && styles.blurFocused,
                      errors.email && styles.blurError,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.textPlaceholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="player@example.com"
                      placeholderTextColor={colors.textPlaceholder}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      cursorColor={colors.accentCyan}
                      selectionColor={colors.accentCyan}
                    />
                  </BlurView>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <BlurView
                    intensity={30}
                    tint="dark"
                    style={[
                      styles.blurContainer,
                      focusedField === "password" && styles.blurFocused,
                      errors.password && styles.blurError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.textPlaceholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={colors.textPlaceholder}
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      cursorColor={colors.accentCyan}
                      selectionColor={colors.accentCyan}
                    />
                  </BlurView>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Gradient Action Button (Matching Login Style) */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
              style={styles.buttonShadowWrapper}
            >
              <LinearGradient
                colors={["#D500F9", "#651FFF"]}
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
            <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
              <Text style={styles.footerText}>Already a player?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Log In</Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // Transparent for background blobs
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 10,
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  brandTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "LilitaOne",
    opacity: 0.8,
    marginBottom: 4,
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
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#A0A0B0",
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Poppins-Medium",
  },

  // --- BLUR INPUT STYLES ---
  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    height: 58,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  blurFocused: {
    borderColor: "#06B6D4",
    backgroundColor: "rgba(6, 182, 212, 0.1)",
  },
  blurError: {
    borderColor: "#FF5252",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    height: "100%",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  // --- BUTTON STYLES ---
  buttonShadowWrapper: {
    marginTop: 20,
    shadowColor: "#D500F9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  gradientButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.5,
    fontFamily: "Poppins-Bold",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    color: "#06B6D4", // Cyan to match theme (changed from old Purple)
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
