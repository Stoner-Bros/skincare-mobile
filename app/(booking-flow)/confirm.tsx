import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const paymentMethods = [
  {
    id: "card",
    name: "Credit Card",
    icon: "card-outline",
    last4: "4242",
  },
  {
    id: "cash",
    name: "Cash",
    icon: "cash-outline",
  },
];

export default function BookingConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [notes, setNotes] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);

  const basePrice = 89.99;
  const tax = basePrice * 0.1;
  const total = basePrice + tax - discount;

  // Lấy thông tin chuyên gia đã chọn từ AsyncStorage
  useEffect(() => {
    const loadSavedCards = async () => {
      try {
        const cardsData = await AsyncStorage.getItem("savedCards");
        if (cardsData) {
          setSavedCards(JSON.parse(cardsData));
        }
      } catch (error) {
        console.error("Error loading saved cards:", error);
      }
    };

    loadSavedCards();
  }, []);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(basePrice * 0.2);
      Alert.alert("Success", "Promo code applied successfully! 20% discount.");
    } else if (promoCode.toLowerCase() === "first10") {
      setDiscount(basePrice * 0.1);
      Alert.alert("Success", "Promo code applied successfully! 10% discount.");
    } else {
      Alert.alert("Invalid Code", "This promo code is invalid or expired.");
      setDiscount(0);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Save current booking details to AsyncStorage for checkout page
      const bookingDetails = {
        date: params.date,
        time: params.time,
        specialist: "Jazy Dewo",
        treatment: "Deep Tissue Massage (60 min)",
        basePrice: basePrice,
        tax: tax,
        discount: discount,
        total: total,
        notes: notes,
      };

      await AsyncStorage.setItem(
        "currentBooking",
        JSON.stringify(bookingDetails)
      );

      // Navigate to checkout page
      router.push({
        pathname: "/(booking-flow)/checkout",
        params: {
          paymentMethod: selectedPayment,
        },
      });
    } catch (error) {
      console.error("Error saving booking details:", error);
      Alert.alert(
        "Error",
        "There was an error processing your booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addNewPaymentMethod = () => {
    router.push("/profile/payment-methods/add");
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
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailText}>
                {new Date(params.date as string).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{params.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Jazy Dewo</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={20} color="#666" />
              <Text style={styles.detailText}>
                Deep Tissue Massage (60 min)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={addNewPaymentMethod}>
              <Text style={styles.addNewText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentInfo}>
                <Ionicons name={method.icon as any} size={24} color="#333" />
                <View>
                  <Text style={styles.paymentText}>{method.name}</Text>
                  {method.last4 && (
                    <Text style={styles.cardDetails}>
                      •••• •••• •••• {method.last4}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.radioButton}>
                {selectedPayment === method.id && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyPromoCode}
              disabled={!promoCode}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requests or notes for your treatment?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Treatment</Text>
              <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Discount</Text>
                <Text style={styles.discountValue}>
                  -${discount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By confirming this booking, you agree to our{" "}
            <Text style={styles.termsLink}>Terms & Conditions</Text> and{" "}
            <Text style={styles.termsLink}>Cancellation Policy</Text>.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.confirmButtonText}>Processing...</Text>
            ) : (
              <Text style={styles.confirmButtonText}>
                Proceed to Checkout (${total.toFixed(2)})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  addNewText: {
    color: "#2ecc71",
    fontWeight: "500",
  },
  detailCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
  },
  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: "#e8f8f0",
    borderColor: "#2ecc71",
    borderWidth: 1,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
  },
  cardDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2ecc71",
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  promoInput: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  notesInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    height: 100,
  },
  priceCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: "#333",
  },
  discountLabel: {
    fontSize: 14,
    color: "#2ecc71",
  },
  discountValue: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ecc71",
  },
  termsSection: {
    padding: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#2ecc71",
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
