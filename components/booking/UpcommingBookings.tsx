import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BookingCard from "./BookingCards";

const upcomingBookings = [
  {
    id: 1,
    specialist: "Jazy Dewo",
    service: "Deep Tissue Massage",
    date: "Mon, Aug 15",
    time: "10:00 AM",
    status: "upcoming",
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    specialist: "Sarah Johnson",
    service: "Swedish Massage",
    date: "Wed, Aug 17",
    time: "2:00 PM",
    status: "upcoming",
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
  },
];

export default function UpcomingBookings() {
  if (upcomingBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming bookings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {upcomingBookings.map((booking) => (
        <BookingCard key={booking.id} {...booking} status="upcoming" />
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
