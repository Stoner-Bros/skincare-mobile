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

      const response = await api.treatments.getTreatments();

      // Kiểm tra cấu trúc response và xử lý phù hợp
      if (response && response.data) {
        const treatmentsData = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];

        setTreatments(treatmentsData);
      } else {
        // Nếu không có data hoặc cấu trúc không đúng
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

  if (loading) {
    return (
      <View style={[styles.section, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || treatments.length === 0) {
    return (
      <View style={[styles.section, styles.errorContainer]}>
        <Text style={styles.sectionTitle}>Popular Treatments</Text>
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Treatments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {treatments.map((treatment) => (
          <Pressable
            key={treatment.id}
            style={styles.treatmentCard}
            onPress={() => router.push(`/treatment/${treatment.id}`)}
          >
            <Image
              source={{ uri: treatment.image }}
              style={styles.treatmentImage}
            />
            <View style={styles.treatmentInfo}>
              <Text style={styles.treatmentName}>{treatment.name}</Text>
              <View style={styles.treatmentDetails}>
                <Text style={styles.duration}>
                  <Ionicons name="time-outline" size={14} color="#666" />{" "}
                  {treatment.duration} min
                </Text>
                <Text style={styles.price}>${treatment.price}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  treatmentCard: {
    width: 250,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  treatmentImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  treatmentInfo: {
    padding: 12,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  treatmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
});
