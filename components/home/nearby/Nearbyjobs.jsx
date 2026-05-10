import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { checkImageURL } from "../../../utils/app.js";
import { calcHustleScore, loadSkills, scoreLabel } from "../../../utils/hustle.js";
import { COLORS, SIZES, SHADOWS } from "../../../constants";
import API_BASE_URL from "../../../constants/api";

const JobCard = ({ job, skills }) => {
  const router = useRouter();
  const score = scoreLabel(calcHustleScore(skills, job));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/job-details/${job._id || job.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: checkImageURL(job?.employerLogo || job?.employer_logo)
            ? (job.employerLogo || job.employer_logo)
            : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
        }}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
        <View style={styles.metaRow}>
          {job.location && <Text style={styles.meta}>📍 {job.location}</Text>}
          {job.type && <Text style={styles.meta}>· {job.type}</Text>}
        </View>
      </View>
      {score && (
        <View style={[styles.scorePill, { backgroundColor: score.bg }]}>
          <Text style={[styles.scoreText, { color: score.color }]}>{score.label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Nearbyjobs = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadSkills().then((s) => setSkills(s || []));
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/jobs`)
      .then((r) => r.json())
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Jobs</Text>
        <Text style={styles.headerCount}>{data.length} listings</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>Something went wrong</Text>
      ) : data.length === 0 ? (
        <Text style={styles.emptyText}>No jobs available right now</Text>
      ) : (
        data.map((job) => (
          <JobCard key={job._id || job.id} job={job} skills={skills} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  headerCount: {
    fontSize: 13,
    color: "#888",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    ...SHADOWS.small,
    shadowColor: "#312651",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  metaRow: { flexDirection: "row", gap: 4 },
  meta: { fontSize: 11, color: "#aaa" },
  scorePill: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  scoreText: { fontSize: 11, fontWeight: "700" },
  errorText: { color: "red", textAlign: "center", marginTop: 12 },
  emptyText: { color: "#888", textAlign: "center", marginTop: 12 },
});

export default Nearbyjobs;
