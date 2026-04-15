import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons } from "../../constants";
import API_BASE_URL from "../../constants/api";
import { checkImageURL } from "../../utils/app";

const JOB_TYPES = ["Full-time", "Part-time", "Contractor", "Hustle", "Home"];

const SearchResults = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(id);

  const isJobType = JOB_TYPES.includes(id);

  const fetchJobs = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const isType = JOB_TYPES.includes(query);
      const param = isType ? `type=${encodeURIComponent(query)}` : `search=${encodeURIComponent(query)}`;
      const response = await fetch(`${API_BASE_URL}/api/jobs?${param}`);
      const result = await response.json();
      setJobs(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchTerm(id);
      fetchJobs(id);
    }
  }, [id]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchJobs(searchTerm.trim());
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Image source={icons.left} resizeMode="contain" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isJobType ? id : "Search Results"}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search jobs..."
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Image source={icons.search} resizeMode="contain" style={styles.searchBtnImage} />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong: {error}</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No jobs found for "{id}"</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/job-details/${item._id}`)}
            >
              <Image
                source={{
                  uri: checkImageURL(item.employer_logo)
                    ? item.employer_logo
                    : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
                }}
                resizeMode="contain"
                style={styles.logo}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.jobCompany} numberOfLines={1}>{item.company}</Text>
                <Text style={styles.jobMeta}>
                  {item.location}
                  {item.type ? ` · ${item.type}` : ""}
                  {item.remote ? " · Remote" : ""}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.medium,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  searchInput: {
    height: 44,
    fontSize: 14,
    color: COLORS.primary,
  },
  searchBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.tertiary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 2,
  },
  jobCompany: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  jobMeta: {
    fontSize: 12,
    color: "#888",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: "red",
    paddingHorizontal: SIZES.medium,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: "#888",
    fontSize: 15,
  },
});

export default SearchResults;
