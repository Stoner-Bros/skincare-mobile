import React from "react";
import { View, FlatList, RefreshControl, Text, StyleSheet } from "react-native";

import type { BookingItem } from "@/lib/types/api";
import { BookingCard } from "./BookingCards";

interface UpcomingBookingsProps {
  bookings: BookingItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onViewDetail: (id: number) => void;
}

export default function UpcomingBookings({
  bookings,
  isLoading,
  onRefresh,
  onViewDetail,
}: UpcomingBookingsProps) {
  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming bookings</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.bookingId.toString()}
      renderItem={({ item }) => (
        <BookingCard booking={item} onViewDetail={onViewDetail} />
      )}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
    />
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
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
