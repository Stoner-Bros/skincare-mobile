import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../../lib/api/endpoints";
type TabType = "about" | "reviews" | "bio";

const { width } = Dimensions.get("window");

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
      setLoading(true);
      const treatmentId = parseInt(id as string);
      console.log("Loading treatment with ID:", treatmentId);

      if (isNaN(treatmentId)) {
        throw new Error("Invalid treatment ID");
      }

      const response = await api.treatments.getTreatment(treatmentId);
      console.log("Treatment API response:", response);

      if (response?.data?.data) {
        // Định dạng lại data theo response API
        const treatmentData = {
          ...response.data.data,
          image: response.data.data.treatmentThumbnailUrl
            ? `https://skincare-api.azurewebsites.net/api/upload/${response.data.data.treatmentThumbnailUrl}`
            : "https://via.placeholder.com/300",
          name: response.data.data.treatmentName,
          rating: 5, // Giá trị mặc định vì API không trả về
          totalReviews: 0,
          totalBookings: 0,
          experience: "Professional",
          certifications: [], // API không trả về nên để mảng rỗng
          reviewStats: {
            total: 0,
            average: 5,
            distribution: [],
          },
        };
        console.log("Formatted treatment data:", treatmentData);
        setTreatment(treatmentData);
      } else {
        throw new Error("Invalid treatment data structure");
      }
    } catch (error: any) {
      console.error("Error loading treatment:", error);
      setTreatment(null);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A83F98" />
        </View>
      </SafeAreaView>
    );
  }

  if (!treatment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Treatment not found</Text>
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
            <Text style={styles.verifiedText}>
              {treatment.isAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{treatment.description}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Duration</Text>
        <Text style={styles.statsValue}>{treatment.duration} minutes</Text>

        <Text style={styles.statsTitle}>Price</Text>
        <Text style={styles.statsValue}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(treatment.price)}
        </Text>

        <Text style={styles.statsTitle}>Service ID</Text>
        <Text style={styles.statsValue}>{treatment.serviceId}</Text>
      </View>
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <Text>No reviews available</Text>
    </View>
  );

  const renderBioTab = () => (
    <View style={styles.tabContent}>
      <Text>No additional information available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A83F98" />
        </View>
      ) : !treatment ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Treatment not found</Text>
        </View>
      ) : (
        <>
          <LinearGradient
            colors={["#A83F98", "#ffffff"]}
            style={styles.headerGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: treatment.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(168, 63, 152, 0.8)"]}
                style={styles.imageGradient}
              />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.mainInfo}>
                <Text style={styles.name}>{treatment.name}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {renderStars(treatment.rating)}
                  </View>
                  <View style={styles.availabilityBadge}>
                    <Ionicons
                      name={
                        treatment.isAvailable
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={treatment.isAvailable ? "#2ecc71" : "#e74c3c"}
                    />
                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color: treatment.isAvailable ? "#2ecc71" : "#e74c3c",
                        },
                      ]}
                    >
                      {treatment.isAvailable ? "Available" : "Not Available"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={24} color="#A83F98" />
                      <Text style={styles.infoLabel}>Duration</Text>
                      <Text style={styles.infoValue}>
                        {treatment.duration} min
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="cash-outline" size={24} color="#A83F98" />
                      <Text style={styles.infoLabel}>Price</Text>
                      <Text style={styles.infoValue}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(treatment.price)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#A83F98"
                    />
                    <Text style={styles.statValue}>
                      {treatment.totalBookings}
                    </Text>
                    <Text style={styles.statLabel}>Bookings</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Ionicons name="star-outline" size={24} color="#A83F98" />
                    <Text style={styles.statValue}>
                      {treatment.totalReviews}
                    </Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                  </View>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>
                    {treatment.description}
                  </Text>
                </View>

                {/* <View style={styles.serviceInfo}>
                  <Text style={styles.sectionTitle}>Service Information</Text>
                  <View style={styles.serviceCard}>
                    <View style={styles.serviceRow}>
                      <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#A83F98"
                      />
                      <Text style={styles.serviceText}>
                        Service ID: {treatment.serviceId}
                      </Text>
                    </View>
                  </View>
                </View> */}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.bookButton,
                !treatment.isAvailable && styles.disabledButton,
              ]}
              onPress={() =>
                treatment.isAvailable &&
                router.push(`/(booking-flow)/new?treatmentId=${id}`)
              }
              disabled={!treatment.isAvailable}
            >
              <LinearGradient
                colors={
                  treatment.isAvailable
                    ? ["#A83F98", "#7B2C8C"]
                    : ["#ccc", "#999"]
                }
                style={styles.gradientButton}
              >
                <Text style={styles.bookButtonText}>
                  {treatment.isAvailable ? "Book Now" : "Not Available"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    height: 60,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  mainInfo: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },
  serviceInfo: {
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceText: {
    fontSize: 15,
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bookButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  statsSection: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
