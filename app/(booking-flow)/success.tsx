import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";

export default function BookingSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "completed" | "failed"
  >("completed");

  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const bookingId = params.bookingId as string;
        const bookingsJson = await AsyncStorage.getItem("bookings");

        if (bookingsJson) {
          const bookings = JSON.parse(bookingsJson);
          const foundBooking = bookings.find((b: any) => b.id === bookingId);

          if (foundBooking) {
            setBooking(foundBooking);
            setPaymentMethod(
              foundBooking.paymentMethod ||
                (params.paymentMethod as string) ||
                "card"
            );
          }
        }
      } catch (error) {
        console.error("Error loading booking details:", error);
      }
    };

    loadBookingDetails();
  }, [params]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const status = params.status as string;
      if (status === "pending") {
        setPaymentStatus("pending");

        const pendingBooking = await AsyncStorage.getItem("pendingBooking");
        if (pendingBooking) {
          const { orderId } = JSON.parse(pendingBooking);
          // Gọi API kiểm tra trạng thái thanh toán
          // api.payments.checkStatus(orderId)
        }
      }
    };

    checkPaymentStatus();
  }, [params]);

  const handleViewBookings = () => {
    router.push("/(tabs)/booking");
  };

  const handleGoHome = () => {
    router.push("/(tabs)");
  };

  const shareBookingDetails = async () => {
    if (!booking) return;

    try {
      const message = `
Booking ID: ${booking.id}
Treatment: ${booking.treatment || "Deep Tissue Massage (60 min)"}
Date: ${booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
Time: ${booking.time || "N/A"}
Specialist: ${booking.specialist || "Jazy Dewo"}
Payment Method: ${booking.paymentMethod || paymentMethod}

${
  paymentMethod === "Cash"
    ? "Please show this to our staff when you arrive for payment."
    : ""
}
      `;

      await Share.share({
        message,
        title: "Your Booking Details",
      });
    } catch (error) {
      console.error("Error sharing booking details:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2ecc71" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            {paymentMethod === "Cash"
              ? "Your appointment has been booked successfully. Payment will be collected at the venue."
              : "Your appointment has been booked and payment has been processed successfully."}
          </Text>
        </View>

        <View style={styles.bookingDetailsCard}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID:</Text>
            <Text style={styles.bookingId}>
              {booking?.id || params.bookingId}
            </Text>
          </View>

          {paymentMethod === "Cash" && (
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={`BOOKING:${booking?.id || params.bookingId}`}
                size={150}
                color="#000"
                backgroundColor="#fff"
              />
              <Text style={styles.qrCodeLabel}>Show this to our staff</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {booking?.date
                ? new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date not available"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {booking?.time || "Time not available"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {booking?.specialist || "Jazy Dewo"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {booking?.treatment || "Deep Tissue Massage (60 min)"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name={paymentMethod === "Cash" ? "cash-outline" : "card-outline"}
              size={20}
              color="#666"
            />
            <Text style={styles.detailText}>
              {paymentMethod === "Cash"
                ? "Cash (Pay at venue)"
                : "Credit Card (Paid)"}
            </Text>
          </View>

          {paymentMethod === "Cash" && (
            <View style={styles.paymentNote}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.paymentNoteText}>
                Please arrive 10 minutes before your appointment time to
                complete payment.
              </Text>
            </View>
          )}
        </View>

        {paymentMethod === "Cash" && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareBookingDetails}
          >
            <Ionicons name="share-outline" size={20} color="white" />
            <Text style={styles.shareButtonText}>Share Booking Details</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.viewBookingsButton}
            onPress={handleViewBookings}
          >
            <Text style={styles.viewBookingsText}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>

        {paymentStatus === "pending" && (
          <View style={styles.paymentStatusContainer}>
            <ActivityIndicator size="small" color="#2ecc71" />
            <Text style={styles.paymentStatusText}>
              Waiting for payment confirmation...
            </Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bookingDetailsCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  bookingIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 1,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginVertical: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeLabel: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
  },
  paymentNote: {
    flexDirection: "row",
    backgroundColor: "#f0f9f4",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#2ecc71",
    alignItems: "flex-start",
  },
  paymentNoteText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  actionsContainer: {
    gap: 16,
  },
  viewBookingsButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  viewBookingsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentStatusContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  paymentStatusText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
});
