import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

import styles from "./footer.style";
import { icons } from "../../../constants";

const Footer = ({ jobId, title, company }) => {
  const router = useRouter();

  const handleApply = () => {
    router.push({
      pathname: `/apply/${jobId}`,
      params: { title, company },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode='contain'
          style={styles.likeBtnImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={styles.applyBtnText}>Apply for job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
