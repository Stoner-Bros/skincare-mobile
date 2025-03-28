import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api/endpoints";
import type { BlogCreationRequest } from "@/lib/types/api";
import { UIImagePickerPresentationStyle } from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Thêm constant cho tags
const BLOG_TAGS = [
  { label: "Tips Làm đẹp", value: "Tips Làm đẹp", icon: "bulb-outline" },
  { label: "Tin Tức", value: "Tin Tức", icon: "newspaper-outline" },
  {
    label: "Trải nghiệm dịch vụ",
    value: "Trải nghiệm dịch vụ",
    icon: "star-outline",
  },
];

const NewBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleImagePick = async () => {
    try {
      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch image picker with correct options using new MediaType
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        presentationStyle: UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      console.log("ImagePicker Result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        // Create form data
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage.uri,
          type: selectedImage.mimeType || "image/jpeg",
          name: selectedImage.fileName || `image-${Date.now()}.jpg`,
        } as any);

        try {
          setLoading(true);
          console.log("Uploading image...", formData);

          const uploadResponse = await api.upload.uploadFile(formData);
          console.log("Upload response:", uploadResponse);

          if (uploadResponse?.data?.fileName) {
            // Lấy file thông qua API endpoint
            const fileResponse = await api.upload.getFile(
              uploadResponse.data.fileName
            );
            setThumbnailUrl(uploadResponse.data.fileName); // Lưu fileName thay vì full URL
          } else {
            throw new Error("No file name received in response");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload image. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "Please enter content");
      return;
    }

    try {
      setLoading(true);

      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert("Error", "Please login to create blog");
        router.push("/login");
        return;
      }

      const blogData: BlogCreationRequest = {
        title: title.trim(),
        content: content.trim(),
        thumbnailUrl: thumbnailUrl || undefined,
        tags: selectedTags.join(","),
      };

      // Thêm token vào header của request
      const response = await api.blogs.createBlog(blogData, token);

      Alert.alert("Success", "Your blog has been created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Error creating blog:", error);

      // Kiểm tra nếu là lỗi 401 thì redirect về trang login
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        {/* Header mới với gradient */}
        <LinearGradient colors={["#A83F98", "#7B2C8C"]} className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-white">
              Tạo Bài Viết Mới
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`px-4 py-1.5 rounded-full ${
                loading ? "bg-white/30" : "bg-white"
              }`}
            >
              <Text className={loading ? "text-white/70" : "text-purple-700"}>
                {loading ? "Đang đăng..." : "Đăng bài"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView className="flex-1 px-4">
          {/* Cover Image Section */}
          <TouchableOpacity onPress={handleImagePick} className="mt-4 mb-6">
            {thumbnailUrl ? (
              <View className="relative rounded-xl overflow-hidden">
                <Image
                  source={{
                    uri: `https://skincare-api.azurewebsites.net/api/upload/${thumbnailUrl}`,
                  }}
                  className="w-full h-56"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  className="absolute bottom-0 left-0 right-0 p-4"
                >
                  <Text className="text-white text-sm">
                    Nhấn để thay đổi ảnh bìa
                  </Text>
                </LinearGradient>
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                  onPress={() => setThumbnailUrl("")}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-purple-50 rounded-xl p-8 items-center justify-center border-2 border-dashed border-purple-200">
                <Ionicons name="image-outline" size={40} color="#A83F98" />
                <Text className="mt-2 text-purple-700 font-medium">
                  Thêm ảnh bìa cho bài viết
                </Text>
                <Text className="text-purple-500 text-sm mt-1">
                  Nhấn để chọn ảnh
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input với style mới */}
          <TextInput
            placeholder="Tiêu đề bài viết của bạn"
            value={title}
            onChangeText={setTitle}
            mode="flat"
            className="mb-4"
            style={{
              backgroundColor: "transparent",
              fontSize: 24,
              fontWeight: "600",
              paddingHorizontal: 0,
            }}
            underlineColor="#E5E7EB"
            placeholderTextColor="#9CA3AF"
          />

          {/* Tags Section với thiết kế mới */}
          <Text className="text-gray-700 font-medium mb-3">
            Chủ đề bài viết
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {BLOG_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.value}
                onPress={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.value)
                      ? prev.filter((t) => t !== tag.value)
                      : [...prev, tag.value]
                  );
                }}
                className={`flex-row items-center px-4 py-2 rounded-full ${
                  selectedTags.includes(tag.value)
                    ? "bg-purple-100 border-purple-300"
                    : "bg-gray-50 border-gray-200"
                } border`}
              >
                <Ionicons
                  name={tag.icon as any}
                  size={16}
                  color={selectedTags.includes(tag.value) ? "#A83F98" : "#666"}
                />
                <Text
                  className={`ml-2 ${
                    selectedTags.includes(tag.value)
                      ? "text-purple-700"
                      : "text-gray-600"
                  }`}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Input với style mới */}
          <TextInput
            placeholder="Viết nội dung bài viết của bạn ở đây..."
            value={content}
            onChangeText={setContent}
            mode="flat"
            multiline
            numberOfLines={12}
            className="bg-gray-50 rounded-xl mb-8"
            style={{
              backgroundColor: "#F9FAFB",
              textAlignVertical: "top",
              padding: 16,
              fontSize: 16,
              lineHeight: 24,
            }}
            underlineColor="transparent"
          />
        </ScrollView>

        {/* Loading Overlay với thiết kế mới */}
        {loading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white p-6 rounded-2xl items-center">
              <ActivityIndicator size="large" color="#A83F98" />
              <Text className="mt-3 text-gray-700 font-medium">
                Đang tạo bài viết...
              </Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewBlog;
