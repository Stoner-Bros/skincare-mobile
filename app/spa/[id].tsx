import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const spaData = {
  id: 1,
  name: "Luxury Spa & Wellness",
  image:
    "https://img.freepik.com/free-photo/beautiful-woman-having-facial-treatment-spa_23-2148857541.jpg",
  description: "Trải nghiệm dịch vụ chăm sóc da cao cấp và thư giãn tuyệt vời.",
  rating: 4.8,
  totalReviews: 128,
  services: [
    {
      id: 1,
      name: "Facial Treatment",
      price: "500.000",
      duration: "60 min",
      image:
        "https://img.freepik.com/free-photo/beautiful-woman-getting-facial-treatment_23-2148857530.jpg",
    },
    {
      id: 2,
      name: "Body Massage",
      price: "800.000",
      duration: "90 min",
      image:
        "https://img.freepik.com/free-photo/woman-getting-massage-spa_23-2148857544.jpg",
    },
    {
      id: 3,
      name: "Aromatherapy",
      price: "600.000",
      duration: "45 min",
      image:
        "https://img.freepik.com/free-photo/side-view-woman-getting-face-treatment_23-2148857548.jpg",
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Anna",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      date: "2 ngày trước",
      comment: "Dịch vụ rất tốt, nhân viên thân thiện!",
    },
    {
      id: 2,
      user: "John",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4,
      date: "1 tuần trước",
      comment: "Không gian đẹp, thư giãn tuyệt vời.",
    },
  ],
};

const SpaDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const renderRatingStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: spaData.image }} style={styles.coverImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{spaData.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderRatingStars(Math.floor(spaData.rating))}
              </View>
              <Text style={styles.ratingText}>
                {spaData.rating} ({spaData.totalReviews} đánh giá)
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{spaData.description}</Text>

        {/* <Text style={styles.sectionTitle}>Đánh giá khách hàng</Text>
        {spaData.reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.avatar} />
              <View style={styles.reviewInfo}>
                <Text style={styles.userName}>{review.user}</Text>
                <View style={styles.stars}>
                  {renderRatingStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))} */}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push("/(booking-flow)/new")}
        >
          <LinearGradient
            colors={["#A83F98", "#7B2C8C"]}
            style={styles.gradientButton}
          >
            <Text style={styles.bookButtonText}>Đặt Lịch Ngay</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 300,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 20,
  },
  headerInfo: {
    marginBottom: Platform.OS === "ios" ? 40 : 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  servicesContainer: {
    marginBottom: 24,
  },
  serviceCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: 150,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A83F98",
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bookButton: {
    marginTop: 24,
    marginBottom: Platform.OS === "ios" ? 40 : 20,
  },
  gradientButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SpaDetail;
