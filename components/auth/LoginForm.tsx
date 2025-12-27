import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/utils/supabase"; // Adjust path as needed

// --- Types ---
type LoginForm = {
  email: string;
  password: string;
};

// --- Theme Colors ---
const colors = {
  bgDark: "#0B0B15",
  primary: "#651FFF",
  secondary: "#D500F9",
  cyan: "#00E5FF",
  text: "#FFFFFF",
  textDim: "#8F90A6",
};

export default function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  // --- Dynamic Schema ---
  const loginSchema = z.object({
    email: z
      .string()
      .email({ message: t("auth.errors.invalidEmail") || "Invalid email" }),
    password: z
      .string()
      .min(1, {
        message: t("auth.errors.passwordRequired") || "Password required",
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // --- Google Configuration ---
  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId: "YOUR_WEB_CLIENT_ID_FROM_GOOGLE_CLOUD",
        offlineAccess: true,
      });
    }
  }, []);

  // --- Login Logic ---
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      if (Platform.OS === "web") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
            queryParams: { access_type: "offline", prompt: "consent" },
          },
        });
        if (error) throw error;
      } else {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        if (userInfo.data?.idToken) {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: userInfo.data.idToken,
          });
          if (error) throw error;
          router.replace("/(tabs)");
        } else {
          throw new Error("No ID token present!");
        }
      }
    } catch (error: any) {
      if (
        error.code !== statusCodes.SIGN_IN_CANCELLED &&
        error.code !== statusCodes.IN_PROGRESS
      ) {
        Alert.alert(t("auth.loginFailed") || "Login Failed", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmailSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error)
        Alert.alert(t("auth.loginFailed") || "Login Failed", error.message);
      else router.replace("/(tabs)");
    } catch (err) {
      Alert.alert(
        t("common.error") || "Error",
        t("auth.unexpectedError") || "Unexpected error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.formSection}>
      {/* Email Field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{t("auth.emailLabel") || "Email"}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <BlurView
              intensity={Platform.OS === "web" ? 0 : 20}
              tint="dark"
              style={[
                styles.blurContainer,
                focusedField === "email" && styles.blurFocused,
                errors.email && styles.blurError,
                Platform.OS === "web" && styles.webInputBackground,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textDim}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t("auth.emailPlaceholder") || "Enter your email"}
                placeholderTextColor={colors.textDim}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                // @ts-ignore
                outlineStyle="none"
              />
            </BlurView>
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      {/* Password Field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          {t("auth.passwordLabel") || "Password"}
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <BlurView
              intensity={Platform.OS === "web" ? 0 : 20}
              tint="dark"
              style={[
                styles.blurContainer,
                focusedField === "password" && styles.blurFocused,
                errors.password && styles.blurError,
                Platform.OS === "web" && styles.webInputBackground,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textDim}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={
                  t("auth.passwordPlaceholder") || "Enter your password"
                }
                placeholderTextColor={colors.textDim}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                // @ts-ignore
                outlineStyle="none"
              />
            </BlurView>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
        <TouchableOpacity style={styles.forgotPass}>
          <Link href={"/(auth)/forgot-password"} style={styles.forgotPassText}>
            {t("auth.forgotPassword") || "Forgot Password?"}
          </Link>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleSubmit(onEmailSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.8}
        style={styles.buttonShadowWrapper}
      >
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {t("auth.loginButton") || "Login"}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Social Section */}
      <View style={styles.socialSection}>
        <Text style={styles.orText}>{t("auth.or") || "OR"}</Text>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="#1F1F1F" />
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t("auth.newHere") || "New here?"}
        </Text>
        <TouchableOpacity onPress={() => router.replace("/signup")}>
          <Text style={styles.linkText}>
            {t("auth.createAccount") || "Create Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: { width: "100%" },
  inputWrapper: { marginBottom: 20 },
  label: {
    fontSize: 13,
    color: "#8F90A6",
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Poppins-Medium", // Ensure fonts are loaded in root
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    height: 56,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  webInputBackground: { backgroundColor: "#151520" },
  blurFocused: {
    borderColor: "#00E5FF",
    backgroundColor: "rgba(0, 229, 255, 0.05)",
  },
  blurError: { borderColor: "#FF5252" },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    height: "100%",
  },
  errorText: { color: "#FF5252", fontSize: 12, marginTop: 6 },
  forgotPass: { alignSelf: "flex-end", marginTop: 8 },
  forgotPassText: { color: "#8F90A6", fontSize: 13, cursor: "pointer" as any },
  buttonShadowWrapper: {
    marginTop: 10,
    shadowColor: "#D500F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  gradientButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    cursor: "pointer" as any,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  socialSection: { marginTop: 30 },
  orText: {
    color: "#555",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 300,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    cursor: "pointer" as any,
  },
  googleBtnText: {
    color: "#1F1F1F",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#8F90A6", fontSize: 14, marginRight: 6 },
  linkText: {
    color: "#00E5FF",
    fontSize: 14,
    fontWeight: "bold",
    cursor: "pointer" as any,
  },
});
