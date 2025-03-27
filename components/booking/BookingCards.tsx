import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-parser";

interface BookingCardProps {
  booking: BookingItem;
  onViewDetail: (id: number) => void;
}

export function BookingCard({ booking, onViewDetail }: BookingCardProps) {
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Chuyển "15:00:00" thành "15:00"
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewDetail(booking.bookingId)}
    >
      <View style={styles.header}>
        <Text style={styles.serviceName}>
          {booking.treatment.belongToService.serviceName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                booking.status === "Pending"
                  ? "#ffd700"
                  : booking.status === "Confirmed"
                  ? "#4caf50"
                  : booking.status === "Completed"
                  ? "#2196f3"
                  : "#f44336",
            },
          ]}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Ionicons name="medical-outline" size={20} color="#666" />
          <Text style={styles.text}>{booking.treatment.treatmentName}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.text}>
            {new Date(booking.bookingAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.text}>
            {booking.timeSlots
              .map(
                (slot) =>
                  `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
              )
              .join(", ")}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="wallet-outline" size={20} color="#666" />
          <Text style={styles.text}>
            ${booking.totalPrice.toLocaleString()}
          </Text>
        </View>

        {booking.skinTherapist && (
          <View style={styles.row}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.text}>{booking.skinTherapist.fullName}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
