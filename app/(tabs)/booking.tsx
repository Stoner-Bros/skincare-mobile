import { View, Text, Platform, Button } from "react-native";
import React, { useState } from "react";
import { Card } from "react-native-paper";
import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Booking = () => {
  const services = [
    {
      id: 1,
      name: "Deep Cleansing Facial",
      duration: "60 min",
      price: "$95",
      description:
        "A thorough cleansing treatment to purify and refresh your skin.",
    },
    {
      id: 2,
      name: "Anti-Aging Treatment",
      duration: "75 min",
      price: "$125",
      description:
        "Advanced treatment to reduce fine lines and restore youthful glow.",
    },
    {
      id: 3,
      name: "Hydrating Facial",
      duration: "45 min",
      price: "$85",
      description: "Intensive moisture boost for dry or dehydrated skin.",
    },
  ];
  const specialists = [
    {
      id: 1,
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "8 years experience",
      specialization: "Anti-aging specialist",
      details:
        "Specialized in advanced anti-aging treatments and facial rejuvenation. Certified in various premium skincare techniques.",
      languages: ["English", "French"],
      certifications: ["Advanced Skincare", "Anti-aging Specialist"],
    },
    {
      id: 2,
      name: "Emily Chen",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "6 years experience",
      specialization: "Acne treatment expert",
      details:
        "Expert in treating various types of acne and skin conditions. Specialized in combination treatments for optimal results.",
      languages: ["English", "Mandarin"],
      certifications: ["Acne Specialist", "Skincare Therapy"],
    },
    {
      id: 3,
      name: "Maria Garcia",
      image:
        "https://images.unsplash.com/photo-1614436163996-25cee5f54290?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "5 years experience",
      specialization: "Hydration specialist",
      details:
        "Focused on hydration treatments and skin barrier repair. Expertise in treating dry and sensitive skin types.",
      languages: ["English", "Spanish"],
      certifications: ["Hydration Therapy", "Sensitive Skin Care"],
    },
  ];
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];
  return (
    <ScrollView>
      <View className="w-full min-h-screen bg-gray-50">
        <View>
          <Text className="text-center">Skincare</Text>
        </View>
        <View className="flex justify-center items-center">
          <View className="flex-row justify-between items-center space-x-6">
            {/* Step 1 */}
            <View className="flex items-center">
              <Text className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-center pt-1">
                1
              </Text>
              <Text className="mt-2">Service</Text>
            </View>
            <View className=" mb-5 w-8 h-px bg-gray-300" />

            {/* Step 2 */}
            <View className="flex items-center">
              <Text className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-center pt-1">
                2
              </Text>
              <Text className="mt-2">Specialist</Text>
            </View>
            <View className="mb-5 w-8 h-px bg-gray-300" />

            {/* Step 3 */}
            <View className="flex items-center">
              <Text className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-center pt-1">
                3
              </Text>
              <Text className="mt-2">Date & Time</Text>
            </View>
          </View>
        </View>
        {/* Choose service */}
        <View className="mb-8 mt-8">
          <View>
            <Text className="text-xl font-medium text-gray-800 mb-6">
              Step 1: Select a Service
            </Text>
            <View>
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="h-auto w-[360px] ml-7 mb-8"
                  onPress={() =>
                    console.log(`Selected service: ${service.name}`)
                  }
                >
                  <Card.Content>
                    <View className="flex flex-col gap-4">
                      {/* Service Name and Description */}
                      <View>
                        <Text className="text-lg font-bold">
                          {service.name}
                        </Text>
                        <Text className="text-gray-600">
                          {service.description}
                        </Text>
                      </View>

                      {/* Duration and Price on the same row */}
                      <View className="flex flex-row justify-between items-center">
                        <Text className="text-gray-600">
                          {service.duration}
                        </Text>
                        <Text className="font-bold text-green-500">
                          {service.price}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        </View>
        {/* Chooose Specialist */}
        <View>
          <Text>Step 2 : Choose Your Specialist</Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialists.map((specialist, index) => (
              <Card
                key={index}
                className="h-auto w-[360px] ml-7 mb-8"
                onPress={() =>
                  console.log(`Selected Specialist: ${specialist.name}`)
                }
              >
                <Card.Content>
                  <View className="flex flex-col gap-4">
                    <Image
                      source={{ uri: specialist.image }}
                      className="h-[240px] w-full rounded-lg mb-4"
                    />
                    {/* Service Name and Description */}
                    <View>
                      <Text className="text-lg font-bold">
                        {specialist.name}
                      </Text>
                      <Text className="text-gray-600">
                        {specialist.experience}
                      </Text>
                    </View>

                    {/* Duration and Price on the same row */}
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-gray-600">
                        {specialist.certifications}
                      </Text>
                      <Text className="font-bold text-green-500">
                        {/* {specialist.price} */}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
        {/* Date & Time */}
        <View>
          <Text>Step 3 : Date & Time</Text>
        </View>
        {/* Footer */}
        <View>
          <View></View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Booking;
