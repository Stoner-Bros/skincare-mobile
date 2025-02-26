"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useBook } from "@/app/context/BookingContext";

// Dữ liệu mẫu cho các dịch vụ
const services = [
  {
    id: 1,
    name: "Facial Treatments",
    description: "Revitalize your skin with our premium facial treatments",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070",
    treatments: [
      { id: 101, name: "Deep Cleansing Facial", duration: "60 min", price: 89 },
      { id: 102, name: "Anti-Aging Facial", duration: "75 min", price: 119 },
      { id: 103, name: "Hydrating Facial", duration: "60 min", price: 99 },
      { id: 104, name: "Acne Treatment", duration: "45 min", price: 79 },
    ],
  },
  {
    id: 2,
    name: "Massage Therapy",
    description: "Relax and rejuvenate with our therapeutic massages",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070",
    treatments: [
      { id: 201, name: "Swedish Massage", duration: "60 min", price: 99 },
      { id: 202, name: "Deep Tissue Massage", duration: "60 min", price: 109 },
      { id: 203, name: "Hot Stone Massage", duration: "75 min", price: 129 },
      { id: 204, name: "Aromatherapy Massage", duration: "60 min", price: 119 },
    ],
  },
  {
    id: 3,
    name: "Body Treatments",
    description: "Pamper your body with our luxurious treatments",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1974",
    treatments: [
      { id: 301, name: "Body Scrub", duration: "45 min", price: 79 },
      { id: 302, name: "Body Wrap", duration: "60 min", price: 99 },
      { id: 303, name: "Detox Treatment", duration: "75 min", price: 119 },
      { id: 304, name: "Cellulite Treatment", duration: "60 min", price: 109 },
    ],
  },
  {
    id: 4,
    name: "Hair Removal",
    description: "Smooth skin with our professional hair removal services",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b5?q=80&w=2070",
    treatments: [
      { id: 401, name: "Full Leg Waxing", duration: "45 min", price: 69 },
      { id: 402, name: "Brazilian Waxing", duration: "30 min", price: 59 },
      { id: 403, name: "Laser Hair Removal", duration: "60 min", price: 199 },
      { id: 404, name: "Eyebrow Threading", duration: "15 min", price: 29 },
    ],
  },
];

// Dữ liệu mẫu cho các địa điểm
const locations = [
  {
    id: 1,
    name: "Downtown Spa",
    address: "123 Main Street, New York, NY",
    rating: 4.8,
    reviews: 245,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070",
  },
  {
    id: 2,
    name: "Serenity Wellness Center",
    address: "456 Park Avenue, New York, NY",
    rating: 4.7,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
  },
  {
    id: 3,
    name: "Harmony Day Spa",
    address: "789 Broadway, New York, NY",
    rating: 4.9,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=2070",
  },
];

export default function NewBooking() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<number | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const { setBookingData } = useBook(); // Lấy setBookingData từ context

  // Lấy danh sách các treatment của service đã chọn
  const treatments = selectedService
    ? services.find((s) => s.id === selectedService)?.treatments || []
    : [];

  // Lấy thông tin chi tiết của treatment đã chọn
  const treatmentDetails = selectedTreatment
    ? treatments.find((t) => t.id === selectedTreatment)
    : null;

  // Lấy thông tin chi tiết của location đã chọn
  const locationDetails = selectedLocation
    ? locations.find((l) => l.id === selectedLocation)
    : null;

  // Kiểm tra xem có thể tiếp tục không
  const canContinue = selectedService && selectedTreatment && selectedLocation;

  // Xử lý khi nhấn nút tiếp tục
  // Trong hàm handleContinue
  const handleContinue = () => {
    if (canContinue) {
      setBookingData({
        service: selectedService
          ? {
              id: String(selectedService.id), // Ép kiểu number -> string
              name: selectedService.name,
            }
          : undefined,
        treatment: selectedTreatment
          ? {
              id: String(selectedTreatment.id),
              name: selectedTreatment.name,
            }
          : undefined,
        location: selectedLocation
          ? {
              id: String(selectedLocation.id),
              name: selectedLocation.name,
            }
          : undefined,
      });

      router.push("/(tabs)/booking/specialist");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Treatment</Text>
        <Text style={styles.subtitle}>Select a service to get started</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search treatments, services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesContainer}
        >
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.selectedServiceCard,
              ]}
              onPress={() => {
                setSelectedService(service.id);
                setSelectedTreatment(null);
              }}
            >
              <Image
                source={{ uri: service.image }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradient}
              />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
              </View>
              {selectedService === service.id && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedService && (
        <View style={styles.treatmentsSection}>
          <Text style={styles.sectionTitle}>Select Treatment</Text>
          <View style={styles.treatmentsContainer}>
            {treatments.map((treatment) => (
              <TouchableOpacity
                key={treatment.id}
                style={[
                  styles.treatmentCard,
                  selectedTreatment === treatment.id &&
                    styles.selectedTreatmentCard,
                ]}
                onPress={() => setSelectedTreatment(treatment.id)}
              >
                <View style={styles.treatmentInfo}>
                  <Text style={styles.treatmentName}>{treatment.name}</Text>
                  <View style={styles.treatmentDetails}>
                    <View style={styles.treatmentDetail}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.treatmentDetailText}>
                        {treatment.duration}
                      </Text>
                    </View>
                    <View style={styles.treatmentDetail}>
                      <Ionicons name="cash-outline" size={16} color="#666" />
                      <Text style={styles.treatmentDetailText}>
                        ${treatment.price}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.radioButton}>
                  {selectedTreatment === treatment.id && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedTreatment && (
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Select Location</Text>
          <View style={styles.locationsContainer}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationCard,
                  selectedLocation === location.id &&
                    styles.selectedLocationCard,
                ]}
                onPress={() => setSelectedLocation(location.id)}
              >
                <Image
                  source={{ uri: location.image }}
                  style={styles.locationImage}
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                  <View style={styles.locationRating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{location.rating}</Text>
                    <Text style={styles.reviewsText}>
                      ({location.reviews} reviews)
                    </Text>
                  </View>
                </View>
                <View style={styles.radioButton}>
                  {selectedLocation === location.id && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {treatmentDetails && locationDetails && (
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Treatment:</Text>
              <Text style={styles.summaryValue}>{treatmentDetails.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>
                {treatmentDetails.duration}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>${treatmentDetails.price}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{locationDetails.name}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.continueButtonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>
            Continue to Select Specialist
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  servicesContainer: {
    paddingRight: 20,
    paddingVertical: 8,
  },
  serviceCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    position: "relative",
  },
  selectedServiceCard: {
    borderWidth: 2,
    borderColor: "#2ecc71",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  serviceContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  serviceName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  serviceDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
  },
  treatmentsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  treatmentsContainer: {
    gap: 12,
  },
  treatmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  selectedTreatmentCard: {
    backgroundColor: "#e8f8f0",
    borderColor: "#2ecc71",
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  treatmentDetails: {
    flexDirection: "row",
    gap: 16,
  },
  treatmentDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  treatmentDetailText: {
    fontSize: 14,
    color: "#666",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  locationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  locationsContainer: {
    gap: 12,
  },
  locationCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  selectedLocationCard: {
    backgroundColor: "#e8f8f0",
    borderColor: "#2ecc71",
  },
  locationImage: {
    width: 100,
    height: 100,
  },
  locationInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  locationRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 100,
  },
});
