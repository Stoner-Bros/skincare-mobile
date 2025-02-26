import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function BookingLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          // Các option khác nếu cần, ví dụ animation, headerTintColor,...
        }}
      >
        {/* Trang danh sách đặt lịch */}
        <Stack.Screen name="index" options={{ title: "My Bookings" }} />

        {/* Các màn hình trong flow đặt lịch */}
        <Stack.Screen name="new" options={{ title: "New Booking" }} />
        <Stack.Screen
          name="specialist"
          options={{ title: "Select Specialist" }}
        />
        <Stack.Screen
          name="date-time"
          options={{ title: "Select Date & Time" }}
        />
        <Stack.Screen name="payment" options={{ title: "Payment" }} />
        <Stack.Screen name="confirm" options={{ title: "Confirm Booking" }} />
        <Stack.Screen name="success" options={{ title: "Booking Success" }} />

        {/* Nếu có các màn hình chi tiết, reschedule, cancel... bạn có thể thêm tại đây */}
        <Stack.Screen name="detail" options={{ title: "Booking Details" }} />
        {/* <Stack.Screen
          name="reschedule"
          options={{ title: "Reschedule Booking" }}
        /> */}
        {/* <Stack.Screen name="cancel" options={{ title: "Cancel Booking" }} /> */}
      </Stack>
    </SafeAreaView>
  );
}
