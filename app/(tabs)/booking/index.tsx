import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingTabs from "@/components/booking/BookingTabs";
import CanceledBookings from "@/components/booking/CanceledBookings";
import UpcomingBookings from "@/components/booking/UpcommingBookings";
import PastBookings from "@/components/booking/PastBooking";
import type { BookingResponse, BookingHistoryResponse } from "@/lib/types/api";

type TabType = "upcoming" | "past" | "canceled";

// Thêm interface để match với response API
interface BookingItem {
  bookingId: number;
  bookingAt: string;
  status: "Pending" | "Completed" | "Cancelled" | "Confirmed";
  checkinAt: string | null;
  checkoutAt: string | null;
  totalPrice: number;
  notes: string;
  treatment: {
    treatmentId: number;
    treatmentName: string;
    belongToService: {
      serviceId: number;
      serviceName: string;
    };
  };
  skinTherapist: any | null;
  staff: any | null;
  customer: {
    accountId: number;
    fullName: string;
  };
  guest: any | null;
  timeSlots: {
    timeSlotId: number;
    startTime: string;
    endTime: string;
  }[];
}

interface BookingHistoryResponse {
  items: BookingItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Lấy customer ID từ user profile
  useEffect(() => {
    const loadCustomerId = async () => {
      try {
        const profileData = await AsyncStorage.getItem("userProfile");
        console.log("Profile Data from AsyncStorage:", profileData);

        if (profileData) {
          const profile = JSON.parse(profileData);
          console.log("Parsed Profile:", profile);

          // Gọi API để lấy thông tin customer dựa trên email
          try {
            const response = await api.auth.getProfile();
            console.log("Profile API Response:", response);

            if (response?.data?.accountId) {
              console.log("Found Customer ID:", response.data.accountId);
              setCustomerId(response.data.accountId);
            } else {
              console.log("No accountId found in API response");
            }
          } catch (error) {
            console.error("Error fetching customer profile:", error);
          }
        } else {
          console.log("No profile data found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error loading customer ID:", error);
      }
    };

    loadCustomerId();
  }, []);

  // Lấy danh sách booking
  const fetchBookings = useCallback(
    async (page: number = 1) => {
      console.log("Fetching bookings with customerId:", customerId);

      if (!customerId) {
        console.log("No customerId available, skipping fetch");
        return;
      }

      setIsLoading(true);
      try {
        console.log("Making API call with params:", {
          customerId,
          page,
          pageSize,
        });

        const response = await api.bookings.getBookingHistory(
          customerId,
          page,
          pageSize
        );

        console.log("Raw API Response:", JSON.stringify(response, null, 2));

        if (response?.data?.items) {
          const bookingHistory = response.data;

          // Log số lượng booking theo từng status
          const statusCounts = {
            upcoming: bookingHistory.items.filter((b) =>
              ["Pending", "Confirmed"].includes(b.status)
            ).length,
            past: bookingHistory.items.filter((b) => b.status === "Completed")
              .length,
            canceled: bookingHistory.items.filter(
              (b) => b.status === "Cancelled"
            ).length,
          };

          console.log("Booking counts by status:", statusCounts);
          console.log("Current active tab:", activeTab);

          setBookings((prev) =>
            page === 1
              ? bookingHistory.items
              : [...prev, ...bookingHistory.items]
          );
          setTotalPages(bookingHistory.totalPages);
          setCurrentPage(bookingHistory.pageNumber);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          console.error("API Error Response:", error.response.data);
        }
        Alert.alert("Error", "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    },
    [customerId]
  );

  // Lấy chi tiết một booking
  const fetchBookingDetail = async (bookingId: number) => {
    try {
      const response = await api.bookings.getBooking(bookingId);
      console.log("Booking detail:", response);
      return response;
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      Alert.alert("Error", "Failed to load booking detail");
    }
  };

  // Load more bookings
  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      fetchBookings(currentPage + 1);
    }
  };

  // Refresh bookings
  const handleRefresh = () => {
    setCurrentPage(1);
    fetchBookings(1);
  };

  // Gọi API lấy bookings khi component mount và khi tab thay đổi
  useEffect(() => {
    handleRefresh();
  }, [fetchBookings, activeTab]);

  // Lọc bookings theo tab
  const filteredBookings = useCallback(() => {
    return bookings.filter((booking) => {
      switch (activeTab) {
        case "upcoming":
          // Upcoming sẽ bao gồm Pending và Confirmed
          return ["Pending", "Confirmed"].includes(booking.status);
        case "past":
          // Past là các booking đã Completed
          return booking.status === "Completed";
        case "canceled":
          // Canceled là các booking đã Cancelled
          return booking.status === "Cancelled";
        default:
          return true;
      }
    });
  }, [bookings, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader />
      <BookingTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === "upcoming" && (
        <UpcomingBookings
          bookings={filteredBookings()}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewDetail={fetchBookingDetail}
        />
      )}
      {activeTab === "past" && (
        <PastBookings
          bookings={filteredBookings()}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewDetail={fetchBookingDetail}
        />
      )}
      {activeTab === "canceled" && (
        <CanceledBookings
          bookings={filteredBookings()}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewDetail={fetchBookingDetail}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { useBookings } from '../../../lib/hooks/useBookings';
// import { BookingList } from '../../../components/booking/BookingList';
// import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
// import { ErrorMessage } from '../../../components/common/ErrorMessage';

// export default function BookingsScreen() {
//   const {
//     bookings,
//     loading,
//     error,
//     activeTab,
//     setActiveTab,
//     fetchBookings
//   } = useBookings();

//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <View style={{ flex: 1 }}>
//       <BookingList
//         bookings={bookings}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//       />
//     </View>
//   );
// }
