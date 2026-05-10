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
import { COLORS, SIZES, icons, SHADOWS } from "../../constants";
import API_BASE_URL from "../../constants/api";
import { checkImageURL } from "../../utils/app";
import { calcHustleScore, loadSkills, scoreLabel } from "../../utils/hustle";

const JOB_TYPES = ["Full-time", "Part-time", "Contractor", "Hustle", "Home"];

const SearchResults = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(id);
  const [skills, setSkills] = useState([]);

  const isJobType = JOB_TYPES.includes(id);

  useEffect(() => {
    loadSkills().then((s) => setSkills(s || []));
  }, []);

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
    if (id) { setSearchTerm(id); fetchJobs(id); }
  }, [id]);

  const handleSearch = () => {
    if (searchTerm.trim()) fetchJobs(searchTerm.trim());
  };

  const renderJob = ({ item }) => {
    const score = scoreLabel(calcHustleScore(skills, item));

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/job-details/${item._id || item.id}`)}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: checkImageURL(item.employerLogo || item.employer_logo)
              ? (item.employerLogo || item.employer_logo)
              : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.jobCompany} numberOfLines={1}>{item.company}</Text>
          <View style={styles.metaRow}>
            {item.location && <Text style={styles.meta}>📍 {item.location}</Text>}
            {item.type && <Text style={styles.meta}>· {item.type}</Text>}
            {item.remote && <Text style={styles.meta}>· Remote</Text>}
          </View>
        </View>
        {score && (
          <View style={[styles.scorePill, { backgroundColor: score.bg }]}>
            <Text style={[styles.scoreText, { color: score.color }]}>⚡ {score.label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Image source={icons.left} resizeMode="contain" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isJobType ? id : "Search Results"}
        </Text>
        {!isLoading && (
          <Text style={styles.headerCount}>{jobs.length} jobs</Text>
        )}
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search jobs..."
            placeholderTextColor="#aaa"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Image source={icons.search} resizeMode="contain" style={styles.searchBtnImage} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong: {error}</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptySub}>Try a different keyword or job type</Text>
            </View>
          }
          renderItem={renderJob}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightWhite },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.medium,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
    shadowColor: '#312651',
  },
  backIcon: { width: 18, height: 18 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: COLORS.primary },
  headerCount: { fontSize: 13, color: '#888' },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  searchInput: { height: 44, fontSize: 14, color: COLORS.primary },
  searchBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.tertiary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnImage: { width: 20, height: 20, tintColor: "#fff" },
  listContent: { paddingHorizontal: SIZES.medium, paddingBottom: 24, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    ...SHADOWS.small,
    shadowColor: '#312651',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  cardInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: "700", color: COLORS.primary, marginBottom: 2 },
  jobCompany: { fontSize: 12, color: "#777", marginBottom: 4 },
  metaRow: { flexDirection: "row", gap: 4 },
  meta: { fontSize: 11, color: "#aaa" },
  scorePill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  scoreText: { fontSize: 11, fontWeight: "700" },
  errorText: { textAlign: "center", marginTop: 40, color: "red", paddingHorizontal: SIZES.medium },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#888' },
});

export default SearchResults;
