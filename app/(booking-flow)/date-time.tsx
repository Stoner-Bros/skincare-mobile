import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import type { TimeSlot, SkinTherapistResponse } from "@/lib/types/api";
import TimeSlots from "@/components/common/TimeSlots";

// Dữ liệu mẫu cho các ngày
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date,
      available: Math.random() > 0.3, // Ngẫu nhiên tính khả dụng
    });
  }

  return dates;
};

// Dữ liệu mẫu cho các khung giờ
const timeSlots = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "12:00 PM", available: true },
  { time: "01:00 PM", available: false },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "04:00 PM", available: false },
  { time: "05:00 PM", available: true },
];

interface FormattedTherapist {
  id: number;
  name: string;
  specialization: string;
  experience?: string;
  avatar: string;
}

interface TimeSlotData {
  timeSlotId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes: string;
}

export default function DateTimeSelection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<Array<{ date: Date; available: boolean }>>(
    []
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotData | null>(
    null
  );
  const [availableTherapists, setAvailableTherapists] = useState<
    FormattedTherapist[]
  >([]);
  const [selectedTherapist, setSelectedTherapist] =
    useState<FormattedTherapist | null>(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(
    null
  );
  const [treatmentInfo, setTreatmentInfo] = useState<any>(null);
  const [requiredSlots, setRequiredSlots] = useState(1);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlotData[]>(
    []
  );

  // Generate dates for next 14 days
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
          date: date,
          available: true, // Will be updated when checking availability
        });
      }

      setDates(dates);
    };

    generateDates();
  }, []);

  // Load specialist and initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const specialistData = await AsyncStorage.getItem("selectedSpecialist");
        if (specialistData) {
          setSelectedTherapist(JSON.parse(specialistData));
        }
      } catch (error) {
        console.error("Error loading specialist:", error);
        setError("Failed to load specialist data");
      }
    };

    loadInitialData();
  }, []);

  // Load time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate]);

  // Thêm useEffect để load treatment info
  useEffect(() => {
    const loadTreatmentInfo = async () => {
      try {
        const treatmentData = await AsyncStorage.getItem("selectedTreatment");
        if (treatmentData) {
          const treatment = JSON.parse(treatmentData);
          setTreatmentInfo(treatment);
          // Tính số slot cần dựa vào duration (giả sử mỗi slot là 60 phút)
          const slotsNeeded = Math.ceil(treatment.duration / 60);
          setRequiredSlots(slotsNeeded);
        }
      } catch (error) {
        console.error("Error loading treatment:", error);
      }
    };
    loadTreatmentInfo();
  }, []);

  const loadTimeSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);
    try {
      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const response = await api.timeSlots.getTimeSlots(formattedDate);
      console.log("Time slots response:", response);

      // Sửa lại cách lấy data từ response
      if (response?.data) {
        // Chỉ kiểm tra response.data thôi
        const formattedSlots = response.data.map((slot: TimeSlotData) => ({
          timeSlotId: slot.timeSlotId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
          notes: slot.notes,
          displayTime: new Date(
            `2000-01-01T${slot.startTime}`
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setTimeSlots(formattedSlots);
        setSelectedTimeSlot(null); // Reset selected time slot
        console.log("Formatted time slots:", formattedSlots);
      } else {
        setTimeSlots([]);
        setError("No time slots available");
      }
    } catch (error) {
      console.error("Error loading time slots:", error);
      setError("Failed to load time slots");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset selected time when date changes
  };

  const formatTherapistData = (
    therapist: SkinTherapistResponse
  ): FormattedTherapist => {
    return {
      id: therapist.accountId,
      name: therapist.account?.accountInfo?.fullName || "Unknown",
      specialization: therapist.specialization || "",
      experience: therapist.experience,
      avatar: therapist.account?.accountInfo?.avatar
        ? therapist.account.accountInfo.avatar.startsWith("http")
          ? therapist.account.accountInfo.avatar
          : `https://skincare-api.azurewebsites.net/api/upload/${therapist.account.accountInfo.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            therapist.account?.accountInfo?.fullName || "Specialist"
          )}&background=random&color=fff&size=256`,
    };
  };

  const handleTimeSelect = async (slot: TimeSlotData) => {
    try {
      // Nếu slot đã được chọn, remove nó
      if (selectedTimeSlots.find((s) => s.timeSlotId === slot.timeSlotId)) {
        setSelectedTimeSlots((prev) =>
          prev.filter((s) => s.timeSlotId !== slot.timeSlotId)
        );
        return;
      }

      // Kiểm tra xem có thể chọn slot này không
      const slotIndex = timeSlots.findIndex(
        (s) => s.timeSlotId === slot.timeSlotId
      );
      const nextSlots = timeSlots.slice(slotIndex, slotIndex + requiredSlots);

      // Kiểm tra đủ số slot liên tiếp và available
      if (
        nextSlots.length < requiredSlots ||
        !nextSlots.every((s) => s.isAvailable)
      ) {
        Alert.alert(
          "Invalid Selection",
          `This treatment requires ${requiredSlots} consecutive time slots`
        );
        return;
      }

      setLoading(true);
      const formattedDate = selectedDate!.toISOString().split("T")[0];
      const selectedSlotIds = nextSlots.map((s) => s.timeSlotId);
      console.log("selectedSlotIds", selectedSlotIds);
      try {
        // Lấy danh sách therapist rảnh cho các slots đã chọn
        const freeTherapistsResponse = await api.timeSlots.getFreeTherapists(
          formattedDate,
          selectedSlotIds
        );

        console.log("Free therapists response:", freeTherapistsResponse);

        if (freeTherapistsResponse?.data?.items?.length > 0) {
          // Nếu đã chọn specialist trước đó, kiểm tra xem họ có trong danh sách rảnh không
          if (selectedTherapist) {
            const isTherapistAvailable = freeTherapistsResponse.data.items.some(
              (therapist: any) => therapist.accountId === selectedTherapist.id
            );

            if (!isTherapistAvailable) {
              Alert.alert(
                "Specialist Not Available",
                "The selected specialist is not available for these time slots. Would you like to choose another specialist?",
                [
                  {
                    text: "Choose Another",
                    onPress: () => {
                      const formattedTherapists =
                        freeTherapistsResponse.data.items.map(
                          formatTherapistData
                        );
                      setAvailableTherapists(formattedTherapists);
                      setShowTherapistModal(true);
                    },
                  },
                  {
                    text: "Skip Specialist",
                    onPress: () => {
                      setSelectedTherapist(null);
                      AsyncStorage.removeItem("selectedSpecialist");
                    },
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ]
              );
              return;
            }
          } else {
            // Nếu chưa chọn specialist, hiển thị modal để chọn từ danh sách rảnh
            const formattedTherapists =
              freeTherapistsResponse.data.items.map(formatTherapistData);
            setAvailableTherapists(formattedTherapists);
            setShowTherapistModal(true);
          }
        } else {
          // Nếu không có specialist nào rảnh, cho phép tiếp tục mà không cần chọn
          Alert.alert(
            "No Specialists Available",
            "There are no specialists available for these time slots. You can continue without selecting a specialist.",
            [
              {
                text: "Continue Without Specialist",
                onPress: () => {
                  setSelectedTherapist(null);
                  AsyncStorage.removeItem("selectedSpecialist");
                },
              },
              {
                text: "Choose Different Time",
                style: "cancel",
              },
            ]
          );
        }

        // Cập nhật selected slots
        setSelectedTimeSlots(nextSlots);
      } catch (error) {
        console.error("Error checking therapist availability:", error);
        // Cho phép tiếp tục nếu không check được availability
        Alert.alert(
          "Warning",
          "Unable to verify specialist availability. You can continue without selecting a specialist.",
          [
            {
              text: "Continue Without Specialist",
              onPress: () => {
                setSelectedTherapist(null);
                AsyncStorage.removeItem("selectedSpecialist");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error in handleTimeSelect:", error);
      Alert.alert("Error", "Failed to process time slot selection");
    } finally {
      setLoading(false);
    }
  };

  const handleTherapistSelect = async (
    therapist: FormattedTherapist | null
  ) => {
    setSelectedTherapist(therapist);
    setShowTherapistModal(false);

    if (therapist) {
      try {
        await AsyncStorage.setItem(
          "selectedSpecialist",
          JSON.stringify(therapist) // Save formatted data
        );
      } catch (error) {
        console.error("Error saving therapist:", error);
      }
    }
  };

  const handleContinue = async () => {
    if (!selectedDate || selectedTimeSlots.length === 0) {
      Alert.alert("Please select date and time slots");
      return;
    }

    if (selectedTimeSlots.length < requiredSlots) {
      Alert.alert(
        "Please select enough time slots",
        `This treatment requires ${requiredSlots} consecutive time slots`
      );
      return;
    }

    try {
      const bookingState = {
        date: selectedDate.toISOString().split("T")[0],
        timeSlotIds: selectedTimeSlots.map((slot) => slot.timeSlotId),
        specialistId: selectedTherapist?.id || null, // Cho phép null
      };

      await AsyncStorage.setItem("bookingState", JSON.stringify(bookingState));
      router.push("/(booking-flow)/confirm");
    } catch (error) {
      console.error("Error saving booking state:", error);
      Alert.alert("Error", "Failed to save booking information");
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Debug log
  useEffect(() => {
    console.log("State updated - selectedDate:", selectedDate);
    console.log("State updated - selectedTimeSlot:", selectedTimeSlot);
  }, [selectedDate, selectedTimeSlot]);

  // Therapist Modal Component
  const TherapistModal = () => (
    <Modal
      visible={showTherapistModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Available Specialists</Text>
          <Text style={styles.modalSubtitle}>
            Optional: You can skip selecting a specialist
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2ecc71" />
          ) : availableTherapists.length > 0 ? (
            <ScrollView style={styles.therapistList}>
              {availableTherapists.map((therapist) => (
                <TouchableOpacity
                  key={therapist.id}
                  style={styles.therapistItem}
                  onPress={() => handleTherapistSelect(therapist)}
                >
                  <Image
                    source={{ uri: therapist.avatar }}
                    style={styles.therapistAvatar}
                  />
                  <View style={styles.therapistInfo}>
                    <Text style={styles.therapistName}>{therapist.name}</Text>
                    <Text style={styles.therapistSpecialization}>
                      {therapist.specialization}
                    </Text>
                    {therapist.experience && (
                      <Text style={styles.experienceText}>
                        Experience: {therapist.experience}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noTherapistsText}>
              No specialists available for this time slot
            </Text>
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => handleTherapistSelect(null)}
          >
            <Text style={styles.skipButtonText}>Skip Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Selected Therapist Display
  const SelectedTherapistInfo = () => {
    if (!selectedTherapist) return null;

    return (
      <View style={styles.selectedTherapistContainer}>
        <Text style={styles.sectionTitle}>Selected Specialist</Text>
        <View style={styles.therapistCard}>
          <Image
            source={{ uri: selectedTherapist.avatar }}
            style={styles.therapistAvatar}
          />
          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>{selectedTherapist.name}</Text>
            <Text style={styles.therapistSpecialization}>
              {selectedTherapist.specialization}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowTherapistModal(true)}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Chỉ áp dụng SafeArea cho top */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  !item.available && styles.unavailableDate,
                  selectedDate?.toDateString() === item.date.toDateString() &&
                    styles.selectedDate,
                ]}
                onPress={() => handleDateSelect(item.date)}
              >
                <Text style={styles.dateDay}>
                  {item.date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text style={styles.dateNumber}>{item.date.getDate()}</Text>
                <Text style={styles.dateMonth}>
                  {item.date.toLocaleDateString("en-US", { month: "short" })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2ecc71" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadTimeSlots}
            >
              {/* <TimeSlots/> */}
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : timeSlots.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Available Times for{" "}
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.timeSlotId}
                  style={[
                    styles.timeSlot,
                    !slot.isAvailable && styles.unavailableTime,
                    selectedTimeSlots.find(
                      (s) => s.timeSlotId === slot.timeSlotId
                    ) && styles.selectedTime,
                  ]}
                  onPress={() => slot.isAvailable && handleTimeSelect(slot)}
                  disabled={!slot.isAvailable}
                >
                  <Text
                    style={[
                      styles.timeText,
                      !slot.isAvailable && styles.unavailableTimeText,
                      selectedTimeSlots.find(
                        (s) => s.timeSlotId === slot.timeSlotId
                      ) && styles.selectedTimeText,
                    ]}
                  >
                    {slot.displayTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No time slots available for this date
            </Text>
          </View>
        )}

        <SelectedTherapistInfo />

        {/* Thêm khoảng trống ở cuối để tránh bị che bởi nút Continue */}
        <View style={{ height: 140 }} />
      </ScrollView>
      {/* Điều chỉnh vị trí của footer để không bị bottom tab che */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTimeSlots.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedTimeSlots.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue to Confirmation
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <TherapistModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  datesContainer: {
    paddingBottom: 8,
    gap: 10,
  },
  dateCard: {
    width: 70,
    height: 90,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  unavailableDate: {
    backgroundColor: "#f1f1f1",
    opacity: 0.7,
  },
  selectedDate: {
    backgroundColor: "#2ecc71",
  },
  dateDay: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 14,
    color: "#666",
  },
  unavailableText: {
    color: "#999",
  },
  selectedDateText: {
    color: "white",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 16,
  },
  timeSlot: {
    width: "30%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  selectedTime: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  unavailableTime: {
    backgroundColor: "#f1f1f1",
    opacity: 0.7,
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTimeText: {
    color: "white",
    fontWeight: "600",
  },
  unavailableTimeText: {
    color: "#999",
  },
  selectedTherapistContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  therapistCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  therapistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  therapistSpecialization: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 70, // Thêm khoảng cách để tránh bottom tab
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    zIndex: 10,
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
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  therapistList: {
    maxHeight: 300,
  },
  therapistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  skipButton: {
    padding: 12,
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    alignItems: "center",
  },
  skipButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
  },
  experienceText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noTherapistsText: {
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});
