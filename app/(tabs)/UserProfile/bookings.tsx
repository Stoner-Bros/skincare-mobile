import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const bookings = [
  {
    id: 1,
    treatment: "Deep Cleansing Facial",
    specialist: "Sarah Johnson",
    date: "2024-02-26T10:00:00",
    status: "upcoming",
  },
  {
    id: 2,
    treatment: "Hydrating Treatment",
    specialist: "Emma Beauty",
    date: "2024-02-24T14:30:00",
    status: "completed",
  },
  {
    id: 3,
    treatment: "Anti-Aging Facial",
    specialist: "Maria Chen",
    date: "2024-02-20T11:00:00",
    status: "completed",
  },
];

export default function BookingsScreen() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#2ecc71";
      case "completed":
        return "#666";
      default:
        return "#666";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Bookings",
        }}
      />
      <ScrollView style={styles.container}>
        {bookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingCard}
            onPress={() => router.push(`/booking/${booking.id}`)}
          >
            <View style={styles.bookingHeader}>
              <View style={styles.treatmentInfo}>
                <Text style={styles.treatmentName}>{booking.treatment}</Text>
                <Text style={styles.specialistName}>{booking.specialist}</Text>
              </View>
              <Text
                style={[
                  styles.status,
                  { color: getStatusColor(booking.status) },
                ]}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Text>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.detailText}>
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailText}>
                  {new Date(booking.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            {booking.status === "upcoming" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.rescheduleButton}
                  onPress={() =>
                    router.push(`/booking/reschedule/${booking.id}`)
                  }
                >
                  <Ionicons name="calendar" size={20} color="#2ecc71" />
                  <Text style={styles.rescheduleText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    // Handle cancellation
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4757" />
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {booking.status === "completed" && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => router.push(`/review/create/${booking.id}`)}
              >
                <Ionicons name="star" size={20} color="#ffd700" />
                <Text style={styles.reviewText}>Write a Review</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  specialistName: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e8f8f0",
  },
  rescheduleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2ecc71",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff3f3",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4757",
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff9e6",
  },
  reviewText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffc107",
  },
});
