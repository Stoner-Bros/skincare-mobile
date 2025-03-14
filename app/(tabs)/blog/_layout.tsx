import { Stack } from "expo-router";

export default function BlogFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Blog" }} />
    </Stack>
  );
}
