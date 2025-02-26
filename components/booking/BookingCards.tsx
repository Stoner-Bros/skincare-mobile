import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface BookingProps {
  id: number;
  specialist: string;
  service: string;
  date: string;
  time: string;
  status: "upcoming" | "past" | "canceled";
  image: string;
}

export default function BookingCard({
  id,
  specialist,
  service,
  date,
  time,
  status,
  image,
}: BookingProps) {
  const router = useRouter();

  const getStatusColor = () => {
    switch (status) {
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

  const handleViewDetails = () => {
    router.push(`/booking/${id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleViewDetails}>
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.specialist}>{specialist}</Text>
          <Text style={styles.service}>{service}</Text>
          <View style={styles.dateTime}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>
        </View>
        <View
          style={[styles.status, { backgroundColor: `${getStatusColor()}20` }]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      {status === "upcoming" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rescheduleButton]}
            onPress={handleReschedule}
          >
            <Ionicons name="calendar" size={16} color="#2ecc71" />
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Ionicons name="close-circle" size={16} color="#e74c3c" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "past" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.reviewButton]}
            onPress={() => router.push(`/review/create/${id}`)}
          >
            <Ionicons name="star" size={16} color="#f1c40f" />
            <Text style={styles.reviewText}>Write Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.bookAgainButton]}
            onPress={() => router.push("/booking/new")}
          >
            <Ionicons name="repeat" size={16} color="#2ecc71" />
            <Text style={styles.bookAgainText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  specialist: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateTime: {
    flexDirection: "row",
    gap: 16,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  rescheduleButton: {
    backgroundColor: "#e8f8f0",
  },
  rescheduleText: {
    color: "#2ecc71",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
  },
  cancelText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "500",
  },
  reviewButton: {
    backgroundColor: "#fff8e1",
  },
  reviewText: {
    color: "#f1c40f",
    fontSize: 14,
    fontWeight: "500",
  },
  bookAgainButton: {
    backgroundColor: "#e8f8f0",
  },
  bookAgainText: {
    color: "#2ecc71",
    fontSize: 14,
    fontWeight: "500",
  },
});
