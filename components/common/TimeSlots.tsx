import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { api } from "@/lib/api/endpoints";
import type { TimeSlot } from "@/lib/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

interface TimeSlotsProps {
  onSelectTimeSlot?: (timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  selectedSlot?: TimeSlot | null;
  serviceId?: number;
}

const { width } = Dimensions.get("window");
const SLOT_WIDTH = width * 0.25; // 25% của chiều rộng màn hình

const TimeSlots = ({
  onSelectTimeSlot,
  selectedDate,
  selectedSlot,
  serviceId,
}: TimeSlotsProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimeSlots();
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.timeSlots.getTimeSlots();
      console.log("Time slots response:", response);

      if (response?.data) {
        setTimeSlots(response.data);
        if (response.data.length === 0) {
          setError("Không có khung giờ nào");
        }
      } else {
        setTimeSlots([]);
        setError("Không có dữ liệu khung giờ");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setError("Không thể tải khung giờ. Vui lòng thử lại sau.");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Format "08:00:00" to "08:00"
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    onSelectTimeSlot?.(slot);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" color="#A83F98" />
        <Text className="mt-4 text-gray-600 font-medium">
          Đang tải khung giờ...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <MaterialCommunityIcons
          name="clock-alert-outline"
          size={48}
          color="#EF4444"
        />
        <Text className="mt-4 text-red-500 text-center font-medium">
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchTimeSlots}
          className="mt-4 px-6 py-2 bg-red-100 rounded-full"
        >
          <Text className="text-red-500 font-medium">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <MaterialCommunityIcons
          name="clock-outline"
          size={48}
          color="#6B7280"
        />
        <Text className="mt-4 text-gray-500 text-center font-medium">
          Không có khung giờ nào
        </Text>
      </View>
    );
  }

  // Nhóm các time slots theo khoảng thời gian (sáng, chiều, tối)
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const hour = parseInt(slot.startTime.split(":")[0]);
    let period = "";

    if (hour < 12) period = "Buổi sáng";
    else if (hour < 17) period = "Buổi chiều";
    else period = "Buổi tối";

    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <View className="flex-1">
      {Object.entries(groupedTimeSlots).map(([period, slots]) => (
        <View key={period} className="mb-6">
          <View className="flex-row items-center px-4 mb-2">
            <MaterialCommunityIcons
              name={
                period === "Buổi sáng"
                  ? "weather-sunny"
                  : period === "Buổi chiều"
                  ? "weather-sunset"
                  : "weather-night"
              }
              size={20}
              color="#A83F98"
            />
            <Text className="ml-2 text-base font-medium text-gray-800">
              {period}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            {slots.map((slot) => (
              <Link
                key={slot.timeSlotId}
                href={{
                  pathname: "/(booking-flow)/confirm",
                  params: {
                    timeSlotId: slot.timeSlotId,
                    serviceId: serviceId,
                    date: selectedDate?.toISOString(),
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                }}
                asChild
              >
                <TouchableOpacity
                  disabled={!slot.isAvailable}
                  style={{ width: SLOT_WIDTH }}
                  className={`
                    mx-2 px-3 py-4 rounded-xl
                    ${
                      !slot.isAvailable
                        ? "bg-gray-50 border border-gray-200"
                        : selectedSlot?.timeSlotId === slot.timeSlotId
                        ? "bg-purple-600 shadow-sm"
                        : "bg-white border border-purple-100"
                    }
                  `}
                  onPress={() => handleSelectTimeSlot(slot)}
                >
                  <Text
                    className={`
                      text-center text-base font-medium
                      ${
                        !slot.isAvailable
                          ? "text-gray-400"
                          : selectedSlot?.timeSlotId === slot.timeSlotId
                          ? "text-white"
                          : "text-purple-600"
                      }
                    `}
                  >
                    {formatTime(slot.startTime)}
                  </Text>
                  <Text
                    className={`
                      text-center text-xs mt-1
                      ${
                        !slot.isAvailable
                          ? "text-gray-400"
                          : selectedSlot?.timeSlotId === slot.timeSlotId
                          ? "text-purple-100"
                          : "text-purple-400"
                      }
                    `}
                  >
                    {slot.isAvailable
                      ? formatTime(slot.endTime)
                      : "Không có sẵn"}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default TimeSlots;
