import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dữ liệu mẫu cho các chuyên gia
const specialists = [
  {
    id: 1,
    name: "Jazy Dewo",
    role: "Senior Esthetician",
    experience: "5 years",
    rating: 4.9,
    reviews: 120,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialist1-Yd9Iy9Yd9Iy9.jpg",
    availability: ["Mon", "Tue", "Wed", "Fri"],
    specialties: ["Facial Treatments", "Anti-Aging", "Acne Treatment"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Massage Therapist",
    experience: "7 years",
    rating: 4.8,
    reviews: 98,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialist2-Yd9Iy9Yd9Iy9.jpg",
    availability: ["Mon", "Wed", "Thu", "Sat"],
    specialties: ["Deep Tissue", "Swedish Massage", "Hot Stone"],
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Skincare Expert",
    experience: "4 years",
    rating: 4.7,
    reviews: 85,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialist3-Yd9Iy9Yd9Iy9.jpg",
    availability: ["Tue", "Thu", "Fri", "Sun"],
    specialties: ["Hydrating Facial", "Skin Analysis", "Chemical Peels"],
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Body Treatment Specialist",
    experience: "6 years",
    rating: 4.9,
    reviews: 110,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialist4-Yd9Iy9Yd9Iy9.jpg",
    availability: ["Mon", "Tue", "Sat", "Sun"],
    specialties: ["Body Wraps", "Scrubs", "Cellulite Treatments"],
  },
];

// Tạo một biến global để lưu trữ thông tin chuyên gia đã chọn
// Đây là cách đơn giản để chia sẻ dữ liệu giữa các component
// Trong ứng dụng thực tế, bạn nên sử dụng Context API hoặc Redux
global.selectedSpecialistId = null;
global.canProceedToNextStep = false;

export default function SpecialistSelection() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(
    null
  );
  const router = useRouter();
  const navigation = useNavigation();

  // Khi component mount, thiết lập lại trạng thái global
  useEffect(() => {
    global.canProceedToNextStep = false;

    // Thiết lập sự kiện cho nút Next trong layout
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Nếu đang điều hướng đến trang date-time và chưa chọn chuyên gia
      if (
        e.data.action.type === "NAVIGATE" &&
        e.data.action.payload?.name === "date-time" &&
        !global.canProceedToNextStep
      ) {
        // Ngăn chặn điều hướng
        e.preventDefault();

        // Hiển thị thông báo
        Alert.alert(
          "Chưa chọn chuyên gia",
          "Vui lòng chọn một chuyên gia trước khi tiếp tục.",
          [{ text: "OK" }]
        );
      }
    });

    // Cleanup khi component unmount
    return unsubscribe;
  }, [navigation]);

  // Khi người dùng chọn chuyên gia
  const handleSelectSpecialist = (id: number) => {
    setSelectedSpecialist(id);

    // Lưu ID chuyên gia đã chọn vào biến global
    global.selectedSpecialistId = id;
    global.canProceedToNextStep = true;

    // Lưu vào AsyncStorage để sử dụng ở các màn hình khác
    const saveSpecialist = async () => {
      try {
        const specialist = specialists.find((s) => s.id === id);
        if (specialist) {
          await AsyncStorage.setItem(
            "selectedSpecialist",
            JSON.stringify(specialist)
          );
        }
      } catch (error) {
        console.error("Error saving specialist:", error);
      }
    };

    saveSpecialist();
  };

  // Thêm nút Continue ở cuối trang để đảm bảo người dùng có thể tiếp tục
  // ngay cả khi không có bottom bar từ layout
  const handleContinue = () => {
    if (selectedSpecialist) {
      router.push("/(booking-flow)/date-time");
    } else {
      Alert.alert(
        "Chưa chọn chuyên gia",
        "Vui lòng chọn một chuyên gia trước khi tiếp tục.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Specialist</Text>
        <Text style={styles.subtitle}>
          Select the specialist for your treatment
        </Text>
      </View>

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[styles.filterChip, styles.activeFilterChip]}
          >
            <Text style={styles.activeFilterText}>All Specialists</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Facial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Massage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Body</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Hair Removal</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.specialistsSection}>
        {specialists.map((specialist) => (
          <TouchableOpacity
            key={specialist.id}
            style={[
              styles.specialistCard,
              selectedSpecialist === specialist.id &&
                styles.selectedSpecialistCard,
            ]}
            onPress={() => handleSelectSpecialist(specialist.id)}
          >
            <Image
              source={{ uri: specialist.image }}
              style={styles.specialistImage}
            />

            <View style={styles.specialistInfo}>
              <View style={styles.specialistHeader}>
                <View>
                  <Text style={styles.specialistName}>{specialist.name}</Text>
                  <Text style={styles.specialistRole}>{specialist.role}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{specialist.rating}</Text>
                </View>
              </View>

              <View style={styles.specialistDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="briefcase-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{specialist.experience}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {specialist.reviews} reviews
                  </Text>
                </View>
              </View>

              <View style={styles.specialtiesContainer}>
                {specialist.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyChip}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityLabel}>Available on: </Text>
                <View style={styles.daysContainer}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <View
                        key={day}
                        style={[
                          styles.dayChip,
                          specialist.availability.includes(day)
                            ? styles.availableDay
                            : styles.unavailableDay,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            specialist.availability.includes(day)
                              ? styles.availableDayText
                              : styles.unavailableDayText,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>

            <View style={styles.radioContainer}>
              <View style={styles.radioButton}>
                {selectedSpecialist === specialist.id && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút Continue ở cuối trang */}
      <View style={styles.continueButtonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSpecialist && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedSpecialist}
        >
          <Text style={styles.continueButtonText}>
            Continue to Select Date & Time
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  filterSection: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  activeFilterChip: {
    backgroundColor: "#2ecc71",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  specialistsSection: {
    paddingHorizontal: 20,
    gap: 16,
  },
  specialistCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  selectedSpecialistCard: {
    backgroundColor: "#e8f8f0",
    borderColor: "#2ecc71",
  },
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 18,
    fontWeight: "600",
  },
  specialistRole: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  specialistDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  specialtyChip: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: "#2ecc71",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  availabilityLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  daysContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dayChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  availableDay: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  unavailableDay: {
    backgroundColor: "#f1f1f1",
  },
  dayText: {
    fontSize: 10,
    fontWeight: "500",
  },
  availableDayText: {
    color: "#2ecc71",
  },
  unavailableDayText: {
    color: "#999",
  },
  radioContainer: {
    justifyContent: "center",
    paddingLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2ecc71",
  },
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 100,
  },
});
