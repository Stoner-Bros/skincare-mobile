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
import { api } from "../../lib/api/endpoints";
import type { SkinTherapistResponse, SpecialistUI } from "../../lib/types/api";

export default function Specialists() {
  const router = useRouter();
  const [specialists, setSpecialists] = useState<SpecialistUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      const response = await api.specialists.getTherapists();
      // console.log("Specialists response:", response);

      // Kiểm tra nếu có data
      if (!response || !response.data || !response.data.data) {
        setError("Không có dữ liệu chuyên gia");
        setSpecialists([]);
        return;
      }

      const apiData = response.data.data;
      if (!apiData.items || apiData.items.length === 0) {
        setSpecialists([]);
        return;
      }

      // Chuyển đổi từ SkinTherapistResponse sang SpecialistUI để dễ sử dụng
      const formattedSpecialists: SpecialistUI[] = apiData.items.map(
        (item: SkinTherapistResponse) => ({
          id: item.accountId,
          fullName: item.account.accountInfo.fullName,
          specialization: item.specialization,
          avatar: item.account.accountInfo.avatar
            ? item.account.accountInfo.avatar.startsWith("http")
              ? item.account.accountInfo.avatar
              : `https://skincare-api.azurewebsites.net/api/upload/${item.account.accountInfo.avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.account.accountInfo.fullName || "Specialist"
              )}&background=random&color=fff&size=256`,
          experience: item.experience,
          bio: item.bio,
          rating: item.rating,
          isAvailable: item.isAvailable,
          introduction: item.introduction,
          email: item.account.email,
          phone: item.account.accountInfo.phone,
          address: item.account.accountInfo.address,
        })
      );

      setSpecialists(formattedSpecialists);
    } catch (error) {
      console.error("Error loading specialists:", error);
      setError("Không thể tải danh sách chuyên gia");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSpecialist = (specialistId: number) => {
    router.push(`/specialist/${specialistId}` as any);
  };

  if (loading) {
    return (
      <View style={[styles.section, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#A83F98" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.section, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (specialists.length === 0) {
    return (
      <View style={[styles.section, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Không có chuyên gia nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Chuyên gia chăm sóc da</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specialistsContainer}
      >
        {specialists.map((specialist) => (
          <TouchableOpacity
            key={specialist.id}
            style={styles.specialistCard}
            onPress={() => navigateToSpecialist(specialist.id)}
          >
            <Image
              source={{ uri: specialist.avatar }}
              style={styles.specialistImage}
            />
            <Text style={styles.specialistName}>{specialist.fullName}</Text>
            <Text style={styles.specialistSpecialty}>
              {specialist.specialization}
            </Text>
            {specialist.isAvailable ? (
              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>Có sẵn</Text>
              </View>
            ) : (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Không có sẵn</Text>
              </View>
            )}
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
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 14,
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
    position: "relative",
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
  availableBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  availableText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  unavailableBadge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  unavailableText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
});
