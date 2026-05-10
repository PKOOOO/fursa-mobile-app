import AsyncStorage from '@react-native-async-storage/async-storage';

export const SKILLS_KEY = 'user_skills';

export const saveSkills = async (skills) => {
  await AsyncStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
};

export const loadSkills = async () => {
  try {
    const raw = await AsyncStorage.getItem(SKILLS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const calcHustleScore = (skills, job) => {
  if (!skills || skills.length === 0) return null;

  const haystack = [
    job?.title || '',
    job?.description || '',
    job?.qualifications || '',
    job?.responsibilities || '',
    job?.type || '',
  ]
    .join(' ')
    .toLowerCase();

  const matched = skills.filter((s) => haystack.includes(s.toLowerCase().trim()));
  const score = Math.round((matched.length / skills.length) * 100);
  return Math.min(score, 100);
};

export const scoreLabel = (score) => {
  if (score === null) return null;
  if (score >= 75) return { label: 'Top Match', color: '#059669', bg: '#D1FAE5' };
  if (score >= 50) return { label: 'Good Match', color: '#2563EB', bg: '#DBEAFE' };
  if (score >= 25) return { label: 'Fair Match', color: '#D97706', bg: '#FEF3C7' };
  return { label: 'Low Match', color: '#9CA3AF', bg: '#F3F4F6' };
};
