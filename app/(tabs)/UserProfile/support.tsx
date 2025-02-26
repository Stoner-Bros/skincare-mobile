import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const faqCategories = [
  {
    id: 1,
    title: "Booking & Appointments",
    icon: "calendar",
    questions: [
      "How do I book an appointment?",
      "How can I reschedule my appointment?",
      "What is the cancellation policy?",
    ],
  },
  {
    id: 2,
    title: "Payments & Billing",
    icon: "card",
    questions: [
      "What payment methods do you accept?",
      "How do refunds work?",
      "Are there any booking fees?",
    ],
  },
  {
    id: 3,
    title: "Services & Treatments",
    icon: "medical",
    questions: [
      "What treatments do you offer?",
      "How long do treatments take?",
      "What should I prepare before my treatment?",
    ],
  },
];

export default function SupportScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Help & Support",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>How can we help you?</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push("/profile/support/contact")}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Topics</Text>
          {faqCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() =>
                router.push(`/profile/support/category/${category.id}`)
              }
            >
              <View style={styles.categoryHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color="#2ecc71"
                  />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              <View style={styles.questionsList}>
                {category.questions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.questionItem}
                    onPress={() =>
                      router.push(
                        `/profile/support/faq/${category.id}/${index}`
                      )
                    }
                  >
                    <Text style={styles.questionText}>{question}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text" size={24} color="#666" />
            <Text style={styles.actionText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="shield-checkmark" size={24} color="#666" />
            <Text style={styles.actionText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 24,
    backgroundColor: "#f8f8f8",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  questionsList: {
    paddingLeft: 16,
    paddingBottom: 16,
  },
  questionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  questionText: {
    fontSize: 14,
    color: "#333",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
});
