import React, { useState, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next"; // <--- IMPORT THIS

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Note: Schema definition moved inside the component to support i18n
type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation(); // <--- HOOK
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  // --- Dynamic Validation Schema ---
  const loginSchema = z.object({
    email: z.string().email({ message: t("auth.errors.invalidEmail") }),
    password: z.string().min(1, { message: t("auth.errors.passwordRequired") }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // --- Theme Colors ---
  const colors = {
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textPlaceholder: "#B0B0C0",
    accentPurple: "#D500F9",
    accentBlue: "#651FFF",
    accentCyan: "#06B6D4",
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "157056951354-r483kv15tbq5639ls1reo4o6rn346rmu.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (!idToken) throw new Error("No ID Token found");

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        Alert.alert("Supabase Error", error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("In progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(t("common.error"), t("auth.googlePlayError"));
      } else {
        console.error(error);
        Alert.alert(t("auth.loginFailed"), error.message || t("common.error"));
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

      if (error) {
        Alert.alert(t("auth.loginFailed"), error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert(t("common.error"), t("auth.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
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
              <Ionicons name="game-controller" size={40} color="#fff" />
            </View>
            <GradientText style={styles.brandTitle}>
              {t("appName")}
            </GradientText>
            <Text style={styles.subHeader}>{t("auth.welcomeBack")}</Text>
          </Animated.View>

          {/* --- Form --- */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.formSection}
          >
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t("auth.emailLabel")}</Text>
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
                      placeholder={t("auth.emailPlaceholder")}
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
              <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
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
                      placeholder={t("auth.passwordPlaceholder")}
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

              <TouchableOpacity style={styles.forgotPass}>
                <Link
                  href={"/(auth)/forgot-password"}
                  style={styles.forgotPassText}
                >
                  {t("auth.forgotPassword")}
                </Link>
              </TouchableOpacity>
            </View>

            {/* --- Login Button --- */}
            <TouchableOpacity
              onPress={handleSubmit(onEmailSubmit)}
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
                  <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* --- Footer / Social Section --- */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.socialSection}
          >
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t("auth.or")}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button - Native component usually handles own translation, 
                or you can swap for a custom button if needed. */}
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleLogin}
                disabled={isSubmitting}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
            <Text style={styles.footerText}>{t("auth.newHere")}</Text>
            <TouchableOpacity onPress={() => router.replace("/signup")}>
              <Text style={styles.linkText}>{t("auth.createAccount")}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 60,
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
    fontSize: 48,
    fontWeight: "800",
    fontFamily: "LilitaOne",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#A0A0B0",
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.5,
  },
  formSection: {
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
  forgotPass: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPassText: {
    color: "#A0A0B0",
    fontSize: 13,
  },
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
    color: "#06B6D4",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
