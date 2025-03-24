import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/lib/api/endpoints";
import type { BlogResponse } from "@/lib/types/api";

// Định nghĩa interface cho dữ liệu hiển thị
interface BlogDetail {
  id: string | number;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  date: string;
  image: string;
  rating: number;
  viewCount: number;
  tags?: string;
  readTime?: number;
}

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(false);

    try {
      // Đảm bảo id là chuỗi
      const rawId = typeof id === "object" ? id[0] : String(id);
      console.log("Raw ID from params:", rawId);

      // Tách lấy blogId thực từ định dạng "blogId-timestamp-index"
      // Nếu ID có dạng "1-1742811470044-0", lấy phần trước dấu gạch ngang đầu tiên
      const actualBlogId = rawId.split("-")[0];
      console.log("Extracted actual blog ID:", actualBlogId);

      // Gọi API với ID thực
      const response = await api.blogs.getBlog(actualBlogId);
      console.log("Blog response:", response);

      // Kiểm tra phản hồi
      if (!response) {
        console.error("API trả về null hoặc undefined");
        setError(true);
        return;
      }

      // Xử lý dữ liệu blog như bình thường
      const blogData = response;

      console.log("Xử lý blog data:", {
        blogId: blogData.blogId,
        title: blogData.title,
        authorName: blogData.authorName,
        content: blogData.content
          ? blogData.content.substring(0, 50) + "..."
          : "No content",
      });

      // Tính thời gian đọc (cứ 1000 ký tự ~ 5 phút đọc)
      const contentLength = blogData.content ? blogData.content.length : 0;
      const readTimeMinutes = Math.max(
        3,
        Math.ceil((contentLength / 1000) * 5)
      );

      // Xây dựng đường dẫn đúng cho hình ảnh
      const thumbnailUrl = blogData.thumbnailUrl
        ? blogData.thumbnailUrl.startsWith("http")
          ? blogData.thumbnailUrl
          : `https://skincare-api.azurewebsites.net/api/upload/${blogData.thumbnailUrl}`
        : `https://picsum.photos/seed/${blogData.blogId}/800/400`;

      console.log("Thumbnail URL:", thumbnailUrl);

      // Format dữ liệu từ API để hiển thị trong UI
      setBlog({
        id: blogData.blogId,
        title: blogData.title || "Untitled Blog",
        content: blogData.content || "No content available",
        authorName: blogData.authorName || "Anonymous",
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          blogData.authorName || "Anonymous"
        )}&background=random&color=fff&size=256`,
        authorRole: "Contributor",
        date: blogData.createdAt
          ? new Date(blogData.createdAt).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
        image: thumbnailUrl,
        rating: 4.5, // Giả định rating
        viewCount: blogData.viewCount || 0,
        tags: blogData.tags || "General",
        readTime: readTimeMinutes,
      });
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      setError(true);
      Alert.alert(
        "Lỗi khi tải bài viết",
        "Không thể kết nối đến máy chủ hoặc bài viết không tồn tại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!blog) return;

    try {
      await Share.share({
        message: `${blog.title} - ${blog.content.substring(
          0,
          100
        )}... Đọc thêm tại ứng dụng của chúng tôi!`,
        title: blog.title,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={{ flexDirection: "row", marginVertical: 4 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={`star-${index}`}
            name={index < Math.floor(rating) ? "star" : "star-outline"}
            size={16}
            color="#FFD700"
          />
        ))}
        <Text className="ml-2 text-gray-600">({rating.toFixed(1)})</Text>
      </View>
    );
  };

  // Nếu đang loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#A83F98" />
        <Text className="mt-4 text-gray-600">Đang tải bài viết...</Text>
      </SafeAreaView>
    );
  }

  // Nếu có lỗi
  if (error || !blog) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4 py-3 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1">Lỗi</Text>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="alert-circle-outline" size={64} color="#F43F5E" />
          <Text className="text-lg text-gray-700 text-center mb-4 mt-4">
            Không thể tải bài viết này
          </Text>
          <TouchableOpacity
            onPress={() => fetchBlogDetail()}
            className="bg-[#A83F98] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị chi tiết bài viết
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header với nút back */}
        <View className="px-4 py-3 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1">Blog</Text>
        </View>

        {/* Ảnh cover */}
        <View className="relative">
          {blog.image ? (
            <Image
              source={{ uri: blog.image }}
              className="w-full h-56"
              resizeMode="cover"
              onError={(e) => {
                console.log("Lỗi khi tải hình ảnh:", e.nativeEvent.error);
                const updatedBlog = { ...blog };
                updatedBlog.image = `https://picsum.photos/seed/${
                  blog.id
                }/800/400?random=${Date.now()}`;
                setBlog(updatedBlog);
              }}
            />
          ) : (
            <View className="w-full h-56 bg-gray-200 justify-center items-center">
              <Ionicons name="image-outline" size={48} color="#666" />
              <Text className="text-gray-500 mt-2">Không có hình ảnh</Text>
            </View>
          )}

          {/* Tag overlay */}
          {blog.tags && (
            <View className="absolute top-4 left-4 bg-[#A83F98] px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                {blog.tags}
              </Text>
            </View>
          )}

          {/* View count */}
          <View className="absolute bottom-4 right-4 bg-black/50 flex-row items-center px-2 py-1 rounded-full">
            <Ionicons name="eye-outline" size={16} color="#fff" />
            <Text className="text-white text-xs ml-1">
              {blog.viewCount} lượt xem
            </Text>
          </View>
        </View>

        {/* Nội dung bài viết */}
        <View className="p-4">
          {/* Tiêu đề */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            {blog.title}
          </Text>

          {/* Thông tin tác giả và thống kê */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Image
                source={{ uri: blog.authorAvatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-bold text-gray-900">
                  {blog.authorName}
                </Text>
                <Text className="text-gray-500 text-sm">{blog.authorRole}</Text>
              </View>
            </View>
            <View>
              <Text className="text-gray-500 text-right">{blog.date}</Text>
              <Text className="text-gray-500 text-sm">
                {blog.readTime} phút đọc
              </Text>
            </View>
          </View>

          {/* Rating và tương tác */}
          <View className="bg-gray-50 p-3 rounded-lg mb-4">
            {renderRatingStars(blog.rating)}
            <View className="flex-row items-center justify-around mt-2">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="heart-outline" size={20} color="#F43F5E" />
                <Text className="ml-1 text-gray-600">Yêu thích</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
                <Text className="ml-1 text-gray-600">Bình luận</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center"
                onPress={handleShare}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color="#10B981"
                />
                <Text className="ml-1 text-gray-600">Chia sẻ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nội dung chính */}
          <View className="mt-4">
            {blog.content.split("\n").map((paragraph, index) => {
              // Kiểm tra nếu là đường dẫn hình ảnh
              if (
                paragraph.trim().startsWith("![") &&
                paragraph.includes("](") &&
                paragraph.includes(")")
              ) {
                const imageUrl = paragraph.match(/\]\((.*?)\)/)?.[1];
                if (imageUrl) {
                  return (
                    <View key={`p-${index}`} className="my-2">
                      <Image
                        source={{ uri: imageUrl }}
                        style={{ width: "100%", height: 200 }}
                        resizeMode="contain"
                        onError={() =>
                          console.log(`Không thể tải hình ảnh: ${imageUrl}`)
                        }
                      />
                    </View>
                  );
                }
              }

              // Kiểm tra nếu là tiêu đề
              if (paragraph.trim().startsWith("# ")) {
                return (
                  <Text key={`p-${index}`} className="text-2xl font-bold my-2">
                    {paragraph.replace(/^#\s+/, "")}
                  </Text>
                );
              }

              // Kiểm tra nếu là in đậm
              const boldText = paragraph.replace(/\*\*(.*?)\*\*/g, "$1");

              // Kiểm tra nếu đoạn văn trống
              if (paragraph.trim() === "") {
                return <View key={`p-${index}`} style={{ height: 16 }} />;
              }

              // Đoạn văn thông thường
              return (
                <Text
                  key={`p-${index}`}
                  className="text-gray-700 text-base mb-4"
                  style={{ lineHeight: 24 }}
                >
                  {boldText}
                </Text>
              );
            })}
          </View>

          {/* Footer */}
          <View className="mt-8 pt-4 border-t border-gray-200">
            <TouchableOpacity
              className="bg-[#A83F98] p-4 rounded-lg flex-row justify-center items-center"
              onPress={() => router.push("/")}
            >
              <Text className="text-white font-semibold text-center">
                Đặt Lịch Ngay
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6 mb-4">
              <Text className="text-gray-500 text-sm text-center">
                Cảm ơn bạn đã đọc bài viết này!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetailPage;
