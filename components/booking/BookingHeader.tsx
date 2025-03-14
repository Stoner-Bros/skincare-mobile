import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BookingHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity> */}
      <Text style={styles.title}>My Bookings</Text>
      <TouchableOpacity onPress={() => router.push("/(booking-flow)/new")}>
        <Ionicons name="add-circle-outline" size={24} color="#2ecc71" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
