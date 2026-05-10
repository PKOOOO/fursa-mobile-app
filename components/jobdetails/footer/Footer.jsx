import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { icons, COLORS } from "../../../constants";

const STATUS_CONFIG = {
  pending:  { label: 'Application Sent',  color: '#D97706', bg: '#FEF3C7', icon: '📤' },
  reviewed: { label: 'Being Reviewed',    color: '#2563EB', bg: '#DBEAFE', icon: '🔍' },
  accepted: { label: 'Accepted! 🎉',      color: '#059669', bg: '#D1FAE5', icon: '✅' },
  rejected: { label: 'Not Selected',      color: '#DC2626', bg: '#FEE2E2', icon: '❌' },
};

const Footer = ({ jobId, title, company, applicationStatus }) => {
  const router = useRouter();

  const handleApply = () => {
    router.push({ pathname: `/apply/${jobId}`, params: { title, company } });
  };

  if (applicationStatus === 'accepted') {
    return (
      <View style={styles.container}>
        <View style={styles.acceptedCard}>
          <Text style={styles.acceptedEmoji}>🎉</Text>
          <View style={styles.acceptedText}>
            <Text style={styles.acceptedTitle}>Congratulations!</Text>
            <Text style={styles.acceptedDesc}>
              The employer will reach out via email. Prepare your documents and be ready for an interview.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (applicationStatus && applicationStatus !== 'none') {
    const config = STATUS_CONFIG[applicationStatus] || STATUS_CONFIG.pending;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.likeBtn}>
          <Image source={icons.heartOutline} resizeMode="contain" style={styles.likeBtnImage} />
        </TouchableOpacity>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={styles.statusIcon}>{config.icon}</Text>
          <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}>
        <Image source={icons.heartOutline} resizeMode="contain" style={styles.likeBtnImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={styles.applyBtnText}>Apply for job</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  likeBtn: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  likeBtnImage: {
    width: "40%",
    height: "40%",
    tintColor: "#999",
  },
  applyBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  statusBadge: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    gap: 8,
  },
  statusIcon: { fontSize: 18 },
  statusLabel: { fontSize: 15, fontWeight: "700" },
  acceptedCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#D1FAE5",
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  acceptedEmoji: { fontSize: 24 },
  acceptedText: { flex: 1 },
  acceptedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 2,
  },
  acceptedDesc: {
    fontSize: 12,
    color: "#065F46",
    lineHeight: 17,
  },
});

export default Footer;
