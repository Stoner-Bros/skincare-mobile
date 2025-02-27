import { Stack } from "expo-router";

export default function BookingFlowLayout() {
  return (
    <Stack>
      <Stack.Screen name="new" options={{ title: "New Booking" }} />
      <Stack.Screen
        name="date-time"
        options={{ title: "Select Date & Time" }}
      />
      <Stack.Screen
        name="specialist"
        options={{ title: "Choose Specialist" }}
      />
      {/* <Stack.Screen name="payment" options={{ title: "Payment" }} /> */}
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: "Success",
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Stack.Screen name="confirm" options={{ title: "Confirm Booking" }} />
      {/* <Stack.Screen
        name="success"
        options={{ title: "Success", headerShown: false }}
      /> */}
      <Stack.Screen name="cancel/[id]" options={{ title: "Cancel Booking" }} />
      <Stack.Screen
        name="reschedule/[id]"
        options={{ title: "Reschedule Booking" }}
      />
    </Stack>
  );
}
