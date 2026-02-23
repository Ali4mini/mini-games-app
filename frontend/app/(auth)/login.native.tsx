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
import { pb } from "@/utils/pocketbase"; // Changed from supabase
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreenNative() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  const colors = {
    bgDark: "#0B0B15",
    primary: "#651FFF",
    secondary: "#D500F9",
    cyan: "#00E5FF",
    text: "#FFFFFF",
    textDim: "#8F90A6",
  };

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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "242972121222-21gnev3hlk29eqn2ckl6mcf7btialvg5.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      // PocketBase standard OAuth flow for Native
      // This will open a browser for the user to select their account
      const authData = await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      if (authData) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled login flow");
      } else {
        Alert.alert(
          t("auth.loginFailed"),
          error.message || "An unexpected error occurred",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmailSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      // PocketBase: authWithPassword
      await pb.collection("users").authWithPassword(data.email, data.password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const msg =
        err.response?.message || err.message || t("auth.unexpectedError");
      Alert.alert(t("auth.loginFailed"), msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const GradientText = (props: any) => (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={[colors.cyan, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );

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
        >
          <View style={styles.responsiveContainer}>
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
              <Text style={styles.subHeader}>Welcome back, Player 1</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <View style={styles.formSection}>
                {/* Email Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>{t("auth.emailLabel")}</Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <BlurView
                        intensity={20}
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
                          color={colors.textDim}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder={t("auth.emailPlaceholder")}
                          placeholderTextColor={colors.textDim}
                          autoCapitalize="none"
                          keyboardType="email-address"
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
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
                  <Text style={styles.label}>{t("auth.passwordLabel")}</Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <BlurView
                        intensity={20}
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
                          color={colors.textDim}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder={t("auth.passwordPlaceholder")}
                          placeholderTextColor={colors.textDim}
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </BlurView>
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
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

                {/* Submit Button */}
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
                        {t("auth.loginButton")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Social Login -- disabled for v1 */}
                {/* <View style={styles.socialSection}> */}
                {/*   <Text style={styles.orText}>{t("auth.or")}</Text> */}
                {/*   <View style={{ alignItems: "center", marginTop: 15 }}> */}
                {/*     <GoogleSigninButton */}
                {/*       size={GoogleSigninButton.Size.Wide} */}
                {/*       color={GoogleSigninButton.Color.Dark} */}
                {/*       onPress={handleGoogleLogin} */}
                {/*       disabled={isSubmitting} */}
                {/*     /> */}
                {/*   </View> */}
                {/* </View> */}

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>{t("auth.newHere")}</Text>
                  <TouchableOpacity onPress={() => router.replace("/signup")}>
                    <Text style={styles.linkText}>
                      {t("auth.createAccount")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B15" },
  scrollContent: { flexGrow: 1 },
  responsiveContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 450,
    alignSelf: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    marginBottom: 15,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: "#8F90A6" },
  formSection: { width: "100%" },
  inputWrapper: { marginBottom: 20 },
  label: {
    fontSize: 13,
    color: "#8F90A6",
    marginBottom: 8,
    marginLeft: 4,
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
    height: "100%",
  },
  errorText: { color: "#FF5252", fontSize: 12, marginTop: 6 },
  forgotPass: { alignSelf: "flex-end", marginTop: 8 },
  forgotPassText: { color: "#8F90A6", fontSize: 13 },
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
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#8F90A6", fontSize: 14, marginRight: 6 },
  linkText: { color: "#00E5FF", fontSize: 14, fontWeight: "bold" },
});
