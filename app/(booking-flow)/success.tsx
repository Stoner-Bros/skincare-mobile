// import React, { useCallback, useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect, usePathname, useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import LottieView from "lottie-react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function BookingSuccess() {
//   const router = useRouter();
//   // Xóa dữ liệu booking tạm thời
//   useEffect(() => {
//     const clearTempData = async () => {
//       try {
//         await AsyncStorage.removeItem("selectedSpecialist");
//         await AsyncStorage.removeItem("selectedDate");
//         await AsyncStorage.removeItem("selectedTime");
//       } catch (error) {
//         console.error("Error clearing temp data:", error);
//       }
//     };

//     clearTempData();
//   }, []);
//   const handleViewBooking = () => {
//     // Reset navigation stack và chuyển đến tab booking
//     router.replace(`/(booking-flow)/${bookingInfo.id}`);
//   };

//   const handleBackToHome = () => {
//     // Reset navigation stack và chuyển về tab home
//     router.replace("/");
//   };

//   // Giả lập thông tin đặt lịch
//   const bookingInfo = {
//     id: "12345",
//     date: "Monday, August 15, 2023",
//     time: "10:00 AM",
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.content}>
//           <View style={styles.animationContainer}>
//             <LottieView
//               source={require("../../assets/animations/success.json")}
//               autoPlay
//               loop={false}
//               style={styles.animation}
//             />
//           </View>

//           <Text style={styles.title}>Booking Confirmed!</Text>
//           <Text style={styles.message}>
//             Your appointment has been successfully booked. We've sent a
//             confirmation to your email.
//           </Text>

//           <View style={styles.bookingInfoCard}>
//             <View style={styles.bookingInfoRow}>
//               <Ionicons name="calendar-outline" size={20} color="#2ecc71" />
//               <Text style={styles.bookingInfoLabel}>Date:</Text>
//               <Text style={styles.bookingInfoValue}>{bookingInfo.date}</Text>
//             </View>
//             <View style={styles.bookingInfoRow}>
//               <Ionicons name="time-outline" size={20} color="#2ecc71" />
//               <Text style={styles.bookingInfoLabel}>Time:</Text>
//               <Text style={styles.bookingInfoValue}>{bookingInfo.time}</Text>
//             </View>
//             <View style={styles.bookingInfoRow}>
//               <Ionicons name="bookmark-outline" size={20} color="#2ecc71" />
//               <Text style={styles.bookingInfoLabel}>Booking ID:</Text>
//               <Text style={styles.bookingInfoValue}>#{bookingInfo.id}</Text>
//             </View>
//           </View>

//           <View style={styles.reminderCard}>
//             <View style={styles.reminderIconContainer}>
//               <Ionicons
//                 name="notifications-outline"
//                 size={24}
//                 color="#2ecc71"
//               />
//             </View>
//             <View style={styles.reminderContent}>
//               <Text style={styles.reminderTitle}>Reminder</Text>
//               <Text style={styles.reminderText}>
//                 We'll send you a reminder 24 hours before your appointment.
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[styles.footerButton, { backgroundColor: "#2ecc71" }]}
//             onPress={handleViewBooking}
//           >
//             <Text style={styles.footerButtonText}>View Booking Details</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.footerButton, { backgroundColor: "#f1f1f1" }]}
//             onPress={handleBackToHome}
//           >
//             <Text style={[styles.footerButtonText, { color: "#333" }]}>
//               Back to Home
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "space-between", // Đảm bảo nội dung kéo dài hết màn hình
//     paddingBottom: 100, // Tránh footer bị che mất
//   },
//   content: {
//     padding: 20,
//     alignItems: "center",
//   },
//   animationContainer: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   animation: {
//     width: "100%",
//     height: "100%",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   message: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 32,
//     lineHeight: 24,
//   },
//   bookingInfoCard: {
//     width: "100%",
//     backgroundColor: "#f9f9f9",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#f1f1f1",
//   },
//   bookingInfoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   bookingInfoLabel: {
//     fontSize: 16,
//     color: "#666",
//     marginLeft: 8,
//     width: 80,
//   },
//   bookingInfoValue: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//     flex: 1,
//   },
//   reminderCard: {
//     width: "100%",
//     flexDirection: "row",
//     backgroundColor: "#e8f8f0",
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#d1f0e0",
//     marginBottom: 20,
//   },
//   reminderIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   reminderContent: {
//     flex: 1,
//   },
//   reminderTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   reminderText: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//   },
//   footer: {
//     width: "100%",
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   footerButton: {
//     width: "100%", // Full width để tạo thanh ngang
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 10, // Khoảng cách giữa 2 thanh
//   },
//   footerButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "white",
//   },
//   viewBookingButton: {
//     backgroundColor: "#2ecc71",
//   },
//   viewBookingButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   homeButton: {
//     backgroundColor: "#f1f1f1",
//   },
//   homeButtonText: {
//     color: "#333",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
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
});
