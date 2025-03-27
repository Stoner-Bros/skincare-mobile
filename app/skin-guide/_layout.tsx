import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SkinGuideLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Skin Care Guide",
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="article/[id]"
        options={{
          title: "Article",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          title: "Category",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
