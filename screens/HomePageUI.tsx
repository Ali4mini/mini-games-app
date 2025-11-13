import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router"; // The correct way to navigate with Expo Router

// ====================================================================================
// --- 1. TYPE DEFINITIONS ---
// Define the shape of our data for TypeScript
// ====================================================================================
type User = {
  name: string;
  coins: number;
};

type Game = {
  id: string;
  title: string;
  image: string;
};

type GameCardProps = {
  title: string;
  image: string;
};

// ====================================================================================
// --- 2. DUMMY DATA ---
// Replace this with your actual data from an API or state management later
// ====================================================================================
const USER_DATA: User = {
  name: "PlayerOne",
  coins: 1250,
};

const FEATURED_GAMES: Game[] = [
  {
    id: "1",
    title: "Bubble Shooter",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/BubbleShooterHDBig.jpg",
  },
  {
    id: "2",
    title: "Solitaire",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/SolitaireClassicBig.jpg",
  },
  {
    id: "3",
    title: "Moto X3M",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/MotoX3mBig.jpg",
  },
  {
    id: "4",
    title: "8 Ball Pool",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/8BallBillardsClassicBig.jpg",
  },
  {
    id: "5",
    title: "Mahjong",
    image:
      "https://img.cdn.famobi.com/portal/html5games/images/tmp/MahjongConnectBig.jpg",
  },
];

// ====================================================================================
// --- 3. REUSABLE SUB-COMPONENTS ---
// Small components used within the main screen
// ====================================================================================
const GameCard: React.FC<GameCardProps> = ({ title, image }) => (
  // In a real app, this would also be a <Link> to navigate to the game
  <TouchableOpacity style={styles.gameCard}>
    <Image source={{ uri: image }} style={styles.gameImage} />
    <Text style={styles.gameTitle} numberOfLines={1}>
      {title}
    </Text>
  </TouchableOpacity>
);

// ====================================================================================
// --- 4. THE MAIN HOME PAGE UI COMPONENT ---
// This is the primary component for the screen
// ====================================================================================
const HomePageUI: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Header Section --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerWelcome}>Welcome back,</Text>
            <Text style={styles.headerUsername}>{USER_DATA.name}</Text>
          </View>
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="coins" size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{USER_DATA.coins}</Text>
          </View>
        </View>

        {/* --- Hero Banner Section --- */}
        <Link href="/lucky-spin" asChild>
          <TouchableOpacity style={styles.heroBanner}>
            <Image
              source={{ uri: "https://i.ibb.co/L5rR1yN/spin-banner.png" }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Spin the Wheel!</Text>
              <Text style={styles.heroSubtitle}>
                Win daily prizes and coins.
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* --- Quick Actions Section --- */}
        <View style={styles.quickActionsContainer}>
          <Link href="/daily-check" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Feather name="calendar" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>Daily Check-in</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/lucky-spin" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <FontAwesome5 name="compact-disc" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>Lucky Spin</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* --- Featured Games Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Games</Text>
          <FlatList
            data={FEATURED_GAMES}
            renderItem={({ item }) => (
              <GameCard title={item.title} image={item.image} />
            )}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </View>

        {/* --- See All Games Button --- */}
        <Link href="/games-list" asChild>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>Browse All Games</Text>
          </TouchableOpacity>
        </Link>

        {/* --- Refer a Friend CTA Section --- */}
        <Link href="/referral" asChild>
          <TouchableOpacity style={styles.referralContainer}>
            <FontAwesome5 name="user-friends" size={30} color="#1E90FF" />
            <View style={styles.referralText}>
              <Text style={styles.referralTitle}>Refer a Friend!</Text>
              <Text style={styles.referralSubtitle}>
                Earn 500 coins for every friend you invite.
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="#1E90FF" />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
};

// ====================================================================================
// --- 5. STYLESHEET ---
// All the styles for the components above
// ====================================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7", // A light grey background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerWelcome: {
    fontSize: 16,
    color: "#6c757d",
  },
  headerUsername: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#343a40",
  },
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
    height: 180,
    justifyContent: "center",
    elevation: 4, // for Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroTextContainer: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for text readability
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#FFF",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  quickAction: {
    backgroundColor: "#5A67D8",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  quickActionText: {
    color: "#FFF",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343a40",
    marginLeft: 20,
    marginBottom: 15,
  },
  gameCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gameImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  gameTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#495057",
  },
  seeAllButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#E9ECEF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  seeAllButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
  },
  referralContainer: {
    backgroundColor: "#E0F7FF",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#B3E5FC",
  },
  referralText: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056b3",
  },
  referralSubtitle: {
    fontSize: 14,
    color: "#0056b3",
    marginTop: 2,
  },
});

export default HomePageUI;
