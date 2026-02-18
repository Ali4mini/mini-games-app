import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Web Landing Page</Text>
      <Text style={styles.subtitle}>Build something amazing.</Text>

      {/* Link to your existing login page */}
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started / Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0d18",
  },
  title: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "#aaa", marginVertical: 20 },
  button: {
    backgroundColor: "#D500F9",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
