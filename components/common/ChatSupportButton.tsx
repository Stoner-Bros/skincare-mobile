import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  actions?: Action[];
}

interface Action {
  label: string;
  route: string;
  icon?: string;
  params?: Record<string, string | number>;
}

interface SuggestionCategory {
  id: string;
  title: string;
  suggestions: string[];
}

export default function ChatSupportButton() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with your skincare today?",
      sender: "support",
      timestamp: new Date(),
      actions: [
        {
          label: "Book Appointment",
          route: "/(booking-flow)/new",
          icon: "calendar-outline",
        },
        {
          label: "Skin Test",
          route: "/skin-test",
          icon: "flask-outline",
        },
        {
          label: "Skin Guide",
          route: "/skin-guide",
          icon: "book-outline",
        },
      ],
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Suggestion categories
  const suggestionCategories: SuggestionCategory[] = [
    {
      id: "booking",
      title: "Booking & Appointments",
      suggestions: [
        "How do I book an appointment?",
        "Can I reschedule my appointment?",
        "What treatments do you offer?",
        "How long is a typical session?",
      ],
    },
    {
      id: "skincare",
      title: "Skincare Advice",
      suggestions: [
        "What products are good for acne?",
        "How can I reduce skin redness?",
        "What's the best routine for dry skin?",
        "Do you recommend any anti-aging products?",
      ],
    },
    {
      id: "pricing",
      title: "Pricing & Payments",
      suggestions: [
        "How much do treatments cost?",
        "Do you accept insurance?",
        "Are there any current promotions?",
        "What payment methods do you accept?",
      ],
    },
    {
      id: "checkout",
      title: "Checkout & Payment",
      suggestions: [
        "How do I checkout?",
        "Is my payment secure?",
        "What payment methods do you accept?",
        "Can I get a receipt?",
      ],
    },
  ];

  const handleSendMessage = (text = message) => {
    if (text.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage("");
    setShowSuggestions(false);

    // Simulate support response after a delay
    setTimeout(() => {
      const response = getAutomaticResponse(text);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "support",
        timestamp: new Date(),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, supportMessage]);

      // Show new suggestions after response
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
    }, 1000);
  };

  const getAutomaticResponse = (
    userMessage: string
  ): { text: string; actions?: Action[] } => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (
      lowerCaseMessage.includes("checkout") ||
      lowerCaseMessage.includes("payment") ||
      lowerCaseMessage.includes("pay") ||
      lowerCaseMessage.includes("purchase")
    ) {
      return {
        text: "You can complete your checkout by proceeding to our secure payment page. Would you like to go there now?",
        actions: [
          {
            label: "Go to Checkout",
            route: "/(booking-flow)/checkout",
            icon: "card-outline",
          },
          {
            label: "View Booking",
            route: "/(booking-flow)/confirm",
            icon: "list-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("appointment") ||
      lowerCaseMessage.includes("booking") ||
      lowerCaseMessage.includes("schedule")
    ) {
      return {
        text: "You can book an appointment through our booking page. Would you like me to guide you there?",
        actions: [
          {
            label: "Book Now",
            route: "/(booking-flow)/new",
            icon: "calendar-outline",
          },
          {
            label: "View My Bookings",
            route: "/(tabs)/booking",
            icon: "list-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("product") ||
      lowerCaseMessage.includes("recommend") ||
      lowerCaseMessage.includes("routine")
    ) {
      return {
        text: "We have various products for different skin types. Have you taken our skin analysis quiz to get personalized recommendations?",
        actions: [
          {
            label: "Take Skin Test",
            route: "/skin-test",
            icon: "flask-outline",
          },
          {
            label: "Browse Products",
            route: "/products",
            icon: "pricetag-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("acne") ||
      lowerCaseMessage.includes("pimple") ||
      lowerCaseMessage.includes("breakout")
    ) {
      return {
        text: "For acne concerns, we recommend products with salicylic acid or benzoyl peroxide. Would you like specific product recommendations?",
        actions: [
          {
            label: "Acne Treatments",
            route: "/treatments/acne",
            icon: "medkit-outline",
          },
          {
            label: "Book Consultation",
            route: "/(booking-flow)/new",
            icon: "calendar-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("price") ||
      lowerCaseMessage.includes("cost") ||
      lowerCaseMessage.includes("expensive")
    ) {
      return {
        text: "Our treatment prices vary based on the service. You can find detailed pricing on each treatment page. Is there a specific treatment you're interested in?",
        actions: [
          {
            label: "View Pricing",
            route: "/pricing",
            icon: "cash-outline",
          },
          {
            label: "Special Offers",
            route: "/promotions",
            icon: "gift-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("dry") ||
      lowerCaseMessage.includes("flaky") ||
      lowerCaseMessage.includes("dehydrated")
    ) {
      return {
        text: "For dry skin, we recommend using a gentle cleanser, hydrating serum with hyaluronic acid, and a rich moisturizer. Would you like specific product suggestions?",
        actions: [
          {
            label: "Dry Skin Guide",
            route: "/skin-guide/category/2",
            icon: "water-outline",
          },
          {
            label: "Recommended Products",
            route: "/products/dry-skin",
            icon: "pricetag-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("oily") ||
      lowerCaseMessage.includes("greasy") ||
      lowerCaseMessage.includes("shiny")
    ) {
      return {
        text: "For oily skin, we recommend using a foaming cleanser, oil-free moisturizer, and products with niacinamide or salicylic acid. Would you like to know more?",
        actions: [
          {
            label: "Oily Skin Guide",
            route: "/skin-guide/category/3",
            icon: "water-outline",
          },
          {
            label: "Recommended Products",
            route: "/products/oily-skin",
            icon: "pricetag-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("sensitive") ||
      lowerCaseMessage.includes("irritated") ||
      lowerCaseMessage.includes("redness")
    ) {
      return {
        text: "For sensitive skin, we recommend fragrance-free products with soothing ingredients like centella asiatica, aloe vera, and ceramides. Would you like specific recommendations?",
        actions: [
          {
            label: "Sensitive Skin Guide",
            route: "/skin-guide/category/5",
            icon: "alert-circle-outline",
          },
          {
            label: "Calming Treatments",
            route: "/treatments/sensitive",
            icon: "medkit-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("aging") ||
      lowerCaseMessage.includes("wrinkle") ||
      lowerCaseMessage.includes("fine line")
    ) {
      return {
        text: "For anti-aging concerns, we recommend products with retinol, peptides, and antioxidants. Regular treatments like microneedling can also help. Would you like to know more?",
        actions: [
          {
            label: "Anti-Aging Guide",
            route: "/skin-guide/category/4",
            icon: "time-outline",
          },
          {
            label: "Book Anti-Aging Treatment",
            route: "/(booking-flow)/new",
            params: { treatment: "anti-aging" },
            icon: "calendar-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("guide") ||
      lowerCaseMessage.includes("learn") ||
      lowerCaseMessage.includes("article")
    ) {
      return {
        text: "Our skin care guide has articles on various topics including skin types, daily routines, ingredients, and treatments. What would you like to learn about?",
        actions: [
          {
            label: "Skin Care Guide",
            route: "/skin-guide",
            icon: "book-outline",
          },
          {
            label: "Take Skin Test",
            route: "/skin-test",
            icon: "flask-outline",
          },
        ],
      };
    } else if (
      lowerCaseMessage.includes("test") ||
      lowerCaseMessage.includes("quiz") ||
      lowerCaseMessage.includes("analysis")
    ) {
      return {
        text: "Our skin test can help determine your skin type and recommend appropriate products and treatments. Would you like to take the test?",
        actions: [
          {
            label: "Take Skin Test",
            route: "/skin-test",
            icon: "flask-outline",
          },
        ],
      };
    } else {
      return {
        text: "Thank you for your message. Our skincare specialist will respond shortly. Is there anything specific about your skin concerns you'd like to share?",
        actions: [
          {
            label: "Explore Skin Guide",
            route: "/skin-guide",
            icon: "book-outline",
          },
          {
            label: "Book Consultation",
            route: "/(booking-flow)/new",
            icon: "calendar-outline",
          },
        ],
      };
    }
  };

  const handleActionPress = (action: Action) => {
    setIsModalVisible(false);

    // Navigate with params if provided
    if (action.params) {
      router.push({
        pathname: action.route,
        params: action.params,
      });
    } else {
      router.push(action.route);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageWrapper}>
      <View
        style={[
          styles.messageContainer,
          item.sender === "user" ? styles.userMessage : styles.supportMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === "user"
              ? styles.userMessageText
              : styles.supportMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            item.sender === "user"
              ? styles.userMessageTime
              : styles.supportMessageTime,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>

      {item.actions && item.actions.length > 0 && (
        <View style={styles.actionButtonsContainer}>
          {item.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => handleActionPress(action)}
            >
              {action.icon && (
                <Ionicons
                  name={action.icon as any}
                  size={16}
                  color="#2ecc71"
                  style={styles.actionIcon}
                />
              )}
              <Text style={styles.actionButtonText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderSuggestionCategory = (category: SuggestionCategory) => (
    <View key={category.id} style={styles.suggestionCategory}>
      <Text style={styles.suggestionCategoryTitle}>{category.title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScroll}
      >
        {category.suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => handleSendMessage(suggestion)}
          >
            <Text style={styles.suggestionChipText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Skin Care Support</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              inverted={false}
              contentContainerStyle={styles.messagesContainer}
            />

            {showSuggestions && messages.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {suggestionCategories.map(renderSuggestionCategory)}
              </View>
            )}

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={100}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim() === "" && styles.sendButtonDisabled,
                ]}
                onPress={() => handleSendMessage()}
                disabled={message.trim() === ""}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={message.trim() === "" ? "#aaa" : "white"}
                />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#2ecc71",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2ecc71",
    borderBottomRightRadius: 4,
  },
  supportMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "white",
  },
  supportMessageText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  supportMessageTime: {
    color: "#999",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginLeft: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2ecc71",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    color: "#2ecc71",
    fontWeight: "500",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#2ecc71",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    alignSelf: "flex-end",
  },
  sendButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  suggestionCategory: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  suggestionCategoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  suggestionsScroll: {
    flexDirection: "row",
  },
  suggestionChip: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  suggestionChipText: {
    fontSize: 14,
    color: "#333",
  },
});
