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
import { api } from "@/lib/api/endpoints";
import type {
  Blog,
  BlogResponse,
  BlogResponsePaginationModel,
} from "@/lib/types/api";

// Số bài viết mỗi trang
const ITEMS_PER_PAGE = 5;

const ReviewPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  // Hàm gọi API lấy danh sách blogs
  const fetchBlogs = useCallback(async (pageNum = 1, shouldRefresh = false) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.blogs.getBlogs(pageNum, ITEMS_PER_PAGE);
      // Kiểm tra nếu có data
      if (!response || !response.data) {
        setError("Không có dữ liệu từ API");
        setBlogs([]);
        setHasMore(false);
        return;
      }

      const apiData = response.data as BlogResponsePaginationModel;

      // Kiểm tra nếu không có items hoặc mảng rỗng
      if (!apiData.items || apiData.items.length === 0) {
        if (shouldRefresh) {
          setBlogs([]);
        }
        setHasMore(false);
        return;
      }

      // Format dữ liệu từ API để hiển thị trong UI - chỉ lấy dữ liệu thực tế
      const formattedBlogs = apiData.items.map((item: BlogResponse) => ({
        ...item,
        id: item.blogId,
        author: {
          name: item.authorName || "Anonymous",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.authorName || "Anonymous"
          )}&background=random`,
        },
        date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
        image:
          item.thumbnailUrl ||
          `https://picsum.photos/seed/${item.blogId}/800/400`,
        rating: 0, // Mặc định không có rating
        likes: 0, // Mặc định không có likes
        comments: 0, // Mặc định không có comments
      }));

      if (shouldRefresh) {
        setBlogs(formattedBlogs);
      } else {
        setBlogs((prev) => [...prev, ...formattedBlogs]);
      }

      setHasMore(pageNum < apiData.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      if (shouldRefresh) {
        setBlogs([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBlogs(1, true);
  }, []);

  // Refresh khi focus lại screen
  useFocusEffect(
    useCallback(() => {
      fetchBlogs(1, true);
    }, [])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchBlogs(1, true);
  }, []);

  // Load more
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBlogs(nextPage);
    }
  };

  const renderRatingStars = (rating: number) => {
    if (rating <= 0) {
      return <Text className="text-gray-400 text-xs">Chưa có đánh giá</Text>;
    }

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

        <Text className="text-xs text-blue-500 mb-2">
          {item.tags || "Chung"}
        </Text>
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {item.title}
        </Text>
        <Text className="text-gray-600 mb-2" numberOfLines={2}>
          {item.content}
        </Text>

        {renderRatingStars(item.rating)}

        <View className="flex-row justify-between items-center mt-3">
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">{item.viewCount || 0}</Text>
          </View>
          {item.comments > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
              <Text className="ml-1 text-gray-600">{item.comments}</Text>
            </View>
          )}
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

      {error ? (
        <Text className="text-red-500 text-center m-2">{error}</Text>
      ) : null}

      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          blogs.length === 0
            ? { flexGrow: 1, justifyContent: "center" }
            : { padding: 16 }
        }
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
            <View className="flex-1 justify-center items-center p-8">
              <Ionicons
                name="document-text-outline"
                size={64}
                color="#cccccc"
              />
              <Text className="text-gray-500 text-center mt-4 text-lg">
                Không có bài blog nào
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Hãy là người đầu tiên viết blog!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(blog-flow)/new")}
                className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Viết Blog Ngay</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default ReviewPage;
