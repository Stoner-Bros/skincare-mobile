import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // Mock booking data - replace with actual data fetching
  const booking = {
    treatment: "Deep Cleansing Facial",
    specialist: "Sarah Johnson",
    date: "2024-02-20T11:00:00",
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Write a Review",
          headerLeft: () => (
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.bookingInfo}>
          <Text style={styles.treatment}>{booking.treatment}</Text>
          <Text style={styles.specialist}>{booking.specialist}</Text>
          <Text style={styles.date}>
            {new Date(booking.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#ffd700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={6}
            placeholder="Share your experience..."
            value={review}
            onChangeText={setReview}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!rating || !review) && styles.disabledButton,
          ]}
          disabled={!rating || !review}
          onPress={() => {
            // Handle review submission
            router.back();
          }}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  bookingInfo: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 24,
  },
  treatment: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  specialist: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  reviewContainer: {
    marginBottom: 24,
  },
  reviewInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
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
