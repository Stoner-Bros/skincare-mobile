import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import SkinTest from "@/components/skintest/SkinTest";
import SkinCareProducts from "@/components/skintest/SkinCareProduct";
import { ScrollView } from "react-native-gesture-handler";

const SkinTestScreen = () => {
  return (
    <ScrollView>
      <SkinTest />
      <SkinCareProducts />
    </ScrollView>
  );
};

export default SkinTestScreen;

const styles = StyleSheet.create({});
