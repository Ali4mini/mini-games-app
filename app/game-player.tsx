import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GamePlayerScreen() {
  const router = useRouter();
  // Get params passed from the previous screen
  const { url, title, orientation } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // --- 1. ORIENTATION & STATUS BAR MANAGEMENT ---
  useEffect(() => {
    // Hide Status Bar for immersion
    StatusBar.setHidden(true);

    // Force Orientation based on game type
    const lockOrientation = async () => {
      if (orientation === "landscape") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      } else if (orientation === "portrait") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT,
        );
      }
      // If 'auto', we let the user rotate freely
    };

    lockOrientation();

    // CLEANUP: Reset everything when user leaves the game
    return () => {
      StatusBar.setHidden(false);
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, [orientation]);

  const handleExit = () => {
    // Optional: Show Interstitial Ad here before closing!
    router.back();
  };

  // --- 2. HARDWARE BACK BUTTON HANDLING (Android) ---
  useEffect(() => {
    const onBackPress = () => {
      // Instead of exiting app, go back to Home
      handleExit();
      return true; // Prevent default behavior (exiting the app)
    };

    // Create the subscription
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    // Cleanup: Remove the subscription using .remove()
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* 3. THE WEBVIEW */}
      <WebView
        ref={webViewRef}
        source={{ uri: url as string }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        // Performance & Compatibility Settings
        javaScriptEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true} // Essential for game audio/video
        mediaPlaybackRequiresUserAction={false}
        // UI Tweaks
        scrollEnabled={false} // Disable scrolling page, game handles touches
        bounces={false} // iOS elastic bounce
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // --- CACHING & STORAGE SETTINGS ---
        // 1. Enable DOM Storage (Critical for saving game progress locally)
        domStorageEnabled={true}
        // 2. Enable Caching
        cacheEnabled={true}
        // 3. Android Specific: "LOAD_CACHE_ELSE_NETWORK"
        // This tells WebView: "If you have this file in cache, use it. Don't ask the server."
        // This makes games load instantly on Android.
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        // 4. iOS/Android: Allow standard database storage
        databaseEnabled={true}
        // Safe Area background
        style={{ backgroundColor: "#000" }}
      />

      {/* 4. LOADING OVERLAY */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      )}

      {/* 5. FLOATING CONTROLS (Exit Button) */}
      {/* We create a semi-transparent pill at the top corner */}
      <SafeAreaView style={styles.controlsOverlay} edges={["top", "left"]}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExit}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background for letterboxing
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#121212", // Loading screen background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  controlsOverlay: {
    position: "absolute",
    top: 10,
    left: 10, // Left side is usually safer for landscape games
    zIndex: 20,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
