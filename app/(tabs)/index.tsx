import Header from "@/components/home/Header";

import SearchBar from "@/components/home/SearchBar";
import Specialists from "@/components/home/Specialists";
import PopularTreatments from "@/components/home/Treaments";

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpaDetail from "../spa/[id]";
import ChatSupportButton from "@/components/common/ChatSupportButton";
import Services from "@/components/home/Services";
const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

          {/* <Categories /> */}
          <PopularTreatments />
          <Services limit={4} />
          <Specialists />
          <SpaDetail />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;
