import { View, Text, StyleSheet } from "react-native";
import React from "react";

const ReferralPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer a Friend Page</Text>
      <Text>Your referral code and sharing options will be here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
});

export default ReferralPage;
