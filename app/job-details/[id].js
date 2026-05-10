import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import API_BASE_URL from "../../constants/api";
import { calcHustleScore, loadSkills, scoreLabel } from "../../utils/hustle";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [hustleScore, setHustleScore] = useState(null);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
      if (!response.ok) throw new Error("Failed to fetch job details");
      const result = await response.json();
      setJob(result);

      const skills = await loadSkills();
      setHustleScore(calcHustleScore(skills, result));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationStatus = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications?userId=${user.id}&jobId=${id}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setApplicationStatus(data[0].status);
      } else {
        setApplicationStatus('none');
      }
    } catch {
      setApplicationStatus('none');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchJobDetails(), fetchApplicationStatus()]).finally(() =>
      setRefreshing(false)
    );
  }, [id]);

  const displayTabContent = () => {
    switch (activeTab) {
      case "About":
        return <JobAbout info={job?.description ?? "No data provided"} />;
      case "Qualifications": {
        const quals = job?.qualifications
          ? job.qualifications.split("\n").map((q) => q.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
          : ["No qualifications listed"];
        return <Specifics title="Qualifications" points={quals} />;
      }
      case "Responsibilities": {
        const resps = job?.responsibilities
          ? job.responsibilities.split("\n").map((r) => r.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
          : ["No responsibilities listed"];
        return <Specifics title="Responsibilities" points={resps} />;
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
      fetchApplicationStatus();
    }
  }, [id]);

  const score = scoreLabel(hustleScore);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: "",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>Something went wrong: {error}</Text>
        ) : !job ? (
          <Text style={styles.emptyText}>No job details found</Text>
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 120 }}>
            <Company
              companyLogo={job?.employerLogo || job?.jobIcon}
              jobTitle={job?.title}
              companyName={job?.company}
              location={job?.location}
            />

            {/* Hustle Score badge */}
            {score && (
              <View style={[styles.hustleCard, { backgroundColor: score.bg }]}>
                <View style={styles.hustleLeft}>
                  <Text style={styles.hustleEmoji}>⚡</Text>
                  <View>
                    <Text style={[styles.hustleLabel, { color: score.color }]}>
                      {score.label}
                    </Text>
                    <Text style={styles.hustleSub}>
                      {hustleScore}% skill match with this job
                    </Text>
                  </View>
                </View>
                <View style={[styles.hustleCircle, { borderColor: score.color }]}>
                  <Text style={[styles.hustleScore, { color: score.color }]}>
                    {hustleScore}%
                  </Text>
                </View>
              </View>
            )}

            {/* Job meta chips */}
            <View style={styles.metaRow}>
              {job.type && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{job.type}</Text>
                </View>
              )}
              {job.remote !== undefined && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{job.remote ? "Remote" : "On-site"}</Text>
                </View>
              )}
              {job.salary && (
                <View style={[styles.chip, styles.chipAccent]}>
                  <Text style={[styles.chipText, styles.chipAccentText]}>{job.salary}</Text>
                </View>
              )}
            </View>

            <JobTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            {displayTabContent()}
          </View>
        )}
      </ScrollView>

      <JobFooter
        jobId={id}
        title={job?.title}
        company={job?.company}
        applicationStatus={applicationStatus}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorText: { color: 'red', fontSize: 15, padding: SIZES.medium },
  emptyText: { color: '#888', fontSize: 15, padding: SIZES.medium },
  hustleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  hustleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  hustleEmoji: { fontSize: 24 },
  hustleLabel: { fontSize: 15, fontWeight: '700' },
  hustleSub: { fontSize: 12, color: '#666', marginTop: 1 },
  hustleCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  hustleScore: { fontSize: 14, fontWeight: '800' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { fontSize: 12, color: '#555', fontWeight: '600' },
  chipAccent: { backgroundColor: '#EEF2FF' },
  chipAccentText: { color: COLORS.primary },
});

export default JobDetails;
