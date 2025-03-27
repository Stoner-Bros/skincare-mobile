"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ExpoImage } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import type { Treatment } from "@/lib/types/api";

// Dữ liệu mẫu cho các dịch vụ

export default function NewBooking() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.treatments.getTreatments();
      if (response.data?.items) {
        setTreatments(response.data.items);
      }
    } catch (error: any) {
      setError(error.message || "Failed to load treatments");
      console.error("Error loading treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTreatment = async (treatment: Treatment) => {
    try {
      setSelectedTreatment(treatment);
      // Lưu treatment đã chọn vào AsyncStorage
      await AsyncStorage.setItem(
        "selectedTreatment",
        JSON.stringify({
          treatmentId: treatment.treatmentId,
          name: treatment.treatmentName,
          duration: treatment.duration,
          price: treatment.price,
          imageUrl: treatment.treatmentThumbnailUrl,
          description: treatment.description,
        })
      );
    } catch (error) {
      console.error("Error saving treatment to AsyncStorage:", error);
    }
  };

  const filterTreatments = (category: string) => {
    setSelectedCategory(category);
    // Implement filtering logic here if needed
  };

  const handleContinue = async () => {
    if (selectedTreatment) {
      try {
        // Lưu booking state vào AsyncStorage trước khi chuyển trang
        await AsyncStorage.setItem(
          "bookingState",
          JSON.stringify({
            treatmentId: selectedTreatment.treatmentId,
            treatment: selectedTreatment,
          })
        );
        router.push("/(booking-flow)/specialist");
      } catch (error) {
        console.error("Error saving booking state:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Treatment</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTreatments}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.treatmentsContainer}>
        {treatments.map((treatment) => (
          <TouchableOpacity
            key={treatment.treatmentId}
            style={[
              styles.treatmentCard,
              selectedTreatment?.treatmentId === treatment.treatmentId &&
                styles.selectedCard,
            ]}
            onPress={() => handleSelectTreatment(treatment)}
          >
            <Image
              source={{ uri: treatment.treatmentThumbnailUrl }}
              style={styles.treatmentImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.treatmentInfo}>
              <Text style={styles.treatmentName}>
                {treatment.treatmentName}
              </Text>
              <Text style={styles.treatmentDescription} numberOfLines={2}>
                {treatment.description}
              </Text>
              <View style={styles.treatmentDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {treatment.duration} min
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>${treatment.price}</Text>
                </View>
              </View>
            </View>
            <View style={styles.radioContainer}>
              <View style={styles.radioButton}>
                {selectedTreatment?.treatmentId === treatment.treatmentId && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedTreatment && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedTreatment}
        >
          <Text style={styles.continueButtonText}>
            Continue to Select Specialist
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  categorySection: {
    paddingVertical: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeCategoryChip: {
    backgroundColor: "#2ecc71",
  },
  categoryText: {
    color: "#666",
  },
  activeCategoryText: {
    color: "white",
    fontWeight: "600",
  },
  treatmentsContainer: {
    flex: 1,
    padding: 16,
  },
  treatmentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f1f1",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: "#2ecc71",
    backgroundColor: "#e8f8f0",
  },
  treatmentImage: {
    width: 100,
    height: 100,
  },
  treatmentInfo: {
    flex: 1,
    padding: 12,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  treatmentDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  treatmentDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  radioContainer: {
    justifyContent: "center",
    paddingRight: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2ecc71",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    backgroundColor: "#fff",
  },
  continueButton: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
