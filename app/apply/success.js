import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants';

const STEPS = [
  { icon: '✅', label: 'Applied', desc: 'Your application has been received.' },
  { icon: '🔍', label: 'Under Review', desc: 'The employer is reviewing applications.' },
  { icon: '📞', label: 'Decision', desc: 'You will be contacted via email if selected.' },
];

export default function ApplySuccess() {
  const { title, company } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Confetti header */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🎉</Text>
        <Text style={styles.heroTitle}>Application Sent!</Text>
        <Text style={styles.heroSub}>
          You've successfully applied for{'\n'}
          <Text style={styles.heroJobTitle}>{title || 'this job'}</Text>
          {company ? <Text style={styles.heroCompany}> at {company}</Text> : null}
        </Text>
      </View>

      {/* Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>What happens next?</Text>
        {STEPS.map((step, i) => (
          <View key={step.label} style={styles.step}>
            <View style={styles.stepLeft}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              {i < STEPS.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>
                {step.label}
              </Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          Keep your phone and email active. Employers usually respond within 3–7 days.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.primaryBtnText}>Track My Application</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.secondaryBtnText}>Browse More Jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: SIZES.medium,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroEmoji: { fontSize: 56, marginBottom: 12 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  heroJobTitle: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  heroCompany: {
    color: '#888',
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 0,
  },
  stepLeft: {
    alignItems: 'center',
    width: 36,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#D1FAE5',
  },
  stepIcon: { fontSize: 16 },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e8e8e8',
    marginVertical: 4,
    minHeight: 20,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
    marginBottom: 2,
  },
  stepLabelActive: {
    color: '#059669',
  },
  stepDesc: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipIcon: { fontSize: 18 },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
});
