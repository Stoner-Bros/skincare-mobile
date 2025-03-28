import React, { useState, useRef, useEffect } from "react";
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
import { api } from "@/lib/api/endpoints";
import { Feedback } from "@/lib/types/api";

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
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const response = await api.feedback.getFeedbacks(1, 4);
      setFeedbacks(response.data.items);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    }
  };

  const renderBannerItem = ({ item, index }: { item: any; index: number }) => {
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
      <LinearGradient
        colors={["#A83F98", "#ffffff"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/LuxSpa.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>LuxSpa</Text>
            </View>
          </View>
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

              {/* Feedbacks Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Đánh giá khách hàng</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.feedbacksContainer}
                >
                  {feedbacks.map((feedback) => (
                    <View key={feedback.feedbackId} style={styles.feedbackCard}>
                      <LinearGradient
                        colors={["#f8f2f7", "#ffffff"]}
                        style={styles.feedbackGradient}
                      >
                        <View style={styles.feedbackHeader}>
                          <View style={styles.userInfo}>
                            <View style={styles.avatarContainer}>
                              <Text style={styles.avatarText}>
                                {feedback.feedbackBy.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.userName}>
                                {feedback.feedbackBy}
                              </Text>
                              <Text style={styles.feedbackDate}>
                                {new Date(
                                  feedback.createdAt
                                ).toLocaleDateString("vi-VN")}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.ratingContainer}>
                            {[...Array(5)].map((_, index) => (
                              <Ionicons
                                key={index}
                                name={
                                  index < feedback.rating
                                    ? "star"
                                    : "star-outline"
                                }
                                size={16}
                                color="#FFD700"
                              />
                            ))}
                          </View>
                        </View>

                        <Text style={styles.feedbackComment}>
                          {feedback.comment}
                        </Text>

                        {feedback.feedbackReplies.length > 0 && (
                          <View style={styles.replyContainer}>
                            <View style={styles.replyHeader}>
                              <Ionicons
                                name="chatbubble-outline"
                                size={14}
                                color="#666"
                              />
                              <Text style={styles.replyStaffName}>
                                {feedback.feedbackReplies[0].staffName}
                              </Text>
                            </View>
                            <Text style={styles.replyText}>
                              {feedback.feedbackReplies[0].reply}
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Promotions Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Ưu đãi đặc biệt</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.promotionCard}>
                  <LinearGradient
                    colors={["#A83F98", "#7B2C8C"]}
                    style={styles.promotionGradient}
                  >
                    <View style={styles.promotionContent}>
                      <Text style={styles.promotionTitle}>
                        Giảm 20% cho lần đầu đặt lịch
                      </Text>
                      <Text style={styles.promotionDesc}>
                        Áp dụng cho tất cả dịch vụ
                      </Text>
                      <TouchableOpacity style={styles.promotionButton}>
                        <Text style={styles.promotionButtonText}>Đặt ngay</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Bottom Padding for Tab Bar */}
              <View style={styles.bottomPadding} />
            </View>
          </ScrollView>
        </View>
        <ChatSupportButton />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bannerContainer: {
    height: 280,
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  bannerItemContainer: {
    width: width,
    height: 280,
    paddingHorizontal: 16,
  },
  bannerItem: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    height: "60%",
    padding: 20,
    justifyContent: "flex-end",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerTitle: {
    fontSize: 28,
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
    bottom: 32,
    left: 0,
    right: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  treatmentCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  treatmentImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  treatmentInfo: {
    padding: 16,
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
    top: 12,
    right: 12,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  availabilityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  specialistCard: {
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialistAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  specialistName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  specialistRole: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  feedbacksContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feedbackCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackGradient: {
    padding: 16,
    borderRadius: 20,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A83F98",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  feedbackDate: {
    fontSize: 12,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  replyContainer: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  replyStaffName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginLeft: 6,
  },
  replyText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  promotionCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  promotionGradient: {
    padding: 20,
  },
  promotionContent: {
    alignItems: "center",
  },
  promotionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  promotionDesc: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 16,
  },
  promotionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promotionButtonText: {
    color: "#A83F98",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
    height: 60,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientBackground: {
    flex: 1,
  },
});

export default App;
