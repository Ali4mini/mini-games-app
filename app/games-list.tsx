import { View, Text, StyleSheet } from "react-native";
import React from "react";

const GamesListPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Games Page</Text>
      <Text>This is where you will list all the games.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
});

export default GamesListPage;
