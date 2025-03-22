import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
interface UserProfileData {
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
}

const EditProfileScreen = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: "",
    avatar: "",
    phone: "",
    address: "",
    dob: "",
    otherInfo: "",
  });

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Kiểm tra token
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.push("/(auth)/login");
          return;
        }

        // Lấy thông tin profile
        const response = await api.auth.getProfile();
        console.log("Current profile data:", response);

        if (response && response.accountId) {
          setUserId(response.accountId.toString());

          // Cập nhật form với dữ liệu hiện tại
          setProfileData({
            fullName: response.accountInfo?.fullName || "",
            avatar: response.accountInfo?.avatar || "",
            phone: response.accountInfo?.phone || "",
            address: response.accountInfo?.address || "",
            dob: response.accountInfo?.dob || "",
            otherInfo: response.accountInfo?.otherInfo || "",
          });
        } else {
          setError("Không thể tải thông tin người dùng");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Xử lý chọn ảnh từ thư viện
  const handlePickAvatar = async () => {
    // Kiểm tra quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Cần quyền truy cập vào thư viện ảnh để thay đổi ảnh đại diện"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Upload ảnh lên server (giả sử bạn có API upload)
        const imageUri = result.assets[0].uri;
        const formData = new FormData();

        const filename = imageUri.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        // Gọi API upload ảnh
        try {
          const uploadResponse = await api.upload.uploadFile(formData);
          console.log("Upload response:", uploadResponse);

          if (uploadResponse && uploadResponse.fileName) {
            // Cập nhật avatar với fileName từ server
            setProfileData({ ...profileData, avatar: uploadResponse.fileName });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Lỗi", "Không thể tải lên ảnh đại diện");
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  // Xử lý khi người dùng lưu thay đổi
  const handleSaveProfile = async () => {
    if (!userId) {
      setError("Không thể xác định người dùng");
      return;
    }

    if (!profileData.fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên");
      return;
    }

    try {
      setSaving(true);

      // Chuẩn bị dữ liệu để cập nhật
      const updateData = {
        fullName: profileData.fullName,
        avatar: profileData.avatar,
        phone: profileData.phone,
        address: profileData.address,
        dob: profileData.dob,
        otherInfo: profileData.otherInfo,
      };

      console.log("Updating profile with data:", updateData);
      console.log("User ID:", userId);

      // Gọi API cập nhật thông tin
      const response = await api.accounts.updateAccount(userId, updateData);
      console.log("Update response:", response);

      if (response && response.status === 200) {
        Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        setError("Không thể cập nhật thông tin");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A83F98" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa thông tin cá nhân</Text>
          <View style={{ width: 24 }} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profileData.avatar
                  ? profileData.avatar.startsWith("http")
                    ? { uri: profileData.avatar }
                    : {
                        uri: `https://skincare-api.azurewebsites.net/api/upload/${profileData.avatar}`,
                      }
                  : {
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profileData.fullName || "User"
                      )}&background=random&color=fff&size=256`,
                    }
              }
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handlePickAvatar}
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Họ và tên"
            value={profileData.fullName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, fullName: text })
            }
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Số điện thoại"
            value={profileData.phone}
            onChangeText={(text) =>
              setProfileData({ ...profileData, phone: text })
            }
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label="Địa chỉ"
            value={profileData.address}
            onChangeText={(text) =>
              setProfileData({ ...profileData, address: text })
            }
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label="Ngày sinh (YYYY-MM-DD)"
            value={profileData.dob}
            onChangeText={(text) =>
              setProfileData({ ...profileData, dob: text })
            }
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="calendar" />}
            placeholder="Ví dụ: 1990-01-31"
          />

          <TextInput
            label="Thông tin khác"
            value={profileData.otherInfo}
            onChangeText={(text) =>
              setProfileData({ ...profileData, otherInfo: text })
            }
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="information" />}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            loading={saving}
            disabled={saving}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Lưu thay đổi
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Hủy
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#A83F98",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhotoText: {
    marginTop: 8,
    color: "#A83F98",
    fontSize: 14,
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  saveButton: {
    marginBottom: 12,
    backgroundColor: "#A83F98",
  },
  cancelButton: {
    borderColor: "#A83F98",
  },
});

export default EditProfileScreen;
