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
  headText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  contentBox: {
    marginTop: 0,
  },
  contextText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: "#4a4a4a",
    fontFamily: FONT.regular,
    letterSpacing: 0.1,
  },
});

export default styles;
