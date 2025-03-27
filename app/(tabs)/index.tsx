import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import Specialists from "@/components/home/Specialists";
import PopularTreatments from "@/components/home/Treaments";
import Services from "@/components/home/Services";
import ChatSupportButton from "@/components/common/ChatSupportButton";
import SpaDetail from "../spa/[id]";

const { width } = Dimensions.get("window");

const bannerData = [
  {
    id: 1,
    image:
      "https://img.freepik.com/free-photo/beautiful-woman-getting-treatment-spa-salon_1303-26773.jpg",
    title: "Chăm sóc da cao cấp",
    description: "Trải nghiệm dịch vụ spa đẳng cấp",
  },
  {
    id: 2,
    image:
      "https://img.freepik.com/free-photo/woman-getting-treatment-spa-salon_23-2148880001.jpg",
    title: "Điều trị chuyên sâu",
    description: "Công nghệ hiện đại, chuyên gia hàng đầu",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/free-photo/young-woman-enjoying-facial-massage-spa-salon_1303-26785.jpg",
    title: "Liệu trình tự nhiên",
    description: "An toàn và hiệu quả cho làn da của bạn",
  },
];

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderBannerItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
    });

    return (
      <View style={styles.bannerItemContainer}>
        <Animated.View style={[styles.bannerItem, { transform: [{ scale }] }]}>
          <Image source={{ uri: item.image }} style={styles.bannerImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.bannerGradient}
          >
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerDescription}>{item.description}</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {bannerData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor:
                    currentIndex === index ? "#A83F98" : "#D8BFD8",
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Banner Carousel */}
          <View style={styles.bannerContainer}>
            <Animated.FlatList
              data={bannerData}
              renderItem={renderBannerItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              onMomentumScrollEnd={(event) => {
                setCurrentIndex(
                  Math.round(event.nativeEvent.contentOffset.x / width)
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            />
            {renderDots()}
          </View>
          <SpaDetail />
          {/* Search Bar with Gradient Background */}
          {/* <LinearGradient
            colors={["#f6e7ff", "#ffffff"]}
            style={styles.searchContainer}
          >
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </LinearGradient> */}

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Popular Treatments Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TouchableOpacity></TouchableOpacity>
              </View>
              <PopularTreatments />
            </View>

            {/* Services Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TouchableOpacity></TouchableOpacity>
              </View>
              <Services limit={4} />
            </View>

            {/* Specialists Section */}
            <View style={[styles.section, styles.specialistsSection]}>
              <View style={styles.sectionHeader}>
                <TouchableOpacity></TouchableOpacity>
              </View>
              <Specialists />
            </View>

            {/* Bottom Padding for Tab Bar */}

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
      <ChatSupportButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    height: 250,
    marginBottom: 16,
  },
  bannerItemContainer: {
    width: width,
    height: 250,
  },
  bannerItem: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    padding: 16,
    justifyContent: "flex-end",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  searchContainer: {
    padding: 16,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    color: "#A83F98",
    fontWeight: "600",
  },
  specialistsSection: {
    marginBottom: 100,
  },
  bottomPadding: {
    height: 80,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
  },
  treatmentCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  treatmentImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  treatmentInfo: {
    padding: 12,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  treatmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  treatmentDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  treatmentPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A83F98",
  },
  availabilityBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  specialistCard: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  specialistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  specialistRole: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default App;
