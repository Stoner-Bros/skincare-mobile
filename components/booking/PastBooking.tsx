import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BookingCard from "./BookingCards";

const pastBookings = [
  {
    id: 3,
    specialist: "Jazy Dewo",
    service: "Hot Stone Massage",
    date: "Jul 30",
    time: "3:00 PM",
    status: "past",
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    specialist: "Sarah Johnson",
    service: "Swedish Massage",
    date: "Jul 25",
    time: "1:00 PM",
    status: "past",
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
  },
];

export default function PastBookings() {
  if (pastBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No past bookings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pastBookings.map((booking) => (
        <BookingCard key={booking.id} {...booking} status="past" />
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
