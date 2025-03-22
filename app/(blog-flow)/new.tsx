import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";
import type { BlogCreationRequest } from "@/lib/types/api";

const categories = [
  "Spa Review",
  "Beauty Review",
  "Service Review",
  "Product Review",
  "App Review",
];

const NewReview = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert("Validation Error", "Vui lòng nhập tiêu đề");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Validation Error", "Vui lòng nhập nội dung");
      return;
    }

    if (!category) {
      Alert.alert("Validation Error", "Vui lòng chọn danh mục");
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra token xác thực
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để đăng bài viết", [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng nhập", onPress: () => router.push("/login") },
        ]);
        return;
      }

      // Tạo dữ liệu blog mới
      const blogData: BlogCreationRequest = {
        title,
        content,
        category,
      };

      // Gọi API tạo blog mới
      const response = await api.blogs.createBlog(blogData);

      Alert.alert("Thành công", "Bài viết của bạn đã được tạo thành công", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating blog:", error);

      // Xử lý lỗi
      if (error.response?.status === 401) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập lại để thực hiện thao tác này");
      } else {
        Alert.alert(
          "Lỗi",
          error.response?.data?.message ||
            "Không thể tạo bài viết. Vui lòng thử lại sau."
        );
      }

      // Lưu tạm thời vào Local Storage để không mất dữ liệu
      try {
        const reviewData = {
          title,
          content,
          category,
          timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem("draft_review", JSON.stringify(reviewData));
      } catch (err) {
        console.error("Error saving draft:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Tạo Bài Viết Mới</Text>
      </View>

      <ScrollView className="p-4">
        <TextInput
          label="Tiêu đề"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          className="mb-4"
        />

        <Text className="text-gray-700 mb-2">Chọn danh mục:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`mr-2 px-4 py-2 rounded-full ${
                category === cat ? "bg-blue-500" : "bg-gray-200"
              }`}
              onPress={() => setCategory(cat)}
            >
              <Text
                className={`${
                  category === cat ? "text-white" : "text-gray-800"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          label="Nội dung"
          value={content}
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={10}
          className="mb-4"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          className="mt-4"
        >
          Đăng Bài
        </Button>
      </ScrollView>
    </View>
  );
};

export default NewReview;
