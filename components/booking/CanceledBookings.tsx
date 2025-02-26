import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BookingCard from "./BookingCards";

const canceledBookings = [
  {
    id: 5,
    specialist: "Jazy Dewo",
    service: "Deep Tissue Massage",
    date: "Aug 5",
    time: "11:00 AM",
    status: "canceled",
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
  },
];

export default function CanceledBookings() {
  if (canceledBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No canceled bookings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {canceledBookings.map((booking) => (
        <BookingCard key={booking.id} {...booking} status="canceled" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
