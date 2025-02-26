import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const featuredSpas = [
  {
    id: 1,
    name: "Gold Spa & Cream",
    description:
      "From Relaxation To Recovery Treatments To Suit Every Lifestyle",
    image: "https://v0.dev/placeholder.svg?height=200&width=400",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 2,
    name: "Nutra Spa Beauty And Spa",
    description:
      "From Relaxation To Recovery Treatments To Suit Every Lifestyle",
    image: "https://v0.dev/placeholder.svg?height=200&width=400",
    rating: 4.7,
    reviews: 95,
  },
];

export default function FeaturedSpas() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Featured Spas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuredSpas.map((spa) => (
          <Pressable
            key={spa.id}
            style={styles.spaCard}
            onPress={() => router.push(`/spa/${spa.id}`)}
          >
            <Image source={{ uri: spa.image }} style={styles.spaImage} />
            <View style={styles.spaInfo}>
              <Text style={styles.spaName}>{spa.name}</Text>
              <Text style={styles.spaDescription} numberOfLines={2}>
                {spa.description}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{spa.rating}</Text>
                <Text style={styles.reviews}>({spa.reviews} reviews)</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  spaCard: {
    width: 300,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  spaInfo: {
    padding: 12,
  },
  spaName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  spaDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});
