import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const menuItems = [
  {
    icon: "calendar-outline",
    title: "My Bookings",
    route: "/UserProfile/bookings",
  },
  {
    icon: "heart-outline",
    title: "Favorites",
    route: "/UserProfile/favorites",
  },
  {
    icon: "card-outline",
    title: "Payment Methods",
    route: "/UserProfile/payments",
  },
  {
    icon: "notifications-outline",
    title: "Notifications",
    route: "/UserProfile/notifications",
  },
  {
    icon: "settings-outline",
    title: "Settings",
    route: "/UserProfile/settings",
  },
  {
    icon: "help-circle-outline",
    title: "Help & Support",
    route: "/UserProfile/support",
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=150&width=150",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Jessica Parker</Text>
          <Text style={styles.email}>jessica.parker@example.com</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name={item.icon as any} size={24} color="#333" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            // Handle logout
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff4757" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f1f1f1",
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
