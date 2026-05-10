import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import API_BASE_URL from '../../constants/api';

const STATUS_CONFIG = {
  pending:  { bg: '#FEF3C7', text: '#D97706', label: 'Pending',      icon: '📤', bar: '#FCD34D' },
  reviewed: { bg: '#DBEAFE', text: '#2563EB', label: 'Being Reviewed', icon: '🔍', bar: '#93C5FD' },
  accepted: { bg: '#D1FAE5', text: '#059669', label: 'Accepted',     icon: '✅', bar: '#6EE7B7' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Not Selected', icon: '❌', bar: '#FCA5A5' },
};

const PROGRESS = { pending: 0.33, reviewed: 0.66, accepted: 1, rejected: 1 };

function Jobstatus() {
  const { user } = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications?userId=${user.id}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const onRefresh = () => { setRefreshing(true); fetchApplications(); };

  const renderItem = ({ item }) => {
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    const progress = PROGRESS[item.status] || 0.33;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/job-details/${item.jobId}`)}
        activeOpacity={0.75}
      >
        {/* Top row */}
        <View style={styles.cardTop}>
          {item.job?.employerLogo ? (
            <Image source={{ uri: item.job.employerLogo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoLetter}>{item.job?.company?.[0] || '?'}</Text>
            </View>
          )}
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={1}>{item.job?.title || 'Job'}</Text>
            <Text style={styles.jobCompany} numberOfLines={1}>{item.job?.company || ''}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={styles.badgeIcon}>{config.icon}</Text>
            <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: config.bar }]} />
        </View>

        {/* Bottom row */}
        <View style={styles.cardBottom}>
          <Text style={styles.dateText}>
            Applied {new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
          {item.job?.location && (
            <Text style={styles.locationText}>📍 {item.job.location}</Text>
          )}
        </View>

        {/* Accepted tip */}
        {item.status === 'accepted' && (
          <View style={styles.acceptedTip}>
            <Text style={styles.acceptedTipText}>
              🎉 Congratulations! Check your email for next steps.
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Applications</Text>
          <Text style={styles.headerSubtitle}>
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {/* Stats row */}
        {applications.length > 0 && (
          <View style={styles.statsRow}>
            {['accepted', 'reviewed', 'pending'].map((s) => {
              const count = applications.filter((a) => a.status === s).length;
              const cfg = STATUS_CONFIG[s];
              if (!count) return null;
              return (
                <View key={s} style={[styles.statChip, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statCount, { color: cfg.text }]}>{count}</Text>
                  <Text style={[styles.statLabel, { color: cfg.text }]}>{cfg.label}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {applications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No applications yet</Text>
          <Text style={styles.emptySubtitle}>
            Browse jobs and apply to track your status here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightWhite },
  header: {
    paddingHorizontal: SIZES.medium,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  statCount: { fontSize: 13, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  listContent: { padding: SIZES.medium, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
    shadowColor: '#312651',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoLetter: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  jobCompany: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    marginLeft: 8,
  },
  badgeIcon: { fontSize: 11 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  progressBg: {
    height: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { fontSize: 12, color: '#aaa' },
  locationText: { fontSize: 12, color: '#aaa' },
  acceptedTip: {
    marginTop: 12,
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    padding: 10,
  },
  acceptedTipText: { fontSize: 13, color: '#065F46', fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
});

export default Jobstatus;
