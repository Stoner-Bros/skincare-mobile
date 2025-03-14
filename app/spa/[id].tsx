import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const spaData = {
  id: 1,
  name: "Luxury Spa & Wellness",
  image: "https://source.unsplash.com/400x300/?spa",
  description: "Trải nghiệm dịch vụ chăm sóc da cao cấp và thư giãn tuyệt vời.",
  services: [
    { id: 1, name: "Facial Treatment", price: "$50" },
    { id: 2, name: "Body Massage", price: "$80" },
    { id: 3, name: "Aromatherapy", price: "$60" },
  ],
  reviews: [
    {
      id: 1,
      user: "Anna",
      rating: 5,
      comment: "Dịch vụ rất tốt, nhân viên thân thiện!",
    },
    {
      id: 2,
      user: "John",
      rating: 4,
      comment: "Không gian đẹp, thư giãn tuyệt vời.",
    },
  ],
};

const SpaDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Image
        source={{ uri: spaData.image }}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
        {spaData.name}
      </Text>
      <Text style={{ fontSize: 16, color: "gray" }}>{spaData.description}</Text>

      <TouchableOpacity
        onPress={() => router.push("/(booking-flow)/new")}
        style={{
          backgroundColor: "#ff7f50",
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Đặt Lịch Ngay
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
        Đánh giá khách hàng
      </Text>
      {spaData.reviews.map((review) => (
        <View
          key={review.id}
          style={{
            backgroundColor: "#f8f8f8",
            padding: 10,
            marginVertical: 5,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{review.user}</Text>
          <Text style={{ color: "gold" }}>⭐ {review.rating}</Text>
          <Text>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SpaDetail;
