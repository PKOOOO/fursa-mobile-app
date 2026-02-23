import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import styles from "./popularjobs.style";
import { COLORS, SIZES } from "../../../constants";
import PopularJobCard from "../../common/cards/popular/PopularJobCard";
import API_BASE_URL from "../../../constants/api";

const Popularjobs = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCardPress = (item) => {
    router.push(`/job-details/${item._id}`);
    setSelectedJob(item._id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Jobs</Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong: {error}</Text>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <PopularJobCard
                item={item}
                selectedJob={selectedJob}
                handleCardPress={handleCardPress}
              />
            )}
            keyExtractor={(item) => item._id} // Use _id from your local API response
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default Popularjobs;

// import React, { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import styles from "./popularjobs.style";
// import { COLORS, SIZES } from "../../../constants";
// import { checkImageURL } from "../../../utils/app";

// const Popularjobs = () => {
//   const router = useRouter();
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);

//   // Fetch data from your API endpoint
//   const fetchJobs = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://192.168.0.108:3000/api/jobs");
//       const result = await response.json();
//       setData(result);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const handleCardPress = (item) => {
//     router.push(`/job-details/${item._id}`);
//     setSelectedJob(item._id);
//   };

//   const renderPopularJobCard = ({ item }) => (
//     <TouchableOpacity
//       key={item._id}
//       style={[
//         styles.cardContainer,
//         { flexDirection: "row", alignItems: "center", padding: 10 },
//       ]}
//       onPress={() => handleCardPress(item)}
//     >
//       {/* Employer Logo */}
//       <Image
//         source={{
//           uri: checkImageURL(item?.employer_logo)
//             ? item.employer_logo
//             : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
//         }}
//         resizeMode="contain"
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: 10,
//           marginRight: 10, // Space between image and text
//         }}
//       />

//       {/* Job Content */}
//       <View style={{ flex: 1 }}>
//         <Text style={styles.jobTitle}>{item.title}</Text>
//         <Text style={styles.jobType}>
//           {item.remote ? "Remote" : "On-site"}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Popular Jobs</Text>
//         <TouchableOpacity>
//           <Text style={styles.headerBtn}>Show all</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.cardsContainer}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         ) : error ? (
//           <Text>Something went wrong: {error}</Text>
//         ) : (
//           <FlatList
//             data={data}
//             renderItem={renderPopularJobCard}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={{ columnGap: SIZES.medium }}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Popularjobs;


// import { useState } from "react";
// import { useRouter } from "expo-router";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";

// import styles from "./popularjobs.style";
// import { COLORS, SIZES } from "../../../constants";
// import PopularJobCard from "../../common/cards/popular/PopularJobCard";
// import useFetch from "../../../hook/useFetch";

// const Popularjobs = () => {
//   const router = useRouter();
//   const { data, isLoading, error } = useFetch("search", {
//     query: "React developer",
//     num_pages: "1",
//   });

//   const [selectedJob, setSelectedJob] = useState();

//   const handleCardPress = (item) => {
//     router.push(`/job-details/${item.job_id}`);
//     setSelectedJob(item.job_id);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Popular jobs</Text>
//         <TouchableOpacity>
//           <Text style={styles.headerBtn}>Show all</Text>
//         </TouchableOpacity>
//       </View>

// <View style={styles.cardsContainer}>
//   {isLoading ? (
//     <ActivityIndicator size='large' color={COLORS.primary} />
//   ) : error ? (
//     <Text>Something went wrong</Text>
//   ) : (
//     <FlatList
//       data={data}
//       renderItem={({ item }) => (
//         <PopularJobCard
//           item={item}
//           selectedJob={selectedJob}
//           handleCardPress={handleCardPress}
//         />
//       )}
//       keyExtractor={(item) => item.job_id}
//       contentContainerStyle={{ columnGap: SIZES.medium }}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//     />
//   )}
// </View>
//     </View>
//   );
// };

// export default Popularjobs;
