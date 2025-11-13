import { View, Text, StyleSheet } from "react-native";
import React from "react";

const DailyCheckPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Check-in Page</Text>
      <Text>Your daily rewards calendar will go here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
});

export default DailyCheckPage;
