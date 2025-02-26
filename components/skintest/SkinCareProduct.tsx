import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const products = [
  {
    id: 1,
    name: "Hydrating Facial Cleanser",
    brand: "Pure Glow",
    price: 28.99,
    rating: 4.8,
    reviews: 124,
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    skinTypes: ["Dry", "Normal", "Sensitive"],
  },
  {
    id: 2,
    name: "Vitamin C Brightening Serum",
    brand: "Radiance",
    price: 45.99,
    rating: 4.7,
    reviews: 98,
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    skinTypes: ["All Skin Types"],
  },
  {
    id: 3,
    name: "Oil Control Moisturizer",
    brand: "Clear Balance",
    price: 32.5,
    rating: 4.6,
    reviews: 87,
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    skinTypes: ["Oily", "Combination"],
  },
  {
    id: 4,
    name: "Retinol Night Repair Cream",
    brand: "Ageless Beauty",
    price: 52.99,
    rating: 4.9,
    reviews: 156,
    image: "https://v0.dev/placeholder.svg?height=100&width=100",
    skinTypes: ["Normal", "Dry", "Combination"],
  },
];

export default function SkinCareProducts() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Products</Text>
        <TouchableOpacity onPress={() => router.push("/products")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => router.push(`/product/${product.id}`)}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.productMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Text style={styles.reviewCount}>({product.reviews})</Text>
                </View>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
              <View style={styles.skinTypeContainer}>
                {product.skinTypes.map((type, index) => (
                  <View key={index} style={styles.skinTypeTag}>
                    <Text style={styles.skinTypeText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
  },
  scrollContent: {
    paddingRight: 16,
  },
  productCard: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2ecc71",
  },
  skinTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skinTypeTag: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skinTypeText: {
    fontSize: 10,
    color: "#666",
  },
});
