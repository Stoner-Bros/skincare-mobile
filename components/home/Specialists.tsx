import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { specialistApi } from "../../lib/api/endpoints";
import type { Specialist } from "../../lib/types/api";

export default function Specialists() {
  const router = useRouter();
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      const data = await specialistApi.getSpecialists();
      // console.log("Raw data from API:", data);
      setSpecialists(data);
    } catch (error) {
      console.error("Error loading specialists:", error);
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
      <Text style={styles.sectionTitle}>Our Specialists</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specialistsContainer}
      >
        {specialists.map((specialist) => (
          <TouchableOpacity
            key={specialist.id}
            style={styles.specialistCard}
            onPress={() => router.push(`/specialist/${specialist.id}`)}
          >
            <Image
              source={{ uri: specialist.avatar }}
              style={styles.specialistImage}
            />
            <Text style={styles.specialistName}>{specialist.name}</Text>
            <Text style={styles.specialistSpecialty}>{specialist.role}</Text>
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 12,
  },
  specialistsContainer: {
    paddingHorizontal: 16,
  },
  specialistCard: {
    alignItems: "center",
    marginRight: 16,
    width: 120,
  },
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  specialistSpecialty: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
});
