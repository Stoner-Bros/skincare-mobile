import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - replace with your actual data fetching logic
const getBookingById = (id: string) => {
  return {
    id: parseInt(id),
    specialist: "Jazy Dewo",
    service: "Deep Tissue Massage",
    date: "Mon, Aug 15, 2023",
    time: "10:00 AM",
    duration: "60 min",
    price: 89.99,
    status: "upcoming",
    location: "123 Spa Street, New York",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ipvuot02jMdPs4tqEeExcc03Lqjw79.png",
    notes:
      "Please arrive 15 minutes before your appointment. Wear comfortable clothing.",
    specialistInfo: {
      experience: "5 Years",
      rating: 4.88,
      totalReviews: 1250,
    },
  };
};

export default function BookingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const booking = getBookingById(id as string);

  const getStatusColor = () => {
    switch (booking.status) {
      case "upcoming":
        return "#2ecc71";
      case "past":
        return "#666";
      case "canceled":
        return "#e74c3c";
      default:
        return "#666";
    }
  };

  const handleReschedule = () => {
    router.push(`/booking/reschedule/${id}`);
  };

  const handleCancel = () => {
    router.push(`/booking/cancel/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusBar}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor()}20` },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Info</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Date:</Text>
              <Text style={styles.cardValue}>{booking.date}</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Time:</Text>
              <Text style={styles.cardValue}>{booking.time}</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="hourglass-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Duration:</Text>
              <Text style={styles.cardValue}>{booking.duration}</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Location:</Text>
              <Text style={styles.cardValue}>{booking.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service & Specialist</Text>
          <View style={styles.card}>
            <View style={styles.specialistRow}>
              <Image
                source={{ uri: booking.image }}
                style={styles.specialistImage}
              />
              <View style={styles.specialistInfo}>
                <Text style={styles.specialistName}>{booking.specialist}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>
                    {booking.specialistInfo.rating}
                  </Text>
                  <Text style={styles.reviews}>
                    ({booking.specialistInfo.totalReviews} reviews)
                  </Text>
                </View>
                <Text style={styles.experience}>
                  Experience: {booking.specialistInfo.experience}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Service:</Text>
              <Text style={styles.serviceName}>{booking.service}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Price:</Text>
              <Text style={styles.servicePrice}>${booking.price}</Text>
            </View>
          </View>
        </View>

        {booking.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notes}>{booking.notes}</Text>
            </View>
          </View>
        )}

        {booking.status === "upcoming" && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={handleReschedule}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBar: {
    padding: 16,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    width: 80,
  },
  cardValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  specialistRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  specialistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#666",
  },
  experience: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginVertical: 12,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: "#666",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  notes: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
    gap: 12,
  },
  rescheduleButton: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  rescheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
