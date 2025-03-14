import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatSupportButton from "../../../components/common/ChatSupportButton";

// Sample category data
const categories = {
  "1": {
    title: "Skin Types",
    icon: "water-outline",
    color: "#4ECDC4",
    description:
      "Learn about different skin types and how to care for your specific needs.",
    articles: [
      {
        id: "2",
        title: "Understanding Your Skin Type: A Comprehensive Guide",
        image:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "7 min read",
      },
      {
        id: "4",
        title: "How to Care for Dry Skin Year-Round",
        image:
          "https://images.unsplash.com/photo-1513786089032-a7bdd6fe4a30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
      {
        id: "5",
        title: "Managing Oily Skin: Tips and Tricks",
        image:
          "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
      {
        id: "6",
        title: "Combination Skin: Finding the Right Balance",
        image:
          "https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "4 min read",
      },
    ],
  },
  "2": {
    title: "Daily Routines",
    icon: "time-outline",
    color: "#FF6B6B",
    description:
      "Discover effective skincare routines for morning, evening, and special occasions.",
    articles: [
      {
        id: "1",
        title: "How to Build a Perfect Skincare Routine",
        image:
          "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
      {
        id: "7",
        title: "Morning Skincare Routine for Busy Professionals",
        image:
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "4 min read",
      },
      {
        id: "8",
        title: "Evening Skincare Routine for Optimal Repair",
        image:
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
      {
        id: "9",
        title: "Weekend Skincare: Masks and Treatments",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
    ],
  },
  "3": {
    title: "Ingredients",
    icon: "leaf-outline",
    color: "#A2D729",
    description:
      "Learn about key skincare ingredients, their benefits, and how to use them effectively.",
    articles: [
      {
        id: "3",
        title: "The Science Behind Hyaluronic Acid",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "4 min read",
      },
      {
        id: "10",
        title: "Retinol: Benefits, Side Effects, and How to Use",
        image:
          "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "8 min read",
      },
      {
        id: "11",
        title: "Vitamin C: The Brightening Powerhouse",
        image:
          "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
      {
        id: "12",
        title: "Niacinamide: The Multi-Tasking Ingredient",
        image:
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
    ],
  },
  "4": {
    title: "Treatments",
    icon: "flask-outline",
    color: "#9D8DF1",
    description:
      "Explore professional and at-home treatments for various skin concerns.",
    articles: [
      {
        id: "13",
        title: "Chemical Peels: Types, Benefits, and Aftercare",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "7 min read",
      },
      {
        id: "14",
        title: "Microdermabrasion vs. Dermaplaning",
        image:
          "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
      {
        id: "15",
        title: "LED Light Therapy: Colors and Their Benefits",
        image:
          "https://images.unsplash.com/photo-1571646034647-67d0c5f7fb2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
      {
        id: "16",
        title: "At-Home Facial Massage Techniques",
        image:
          "https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "4 min read",
      },
    ],
  },
  "5": {
    title: "Skin Concerns",
    icon: "alert-circle-outline",
    color: "#FFC75F",
    description:
      "Find solutions for common skin concerns like acne, aging, hyperpigmentation, and more.",
    articles: [
      {
        id: "17",
        title: "Acne: Causes, Types, and Treatment Options",
        image:
          "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "8 min read",
      },
      {
        id: "18",
        title: "Hyperpigmentation: Causes and Solutions",
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "7 min read",
      },
      {
        id: "19",
        title: "Anti-Aging Strategies That Actually Work",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "9 min read",
      },
      {
        id: "20",
        title: "Rosacea: Understanding and Managing Flare-Ups",
        image:
          "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
    ],
  },
  "6": {
    title: "Seasonal Care",
    icon: "sunny-outline",
    color: "#F9F871",
    description:
      "Adjust your skincare routine for different seasons and environmental conditions.",
    articles: [
      {
        id: "21",
        title: "Winter Skincare: Combating Dryness and Irritation",
        image:
          "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
      {
        id: "22",
        title: "Summer Skincare: Beyond Sunscreen",
        image:
          "https://images.unsplash.com/photo-1528495612343-9ca9f4a9f67c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "6 min read",
      },
      {
        id: "23",
        title: "Transitioning Your Skincare from Winter to Spring",
        image:
          "https://images.unsplash.com/photo-1582683508301-a1c79acfc5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "4 min read",
      },
      {
        id: "24",
        title: "Fall Skincare: Repairing Summer Damage",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        readTime: "5 min read",
      },
    ],
  },
};

export default function CategoryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const categoryId = Array.isArray(id) ? id[0] : id;

  const category = categories[categoryId as keyof typeof categories];

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Category Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            The category you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={styles.backToGuideButton}
            onPress={() => router.push("/skin-guide")}
          >
            <Text style={styles.backToGuideText}>Back to Skin Guide</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryHeader}>
          <View
            style={[styles.categoryIcon, { backgroundColor: category.color }]}
          >
            <Ionicons name={category.icon} size={32} color="white" />
          </View>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>

        <View style={styles.articlesContainer}>
          {category.articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => {
                router.push({
                  pathname: "/skin-guide/article/[id]",
                  params: { id: article.id },
                });
              }}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Need Personalized Advice?</Text>
          <Text style={styles.ctaDescription}>
            Book a consultation with one of our skincare specialists for
            personalized recommendations.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/booking/new")}
          >
            <Text style={styles.ctaButtonText}>Book a Consultation</Text>
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
  categoryHeader: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  articlesContainer: {
    padding: 16,
  },
  articleCard: {
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
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  articleReadTime: {
    fontSize: 14,
    color: "#999",
  },
  ctaContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  backToGuideButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backToGuideText: {
    color: "white",
    fontWeight: "600",
  },
});
