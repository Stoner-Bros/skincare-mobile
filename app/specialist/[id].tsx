import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SpecialistPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock specialist data - replace with actual data fetching
  const specialist = {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Facial Expert",
    image: "https://v0.dev/placeholder.svg?height=200&width=200",
    bio: "Certified skincare specialist with 8 years of experience in facial treatments and skin rejuvenation.",
    rating: 4.8,
    reviewCount: 127,
    availability: ["Mon", "Tue", "Thu", "Fri"],
  };

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
          <Image source={{ uri: specialist.image }} style={styles.image} />
          <Text style={styles.name}>{specialist.name}</Text>
          <Text style={styles.specialty}>{specialist.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{specialist.rating}</Text>
            <Text style={styles.reviews}>
              ({specialist.reviewCount} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{specialist.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityContainer}>
            {specialist.availability.map((day) => (
              <View key={day} style={styles.dayChip}>
                <Text style={styles.dayText}>{day}</Text>
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
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  availabilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
