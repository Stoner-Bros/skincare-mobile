import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Treatments from "@/components/home/Treaments";

export default function CategoryPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // You would typically fetch category data based on the ID
  const categoryData = {
    1: { name: "Facial", icon: "✨" },
    2: { name: "Body Care", icon: "🧴" },
    3: { name: "Massage", icon: "💆‍♀️" },
    4: { name: "Treatments", icon: "⭐" },
  }[id as string];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
          title: categoryData?.name || "Category",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.icon}>{categoryData?.icon}</Text>
          <Text style={styles.title}>{categoryData?.name}</Text>
        </View>
        <Treatments categoryId={id as string} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});
