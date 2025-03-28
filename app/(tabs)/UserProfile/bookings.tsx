import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import type { BookingResponse } from "@/lib/types/api";

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookingHistory();
  }, []);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);
      const accountId = await AsyncStorage.getItem("accountId");

      if (!accountId) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      const response = await api.bookings.getBookingHistory(Number(accountId));
      console.log("Booking history response:", response);

      if (response?.data?.items) {
        setBookings(response.data.items);
      } else {
        setBookings([]);
      }
    } catch (error: any) {
      console.error("Error loading booking history:", error);
      setError(error.message || "Không thể tải lịch sử đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#ffc107";
      case "confirmed":
        return "#2ecc71";
      case "completed":
        return "#666";
      case "cancelled":
        return "#ff4757";
      default:
        return "#666";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A83F98" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadBookingHistory}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Lịch đặt của tôi",
        }}
      />
      <ScrollView style={styles.container}>
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa có lịch đặt nào</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.bookingId}
              style={styles.bookingCard}
              onPress={() => router.push(`/booking/${booking.bookingId}`)}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.treatmentInfo}>
                  <Text style={styles.treatmentName}>
                    {booking.treatment?.treatmentName || "Chưa có tên dịch vụ"}
                  </Text>
                  <Text style={styles.specialistName}>
                    {booking.skinTherapist?.fullName || "Chưa có chuyên gia"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    { color: getStatusColor(booking.status) },
                  ]}
                >
                  {booking.status === "pending"
                    ? "Chờ xác nhận"
                    : booking.status === "confirmed"
                    ? "Đã xác nhận"
                    : booking.status === "completed"
                    ? "Hoàn thành"
                    : booking.status === "cancelled"
                    ? "Đã hủy"
                    : booking.status}
                </Text>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {new Date(booking.date).toLocaleDateString("vi-VN")}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {booking.totalPrice?.toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{booking.fullName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{booking.phone}</Text>
                </View>
              </View>

              {booking.status === "pending" && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      Alert.alert(
                        "Hủy lịch",
                        "Bạn có chắc chắn muốn hủy lịch này không?",
                        [
                          { text: "Không", style: "cancel" },
                          {
                            text: "Có",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                await api.bookings.cancelBooking(
                                  booking.bookingId
                                );
                                loadBookingHistory();
                              } catch (error) {
                                Alert.alert(
                                  "Lỗi",
                                  "Không thể hủy lịch. Vui lòng thử lại sau."
                                );
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff4757" />
                    <Text style={styles.cancelText}>Hủy lịch</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  specialistName: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff3f3",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4757",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4757",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#A83F98",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
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
  contactDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
});
