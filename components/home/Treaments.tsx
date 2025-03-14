import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { serviceApi } from "../../lib/api/endpoints";
import type { Service } from "../../lib/types/api";

export default function PopularTreatments() {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      const data = await serviceApi.getServices();
      console.log("Raw treatments data:", data);
      // Lấy mảng treatments từ response
      const treatmentsData = data[0]?.treatments || [];
      console.log("Processed treatments data:", treatmentsData);
      setTreatments(treatmentsData);
    } catch (error) {
      console.error("Error loading treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.section, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Treatments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {treatments.map((treatment) => (
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
                  {treatment.duration} min
                </Text>
                <Text style={styles.price}>${treatment.price}</Text>
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
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
