import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "about" | "reviews" | "bio";

const specialist = {
  id: 1,
  name: "Jazy Dewo",
  image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ipvuot02jMdPs4tqEeExcc03Lqjw79.png",
  rating: 4.88,
  lastBooked: "Today",
  description:
    "The strong pressure of this treatment is great for fitness and sports while managing muscle tissues and speeding up recovery. Say farewell to that soreness after a workout. The session will end with a gradual increase in pressure.",
  totalReviews: 1250,
  totalBookings: 1839,
  experience: "5 Years",
  languages: ["English", "PL"],
  certifications: ["Fully Insured and Certified"],
  reviewStats: {
    total: 1250,
    average: 4.88,
    distribution: [
      { stars: 5, count: 955, percentage: "76%" },
      { stars: 4, count: 200, percentage: "38%" },
      { stars: 3, count: 25, percentage: "10%" },
      { stars: 2, count: 25, percentage: "10%" },
      { stars: 1, count: 10, percentage: "5%" },
    ],
  },
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut urna enim ac pretium ornare. Aenean sagittis libero vitae metus cursus placidium. Ut eget imperdiet lacus, nec pretium justo. Etiam ac nunc tellus. Pellentesque sed accumsan ex. Aliquam dignissim imperdiet est, ut faucibus quam eleifend nec. Aliquam blandit ariet mi vitae blandit. Morbi sodales mauris nec placerat. Sed quis quam.",
};

export default function SpecialistDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("about");

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(rating) ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <View style={styles.stars}>{renderStars(specialist.rating)}</View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
            <Text style={styles.verifiedText}>Verified Appointment</Text>
          </View>
        </View>
        <Text style={styles.description}>{specialist.description}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>RATED {specialist.rating} by</Text>
        <Text style={styles.statsValue}>{specialist.totalReviews} Reviews</Text>

        <Text style={styles.statsTitle}>Number of Bookings</Text>
        <Text style={styles.statsValue}>{specialist.totalBookings}</Text>

        <Text style={styles.statsTitle}>Experience</Text>
        <Text style={styles.statsValue}>{specialist.experience}</Text>

        <Text style={styles.statsTitle}>Languages</Text>
        <Text style={styles.statsValue}>{specialist.languages.join(", ")}</Text>

        {specialist.certifications.map((cert, index) => (
          <View key={index} style={styles.certificationItem}>
            <Ionicons name="shield-checkmark" size={20} color="#2ecc71" />
            <Text style={styles.certificationText}>{cert}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsCount}>
          {specialist.reviewStats.total} Reviews
        </Text>
        <Text style={styles.reviewsAverage}>
          {specialist.reviewStats.average} out of 5.0
        </Text>
      </View>

      <View style={styles.distributionContainer}>
        {specialist.reviewStats.distribution.map((item, index) => (
          <View key={index} style={styles.distributionRow}>
            <View style={styles.stars}>{renderStars(item.stars)}</View>
            <View style={styles.distributionBar}>
              <View
                style={[styles.distributionFill, { width: item.percentage }]}
              />
            </View>
            <Text style={styles.distributionCount}>{item.count}</Text>
            <Text style={styles.distributionPercentage}>
              ({item.percentage})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBioTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.bioText}>{specialist.bio}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: specialist.image }} style={styles.image} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{specialist.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{specialist.rating}</Text>
          </View>
          <Text style={styles.lastBooked}>
            Last Booked: {specialist.lastBooked}
          </Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.activeTabText,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "bio" && styles.activeTab]}
            onPress={() => setActiveTab("bio")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "bio" && styles.activeTabText,
              ]}
            >
              BIO
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" && renderAboutTab()}
        {activeTab === "reviews" && renderReviewsTab()}
        {activeTab === "bio" && renderBioTab()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push(`/booking/new?specialistId=${id}`)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  profileInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  lastBooked: {
    fontSize: 14,
    color: "#666",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2ecc71",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#2ecc71",
    fontWeight: "500",
  },
  tabContent: {
    padding: 16,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: "#2ecc71",
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  statsSection: {
    gap: 12,
  },
  statsTitle: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  statsValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  certificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  certificationText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  reviewsHeader: {
    marginBottom: 16,
  },
  reviewsCount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewsAverage: {
    fontSize: 14,
    color: "#666",
  },
  distributionContainer: {
    gap: 12,
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: "hidden",
  },
  distributionFill: {
    height: "100%",
    backgroundColor: "#2ecc71",
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 14,
    color: "#333",
    width: 40,
    textAlign: "right",
  },
  distributionPercentage: {
    fontSize: 14,
    color: "#666",
    width: 50,
    textAlign: "right",
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  bookButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
