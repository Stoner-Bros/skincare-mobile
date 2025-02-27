import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPaymentMethod() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });

    return () =>
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
  }, []);

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substr(0, 19); // Limit to 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const handleCvvChange = (text) => {
    setCvv(text.replace(/[^0-9]/g, "").substr(0, 3));
  };

  const handleSave = () => {
    // Validate and save card logic would go here
    router.back();
  };

  // Determine card type based on first digits
  const getCardType = () => {
    const number = cardNumber.replace(/\s+/g, "");
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6(?:011|5)/.test(number)) return "discover";
    return null;
  };

  const cardType = getCardType();

  // Render card type icon
  const renderCardTypeIcon = () => {
    if (!cardNumber) return null;

    switch (cardType) {
      case "visa":
        return <Ionicons name="card" size={24} color="#1A1F71" />;
      case "mastercard":
        return <Ionicons name="card" size={24} color="#EB001B" />;
      case "amex":
        return <Ionicons name="card" size={24} color="#006FCF" />;
      case "discover":
        return <Ionicons name="card" size={24} color="#FF6600" />;
      default:
        return <Ionicons name="card-outline" size={24} color="#666" />;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s+/g, "").length >= 15 &&
      cardholderName.length > 3 &&
      expiryDate.length === 5 &&
      cvv.length >= 3
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewContent}>
            <View style={styles.cardPreviewHeader}>
              <Text style={styles.cardPreviewType}>
                {cardType ? cardType.toUpperCase() : "CARD"}
              </Text>
              {renderCardTypeIcon()}
            </View>
            <Text style={styles.cardPreviewNumber}>
              {cardNumber || "•••• •••• •••• ••••"}
            </Text>
            <View style={styles.cardPreviewFooter}>
              <View>
                <Text style={styles.cardPreviewLabel}>CARDHOLDER NAME</Text>
                <Text style={styles.cardPreviewValue}>
                  {cardholderName || "YOUR NAME"}
                </Text>
              </View>
              <View>
                <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
                <Text style={styles.cardPreviewValue}>
                  {expiryDate || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Card Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={19}
              />
              <View style={styles.inputIcon}>{renderCardTypeIcon()}</View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                keyboardType="number-pad"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="number-pad"
                value={cvv}
                onChangeText={handleCvvChange}
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveCardContainer}
            onPress={() => setSaveCard(!saveCard)}
          >
            <View style={styles.checkbox}>
              {saveCard && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.saveCardText}>
              Save this card for future payments
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid() && styles.disabledButton]}
          onPress={handleSave}
          disabled={!isFormValid()}
        >
          <Text style={styles.saveButtonText}>Save Card</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const baseCard = {
  backgroundColor: "#f9f9f9",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
};

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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardPreview: {
    ...baseCard,
    padding: 16,
    backgroundColor: "#1A1F71",
    borderRadius: 16,
    marginBottom: 20,
  },
  cardPreviewContent: {
    gap: 10,
  },
  cardPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPreviewType: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  cardPreviewNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardPreviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardPreviewLabel: {
    fontSize: 12,
    color: "#ddd",
  },
  cardPreviewValue: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
    marginTop: 4,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  saveCardText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
