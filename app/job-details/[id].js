import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import API_BASE_URL from "../../constants/api";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const { id } = useLocalSearchParams(); // Using useLocalSearchParams to get the job ID
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch job details from the API
  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      const result = await response.json();
      setJob(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobDetails();
    setRefreshing(false);
  }, [id]);

  // Handle tab content
  const displayTabContent = () => {
    switch (activeTab) {
      case "About":
        return (
          <JobAbout info={job?.description ?? "No data provided"} />
        );

      case "Qualifications":
        const quals = job?.qualifications
          ? job.qualifications.split("\n").map((q) => q.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
          : ["No qualifications listed"];
        return (
          <Specifics title="Qualifications" points={quals} />
        );

      case "Responsibilities":
        const resps = job?.responsibilities
          ? job.responsibilities.split("\n").map((r) => r.replace(/^[•\-]\s*/, "").trim()).filter(Boolean)
          : ["No responsibilities listed"];
        return (
          <Specifics title="Responsibilities" points={resps} />
        );

      default:
        return null;
    }
  };

  // Fetch job details on component mount
  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: "",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text style={{ color: COLORS.error, fontSize: 16 }}>
            Something went wrong: {error}
          </Text>
        ) : !job ? (
          <Text>No job details found</Text>
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
            {/* Company Information */}
            <Company
              companyLogo={job?.employerLogo || job?.jobIcon}
              jobTitle={job?.title}
              companyName={job?.company}
              location={job?.location}
            />

            {/* Job Tabs */}
            <JobTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab Content */}
            {displayTabContent()}
          </View>
        )}
      </ScrollView>

      {/* Job Footer */}
      <JobFooter
        jobId={id}
        title={job?.title}
        company={job?.company}
      />
    </SafeAreaView>
  );
};

export default JobDetails;



// import React, { useEffect, useState, useCallback } from "react";
// import { View, Text, ActivityIndicator, ScrollView, SafeAreaView, Image, RefreshControl } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { COLORS, SIZES, icons } from "../../constants"; // Assuming SIZES, COLORS, and icons are already imported

// const tabs = ["About", "Location", "Description"];

// const JobDetails = () => {
//   const { id } = useLocalSearchParams();
//   const [job, setJob] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState(tabs[0]);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch job details from API
//   const fetchJobDetails = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`http://192.168.0.103:3000/api/jobs/${id}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch job details");
//       }
//       const result = await response.json();
//       setJob(result);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchJobDetails();
//     setRefreshing(false);
//   }, [id]);

//   useEffect(() => {
//     if (id) {
//       fetchJobDetails();
//     }
//   }, [id]);

//   // Render content for each active tab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "About":
//         return (
//           <View>
//             <Text style={{ fontSize: 16, color: COLORS.darkGray, marginVertical: SIZES.small }}>
//               {job?.about ?? "No information available"}
//             </Text>
//           </View>
//         );
//       case "Location":
//         return (
//           <View>
//             <Text style={{ fontSize: 16, color: COLORS.darkGray, marginVertical: SIZES.small }}>
//               {job?.location ?? "Location not specified"}
//             </Text>
//           </View>
//         );
//       case "Description":
//         return (
//           <View>
//             <Text style={{ fontSize: 16, color: COLORS.darkGray, marginVertical: SIZES.small }}>
//               {job?.description ?? "No description available"}
//             </Text>
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   if (isLoading) {
//     return <ActivityIndicator size="large" color={COLORS.primary} />;
//   }

//   if (error) {
//     return <Text style={{ color: COLORS.error, fontSize: 16 }}>Something went wrong: {error}</Text>;
//   }

//   if (!job) {
//     return <Text>No job details found</Text>;
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={{ padding: SIZES.medium }}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {/* Job Icon */}
//         {job.jobIcon && (
//           <Image
//             source={{ uri: job.jobIcon }}
//             style={{
//               width: 50,
//               height: 50,
//               borderRadius: 10,
//               marginBottom: SIZES.small,
//             }}
//           />
//         )}

//         {/* Job Title */}
//         <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.primary }}>{job.title}</Text>

//         {/* Tabs Section */}
//         <View style={{ flexDirection: "row", marginVertical: SIZES.medium }}>
//           {tabs.map((tab, index) => (
//             <Text
//               key={index}
//               style={{
//                 fontSize: 16,
//                 fontWeight: activeTab === tab ? "bold" : "normal",
//                 color: activeTab === tab ? COLORS.primary : COLORS.darkGray,
//                 marginRight: SIZES.medium,
//                 paddingBottom: 5,
//                 borderBottomWidth: activeTab === tab ? 2 : 0,
//                 borderBottomColor: COLORS.primary,
//                 textTransform: "capitalize",
//               }}
//               onPress={() => setActiveTab(tab)}
//             >
//               {tab}
//             </Text>
//           ))}
//         </View>

//         {/* Render Content Based on Active Tab */}
//         {renderTabContent()}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default JobDetails;
