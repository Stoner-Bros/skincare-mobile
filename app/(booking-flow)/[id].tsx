import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/lib/api/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

type BookingDetail = {
  bookingAt: string;
  bookingId: number;
  checkinAt: string | null;
  checkoutAt: string | null;
  customer: {
    accountId: number;
    fullName: string;
  };
  guest: any | null;
  notes: string;
  skinTherapist: any | null;
  slotDate: string;
  staff: any | null;
  status: string;
  timeSlots: any[];
  totalPrice: number;
  treatment: {
    belongToService: any;
    treatmentId: number;
    treatmentName: string;
  };
};

export default function BookingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookingDetail();
  }, [id]);

  const loadBookingDetail = async () => {
    try {
      setIsLoading(true);
      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId) {
        throw new Error("Không tìm thấy thông tin tài khoản");
      }

      const response = await api.bookings.getBookingHistory(Number(accountId));
      if (response?.data?.items) {
        const bookingDetail = response.data.items.find(
          (booking) => booking.bookingId === Number(id)
        );
        if (bookingDetail) {
          setBooking(bookingDetail);
        } else {
          throw new Error("Không tìm thấy thông tin đặt lịch");
        }
      }
    } catch (error) {
      console.error("Error loading booking detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin đặt lịch");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#f1c40f";
      case "confirmed":
        return "#2ecc71";
      case "completed":
        return "#3498db";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#666";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy thông tin đặt lịch</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đặt lịch</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusBar}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(booking.status)}20` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {booking.status}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Ngày:</Text>
              <Text style={styles.cardValue}>
                {formatDate(booking.slotDate)}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Đặt lúc:</Text>
              <Text style={styles.cardValue}>
                {new Date(booking.bookingAt).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.cardLabel}>Khách hàng:</Text>
              <Text style={styles.cardValue}>{booking.customer.fullName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ & Thanh toán</Text>
          <View style={styles.card}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Dịch vụ:</Text>
              <Text style={styles.serviceName}>
                {booking.treatment.treatmentName}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.serviceRow}>
              <Text style={styles.serviceLabel}>Tổng tiền:</Text>
              <Text style={styles.servicePrice}>
                {formatPrice(booking.totalPrice)}
              </Text>
            </View>
          </View>
        </View>

        {booking.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.card}>
              <Text style={styles.notes}>{booking.notes}</Text>
            </View>
          </View>
        )}

        {booking.status === "Pending" && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  "Hủy đặt lịch",
                  "Bạn có chắc muốn hủy lịch hẹn này không?",
                  [
                    { text: "Không", style: "cancel" },
                    {
                      text: "Có",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await api.bookings.cancelBooking(booking.bookingId);
                          router.back();
                        } catch (error) {
                          console.error("Error cancelling booking:", error);
                          Alert.alert(
                            "Lỗi",
                            "Không thể hủy lịch hẹn. Vui lòng thử lại sau."
                          );
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.cancelButtonText}>Hủy đặt lịch</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBar: {
    padding: 16,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    width: 80,
  },
  cardValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  specialistRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  specialistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#666",
  },
  experience: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginVertical: 12,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: "#666",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
  notes: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
    gap: 12,
  },
  rescheduleButton: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  rescheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
