import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import MomoPayment from "@/components/payment/MomoPayment";
import * as Linking from "expo-linking";

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        // Load booking details from params or AsyncStorage
        const bookingData = await AsyncStorage.getItem("currentBooking");
        if (bookingData) {
          setBookingDetails(JSON.parse(bookingData));
        }

        // Load payment method details
        const paymentMethod = params.paymentMethod || "card";
        if (paymentMethod === "card") {
          setPaymentDetails({
            type: "Credit Card",
            icon: "card-outline",
            last4: "4242",
            expiryDate: "12/25",
          });
        } else {
          setPaymentDetails({
            type: "Cash",
            icon: "cash-outline",
            description: "Pay at the venue",
          });
        }

        // Generate a booking ID
        const newBookingId = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
        setBookingId(newBookingId);
      } catch (error) {
        console.error("Error loading details:", error);
      }
    };

    loadDetails();
  }, [params]);

  const handleMomoPayment = async (momoResponse: any) => {
    try {
      if (momoResponse?.qrCodeUrl) {
        const canOpen = await Linking.canOpenURL(momoResponse.qrCodeUrl);

        if (canOpen) {
          await Linking.openURL(momoResponse.qrCodeUrl);
        } else {
          // Fallback nếu không mở được app MoMo
          if (momoResponse.payUrl) {
            await Linking.openURL(momoResponse.payUrl);
          } else {
            Alert.alert(
              "Error",
              "Cannot open MoMo app. Please make sure MoMo is installed."
            );
          }
        }
      }
    } catch (error) {
      console.error("Error opening MoMo:", error);
      Alert.alert("Error", "Failed to open MoMo payment. Please try again.");
    }
  };

  const processPayment = async () => {
    try {
      setIsLoading(true);
      setCurrentStep(2);

      if (paymentDetails?.type === "momo") {
        // Giả sử response là dữ liệu MoMo bạn đã cung cấp
        const momoResponse = {
          qrCodeUrl:
            "momo://app?action=payWithApp&isScanQR=true&revampAutoPick=false&serviceType=qr&sid=TU9NT3wxMVNTMjAyNTAzMjgwNjIyMjc&v=3.0",
          payUrl:
            "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3wxMVNTMjAyNTAzMjgwNjIyMjc&s=af3b1c7d09af915a3f9324a627dd795990b4dcd6f8e869af23e4729ac3b4d5f8",
        };

        await handleMomoPayment(momoResponse);
        setCurrentStep(3);
      } else if (paymentDetails?.type === "Cash") {
        setTimeout(() => {
          setCurrentStep(3);
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        "Failed to process payment. Please try again."
      );
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const completeBooking = async () => {
    try {
      // Create booking object with appropriate status based on payment method
      const paymentStatus =
        paymentDetails?.type === "Cash" ? "pending_payment" : "paid";

      const newBooking = {
        id: bookingId,
        ...bookingDetails,
        paymentMethod: paymentDetails?.type,
        status: "confirmed",
        paymentStatus: paymentStatus,
        date: new Date().toISOString(),
      };

      // Get existing bookings
      const existingBookingsJson = await AsyncStorage.getItem("bookings");
      const existingBookings = existingBookingsJson
        ? JSON.parse(existingBookingsJson)
        : [];

      // Add new booking
      const updatedBookings = [...existingBookings, newBooking];

      // Save updated bookings
      await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));

      // Navigate to success page
      router.push({
        pathname: "/(booking-flow)/success",
        params: {
          bookingId,
          paymentMethod: paymentDetails?.type,
        },
      });
    } catch (error) {
      console.error("Error completing booking:", error);
      Alert.alert(
        "Error",
        "There was an error processing your booking. Please try again."
      );
    }
  };

  const shareBookingDetails = async () => {
    try {
      const message = `
Booking ID: ${bookingId}
Treatment: ${bookingDetails?.treatment || "Deep Tissue Massage (60 min)"}
Date: ${
        bookingDetails?.date
          ? new Date(bookingDetails.date).toLocaleDateString()
          : "N/A"
      }
Time: ${bookingDetails?.time || "N/A"}
Specialist: ${bookingDetails?.specialist || "Jazy Dewo"}
Payment Method: ${paymentDetails?.type}

Please show this to our staff when you arrive.
      `;

      await Share.share({
        message,
        title: "Your Booking Details",
      });
    } catch (error) {
      console.error("Error sharing booking details:", error);
    }
  };

  const handlePaymentSuccess = () => {
    // Xử lý khi thanh toán thành công
    console.log("Payment successful");
  };

  const handlePaymentError = (error: any) => {
    // Xử lý khi thanh toán thất bại
    console.error("Payment failed:", error);
  };

  const renderPaymentStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
        <Text style={styles.stepTitle}>
          {paymentDetails?.type === "Cash"
            ? "Confirm Cash Payment"
            : "Payment Verification"}
        </Text>
      </View>

      <View style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <Ionicons name={paymentDetails?.icon as any} size={24} color="#333" />
          <Text style={styles.paymentTitle}>{paymentDetails?.type}</Text>
        </View>

        {paymentDetails?.last4 ? (
          <View style={styles.cardDetails}>
            <Text style={styles.cardNumber}>
              •••• •••• •••• {paymentDetails.last4}
            </Text>
            <Text style={styles.cardExpiry}>
              Expires: {paymentDetails.expiryDate}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.paymentDescription}>
              {paymentDetails?.description}
            </Text>
            <View style={styles.cashInstructions}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
                style={styles.infoIcon}
              />
              <Text style={styles.cashInstructionsText}>
                Your booking will be confirmed now, but payment will be
                collected when you arrive at our venue.
              </Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={processPayment}>
        <Text style={styles.actionButtonText}>
          {paymentDetails?.type === "Cash"
            ? "Confirm Booking"
            : "Verify & Process Payment"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessingStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={styles.stepTitle}>
          {paymentDetails?.type === "Cash"
            ? "Confirming Booking"
            : "Processing Payment"}
        </Text>
      </View>

      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.processingText}>
          {paymentDetails?.type === "Cash"
            ? "Confirming your booking..."
            : "Processing your payment..."}
        </Text>
        <Text style={styles.processingSubtext}>
          Please do not close this screen
        </Text>
      </View>
    </View>
  );

  const renderCompletionStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIndicator, styles.completedStep]}>
          <Ionicons name="checkmark" size={20} color="white" />
        </View>
        <Text style={styles.stepTitle}>
          {paymentDetails?.type === "Cash"
            ? "Booking Confirmed"
            : "Payment Successful"}
        </Text>
      </View>

      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#2ecc71" />
        </View>

        <Text style={styles.successText}>
          {paymentDetails?.type === "Cash"
            ? "Your booking is confirmed!"
            : "Your payment was successful!"}
        </Text>

        {paymentDetails?.type === "Cash" && (
          <>
            <Text style={styles.successSubtext}>
              Please show your booking ID when you arrive at our venue.
            </Text>

            <View style={styles.bookingIdContainer}>
              <Text style={styles.bookingIdLabel}>Booking ID:</Text>
              <Text style={styles.bookingId}>{bookingId}</Text>
            </View>

            <View style={styles.qrCodeContainer}>
              <QRCode
                value={`BOOKING:${bookingId}`}
                size={150}
                color="#000"
                backgroundColor="#fff"
              />
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareBookingDetails}
            >
              <Ionicons
                name="share-outline"
                size={18}
                color="white"
                style={styles.shareIcon}
              />
              <Text style={styles.shareButtonText}>Share Booking Details</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.completeButton}
          onPress={completeBooking}
        >
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPaymentStep();
      case 2:
        return renderProcessingStep();
      case 3:
        return renderCompletionStep();
      default:
        return renderPaymentStep();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isLoading ? "#ccc" : "#000"}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Treatment</Text>
              <Text style={styles.summaryValue}>
                {bookingDetails?.treatment || "Deep Tissue Massage (60 min)"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date & Time</Text>
              <Text style={styles.summaryValue}>
                {bookingDetails?.date
                  ? new Date(bookingDetails.date).toLocaleDateString()
                  : "N/A"}{" "}
                at {bookingDetails?.time || "N/A"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Specialist</Text>
              <Text style={styles.summaryValue}>
                {bookingDetails?.specialist || "Jazy Dewo"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${bookingDetails?.basePrice || "89.99"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${bookingDetails?.tax || "9.00"}
              </Text>
            </View>

            {bookingDetails?.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>Discount</Text>
                <Text style={styles.discountValue}>
                  -${bookingDetails.discount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${bookingDetails?.total || "98.99"}
              </Text>
            </View>
          </View>
        </View>

        {renderCurrentStep()}

        {/* Component thanh toán MoMo */}
        <MomoPayment
          amount={bookingDetails?.total || 0}
          orderInfo={`Payment for ${
            bookingDetails?.treatment || "Deep Tissue Massage (60 min)"
          }`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  orderSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginVertical: 12,
  },
  discountLabel: {
    fontSize: 14,
    color: "#2ecc71",
  },
  discountValue: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ecc71",
  },
  stepContainer: {
    padding: 16,
    marginTop: 8,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completedStep: {
    backgroundColor: "#2ecc71",
  },
  stepNumber: {
    color: "white",
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  cardDetails: {
    marginTop: 8,
  },
  cardNumber: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: "#666",
  },
  paymentDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  cashInstructions: {
    flexDirection: "row",
    backgroundColor: "#f0f9f4",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2ecc71",
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  cashInstructionsText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  processingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  processingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  bookingIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 1,
  },
  qrCodeContainer: {
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
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
