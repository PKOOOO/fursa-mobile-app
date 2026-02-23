import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.medium,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  pointsContainer: {
    gap: 0,
  },
  pointWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
    opacity: 0.5,
  },
  pointText: {
    fontSize: 14.5,
    lineHeight: 20,
    color: "#4a4a4a",
    fontFamily: FONT.regular,
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.1,
  },
});

export default styles;
