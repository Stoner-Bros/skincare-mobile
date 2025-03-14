import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { serviceApi } from "../../lib/api/endpoints";

type TabType = "about" | "reviews" | "bio";

export default function TreatmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [treatment, setTreatment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreatment();
  }, [id]);

  const loadTreatment = async () => {
    try {
      const data = await serviceApi.getService(id as string);
      console.log("Treatment data:", data);
      setTreatment(data);
    } catch (error) {
      console.error("Error loading treatment:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>
      </SafeAreaView>
    );
  }

  if (!treatment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text>Treatment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <View style={styles.stars}>{renderStars(treatment.rating)}</View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
            <Text style={styles.verifiedText}>Verified Appointment</Text>
          </View>
        </View>
        <Text style={styles.description}>{treatment.description}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>RATED {treatment.rating} by</Text>
        <Text style={styles.statsValue}>{treatment.totalReviews} Reviews</Text>

        <Text style={styles.statsTitle}>Number of Bookings</Text>
        <Text style={styles.statsValue}>{treatment.totalBookings}</Text>

        <Text style={styles.statsTitle}>Experience</Text>
        <Text style={styles.statsValue}>{treatment.experience}</Text>

        <Text style={styles.statsTitle}>Languages</Text>
        <Text style={styles.statsValue}>{treatment.languages.join(", ")}</Text>

        {treatment.certifications.map((cert: string, index: number) => (
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
          {treatment.reviewStats.total} Reviews
        </Text>
        <Text style={styles.reviewsAverage}>
          {treatment.reviewStats.average} out of 5.0
        </Text>
      </View>

      <View style={styles.distributionContainer}>
        {treatment.reviewStats.distribution.map((item: any, index: number) => (
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
      <Text style={styles.bioText}>{treatment.bio}</Text>
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
        <Image source={{ uri: treatment.image }} style={styles.image} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{treatment.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{treatment.rating}</Text>
          </View>
          <Text style={styles.lastBooked}>
            Last Booked: {treatment.lastBooked}
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
          onPress={() => router.push(`/booking/new?treatmentId=${id}`)}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
