import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Your facial treatment is tomorrow at 10:00 AM",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "reminder",
    title: "Booking Reminder",
    message: "Don't forget your appointment with Sarah Johnson",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 3,
    type: "promo",
    title: "Special Offer",
    message: "20% off on all facial treatments this weekend!",
    time: "2 days ago",
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return "calendar";
      case "reminder":
        return "alarm";
      case "promo":
        return "pricetag";
      default:
        return "notifications";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Notifications",
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Mark all as read</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              !notification.isRead && styles.unreadItem,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: notification.isRead ? "#f1f1f1" : "#e8f8f0",
                },
              ]}
            >
              <Ionicons
                name={getIcon(notification.type)}
                size={24}
                color={notification.isRead ? "#666" : "#2ecc71"}
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    color: "#2ecc71",
    fontSize: 14,
    fontWeight: "500",
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    backgroundColor: "white",
  },
  unreadItem: {
    backgroundColor: "#fafafa",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
    marginLeft: 8,
    alignSelf: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});
