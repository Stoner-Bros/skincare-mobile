import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import type { SkinTherapistResponse, Treatment } from "@/lib/types/api";

export default function SpecialistSelection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialists, setSpecialists] = useState<SkinTherapistResponse[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<SkinTherapistResponse | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load selected treatment from AsyncStorage
      const treatmentData = await AsyncStorage.getItem("selectedTreatment");
      if (treatmentData) {
        setSelectedTreatment(JSON.parse(treatmentData));
      }
      await loadSpecialists();
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadSpecialists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.specialists.getTherapists();

      // Kiểm tra và xử lý dữ liệu như trong Specialists.tsx
      if (!response || !response.data || !response.data.data) {
        setError("Không có dữ liệu chuyên gia");
        setSpecialists([]);
        return;
      }

      const apiData = response.data.data;
      if (!apiData.items || apiData.items.length === 0) {
        setSpecialists([]);
        return;
      }

      // Format specialist data
      const formattedSpecialists = apiData.items.map(
        (item: SkinTherapistResponse) => ({
          ...item,
          account: {
            ...item.account,
            accountInfo: {
              ...item.account.accountInfo,
              avatar: item.account.accountInfo.avatar
                ? item.account.accountInfo.avatar.startsWith("http")
                  ? item.account.accountInfo.avatar
                  : `https://skincare-api.azurewebsites.net/api/upload/${item.account.accountInfo.avatar}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.account.accountInfo.fullName || "Specialist"
                  )}&background=random&color=fff&size=256`,
            },
          },
        })
      );

      setSpecialists(formattedSpecialists);
    } catch (error: any) {
      setError(error.message || "Failed to load specialists");
      console.error("Error loading specialists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSpecialist = async (specialist: SkinTherapistResponse) => {
    try {
      setSelectedSpecialist(specialist);
      // Save selected specialist to AsyncStorage
      await AsyncStorage.setItem(
        "selectedSpecialist",
        JSON.stringify({
          id: specialist.accountId,
          name: specialist.account.accountInfo.fullName,
          specialization: specialist.specialization,
          experience: specialist.experience,
          avatar: specialist.account.accountInfo.avatar,
        })
      );

      // Update booking state in AsyncStorage
      const bookingState = await AsyncStorage.getItem("bookingState");
      if (bookingState) {
        const updatedState = {
          ...JSON.parse(bookingState),
          specialistId: specialist.accountId,
          specialist: specialist,
        };
        await AsyncStorage.setItem(
          "bookingState",
          JSON.stringify(updatedState)
        );
      }
    } catch (error) {
      console.error("Error saving specialist selection:", error);
    }
  };

  const filterSpecialists = (filter: string) => {
    setActiveFilter(filter);
    // Implement filtering logic based on specialties if needed
  };

  const handleContinue = () => {
    if (selectedSpecialist) {
      router.push("/(booking-flow)/date-time");
    }
  };

  const handleSkip = async () => {
    try {
      // Clear any previously selected specialist
      await AsyncStorage.removeItem("selectedSpecialist");

      // Update booking state without specialist
      const bookingState = await AsyncStorage.getItem("bookingState");
      if (bookingState) {
        const updatedState = {
          ...JSON.parse(bookingState),
          specialistId: null,
          specialist: null,
        };
        await AsyncStorage.setItem(
          "bookingState",
          JSON.stringify(updatedState)
        );
      }

      // Navigate to date-time screen
      router.push("/(booking-flow)/date-time");
    } catch (error) {
      console.error("Error handling skip:", error);
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
        <Text style={styles.title}>Select Specialist</Text>
      </View>

      {selectedTreatment && (
        <View style={styles.selectedTreatmentContainer}>
          <Text style={styles.selectedTreatmentTitle}>Selected Treatment:</Text>
          <Text style={styles.selectedTreatmentName}>
            {selectedTreatment.treatmentName}
          </Text>
        </View>
      )}

      <View style={styles.skipContainer}>
        <Text style={styles.skipText}>
          You can skip selecting a specialist. Our staff will assign one for
          you.
        </Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Specialist Selection</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadSpecialists}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {specialists.length === 0 && !loading && !error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có chuyên gia nào</Text>
        </View>
      ) : (
        <ScrollView style={styles.specialistsContainer}>
          {specialists.map((specialist) => (
            <TouchableOpacity
              key={specialist.accountId}
              style={[
                styles.specialistCard,
                selectedSpecialist?.accountId === specialist.accountId &&
                  styles.selectedCard,
              ]}
              onPress={() => handleSelectSpecialist(specialist)}
            >
              <Image
                source={{ uri: specialist.account.accountInfo.avatar }}
                style={styles.specialistImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.specialistInfo}>
                <View style={styles.specialistHeader}>
                  <Text style={styles.specialistName}>
                    {specialist.account.accountInfo.fullName}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{specialist.rating}</Text>
                  </View>
                </View>

                <Text style={styles.specialistRole}>
                  {specialist.specialization}
                </Text>

                <View style={styles.experienceContainer}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.experienceText}>
                    {specialist.experience} experience
                  </Text>
                </View>

                {specialist.isAvailable ? (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Có sẵn</Text>
                  </View>
                ) : (
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableText}>Không có sẵn</Text>
                  </View>
                )}

                {specialist.introduction && (
                  <Text style={styles.introduction} numberOfLines={2}>
                    {specialist.introduction}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSpecialist && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedSpecialist}
        >
          <Text style={styles.continueButtonText}>
            Continue with Selected Specialist
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
  filterSection: {
    paddingVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeFilterChip: {
    backgroundColor: "#2ecc71",
  },
  filterText: {
    color: "#666",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "600",
  },
  specialistsContainer: {
    flex: 1,
    padding: 16,
  },
  specialistCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f1f1",
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
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  specialistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  specialistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  specialistName: {
    fontSize: 18,
    fontWeight: "600",
  },
  specialistRole: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontWeight: "600",
  },
  experienceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  experienceText: {
    marginLeft: 4,
    color: "#666",
  },
  selectedTreatmentContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  selectedTreatmentTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  selectedTreatmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  introduction: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  availableText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  unavailableBadge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  unavailableText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  skipContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    alignItems: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
