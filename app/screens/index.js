import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SIZES } from '../../constants';
import { Nearbyjobs, Popularjobs, Welcome } from '../../components';

const DashboardScreen = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleClick = () => {
        if (searchTerm) {
            router.push(`/search/${searchTerm}`);
        }
    };

    return (

        <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={handleClick}
          />
          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({

    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
});