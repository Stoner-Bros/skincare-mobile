import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/lib/api/endpoints";
import type { Blog } from "@/lib/types/api";

// Sử dụng lại BLOG_DATA từ trang index
const BLOG_DATA = [
  {
    id: "1",
    title: "Top 5 Dịch Vụ Massage Được Yêu Thích Nhất 2024",
    content: `Khám phá 5 liệu trình massage được khách hàng đánh giá cao nhất tại Beauty Care trong năm 2024:

1. Massage Đá Nóng
- Sử dụng đá bazan tự nhiên
- Nhiệt độ được kiểm soát chặt chẽ
- Giúp thư giãn sâu và giảm căng cơ

2. Massage Thụy Điển
- Các động tác massage truyền thống
- Áp lực vừa phải, phù hợp mọi đối tượng
- Cải thiện tuần hoàn máu

3. Massage Aromatherapy
- Kết hợp tinh dầu thiên nhiên
- Không gian thư giãn với hương thơm
- Giảm stress hiệu quả

4. Massage Chân
- Tập trung vào các huyệt đạo
- Giảm đau nhức cho dân văn phòng
- Thời gian linh hoạt 30-60 phút

5. Massage Đầu & Vai Gáy
- Giảm đau đầu, mỏi vai gáy
- Cải thiện giấc ngủ
- Phù hợp người làm việc văn phòng

Mỗi liệu trình đều được thực hiện bởi các chuyên viên có chứng chỉ và nhiều năm kinh nghiệm. Không gian sang trọng, riêng tư cùng với service 5 sao sẽ mang đến trải nghiệm thư giãn tuyệt vời nhất.`,
    author: {
      name: "Ngọc Linh",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Beauty Expert",
    },
    category: "Spa Review",
  },
  // ... giữ nguyên các bài viết khác từ BLOG_DATA
];

// Chuyển đổi BLOG_DATA thành MOCK_BLOGS với đầy đủ thông tin
const MOCK_BLOGS = BLOG_DATA.map((blog) => ({
  ...blog,
  rating: 4 + Math.random() * 0.9,
  date: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("vi-VN"),
  image: `https://source.unsplash.com/random/800x600?spa,beauty,massage&sig=${blog.id}`,
  likes: 10 + Math.floor(Math.random() * 90),
  comments: 5 + Math.floor(Math.random() * 45),
  readTime: Math.floor(Math.random() * 5) + 3, // 3-7 phút đọc
}));

const BlogDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await api.blogs.getBlog(id as string);
      const blogData = response.data;

      // Format dữ liệu từ API để hiển thị trong UI
      setBlog({
        ...blogData,
        author: {
          name: blogData.authorName || "Anonymous",
          avatar:
            blogData.authorAvatar ||
            `https://randomuser.me/api/portraits/women/${Math.floor(
              Math.random() * 10
            )}.jpg`,
          role: "Reviewer",
        },
        date: new Date(blogData.createdAt).toLocaleDateString("vi-VN"),
        image:
          blogData.image ||
          `https://source.unsplash.com/random/800x600?spa,beauty,massage&sig=${blogData.id}`,
        rating: blogData.rating || 4.5,
        likes: blogData.likes || Math.floor(Math.random() * 50) + 10,
        comments: blogData.comments || Math.floor(Math.random() * 20) + 5,
        readTime: Math.floor(Math.random() * 5) + 3,
      });
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      setError(true);
      Alert.alert("Error", "Could not load blog details");

      // Fallback to mock data on error
      const foundBlog = MOCK_BLOGS.find((blog) => blog.id === id);
      if (foundBlog) {
        setBlog(foundBlog);
        setError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={{ flexDirection: "row", marginVertical: 4 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={index}
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
        <ActivityIndicator size="large" color="#007AFF" />
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
          <Text className="text-xl font-bold flex-1">Error</Text>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-gray-700 text-center mb-4">
            Could not load blog details
          </Text>
          <TouchableOpacity
            onPress={() => fetchBlogDetail()}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Try Again</Text>
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
          <Text className="text-xl font-bold flex-1">{blog.category}</Text>
        </View>

        {/* Ảnh cover */}
        <Image
          source={{ uri: blog.image }}
          className="w-full h-56"
          resizeMode="cover"
        />

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
                source={{ uri: blog.author.avatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-bold text-gray-900">
                  {blog.author.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {blog.author.role}
                </Text>
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
          <View>
            {renderRatingStars(blog.rating)}
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <Ionicons name="heart" size={20} color="#FF3B30" />
                <Text className="ml-1 text-gray-600">{blog.likes}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="chatbubble" size={20} color="#007AFF" />
                <Text className="ml-1 text-gray-600">{blog.comments}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="share-social" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nội dung chính */}
          <Text
            className="text-gray-700 leading-7 text-base mt-4"
            style={{ lineHeight: 24 }}
          >
            {blog.content}
          </Text>

          {/* Footer */}
          <View className="mt-8 pt-4 border-t border-gray-200">
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg flex-row justify-center items-center"
              onPress={() => router.push("/")}
            >
              <Text className="text-white font-semibold text-center">
                Đặt Lịch Ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetailPage;
