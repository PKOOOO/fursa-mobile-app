import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.small / 2,
  },
  btn: (name, activeTab) => ({
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: name === activeTab ? COLORS.primary : "transparent",
    borderRadius: 24,
    borderWidth: name === activeTab ? 0 : 1.5,
    borderColor: name === activeTab ? "transparent" : "#e0e0e0",
  }),
  btnText: (name, activeTab) => ({
    fontSize: 13,
    fontWeight: name === activeTab ? "700" : "500",
    color: name === activeTab ? "#fff" : "#888",
    letterSpacing: 0.2,
  }),
});

export default styles;
