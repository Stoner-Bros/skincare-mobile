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
import { AccountUpdateRequest } from "@/lib/types/api";
interface UserProfileData {
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
  email: string;
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
    email: "",
  });

  // Thêm useEffect để load dữ liệu từ AsyncStorage khi component mount
  useEffect(() => {
    const loadStoredProfile = async () => {
      try {
        setLoading(true);
        const storedProfile = await AsyncStorage.getItem("userProfile");

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileData({
            fullName: parsedProfile.fullName || "",
            avatar: parsedProfile.avatar || "",
            phone: parsedProfile.phone || "",
            address: parsedProfile.address || "",
            dob: parsedProfile.dob || "",
            otherInfo: parsedProfile.otherInfo || "",
            email: parsedProfile.email || "",
          });
        }

        // Sau đó load dữ liệu mới nhất từ API
        const response = await api.auth.getProfile();
        console.log("API profile data:", response);

        if (response?.data) {
          // Lưu accountId vào AsyncStorage
          await AsyncStorage.setItem(
            "accountId",
            response.data.accountId.toString()
          );

          // Cập nhật state với dữ liệu mới nhất từ API
          setProfileData((prevData) => ({
            fullName: response.data.accountInfo.fullName || prevData.fullName,
            avatar: response.data.accountInfo.avatar || prevData.avatar,
            phone: response.data.accountInfo.phone || prevData.phone,
            address: response.data.accountInfo.address || prevData.address,
            dob: response.data.accountInfo.dob || prevData.dob,
            otherInfo:
              response.data.accountInfo.otherInfo || prevData.otherInfo,
            email: response.data.accountInfo.email || prevData.email,
          }));

          // Lưu lại vào AsyncStorage
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify({
              fullName: response.data.accountInfo.fullName,
              avatar: response.data.accountInfo.avatar,
              phone: response.data.accountInfo.phone,
              address: response.data.accountInfo.address,
              dob: response.data.accountInfo.dob,
              otherInfo: response.data.accountInfo.otherInfo,
              email: response.data.accountInfo.email,
            })
          );
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    loadStoredProfile();
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
    try {
      setSaving(true);

      if (!profileData.fullName.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập họ tên");
        return;
      }

      const accountId = await AsyncStorage.getItem("accountId");
      if (!accountId) {
        throw new Error("No account ID found");
      }

      // Format lại date
      const formattedDob = profileData.dob?.trim()
        ? profileData.dob.trim().replace(/\s+/g, "").replace(/\-+/g, "-")
        : null;

      // Chuẩn bị dữ liệu để cập nhật
      const updateData = {
        fullName: profileData.fullName.trim(),
        avatar: profileData.avatar || null,
        phone: profileData.phone?.trim() || null,
        address: profileData.address?.trim() || null,
        dob: formattedDob,
        otherInfo: profileData.otherInfo?.trim() || null,
      };

      console.log("Sending update data:", updateData);

      // Gọi API update
      const updateResponse = await api.accounts.updateAccount(
        Number(accountId),
        updateData
      );

      if (updateResponse) {
        // Sau khi update thành công, gọi API get profile để lấy thông tin mới nhất
        const profileResponse = await api.auth.getProfile();
        console.log("New profile data:", profileResponse);

        if (profileResponse?.data) {
          // Cập nhật state với dữ liệu mới nhất
          setProfileData({
            fullName: profileResponse.data.accountInfo.fullName || "",
            avatar: profileResponse.data.accountInfo.avatar || "",
            phone: profileResponse.data.accountInfo.phone || "",
            address: profileResponse.data.accountInfo.address || "",
            dob: profileResponse.data.accountInfo.dob || "",
            otherInfo: profileResponse.data.accountInfo.otherInfo || "",
            email: profileResponse.data.accountInfo.email || "",
          });

          // Lưu thông tin mới vào AsyncStorage
          await AsyncStorage.setItem(
            "userProfile",
            JSON.stringify({
              fullName: profileResponse.data.accountInfo.fullName,
              avatar: profileResponse.data.accountInfo.avatar,
              phone: profileResponse.data.accountInfo.phone,
              address: profileResponse.data.accountInfo.address,
              dob: profileResponse.data.accountInfo.dob,
              otherInfo: profileResponse.data.accountInfo.otherInfo,
              email: profileResponse.data.accountInfo.email,
            })
          );

          Alert.alert(
            "Thành công",
            "Thông tin cá nhân đã được cập nhật thành công",
            [{ text: "OK", onPress: () => router.back() }]
          );
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi cập nhật thông tin";

      Alert.alert("Thông báo", errorMessage);
      setError(errorMessage);
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
            label="Ngày sinh"
            value={profileData.dob}
            onChangeText={(text) =>
              setProfileData({ ...profileData, dob: text })
            }
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="calendar" />}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
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
