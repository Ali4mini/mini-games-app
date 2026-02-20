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
  useWindowDimensions, // <--- 1. Import this
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
import { useTranslation } from "react-i18next";

type SignupForm = {
  username: string;
  email: string;
  password: string;
};

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // 2. Get screen dimensions for responsive logic
  const { width, height } = useWindowDimensions();
  const isWebOrTablet = width > 768;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "username" | "email" | "password" | null
  >(null);

  const colors = {
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0B0",
    textPlaceholder: "#B0B0C0",
    accentPurple: "#D500F9",
    accentBlue: "#651FFF",
    accentCyan: "#06B6D4",
  };

  const signupSchema = z.object({
    username: z.string().min(3, { message: t("auth.errors.usernameMin") }),
    email: z.string().email({ message: t("auth.errors.invalidEmail") }),
    password: z.string().min(6, { message: t("auth.errors.passwordMin") }),
  });

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
      Alert.alert(t("auth.signupFailed"), error.message);
    } else {
      Alert.alert(
        t("auth.accountCreatedTitle"),
        t("auth.accountCreatedMessage"),
        [
          {
            text: t("auth.ok"),
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    }
    setIsSubmitting(false);
  };

  const GradientText = (props: any) => {
    // 3. Web Fallback for MaskedView
    if (Platform.OS === "web") {
      return (
        <Text {...props} style={[props.style, { color: colors.accentCyan }]}>
          {props.children}
        </Text>
      );
    }
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
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height }, // Ensures vertical centering on large screens
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
        >
          {/* 4. Responsive Wrapper */}
          <View
            style={[
              styles.responsiveContainer,
              isWebOrTablet && styles.webCardContainer,
            ]}
          >
            {/* --- Header --- */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={styles.headerContainer}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={40} color="#fff" />
              </View>
              <GradientText style={styles.brandTitle}>
                {t("appName")}
              </GradientText>
              <Text style={styles.headerTitle}>{t("auth.joinTheGame")}</Text>
              <Text style={styles.subtitle}>{t("auth.createLegend")}</Text>
            </Animated.View>

            {/* --- Form Section --- */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={styles.formContainer}
            >
              {/* Username Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t("auth.usernameLabel")}</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <BlurView
                      intensity={Platform.OS === "web" ? 0 : 30}
                      tint="dark"
                      style={[
                        styles.blurContainer,
                        focusedField === "username" && styles.blurFocused,
                        errors.username && styles.blurError,
                        Platform.OS === "web" && styles.webInputBackground,
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
                        placeholder={t("auth.usernamePlaceholder")}
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
                  <Text style={styles.errorText}>
                    {errors.username.message}
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t("auth.emailLabel")}</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <BlurView
                      intensity={Platform.OS === "web" ? 0 : 30}
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
                      intensity={Platform.OS === "web" ? 0 : 30}
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
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Gradient Action Button */}
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
                    <Text style={styles.buttonText}>
                      {t("auth.startPlaying")}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer Link */}
              <Animated.View
                entering={FadeInUp.delay(300)}
                style={styles.footer}
              >
                <Text style={styles.footerText}>{t("auth.alreadyPlayer")}</Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>{t("auth.loginLink")}</Text>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            </Animated.View>
          </View>{" "}
          {/* End Responsive Container */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Fix: Dark background instead of transparent to avoid white flashing on web
    backgroundColor: "#121212",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    // Removed padding here, moved to responsiveContainer
  },
  // --- New Responsive Styles ---
  responsiveContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  webCardContainer: {
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "rgba(30,30,30, 0.5)",
    borderRadius: 24,
    padding: 40,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  webInputBackground: {
    backgroundColor: "rgba(30, 30, 40, 1)",
  },
  // ---------------------------
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
    textShadowColor: "rgba(6, 182, 212, 0.5)",
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
    // @ts-ignore
    outlineStyle: "none", // Web fix
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
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
    cursor: "pointer", // Web fix
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
    color: "#06B6D4",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    cursor: "pointer", // Web fix
  },
});
