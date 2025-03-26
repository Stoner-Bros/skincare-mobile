import { StyleSheet, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import SkinTest from "@/components/skintest/SkinTest";
import SkinCareProducts from "@/components/skintest/SkinCareProduct";

const SkinTestScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SkinTest />
        <SkinCareProducts />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SkinTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
