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
import { api } from "@/lib/api/endpoints";
import * as Linking from "expo-linking";

const paymentMethods = [
  {
    id: "momo",
    name: "MoMo Wallet",
    icon: "wallet-outline",
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
  const [selectedPayment, setSelectedPayment] = useState<string>("momo");
  const [notes, setNotes] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    email: "",
    phone: "",
    fullName: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    phone: "",
  });

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

  // Load booking details from AsyncStorage
  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const [treatmentData, specialistData, bookingStateData] =
          await Promise.all([
            AsyncStorage.getItem("selectedTreatment"),
            AsyncStorage.getItem("selectedSpecialist"),
            AsyncStorage.getItem("bookingState"),
          ]);

        console.log("Raw treatment data from storage:", treatmentData);
        console.log("Raw specialist data from storage:", specialistData);
        console.log("Raw booking state from storage:", bookingStateData);

        if (!treatmentData || !bookingStateData) {
          Alert.alert("Error", "Missing booking information");
          router.back();
          return;
        }

        const treatment = JSON.parse(treatmentData);
        const bookingState = JSON.parse(bookingStateData);
        const specialist = specialistData ? JSON.parse(specialistData) : null;

        // Validate dữ liệu
        if (!treatment.id && !treatment.treatmentId) {
          Alert.alert("Error", "Invalid treatment data");
          router.back();
          return;
        }

        if (
          !bookingState.timeSlotIds ||
          !Array.isArray(bookingState.timeSlotIds)
        ) {
          Alert.alert("Error", "Invalid time slot data");
          router.back();
          return;
        }

        setBookingDetails({
          treatment,
          specialist,
          bookingState,
          price: Number(treatment.price) || 0,
          tax: (Number(treatment.price) || 0) * 0.1,
        });
      } catch (error) {
        console.error("Error loading booking details:", error);
        Alert.alert("Error", "Failed to load booking details");
      }
    };

    loadBookingDetails();
  }, []);

  // Sửa lại useEffect để load user profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth and loading profile...");
        const [token, profileData] = await Promise.all([
          AsyncStorage.getItem("accessToken"),
          AsyncStorage.getItem("userProfile"),
        ]);

        console.log("Token:", token);
        console.log("Raw profile data:", profileData);

        if (!token) {
          Alert.alert("Error", "Please login to continue");
          router.push("/(auth)/login");
          return;
        }

        if (profileData) {
          const profile = JSON.parse(profileData);
          console.log("Parsed profile:", profile);
          if (!profile.email) {
            // Nếu không có email trong profile, lấy từ API
            const profileResponse = await api.auth.getProfile();
            console.log("API profile response:", profileResponse);
            if (profileResponse?.data) {
              const updatedProfile = {
                email: profileResponse.data.email,
                fullName:
                  profileResponse.data.fullName || profile.fullName || "",
                phone: profileResponse.data.phone || profile.phone || "",
              };
              console.log("Updated profile:", updatedProfile);
              await AsyncStorage.setItem(
                "userProfile",
                JSON.stringify(updatedProfile)
              );
              setUserProfile(updatedProfile);
            }
          } else {
            setUserProfile(profile);
          }
        } else {
          // Không có profile trong storage, lấy từ API
          console.log("No profile in storage, fetching from API...");
          const profileResponse = await api.auth.getProfile();
          console.log("API profile response:", profileResponse);
          if (profileResponse?.data) {
            const userProfile = {
              email: profileResponse.data.email,
              fullName: profileResponse.data.fullName || "",
              phone: profileResponse.data.phone || "",
            };
            console.log("Setting new profile:", userProfile);
            await AsyncStorage.setItem(
              "userProfile",
              JSON.stringify(userProfile)
            );
            setUserProfile(userProfile);
          }
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        Alert.alert("Error", "Please login again");
        router.push("/(auth)/login");
      }
    };

    checkAuth();
  }, []);

  // Thêm useEffect để khởi tạo editedProfile từ userProfile
  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        fullName: userProfile.fullName || "",
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile]);

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

  // Thêm hàm format fullName
  const formatFullName = (name: string) => {
    // Chuyển đổi thành title case và loại bỏ khoảng trắng thừa
    return name
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleMomoCheckout = async (bookingResponse: any) => {
    try {
      if (bookingResponse?.qrCodeUrl) {
        const canOpen = await Linking.canOpenURL(bookingResponse.qrCodeUrl);

        if (canOpen) {
          await Linking.openURL(bookingResponse.qrCodeUrl);
          // Lưu thông tin booking để kiểm tra trạng thái sau
          await AsyncStorage.setItem(
            "pendingBooking",
            JSON.stringify({
              orderId: bookingResponse.orderId,
              requestId: bookingResponse.requestId,
              amount: bookingResponse.amount,
            })
          );

          // Chuyển đến trang success với trạng thái pending
          router.push({
            pathname: "/(booking-flow)/success",
            params: {
              status: "pending",
              orderId: bookingResponse.orderId,
            },
          });
        } else {
          // Fallback to payUrl if can't open MoMo app
          if (bookingResponse.payUrl) {
            await Linking.openURL(bookingResponse.payUrl);
          } else {
            throw new Error("Cannot open MoMo payment");
          }
        }
      }
    } catch (error) {
      console.error("MoMo payment error:", error);
      Alert.alert(
        "Payment Error",
        "Failed to open MoMo payment. Please try again."
      );
    }
  };

  const handleConfirm = async () => {
    try {
      console.log("1. Starting handleConfirm...");
      setIsLoading(true);

      // Validate fullName
      if (!editedProfile.fullName.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }

      // Get all necessary data
      const [treatmentData, specialistData, bookingStateData] =
        await Promise.all([
          AsyncStorage.getItem("selectedTreatment"),
          AsyncStorage.getItem("selectedSpecialist"),
          AsyncStorage.getItem("bookingState"),
        ]);

      if (!treatmentData || !bookingStateData) {
        throw new Error("Missing booking information");
      }

      const treatment = JSON.parse(treatmentData);
      const bookingState = JSON.parse(bookingStateData);
      const specialist = specialistData ? JSON.parse(specialistData) : null;

      // Format booking request theo đúng schema
      const bookingRequest = {
        email: userProfile.email,
        phone: editedProfile.phone?.trim() || userProfile.phone || "",
        fullName: formatFullName(editedProfile.fullName),
        treatmentId: Number(treatment.treatmentId || treatment.id),
        skinTherapistId: specialist ? Number(specialist.id) : null, // Đổi null thành 0 theo schema
        date: bookingState.date,
        timeSlotIds: bookingState.timeSlotIds.map(Number), // Đảm bảo là array of numbers
        notes: notes.trim() || "No special requests",
        paymentMethod: selectedPayment,
      };

      console.log(
        "Sending booking request:",
        JSON.stringify(bookingRequest, null, 2)
      );

      const response = await api.bookings.createBooking(bookingRequest);

      if (response?.data) {
        if (selectedPayment === "momo") {
          await handleMomoCheckout(response.data);
        } else {
          // Xử lý cho các phương thức thanh toán khác
          router.push("/(booking-flow)/success");
        }
      } else {
        console.log("17. No response data from API");
        throw new Error("No response from server");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewPaymentMethod = () => {
    router.push("/profile/payment-methods/add");
  };

  // Render booking details section
  const renderBookingDetails = () => {
    if (!bookingDetails) return null;

    const { treatment, specialist, bookingState } = bookingDetails;
    const selectedDate = new Date(bookingState.date);

    return (
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.detailText}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.detailText}>
            {bookingState.timeSlotIds.length} time slot(s) selected
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="medical-outline" size={20} color="#666" />
          <Text style={styles.detailText}>
            {treatment.name} ({treatment.duration} min)
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.detailText}>
            {specialist ? specialist.fullName : "No specialist selected"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet-outline" size={20} color="#666" />
          <Text style={styles.detailText}>
            Payment: {selectedPayment === "momo" ? "MoMo Wallet" : "Cash"}
          </Text>
        </View>
      </View>
    );
  };

  // Component GuestForm để nhập thông tin khách
  const GuestForm = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Guest Information</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={guestInfo.fullName}
          onChangeText={(text) =>
            setGuestInfo((prev) => ({ ...prev, fullName: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={guestInfo.email}
          onChangeText={(text) =>
            setGuestInfo((prev) => ({ ...prev, email: text }))
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={guestInfo.phone}
          onChangeText={(text) =>
            setGuestInfo((prev) => ({ ...prev, phone: text }))
          }
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  // Thêm component để edit profile
  const ProfileForm = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Information</Text>
        <TouchableOpacity
          onPress={() => setIsEditingProfile(!isEditingProfile)}
        >
          <Text style={styles.addNewText}>
            {isEditingProfile ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditingProfile ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={editedProfile.fullName}
            onChangeText={(text) =>
              setEditedProfile((prev) => ({ ...prev, fullName: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={editedProfile.phone}
            onChangeText={(text) =>
              setEditedProfile((prev) => ({ ...prev, phone: text }))
            }
            keyboardType="phone-pad"
          />
        </View>
      ) : (
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {userProfile?.fullName || "Please add your name"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {userProfile?.phone || "No phone number"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  // Thêm hàm xử lý thoát
  const handleExit = () => {
    Alert.alert(
      "Thoát đặt lịch",
      "Bạn có chắc muốn thoát? Thông tin đặt lịch sẽ không được lưu.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Thoát",
          style: "destructive",
          onPress: async () => {
            // Xóa thông tin đặt lịch tạm thời
            try {
              await Promise.all([
                AsyncStorage.removeItem("selectedTreatment"),
                AsyncStorage.removeItem("selectedSpecialist"),
                AsyncStorage.removeItem("bookingState"),
              ]);
              router.push("/(tabs)"); // Quay về trang chủ
            } catch (error) {
              console.error("Error clearing booking data:", error);
            }
          },
        },
      ]
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
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ProfileForm />
        {isGuest && <GuestForm />}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          {renderBookingDetails()}
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
          {bookingDetails && (
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Treatment</Text>
                <Text style={styles.priceValue}>
                  ${bookingDetails.price.toFixed(2)}
                </Text>
              </View>
              {/* <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tax (10%)</Text>
                <Text style={styles.priceValue}>
                  ${bookingDetails.tax.toFixed(2)}
                </Text>
              </View> */}
              <View style={styles.divider} />
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${bookingDetails.price.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
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
                Proceed to Checkout ($
                {bookingDetails?.price.toFixed(2)})
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
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  exitButton: {
    padding: 4,
    width: 24, // Để cân đối với nút back
  },
});
