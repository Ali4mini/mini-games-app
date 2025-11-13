import { View, Text, StyleSheet } from "react-native";
import React from "react";

const LuckySpinPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lucky Spin Page</Text>
      <Text>The lucky spin wheel will be here!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
});

export default LuckySpinPage;
