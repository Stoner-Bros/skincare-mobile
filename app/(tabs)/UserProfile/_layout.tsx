import { Stack } from "expo-router";

export default function UserProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="bookings" options={{ title: "My Bookings" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="payments" options={{ title: "Payment Methods" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="support" options={{ title: "Help & Support" }} />
    </Stack>
  );
}
