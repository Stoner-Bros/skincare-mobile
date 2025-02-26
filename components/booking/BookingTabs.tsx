import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type TabType = "upcoming" | "past" | "canceled";

interface Props {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function BookingTabs({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
        onPress={() => onChangeTab("upcoming")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "upcoming" && styles.activeTabText,
          ]}
        >
          Upcoming
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "past" && styles.activeTab]}
        onPress={() => onChangeTab("past")}
      >
        <Text
          style={[styles.tabText, activeTab === "past" && styles.activeTabText]}
        >
          Past
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "canceled" && styles.activeTab]}
        onPress={() => onChangeTab("canceled")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "canceled" && styles.activeTabText,
          ]}
        >
          Canceled
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2ecc71",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#2ecc71",
    fontWeight: "500",
  },
});
