import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../lib/api/endpoints";

export default function Categories() {
  const router = useRouter();
  const categories = api.categories.getCategories();

  const handleCategoryPress = (category) => {
    router.push({
      pathname: `/category/${category.id}`,
      params: {
        name: category.name,
        treatments: JSON.stringify(category.treatments),
      },
    });
  };

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
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.treatmentCount}>
              {category.treatments.length} treatments
            </Text>
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
  treatmentCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
