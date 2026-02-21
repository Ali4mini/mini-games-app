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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { pb } from "@/utils/pocketbase";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // 2. Responsive Logic
  const { width, height } = useWindowDimensions();
  const isWebOrTablet = width > 768;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | null>(null);

  const colors = {
    textPrimary: "#FFFFFF",
    textPlaceholder: "#B0B0C0",
    accentPurple: "#D500F9",
    accentCyan: "#06B6D4",
  };

  const forgotPasswordSchema = z.object({
    email: z.string().email({ message: t("auth.errors.invalidEmail") }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      // PocketBase: requestPasswordReset
      await pb.collection("users").requestPasswordReset(data.email);

      Alert.alert(t("auth.checkEmailTitle"), t("auth.checkEmailMessage"), [
        {
          text: t("auth.backToLogin"),
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (err: any) {
      const msg =
        err.response?.message || err.message || t("auth.unexpectedError");
      Alert.alert(t("common.error"), msg);
    } finally {
      setIsSubmitting(false);
    }
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
            { minHeight: height }, // Vertical centering
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
            {/* --- Back Button --- */}
            {/* Moved inside wrapper so it aligns relative to card on web */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* --- Header --- */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={styles.headerContainer}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="key-outline" size={48} color="#fff" />
              </View>
              <GradientText style={styles.headerTitle}>
                {t("auth.unlockAccess")}
              </GradientText>
              <Text style={styles.subHeader}>{t("auth.recoverSubtitle")}</Text>
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

              {/* Gradient Button */}
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
                      {t("auth.sendResetLink")}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* --- Footer --- */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
              <Text style={styles.footerText}>
                {t("auth.rememberedPassword")}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.linkText}>{t("auth.loginLink")}</Text>
              </TouchableOpacity>
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
    // Solid background for web stability
    backgroundColor: "#121212",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  // --- Responsive Styles ---
  responsiveContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    // Ensure relative positioning so absolute children align to this container
    position: "relative",
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
  // -------------------------
  backButton: {
    position: "absolute",
    top: 10, // Adjusted for card layout
    left: 10, // Adjusted for card layout
    zIndex: 10,
    padding: 10,
    cursor: "pointer", // Web fix
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 60,
  },
  iconContainer: {
    marginBottom: 16,
    shadowColor: "#D500F9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "LilitaOne",
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 15,
    color: "#A0A0B0",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
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

  // --- BLUR INPUT ---
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

  // --- BUTTON ---
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
  },

  // --- FOOTER ---
  footer: {
    marginTop: 32,
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
    cursor: "pointer", // Web fix
  },
});
