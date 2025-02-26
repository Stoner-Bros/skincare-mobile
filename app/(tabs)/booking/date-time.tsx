import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function DateTimeSelection() {
  const router = useRouter();
  const [dates, setDates] = useState(generateDates());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [specialist, setSpecialist] = useState<any>(null);

  // Lấy thông tin chuyên gia đã chọn từ AsyncStorage
  useEffect(() => {
    const loadSpecialist = async () => {
      try {
        const specialistData = await AsyncStorage.getItem("selectedSpecialist");
        if (specialistData) {
          setSpecialist(JSON.parse(specialistData));
        }
      } catch (error) {
        console.error("Error loading specialist:", error);
      }
    };

    loadSpecialist();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected Date:", date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log("Selected Time:", time);
  };

  const handleContinue = () => {
    console.log("Continue button pressed");
    console.log("Current selectedDate:", selectedDate);
    console.log("Current selectedTime:", selectedTime);

    if (!selectedDate || !selectedTime) {
      Alert.alert(
        "Chưa chọn thời gian",
        "Vui lòng chọn ngày và giờ cho lịch hẹn của bạn.",
        [{ text: "OK" }]
      );
      return;
    }

    // Lưu thông tin ngày giờ đã chọn
    const saveDateTime = async () => {
      try {
        await AsyncStorage.setItem("selectedDate", selectedDate.toISOString());
        await AsyncStorage.setItem("selectedTime", selectedTime);

        // Chuyển đến trang xác nhận với thông tin đã chọn
        router.push({
          pathname: "/booking/confirm",
          params: {
            date: selectedDate.toISOString(),
            time: selectedTime,
            specialistId: specialist?.id || global.selectedSpecialistId,
          },
        });
      } catch (error) {
        console.error("Error saving date and time:", error);
        // Nếu có lỗi, vẫn cố gắng chuyển trang
        router.push("/booking/confirm");
      }
    };

    saveDateTime();
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
    console.log("State updated - selectedTime:", selectedTime);
  }, [selectedDate, selectedTime]);

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
                  isDateSelected(item.date) && styles.selectedDate,
                ]}
                onPress={() => item.available && handleDateSelect(item.date)}
                disabled={!item.available}
              >
                <Text
                  style={[
                    styles.dateDay,
                    !item.available && styles.unavailableText,
                    isDateSelected(item.date) && styles.selectedDateText,
                  ]}
                >
                  {item.date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    !item.available && styles.unavailableText,
                    isDateSelected(item.date) && styles.selectedDateText,
                  ]}
                >
                  {item.date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dateMonth,
                    !item.available && styles.unavailableText,
                    isDateSelected(item.date) && styles.selectedDateText,
                  ]}
                >
                  {item.date.toLocaleDateString("en-US", { month: "short" })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedDate
              ? `Available Times for ${formatDate(selectedDate)}`
              : "Select a Time"}
          </Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableTime,
                  selectedTime === slot.time && styles.selectedTime,
                ]}
                onPress={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeText,
                    !slot.available && styles.unavailableTimeText,
                    selectedTime === slot.time && styles.selectedTimeText,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {specialist && (
          <View style={styles.specialistSection}>
            <Text style={styles.sectionTitle}>Your Selected Specialist</Text>
            <View style={styles.specialistCard}>
              <View style={styles.specialistInfo}>
                <Text style={styles.specialistName}>{specialist.name}</Text>
                <Text style={styles.specialistRole}>{specialist.role}</Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => router.push("/booking/specialist")}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Thêm khoảng trống ở cuối để tránh bị che bởi nút Continue */}
        <View style={{ height: 140 }} />
      </ScrollView>
      {/* Điều chỉnh vị trí của footer để không bị bottom tab che */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            Continue to Confirmation
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
  },
  timeSlot: {
    width: "30%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  unavailableTime: {
    backgroundColor: "#f1f1f1",
    opacity: 0.7,
  },
  selectedTime: {
    backgroundColor: "#2ecc71",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  unavailableTimeText: {
    color: "#999",
  },
  selectedTimeText: {
    color: "white",
    fontWeight: "600",
  },
  specialistSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  specialistCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  specialistRole: {
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
});
