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
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api/endpoints";
import type { BlogCreationRequest } from "@/lib/types/api";
import { UIImagePickerPresentationStyle } from "expo-image-picker";

const NewBlog = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
      const blogData: BlogCreationRequest = {
        title: title.trim(),
        content: content.trim(),
        thumbnailUrl: thumbnailUrl || undefined,
      };

      const response = await api.blogs.createBlog(blogData);
      Alert.alert("Success", "Your blog has been created successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Error creating blog:", error);
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
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Create New Blog</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`px-4 py-1.5 rounded-full ${
              loading ? "bg-gray-100" : "bg-purple-600"
            }`}
          >
            <Text className={loading ? "text-gray-400" : "text-white"}>
              {loading ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Title Input */}
          <TextInput
            placeholder="Enter your title"
            value={title}
            onChangeText={setTitle}
            mode="flat"
            className="mb-4"
            style={{
              backgroundColor: "transparent",
              fontSize: 24,
              paddingHorizontal: 0,
            }}
            underlineColor="transparent"
          />

          {/* Image Picker */}
          <TouchableOpacity onPress={handleImagePick} className="mb-4">
            {thumbnailUrl ? (
              <View className="relative">
                <Image
                  source={{
                    uri: `https://skincare-api.azurewebsites.net/api/upload/${thumbnailUrl}`,
                  }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                  onError={(error) => {
                    console.error("Error loading image:", error);
                    Alert.alert("Error", "Failed to load image preview");
                  }}
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                  onPress={() => setThumbnailUrl("")}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row items-center p-4 border border-dashed border-gray-300 rounded-lg">
                <Ionicons name="image-outline" size={24} color="#666" />
                <Text className="ml-2 text-gray-600">Add Cover Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Content Input */}
          <TextInput
            placeholder="Write your blog content..."
            value={content}
            onChangeText={setContent}
            mode="flat"
            multiline
            numberOfLines={10}
            className="bg-transparent"
            style={{
              backgroundColor: "transparent",
              textAlignVertical: "top",
              paddingHorizontal: 0,
            }}
            underlineColor="transparent"
          />
        </ScrollView>

        {loading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white p-4 rounded-lg">
              <Text>Creating blog...</Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewBlog;
