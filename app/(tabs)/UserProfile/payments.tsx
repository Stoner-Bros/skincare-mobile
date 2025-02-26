import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const paymentMethods = [
  {
    id: 1,
    type: "visa",
    last4: "4242",
    expiry: "12/24",
    isDefault: true,
  },
  {
    id: 2,
    type: "mastercard",
    last4: "8888",
    expiry: "06/25",
    isDefault: false,
  },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<number | null>(
    paymentMethods.find((m) => m.isDefault)?.id || null
  );

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "card-outline";
      case "mastercard":
        return "card-outline";
      default:
        return "card-outline";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Payment Methods",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.cardItem,
                selectedMethod === method.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.cardInfo}>
                <Ionicons
                  name={getCardIcon(method.type)}
                  size={24}
                  color="#333"
                />
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {method.last4}
                  </Text>
                  <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
                </View>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
              <Ionicons
                name={
                  selectedMethod === method.id
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color={selectedMethod === method.id ? "#2ecc71" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/profile/payments/add")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#2ecc71" />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Deep Cleansing Facial</Text>
                <Text style={styles.paymentDate}>Feb 20, 2024</Text>
              </View>
              <Text style={styles.paymentAmount}>$89.00</Text>
            </View>
          ))}
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: "#e8f8f0",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#666",
  },
  defaultBadge: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    margin: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2ecc71",
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: "#666",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
});
