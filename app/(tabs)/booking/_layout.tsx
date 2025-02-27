import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function BookingLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(booking-flow)/new")}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="add" size={24} color="#2ecc71" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
