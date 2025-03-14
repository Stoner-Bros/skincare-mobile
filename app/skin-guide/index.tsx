import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatSupportButton from "../../components/common/ChatSupportButton";

const skinGuideCategories = [
  {
    id: "1",
    title: "Skin Types",
    icon: "water-outline",
    color: "#4ECDC4",
  },
  {
    id: "2",
    title: "Daily Routines",
    icon: "time-outline",
    color: "#FF6B6B",
  },
  {
    id: "3",
    title: "Ingredients",
    icon: "leaf-outline",
    color: "#A2D729",
  },
  {
    id: "4",
    title: "Treatments",
    icon: "flask-outline",
    color: "#9D8DF1",
  },
  {
    id: "5",
    title: "Skin Concerns",
    icon: "alert-circle-outline",
    color: "#FFC75F",
  },
  {
    id: "6",
    title: "Seasonal Care",
    icon: "sunny-outline",
    color: "#F9F871",
  },
];

const featuredArticles = [
  {
    id: "1",
    title: "How to Build a Perfect Skincare Routine",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "5 min read",
    category: "Daily Routines",
  },
  {
    id: "2",
    title: "Understanding Your Skin Type: A Comprehensive Guide",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "7 min read",
    category: "Skin Types",
  },
  {
    id: "3",
    title: "The Science Behind Hyaluronic Acid",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    readTime: "4 min read",
    category: "Ingredients",
  },
];

export default function SkinGuide() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/skin-guide/category/[id]",
      params: { id: categoryId },
    });
  };

  const handleArticlePress = (articleId: string) => {
    router.push({
      pathname: "/skin-guide/article/[id]",
      params: { id: articleId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skin Care Guide</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search skin care topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesContainer}>
            {skinGuideCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Ionicons name={category.icon} size={24} color="white" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          {featuredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => handleArticlePress(article.id)}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skin Care Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#FFC75F" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Hydration is Key</Text>
              <Text style={styles.tipText}>
                Drinking at least 8 glasses of water daily helps maintain skin
                elasticity and glow.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="sunny-outline" size={24} color="#FFC75F" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Don't Skip Sunscreen</Text>
              <Text style={styles.tipText}>
                Apply SPF 30+ sunscreen daily, even on cloudy days to prevent
                premature aging.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bed-outline" size={24} color="#FFC75F" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Beauty Sleep</Text>
              <Text style={styles.tipText}>
                7-8 hours of quality sleep allows your skin to repair and
                regenerate.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Skin Analysis</Text>
          <TouchableOpacity
            style={styles.analysisCard}
            onPress={() => router.push("/skin-analysis")}
          >
            <View style={styles.analysisContent}>
              <Text style={styles.analysisTitle}>
                Get Your Personalized Skin Analysis
              </Text>
              <Text style={styles.analysisText}>
                Answer a few questions about your skin to receive tailored
                recommendations.
              </Text>
              <View style={styles.analysisButton}>
                <Text style={styles.analysisButtonText}>Take the Quiz</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
              }}
              style={styles.analysisImage}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Chat Support Button */}
      <ChatSupportButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  articleCategory: {
    fontSize: 12,
    color: "#2ecc71",
    fontWeight: "500",
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  articleReadTime: {
    fontSize: 12,
    color: "#999",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fff9e6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  analysisCard: {
    flexDirection: "row",
    backgroundColor: "#e6f7ff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  analysisContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  analysisButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ecc71",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  analysisButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 4,
  },
  analysisImage: {
    width: 120,
    height: "100%",
  },
});
