import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { checkImageURL } from "../../../../utils/app.js";
import { calcHustleScore, loadSkills, scoreLabel } from "../../../../utils/hustle.js";
import { COLORS, SIZES, SHADOWS } from "../../../../constants";

const PopularJobCard = ({ item, selectedJob, handleCardPress }) => {
  const isSelected = selectedJob === (item._id || item.job_id);
  const [score, setScore] = useState(null);

  useEffect(() => {
    loadSkills().then((skills) => {
      const s = calcHustleScore(skills, item);
      setScore(scoreLabel(s));
    });
  }, [item]);

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.85}
    >
      {/* Score badge */}
      {score && (
        <View style={[styles.scoreBadge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : score.bg }]}>
          <Text style={[styles.scoreText, { color: isSelected ? '#fff' : score.color }]}>
            ⚡ {score.label}
          </Text>
        </View>
      )}

      {/* Logo + company */}
      <View style={styles.logoRow}>
        <View style={[styles.logoBox, isSelected && styles.logoBoxSelected]}>
          <Image
            source={{
              uri: checkImageURL(item?.employerLogo || item?.employer_logo)
                ? (item.employerLogo || item.employer_logo)
                : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
            }}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text
          style={[styles.company, isSelected && styles.textWhite70]}
          numberOfLines={1}
        >
          {item.company || "Company"}
        </Text>
      </View>

      {/* Title */}
      <Text
        style={[styles.title, isSelected && styles.textWhite]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        <View style={[styles.chip, isSelected && styles.chipSelected]}>
          <Text style={[styles.chipText, isSelected && styles.textWhite70]}>
            {item.type || "Job"}
          </Text>
        </View>
        <View style={[styles.chip, isSelected && styles.chipSelected]}>
          <Text style={[styles.chipText, isSelected && styles.textWhite70]}>
            {item.remote ? "Remote" : "On-site"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginRight: 4,
    ...SHADOWS.medium,
    shadowColor: "#312651",
  },
  cardSelected: {
    backgroundColor: COLORS.primary,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoBoxSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  company: {
    flex: 1,
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chipText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  textWhite: { color: "#fff" },
  textWhite70: { color: "rgba(255,255,255,0.7)" },
});

export default PopularJobCard;
