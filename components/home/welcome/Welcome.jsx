import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from '@clerk/clerk-expo';
import { icons, COLORS, SIZES } from "../../../constants";
import { loadSkills } from "../../../utils/hustle";

const jobTypes = ["Full-time", "Part-time", "Contractor", "Hustle", "Home"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const { user } = useUser();
  const [activeJobType, setActiveJobType] = useState("Full-time");
  const [hasSkills, setHasSkills] = useState(true);

  useEffect(() => {
    loadSkills().then((s) => setHasSkills(s !== null && s.length > 0));
  }, []);

  const firstName = user?.firstName || "there";

  return (
    <View>
      {/* Greeting */}
      <View style={styles.greetRow}>
        <View>
          <Text style={styles.greeting}>👋 Hello, {firstName}</Text>
          <Text style={styles.headline}>Find your perfect Hustle</Text>
        </View>
      </View>

      {/* Hustle Score prompt */}
      {!hasSkills && (
        <TouchableOpacity
          style={styles.scoreBanner}
          onPress={() => router.push('/screens/skills')}
          activeOpacity={0.85}
        >
          <Text style={styles.scoreBannerEmoji}>⚡</Text>
          <View style={styles.scoreBannerText}>
            <Text style={styles.scoreBannerTitle}>Set up your Hustle Score</Text>
            <Text style={styles.scoreBannerSub}>Add skills to see how well jobs match you</Text>
          </View>
          <Text style={styles.scoreBannerArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="What are you looking for?"
            placeholderTextColor="#aaa"
            returnKeyType="search"
            onSubmitEditing={handleClick}
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
          <Image source={icons.search} resizeMode="contain" style={styles.searchBtnImage} />
        </TouchableOpacity>
      </View>

      {/* Type tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeJobType === item && styles.tabActive]}
              onPress={() => {
                setActiveJobType(item);
                router.push(`/search/${item}`);
              }}
            >
              <Text style={[styles.tabText, activeJobType === item && styles.tabTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  headline: {
    fontSize: SIZES.xLarge,
    fontWeight: "800",
    color: COLORS.primary,
  },
  scoreBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  scoreBannerEmoji: { fontSize: 22 },
  scoreBannerText: { flex: 1 },
  scoreBannerTitle: { fontSize: 14, fontWeight: "700", color: "#fff" },
  scoreBannerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 1 },
  scoreBannerArrow: { fontSize: 18, color: "rgba(255,255,255,0.7)" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    height: 50,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    justifyContent: "center",
    height: "100%",
  },
  searchInput: {
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.primary,
  },
  searchBtn: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.tertiary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnImage: {
    width: "45%",
    height: "45%",
    tintColor: "#fff",
  },
  tabsContainer: {
    marginBottom: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  tabTextActive: {
    color: "#fff",
  },
});

export default Welcome;
