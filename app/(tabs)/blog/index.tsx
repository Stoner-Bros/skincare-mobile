import { useEffect, useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Thay thế phần MOCK_BLOGS cũ bằng phiên bản mới này
const BLOG_DATA = [
  {
    id: "1",
    title: "Top 5 Dịch Vụ Massage Được Yêu Thích Nhất 2024",
    content:
      "Khám phá 5 liệu trình massage được khách hàng đánh giá cao nhất tại Beauty Care. Từ massage Thụy Điển cho đến massage đá nóng, mỗi liệu trình đều mang đến những trải nghiệm thư giãn tuyệt vời và nhiều lợi ích sức khỏe...",
    author: {
      name: "Ngọc Linh",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    category: "Spa Review",
  },
  {
    id: "2",
    title: "Trải Nghiệm Facial Premium Với Công Nghệ Mới",
    content:
      "Công nghệ chăm sóc da mặt mới nhất tại Beauty Care với các thiết bị hiện đại và mỹ phẩm cao cấp. Quy trình 90 phút cho làn da căng mịn, rạng rỡ tức thì...",
    author: {
      name: "Thu Hà",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    category: "Beauty Review",
  },
  {
    id: "3",
    title: "Đánh Giá Chi Tiết Ứng Dụng Đặt Lịch Mới",
    content:
      "Trải nghiệm đặt lịch dễ dàng với ứng dụng mới của Beauty Care. Giao diện thân thiện, tính năng đa dạng và hệ thống tích điểm hấp dẫn...",
    author: {
      name: "Minh Anh",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    category: "App Review",
  },
  {
    id: "4",
    title: "Liệu Trình Detox Body - Tái Tạo Làn Da",
    content:
      "Khám phá quy trình detox body toàn diện kéo dài 120 phút. Kết hợp tẩy da chết, massage và đắp mặt nạ thải độc, giúp làn da sáng mịn và săn chắc...",
    author: {
      name: "Thanh Thảo",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    category: "Service Review",
  },
  {
    id: "5",
    title: "Review Gói Spa Cặp Đôi Cao Cấp",
    content:
      "Trải nghiệm không gian lãng mạn và riêng tư với gói spa dành cho cặp đôi. Các liệu trình được thiết kế đặc biệt cho 2 người với những dịch vụ cao cấp...",
    author: {
      name: "Hoàng Nam",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    category: "Spa Review",
  },
  {
    id: "6",
    title: "Chăm Sóc Tóc Premium - Công Nghệ Mới",
    content:
      "Trải nghiệm dịch vụ chăm sóc tóc với công nghệ và sản phẩm nhập khẩu. Quy trình 7 bước giúp mái tóc chắc khỏe, suôn mượt...",
    author: {
      name: "Mai Hương",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    category: "Beauty Review",
  },
  {
    id: "7",
    title: "Liệu Trình Giảm Béo Hiệu Quả",
    content:
      "Chia sẻ kết quả sau 1 tháng trải nghiệm liệu trình giảm béo. Kết hợp công nghệ hiện đại và massage giảm mỡ chuyên sâu...",
    author: {
      name: "Thùy Linh",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    category: "Service Review",
  },
  {
    id: "8",
    title: "Nail Art Cao Cấp - Xu Hướng 2024",
    content:
      "Khám phá bộ sưu tập nail art mới nhất với các mẫu độc đáo và sang trọng. Sử dụng các sản phẩm cao cấp và kỹ thuật mới nhất...",
    author: {
      name: "Quỳnh Anh",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    category: "Beauty Review",
  },
  {
    id: "9",
    title: "Massage Chân Cho Dân Văn Phòng",
    content:
      "Giải pháp thư giãn tuyệt vời cho dân văn phòng với liệu trình massage chân 60 phút. Giúp giảm đau nhức và lưu thông máu...",
    author: {
      name: "Đức Minh",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    category: "Spa Review",
  },
  {
    id: "10",
    title: "Trải Nghiệm Gói VIP Member",
    content:
      "Đánh giá chi tiết các đặc quyền của gói thành viên VIP tại Beauty Care. Ưu đãi độc quyền và dịch vụ chăm sóc khách hàng 5 sao...",
    author: {
      name: "Hồng Nhung",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    category: "Service Review",
  },
];

// Chuyển đổi BLOG_DATA thành MOCK_BLOGS với đầy đủ thông tin
const MOCK_BLOGS = BLOG_DATA.map((blog) => ({
  ...blog,
  rating: 4 + Math.random() * 0.9, // Rating từ 4.0 đến 4.9
  date: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("vi-VN"), // Trong vòng 30 ngày
  image: `https://source.unsplash.com/random/800x600?spa,beauty,massage&sig=${blog.id}`,
  likes: 10 + Math.floor(Math.random() * 90), // 10-99 likes
  comments: 5 + Math.floor(Math.random() * 45), // 5-49 comments
}));

// Giảm ITEMS_PER_PAGE xuống vì chỉ có 10 bài
const ITEMS_PER_PAGE = 5;

const ReviewPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load blogs với pagination
  const loadBlogs = useCallback((pageNum = 1, shouldRefresh = false) => {
    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newBlogs = MOCK_BLOGS.slice(startIndex, endIndex);

      if (shouldRefresh) {
        setBlogs(newBlogs);
      } else {
        setBlogs((prev) => [...prev, ...newBlogs]);
      }

      setHasMore(endIndex < MOCK_BLOGS.length);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  }, []);

  // Initial load
  useEffect(() => {
    loadBlogs(1, true);
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadBlogs(1, true);
  }, []);

  // Load more
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadBlogs(nextPage);
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

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(blog-flow)/${item.id}`)}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: item.author.avatar }}
            className="w-8 h-8 rounded-full"
          />
          <View className="ml-2">
            <Text className="text-sm font-medium text-gray-900">
              {item.author.name}
            </Text>
            <Text className="text-xs text-gray-500">{item.date}</Text>
          </View>
        </View>

        <Text className="text-xs text-blue-500 mb-2">{item.category}</Text>
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {item.title}
        </Text>
        <Text className="text-gray-600 mb-2" numberOfLines={2}>
          {item.content}
        </Text>

        {renderRatingStars(item.rating)}

        <View className="flex-row justify-between items-center mt-3">
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">{item.likes}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          📢 Đánh Giá & Blog
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(blog-flow)/new")}
        className="mx-4 mt-4 mb-2 bg-blue-500 p-4 rounded-lg flex flex-row justify-center items-center shadow-md"
      >
        <Text className="text-white text-lg font-semibold">
          ✍️ Viết Đánh Giá
        </Text>
      </TouchableOpacity>

      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <ActivityIndicator size="large" color="#007AFF" className="py-4" />
          ) : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <Text className="text-gray-500 text-center mt-6">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ReviewPage;
