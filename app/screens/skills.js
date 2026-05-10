import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants';
import { saveSkills, loadSkills } from '../../utils/hustle';

const SUGGESTED = [
  'Communication', 'Customer Service', 'Driving', 'Sales', 'Excel',
  'Data Entry', 'Teaching', 'Cooking', 'Security', 'Cleaning',
  'Accounting', 'Programming', 'Design', 'Marketing', 'Tailoring',
  'Plumbing', 'Electrical', 'Welding', 'Carpentry', 'Nursing',
];

export default function SkillsScreen() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadSkills().then((saved) => { if (saved) setSkills(saved); });
  }, []);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) return;
    setSkills((prev) => [...prev, trimmed]);
    setInput('');
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (skills.length === 0) {
      Alert.alert('Add at least one skill', 'Your Hustle Score needs at least one skill to work.');
      return;
    }
    await saveSkills(skills);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⚡</Text>
          <Text style={styles.heroTitle}>Your Hustle Score</Text>
          <Text style={styles.heroSub}>
            Add your skills and we'll show you how well each job matches your profile.
          </Text>
        </View>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a skill..."
            placeholderTextColor="#aaa"
            onSubmitEditing={() => addSkill(input)}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={() => addSkill(input)}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Selected skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your skills ({skills.length})</Text>
            <View style={styles.tagsRow}>
              {skills.map((s) => (
                <TouchableOpacity key={s} style={styles.tagSelected} onPress={() => removeSkill(s)}>
                  <Text style={styles.tagSelectedText}>{s}</Text>
                  <Text style={styles.tagRemove}> ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick add</Text>
          <View style={styles.tagsRow}>
            {SUGGESTED.filter((s) => !skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())).map((s) => (
              <TouchableOpacity key={s} style={styles.tag} onPress={() => addSkill(s)}>
                <Text style={styles.tagText}>+ {s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save My Skills</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightWhite },
  scroll: { padding: SIZES.medium, paddingBottom: 100 },
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 8,
  },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.primary,
  },
  addBtn: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tagText: { fontSize: 13, color: '#555' },
  tagSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tagSelectedText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  tagRemove: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: COLORS.lightWhite,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
