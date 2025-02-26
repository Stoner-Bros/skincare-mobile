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

const popularTreatments = [
  {
    id: 1,
    name: "Deep Tissue Massage",
    image: "https://v0.dev/placeholder.svg?height=150&width=300",
    duration: "60 min",
    price: "$89",
  },
  {
    id: 2,
    name: "Urban Classic Massage",
    image: "https://v0.dev/placeholder.svg?height=150&width=300",
    duration: "45 min",
    price: "$75",
  },
  {
    id: 3,
    name: "Relaxing Massage",
    image: "https://v0.dev/placeholder.svg?height=150&width=300",
    duration: "90 min",
    price: "$120",
  },
];

export default function PopularTreatments() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Treatments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {popularTreatments.map((treatment) => (
          <Pressable
            key={treatment.id}
            style={styles.treatmentCard}
            onPress={() => router.push(`/treatment/${treatment.id}`)}
          >
            <Image
              source={{ uri: treatment.image }}
              style={styles.treatmentImage}
            />
            <View style={styles.treatmentInfo}>
              <Text style={styles.treatmentName}>{treatment.name}</Text>
              <View style={styles.treatmentDetails}>
                <Text style={styles.duration}>
                  <Ionicons name="time-outline" size={14} color="#666" />{" "}
                  {treatment.duration}
                </Text>
                <Text style={styles.price}>{treatment.price}</Text>
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
  treatmentCard: {
    width: 250,
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
  treatmentImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  treatmentInfo: {
    padding: 12,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  treatmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2ecc71",
  },
});
