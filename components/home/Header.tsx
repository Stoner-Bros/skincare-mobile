import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>LuxSpa</Text>
      <TouchableOpacity onPress={() => router.push("/bookmarks")}>
        <Ionicons name="bookmark-outline" size={24} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});
