import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const cancelReasons = [
  "Schedule conflict",
  "Found another service",
  "Changed my mind",
  "Health reasons",
  "Other",
];

export default function CancelBooking() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleCancel = () => {
    if (selectedReason) {
      // Handle cancel logic here
      router.push("/booking");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={60} color="#e74c3c" />
          </View>

          <Text style={styles.title}>Are you sure?</Text>
          <Text style={styles.message}>
            You're about to cancel your appointment. Please note that
            cancellations within 24 hours of the appointment may incur a fee.
          </Text>

          <View style={styles.reasonSection}>
            <Text style={styles.reasonTitle}>
              Please select a reason for cancellation:
            </Text>
            {cancelReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonCard,
                  selectedReason === reason && styles.selectedReasonCard,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
                <View style={styles.radioButton}>
                  {selectedReason === reason && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => router.back()}
        >
          <Text style={styles.keepButtonText}>Keep Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.cancelButton,
            !selectedReason && styles.disabledButton,
          ]}
          disabled={!selectedReason}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Confirm Cancellation</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  reasonSection: {
    marginBottom: 24,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  reasonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedReasonCard: {
    backgroundColor: "#ffebee",
    borderColor: "#e74c3c",
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e74c3c",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    flexDirection: "row",
    gap: 12,
  },
  keepButton: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  keepButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
