import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import GoBackButton from "@/components/Button/GoBackButton";

const NewReview = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Hàm lưu đánh giá vào AsyncStorage
  const saveReview = async () => {
    if (!title || !content) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      const existingReviews = await AsyncStorage.getItem("reviews");
      const reviews = existingReviews ? JSON.parse(existingReviews) : [];

      const newReview = {
        id: Date.now().toString(), // Tạo ID duy nhất
        title,
        content,
      };

      reviews.push(newReview);
      await AsyncStorage.setItem("reviews", JSON.stringify(reviews));

      Alert.alert("Thành công", "Đánh giá của bạn đã được lưu!");
      router.push("/(tabs)/blog"); // Điều hướng về trang Blog
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu đánh giá!");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", padding: 12 }}>
        <GoBackButton />
      </View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Viết Đánh Giá
      </Text>

      <TextInput
        placeholder="Tiêu đề đánh giá"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Nội dung đánh giá"
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          height: 100,
        }}
      />

      <TouchableOpacity
        onPress={saveReview}
        style={{
          backgroundColor: "blue",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Gửi Đánh Giá</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewReview;
