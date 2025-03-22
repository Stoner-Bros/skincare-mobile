import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "@/lib/api/endpoints";
import type { ServiceResponse } from "@/lib/types/api";

interface ServicesProps {
  limit?: number;
}

const Services = ({ limit = 4 }: ServicesProps) => {
  const router = useRouter();
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await api.services.getServices();

      // Kiểm tra nếu có data
      if (!response || !response.data || !response.data.data) {
        setError("Không có dữ liệu dịch vụ");
        setServices([]);
        return;
      }

      const apiData = response.data.data;
      if (!apiData.items || apiData.items.length === 0) {
        setServices([]);
        return;
      }

      // Lấy số lượng service theo limit
      const serviceData = apiData.items.slice(0, limit);

      // Sử dụng URL từ API upload để hiển thị hình ảnh
      const formattedServiceData = serviceData.map((service) => ({
        ...service,
        serviceThumbnailUrl: service.serviceThumbnailUrl
          ? service.serviceThumbnailUrl.startsWith("http")
            ? service.serviceThumbnailUrl
            : `https://skincare-api.azurewebsites.net/api/upload/${service.serviceThumbnailUrl}`
          : `https://picsum.photos/seed/${service.serviceId}/300/200`,
      }));

      setServices(formattedServiceData);
    } catch (error) {
      console.error("Error loading services:", error);
      setError("Không thể tải dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleServicePress = (serviceId: number) => {
    router.push(`/service/${serviceId}`);
  };

  const renderServiceItem = ({ item }: { item: ServiceResponse }) => (
    <TouchableOpacity
      onPress={() => handleServicePress(item.serviceId)}
      style={styles.serviceCard}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item.serviceThumbnailUrl,
        }}
        style={styles.serviceImage}
        resizeMode="cover"
        onError={(e) => {
          console.log("Error loading image:", e.nativeEvent.error);
          const updatedServices = [...services];
          const index = updatedServices.findIndex(
            (s) => s.serviceId === item.serviceId
          );
          if (index !== -1) {
            updatedServices[
              index
            ].serviceThumbnailUrl = `https://picsum.photos/seed/${item.serviceId}/300/200`;
            setServices(updatedServices);
          }
        }}
      />

      <View style={styles.serviceContent}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.serviceName}
        </Text>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.serviceDescription || "Không có mô tả"}
        </Text>

        <View style={styles.serviceFooter}>
          <View style={styles.availabilityContainer}>
            <Ionicons
              name={item.isAvailable ? "checkmark-circle" : "close-circle"}
              size={16}
              color={item.isAvailable ? "#4CAF50" : "#F44336"}
            />
            <Text style={styles.availabilityText}>
              {item.isAvailable ? "Có sẵn" : "Không có sẵn"}
            </Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Xem chi tiết</Text>
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
        <Text style={styles.sectionSubtitle}>
          Khám phá những dịch vụ tốt nhất của chúng tôi
        </Text>
      </View>

      {/* <TouchableOpacity
        onPress={() => router.push("/services")}
        style={styles.viewAllButton}
      >
        <Text style={styles.viewAllText}>Xem tất cả</Text>
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f43f5e" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyText}>Không có dịch vụ nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={services}
        keyExtractor={(item) => item.serviceId.toString()}
        renderItem={renderServiceItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3b82f6",
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  serviceCard: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: 130,
  },
  serviceContent: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 18,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#4b5563",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#6b7280",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    marginTop: 8,
    color: "#f43f5e",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 8,
    color: "#6b7280",
  },
});

export default Services;
