import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Platform,
  Text,
} from "react-native";
// Only import WebView for native, or use it carefully
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GamePlayerScreen() {
  const router = useRouter();
  const { url, title, orientation } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const isWeb = Platform.OS === "web";

  useEffect(() => {
    // 1. ORIENTATION & STATUS BAR (Native Only)
    if (!isWeb) {
      StatusBar.setHidden(true);
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
      };
      lockOrientation();
    }

    // CLEANUP
    return () => {
      if (!isWeb) {
        StatusBar.setHidden(false);
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      }
    };
  }, [orientation]);

  const handleExit = () => {
    router.back();
  };

  // 2. BACK HANDLER (Android Only)
  useEffect(() => {
    if (Platform.OS === "android") {
      const onBackPress = () => {
        handleExit();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }
  }, []);

  // 3. Define the actual WebView component based on platform
  const renderGameContent = () => {
    if (isWeb) {
      // WEB: Render a standard iframe
      return (
        <iframe
          src={url as string}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          onLoad={() => setIsLoading(false)}
          allowFullScreen
          // Add allow attributes to ensure game features work in iframe
          allow="autoplay; fullscreen; gyroscope; accelerometer"
        />
      );
    }

    // NATIVE (iOS/Android)
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: url as string }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        databaseEnabled={true}
        style={{ backgroundColor: "#000" }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Render Web Iframe or Native WebView */}
      {renderGameContent()}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      )}

      {/* Controls */}
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
    backgroundColor: "#000",
    // On web, we need to ensure the container takes full viewport height
    ...Platform.select({
      web: {
        height: "100vh",
        overflow: "hidden",
      },
    }),
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  controlsOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 20,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    cursor: "pointer", // Add pointer cursor for web
  },
});
