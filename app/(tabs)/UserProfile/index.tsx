import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ChatSupportButton from "@/components/common/ChatSupportButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import axios from "axios";

// Helper function để xử lý navigation với type safety
const navigateTo = (router: ReturnType<typeof useRouter>, path: string) => {
  if (path === "edit") {
    router.push("/UserProfile/edit"); // Sửa đường dẫn chính xác
  } else {
    router.push(path as any);
  }
};

interface UserProfile {
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  memberSince?: string;
  isVerified?: boolean;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Các chức năng trong profile
  const profileOptions = [
    {
      icon: "calendar-outline",
      title: "Lịch đặt của tôi",
      description: "Xem và quản lý các lịch đặt của bạn",
      route: "bookings", // Đường dẫn tương đối
    },
    {
      icon: "card-outline",
      title: "Thanh toán",
      description: "Quản lý phương thức thanh toán và lịch sử",
      route: "payments",
    },
    {
      icon: "notifications-outline",
      title: "Thông báo",
      description: "Thiết lập thông báo và cảnh báo",
      route: "notifications",
    },
    {
      icon: "settings-outline",
      title: "Cài đặt",
      description: "Chỉnh sửa thông tin cá nhân và mật khẩu",
      route: "settings",
    },
    {
      icon: "headset-outline",
      title: "Hỗ trợ",
      description: "Liên hệ với đội ngũ hỗ trợ của chúng tôi",
      route: "support",
    },
  ];

  // Tải thông tin profile từ API
  const loadUserProfile = async () => {
    setLoading(true);
    setError("");

    try {
      // Sửa "authToken" thành "accessToken"
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }

      const response = await api.auth.getProfile();
      console.log("Profile response:", response);

      if (response && response.data) {
        const userData = response.data;
        const userProfile: UserProfile = {
          fullName: userData.fullName || "Người dùng",
          email: userData.email || "",
          avatar: userData.avatar,
          phone: userData.phone,
          memberSince: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString("vi-VN")
            : new Date().toLocaleDateString("vi-VN"),
          isVerified: userData.isVerified || false,
        };

        setProfile(userProfile);
        // Lưu profile vào AsyncStorage
        await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
      } else {
        setError("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Đã xảy ra lỗi khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: async () => {
          try {
            // Gọi API đăng xuất
            await api.auth.logout();
            console.log("Logged out successfully");

            // Xóa tất cả dữ liệu lưu trữ local
            await AsyncStorage.multiRemove([
              "accessToken",
              "refreshToken",
              "userProfile",
              "accountId",
            ]);

            // Chuyển đến trang login
            router.push("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);

            // Nếu lỗi 400 hoặc 401, vẫn xóa dữ liệu local
            if (
              axios.isAxiosError(error) &&
              (error.response?.status === 400 || error.response?.status === 401)
            ) {
              await AsyncStorage.multiRemove([
                "accessToken",
                "refreshToken",
                "userProfile",
                "accountId",
              ]);
              router.push("/(auth)/login");
            } else {
              // Nếu là lỗi khác, hiển thị thông báo
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại sau.");
            }
          }
        },
      },
    ]);
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Hiển thị loading spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A83F98" />
        <Text style={styles.loadingText}>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: "#FF3B30", marginTop: 12 },
          ]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.retryButtonText}>Đăng nhập lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri:
                  profile?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.fullName || "User"
                  )}&background=random&color=fff&size=256`,
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{profile?.fullName}</Text>
                {profile?.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#4CAF50"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
              <Text style={styles.profileEmail}>{profile?.email}</Text>
              <Text style={styles.memberSince}>
                Thành viên từ: {profile?.memberSince}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/(tabs)/UserProfile/edit")}
          >
            <Text style={styles.editProfileText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={() => navigateTo(router, option.route)}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name={option.icon as any} size={24} color="#A83F98" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A8A8A8" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#A83F98",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  editProfileText: {
    color: "#A83F98",
    fontWeight: "600",
  },
  optionsContainer: {
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F8F0F7",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  optionDescription: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    marginTop: 24,
    marginBottom: 30,
    fontSize: 12,
  },
});

export default ProfileScreen;
