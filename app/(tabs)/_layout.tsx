import { Tabs, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ChatSupportButton from "@/components/common/ChatSupportButton";

export default function TabLayout() {
  const activeColor = "#A83F98";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: "#888",
        headerShown: false,
        animation: "fade",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: "absolute",
          height: 70, // Tùy chỉnh chiều cao tab bar
          backgroundColor: "white",
          borderTopLeftRadius: 24, // Bo góc trái trên
          borderTopRightRadius: 24, // Bo góc phải trên
          shadowColor: "#000", // Màu bóng đổ
          shadowOffset: { width: 0, height: -4 }, // Hướng bóng (trên)
          shadowOpacity: 0.1, // Độ mờ bóng
          shadowRadius: 8, // Độ lan của bóng
          elevation: 8, // Bóng cho Android
        },
      }}
    >
      <Tabs.Screen
        name="index" // Màn hình Home
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking" // Màn hình Booking
        options={{
          title: "Booking",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog" // Màn hình Booking
        options={{
          title: "Blog",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="skin-test/index"
        options={{
          title: "SkinTest",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="text-document" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="UserProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="profile" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
