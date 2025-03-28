import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { api } from "../../lib/api/endpoints";
import type { Specialist } from "../../lib/types/api";

export default function SpecialistPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<SpecialistUI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecialist();
  }, [id]);

  const loadSpecialist = async () => {
    try {
      const response = await api.specialists.getTherapist(Number(id));

      // Kiểm tra và lấy data từ response
      if (response?.data?.data) {
        const therapistData = response.data.data;
        const accountInfo = therapistData.account?.accountInfo;

        // Xử lý avatar URL
        const avatarUrl = accountInfo?.avatar
          ? accountInfo.avatar.startsWith("http")
            ? accountInfo.avatar
            : `https://skincare-api.azurewebsites.net/api/upload/${accountInfo.avatar}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              accountInfo?.fullName || "Specialist"
            )}&background=random&color=fff&size=256`;

        setSpecialist({
          id: therapistData.accountId,
          fullName: accountInfo?.fullName || "Unknown Specialist",
          specialization: therapistData.specialization || "",
          avatar: avatarUrl,
          experience: therapistData.experience || "",
          bio: therapistData.bio || "",
          rating: therapistData.rating || 0,
          isAvailable: therapistData.isAvailable || false,
          introduction: therapistData.introduction || "",
          email: therapistData.account?.email || "",
          phone: accountInfo?.phone || "",
          address: accountInfo?.address || "",
        });
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error loading specialist:", error);
      setSpecialist(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!specialist) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Specialist not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
          title: specialist?.fullName || "Specialist Details",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: specialist?.avatar }} style={styles.image} />
          <Text style={styles.name}>{specialist?.fullName}</Text>
          <Text style={styles.specialty}>{specialist?.specialization}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{specialist?.rating}</Text>
          </View>
        </View>

        {specialist?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{specialist.bio}</Text>
          </View>
        )}

        {specialist?.experience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.bio}>{specialist.experience}</Text>
          </View>
        )}

        {specialist?.introduction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.bio}>{specialist.introduction}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push(`/(booking-flow)/new?specialistId=${id}`)}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: "gray",
  },
  bookButton: {
    margin: 16,
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 16,
  },
});
