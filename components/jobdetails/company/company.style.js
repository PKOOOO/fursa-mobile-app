import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  logoBox: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 18,
    overflow: "hidden",
  },
  logoImage: {
    width: "85%",
    height: "85%",
    borderRadius: 12,
  },
  jobTitleBox: {
    marginTop: 14,
  },
  jobTitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  companyInfoBox: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationImage: {
    width: 13,
    height: 13,
    tintColor: "#999",
  },
  locationName: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
});

export default styles;
