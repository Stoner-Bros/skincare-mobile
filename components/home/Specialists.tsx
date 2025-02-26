import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const specialists = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Facial Expert",
    image: "https://v0.dev/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Emma Beauty",
    specialty: "Skin Specialist",
    image: "https://v0.dev/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Maria Chen",
    specialty: "Dermatologist",
    image: "https://v0.dev/placeholder.svg?height=80&width=80",
  },
];

export default function Specialists() {
  const router = useRouter();

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
              source={{ uri: specialist.image }}
              style={styles.specialistImage}
            />
            <Text style={styles.specialistName}>{specialist.name}</Text>
            <Text style={styles.specialistSpecialty}>
              {specialist.specialty}
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
