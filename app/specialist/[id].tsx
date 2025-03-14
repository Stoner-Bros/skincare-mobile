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
import { specialistApi } from "../../lib/api/endpoints";
import type { Specialist } from "../../lib/types/api";

export default function SpecialistPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecialist();
  }, [id]);

  const loadSpecialist = async () => {
    try {
      const data = await specialistApi.getSpecialist(id as string);
      setSpecialist(data);
    } catch (error) {
      console.error("Error loading specialist:", error);
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
          title: specialist.name,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: specialist.avatar }} style={styles.image} />
          <Text style={styles.name}>{specialist.name}</Text>
          <Text style={styles.specialty}>{specialist.role}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{specialist.rating}</Text>
            <Text style={styles.reviews}>
              ({specialist.reviewCount} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {specialist.specialties.map((specialty) => (
              <View key={specialty} style={styles.dayChip}>
                <Text style={styles.dayText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityContainer}>
            {Object.keys(specialist.availability).map((date) => (
              <View key={date} style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <View style={styles.timeSlots}>
                  {specialist.availability[date].map((time) => (
                    <Text key={time} style={styles.timeSlot}>
                      {time}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push(`/booking/new?specialistId=${id}`)}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
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
  reviews: {
    fontSize: 14,
    color: "gray",
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
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  availabilityContainer: {
    gap: 12,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
  },
  dayChip: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
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
});
