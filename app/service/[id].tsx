import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/lib/api/endpoints";
import type { ServiceResponse, TimeSlot } from "@/lib/types/api";
import TimeSlots from "@/components/common/TimeSlots";

const ServiceDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    setLoading(true);
    try {
      const response = await api.services.getService(id as string);

      if (!response || !response.data || !response.data.data) {
        setError("Không thể tải thông tin dịch vụ");
        return;
      }

      // Lấy dữ liệu dịch vụ và cập nhật URL hình ảnh nếu cần
      const serviceData = response.data.data;

      const formattedService = {
        ...serviceData,
        serviceThumbnailUrl: serviceData.serviceThumbnailUrl
          ? serviceData.serviceThumbnailUrl.startsWith("http")
            ? serviceData.serviceThumbnailUrl
            : `https://skincare-api.azurewebsites.net/api/upload/${serviceData.serviceThumbnailUrl}`
          : `https://picsum.photos/seed/${serviceData.serviceId}/800/600`,
      };

      setService(formattedService);
    } catch (error) {
      console.error("Error fetching service details:", error);
      setError(
        "Đã xảy ra lỗi khi tải thông tin dịch vụ. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = () => {
    // Lưu thông tin dịch vụ đã chọn vào bộ nhớ hoặc context
    // Sau đó điều hướng đến màn hình booking
    router.push("/(booking-flow)/new");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải thông tin dịch vụ...</Text>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#f43f5e" />
        <Text style={styles.errorText}>
          {error || "Không tìm thấy dịch vụ"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header với nút back */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hình ảnh dịch vụ */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: service.serviceThumbnailUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Overlay gradient */}
          <View style={styles.imageOverlay} />

          {/* Trạng thái */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: service.isAvailable ? "#4CAF50" : "#F44336" },
            ]}
          >
            <Text style={styles.statusText}>
              {service.isAvailable ? "Có sẵn" : "Không có sẵn"}
            </Text>
          </View>
        </View>

        {/* Thông tin dịch vụ */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{service.serviceName}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>
            {service.serviceDescription ||
              "Không có thông tin mô tả cho dịch vụ này."}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>Thời gian: khoảng 60-90 phút</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="pricetag-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                Giá: Liên hệ để biết thêm chi tiết
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name={
                  service.isAvailable
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                size={20}
                color={service.isAvailable ? "#4CAF50" : "#F44336"}
              />
              <Text style={styles.infoText}>
                Trạng thái:{" "}
                {service.isAvailable
                  ? "Có thể đặt lịch ngay"
                  : "Tạm thời không khả dụng"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Đánh giá & Phản hồi</Text>
          <View style={styles.reviewSummary}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>4.8</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= 4 ? "star" : "star-half"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>25 đánh giá</Text>
            </View>
          </View>

          {/* Các đánh giá mẫu */}
          <View style={styles.reviewItem}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/32.jpg",
              }}
              style={styles.reviewerAvatar}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewerName}>Minh Trang</Text>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={14} color="#FFD700" />
                ))}
                <Text style={styles.reviewDate}>2 tuần trước</Text>
              </View>
              <Text style={styles.reviewText}>
                Dịch vụ tuyệt vời! Tôi rất hài lòng với kết quả nhận được.
              </Text>
            </View>
          </View>

          <View style={styles.reviewItem}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }}
              style={styles.reviewerAvatar}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewerName}>Anh Tuấn</Text>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4].map((star) => (
                  <Ionicons key={star} name="star" size={14} color="#FFD700" />
                ))}
                <Text style={styles.reviewDate}>1 tháng trước</Text>
              </View>
              <Text style={styles.reviewText}>
                Nhân viên rất chuyên nghiệp và thân thiện. Sẽ quay lại!
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllReviews}>
            <Text style={styles.viewAllReviewsText}>Xem tất cả đánh giá</Text>
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-2">Khung Giờ Có Sẵn</Text>
        <TimeSlots
          selectedSlot={selectedTimeSlot}
          serviceId={service.serviceId}
          onSelectTimeSlot={(slot) => setSelectedTimeSlot(slot)}
        />
      </ScrollView>

      {/* Button đặt lịch */}
      {service.isAvailable && (
        <View style={styles.bookingContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookService}
          >
            <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    color: "#f43f5e",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  statusBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 2,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },
  additionalInfo: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 10,
  },
  reviewSummary: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  starsContainer: {
    flexDirection: "row",
    marginLeft: 12,
  },
  reviewCount: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 12,
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewContent: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 6,
    lineHeight: 20,
  },
  viewAllReviews: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 12,
  },
  viewAllReviewsText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  bookingContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  bookButton: {
    backgroundColor: "#A83F98",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceDetail;
