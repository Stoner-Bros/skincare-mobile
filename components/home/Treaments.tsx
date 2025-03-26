import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Treatment } from "../../lib/types/api";
import { api } from "../../lib/api/endpoints";

export default function PopularTreatments() {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      // console.log("Fetching treatments...");

      const response = await api.treatments.getTreatments(1, 10);
      // console.log("Treatments response:", response);

      if (response?.data?.items) {
        const formattedTreatments = response.data.items.map(
          (treatment: Treatment) => ({
            ...treatment,
            treatmentThumbnailUrl: treatment.treatmentThumbnailUrl
              ? `https://skincare-api.azurewebsites.net/api/upload/${treatment.treatmentThumbnailUrl}`
              : "https://via.placeholder.com/300",
          })
        );
        // console.log("Formatted treatments:", formattedTreatments);
        setTreatments(formattedTreatments);
      } else {
        console.log("No treatments found in response");
        setTreatments([]);
        setError("No treatments found");
      }
    } catch (error) {
      console.error("Error loading treatments:", error);
      setError("Failed to load treatments");
      setTreatments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (error || treatments.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.title}>Popular Treatments</Text>
        <Text style={styles.errorText}>
          {error || "No treatments available"}
        </Text>
        <Pressable style={styles.retryButton} onPress={loadTreatments}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Treatments</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {treatments.map((treatment) => {
          // console.log(
          //   "Rendering treatment:",
          //   treatment.treatmentId,
          //   treatment.treatmentThumbnailUrl
          // );
          return (
            <Pressable
              key={treatment.treatmentId}
              style={styles.card}
              onPress={() => {
                // console.log("Navigating to treatment:", treatment.treatmentId);
                router.push({
                  pathname: "/treatment/[id]",
                  params: {
                    id: treatment.treatmentId,
                    serviceId: treatment.serviceId,
                    name: treatment.treatmentName,
                    image: treatment.treatmentThumbnailUrl,
                    duration: treatment.duration,
                    price: treatment.price,
                    description: treatment.description,
                    isAvailable: treatment.isAvailable.toString(),
                  },
                });
              }}
            >
              <Image
                source={{
                  uri: treatment.treatmentThumbnailUrl,
                  headers: {
                    Accept: "image/*",
                  },
                }}
                style={styles.image}
                onError={(e) => {
                  // console.log(
                  //   "Image loading error for treatment",
                  //   treatment.treatmentId,
                  //   ":",
                  //   e.nativeEvent.error
                  // );
                }}
                onLoad={() => {
                  // console.log(
                  //   "Image loaded successfully for treatment",
                  //   treatment.treatmentId
                  // );
                }}
              />
              <View style={styles.cardContent}>
                <Text style={styles.name} numberOfLines={1}>
                  {treatment.treatmentName}
                </Text>
                <View style={styles.details}>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.duration}>
                      {treatment.duration} min
                    </Text>
                  </View>
                  <Text style={styles.price}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(treatment.price)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.availableTag,
                    !treatment.isAvailable && styles.unavailableTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.availableText,
                      !treatment.isAvailable && styles.unavailableText,
                    ]}
                  >
                    {treatment.isAvailable ? "Available" : "Unavailable"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  scrollContent: {
    paddingRight: 16,
  },
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  duration: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  availableTag: {
    backgroundColor: "#e8f8f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  availableText: {
    color: "#2ecc71",
    fontSize: 12,
    fontWeight: "500",
  },
  unavailableTag: {
    backgroundColor: "#ffe5e5",
  },
  unavailableText: {
    color: "#ff3b30",
  },
});
