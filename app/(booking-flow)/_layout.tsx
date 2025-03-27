import { Stack } from "expo-router";
import { BookingProvider } from "@/app/context/BookingContext";

export default function BookingFlowLayout() {
  return (
    <BookingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="new"
          options={{
            title: "Select Treatment",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="specialist"
          options={{
            title: "Choose Specialist",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="date-time"
          options={{
            title: "Select Date & Time",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="confirm"
          options={{
            title: "Confirm Booking",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: "Checkout",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="success"
          options={{
            title: "Booking Success",
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "Booking Details",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="cancel/[id]"
          options={{
            title: "Cancel Booking",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="reschedule/[id]"
          options={{
            title: "Reschedule Booking",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </BookingProvider>
  );
}
