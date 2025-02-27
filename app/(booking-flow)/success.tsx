import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookingSuccess() {
  const router = useRouter();
  // Xóa dữ liệu booking tạm thời
  useEffect(() => {
    const clearTempData = async () => {
      try {
        await AsyncStorage.removeItem("selectedSpecialist");
        await AsyncStorage.removeItem("selectedDate");
        await AsyncStorage.removeItem("selectedTime");
      } catch (error) {
        console.error("Error clearing temp data:", error);
      }
    };

    clearTempData();
  }, []);
  const handleViewBooking = () => {
    // Reset navigation stack và chuyển đến tab booking
    router.replace(`/(booking-flow)/${bookingInfo.id}`);
  };

  const handleBackToHome = () => {
    // Reset navigation stack và chuyển về tab home
    router.replace("/");
  };

  // Giả lập thông tin đặt lịch
  const bookingInfo = {
    id: "12345",
    date: "Monday, August 15, 2023",
    time: "10:00 AM",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../../assets/animations/success.json")}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.message}>
            Your appointment has been successfully booked. We've sent a
            confirmation to your email.
          </Text>

          <View style={styles.bookingInfoCard}>
            <View style={styles.bookingInfoRow}>
              <Ionicons name="calendar-outline" size={20} color="#2ecc71" />
              <Text style={styles.bookingInfoLabel}>Date:</Text>
              <Text style={styles.bookingInfoValue}>{bookingInfo.date}</Text>
            </View>
            <View style={styles.bookingInfoRow}>
              <Ionicons name="time-outline" size={20} color="#2ecc71" />
              <Text style={styles.bookingInfoLabel}>Time:</Text>
              <Text style={styles.bookingInfoValue}>{bookingInfo.time}</Text>
            </View>
            <View style={styles.bookingInfoRow}>
              <Ionicons name="bookmark-outline" size={20} color="#2ecc71" />
              <Text style={styles.bookingInfoLabel}>Booking ID:</Text>
              <Text style={styles.bookingInfoValue}>#{bookingInfo.id}</Text>
            </View>
          </View>

          <View style={styles.reminderCard}>
            <View style={styles.reminderIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#2ecc71"
              />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>Reminder</Text>
              <Text style={styles.reminderText}>
                We'll send you a reminder 24 hours before your appointment.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#2ecc71" }]}
            onPress={handleViewBooking}
          >
            <Text style={styles.footerButtonText}>View Booking Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: "#f1f1f1" }]}
            onPress={handleBackToHome}
          >
            <Text style={[styles.footerButtonText, { color: "#333" }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between", // Đảm bảo nội dung kéo dài hết màn hình
    paddingBottom: 100, // Tránh footer bị che mất
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  bookingInfoCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  bookingInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingInfoLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    width: 80,
  },
  bookingInfoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  reminderCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#e8f8f0",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1f0e0",
    marginBottom: 20,
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerButton: {
    width: "100%", // Full width để tạo thanh ngang
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10, // Khoảng cách giữa 2 thanh
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  viewBookingButton: {
    backgroundColor: "#2ecc71",
  },
  viewBookingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#f1f1f1",
  },
  homeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
