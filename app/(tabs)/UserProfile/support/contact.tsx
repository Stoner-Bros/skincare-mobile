import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const topics = [
  "Booking Issues",
  "Payment Problems",
  "Technical Support",
  "Account Help",
  "Other",
];

export default function ContactSupportScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Contact Support",
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.label}>What can we help you with?</Text>
          <View style={styles.topicsList}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[
                  styles.topicChip,
                  selectedTopic === topic && styles.selectedTopic,
                ]}
                onPress={() => setSelectedTopic(topic)}
              >
                <Text
                  style={[
                    styles.topicText,
                    selectedTopic === topic && styles.selectedTopicText,
                  ]}
                >
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={6}
            placeholder="Describe your issue..."
            value={message}
            onChangeText={setMessage}
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#666" />
            <Text style={styles.infoText}>
              Our support team typically responds within 24 hours during
              business days.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedTopic || !message) && styles.disabledButton,
            ]}
            disabled={!selectedTopic || !message}
            onPress={() => {
              // Handle support message submission
              router.back();
            }}
          >
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  topicsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  selectedTopic: {
    backgroundColor: "#e8f8f0",
  },
  topicText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTopicText: {
    color: "#2ecc71",
    fontWeight: "500",
  },
  messageInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 24,
    minHeight: 120,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
