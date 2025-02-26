import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const categories = [
  { id: 1, name: "Facial", icon: "✨" },
  { id: 2, name: "Body Care", icon: "🧴" },
  { id: 3, name: "Massage", icon: "💆‍♀️" },
  { id: 4, name: "Treatments", icon: "⭐" },
];

export default function Categories() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => router.push(`/category/${category.id}`)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    width: 100,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
  },
});
