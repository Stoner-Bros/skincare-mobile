import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    appointments: true,
    reminders: true,
    promotions: false,
    updates: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Settings",
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Appointment Updates</Text>
              <Text style={styles.settingDescription}>
                Get notified about your upcoming appointments
              </Text>
            </View>
            <Switch
              value={notifications.appointments}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, appointments: value }))
              }
              trackColor={{ false: "#ccc", true: "#2ecc71" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Reminders</Text>
              <Text style={styles.settingDescription}>
                Receive reminders before your appointments
              </Text>
            </View>
            <Switch
              value={notifications.reminders}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, reminders: value }))
              }
              trackColor={{ false: "#ccc", true: "#2ecc71" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Promotions</Text>
              <Text style={styles.settingDescription}>
                Stay updated with special offers and deals
              </Text>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, promotions: value }))
              }
              trackColor={{ false: "#ccc", true: "#2ecc71" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#2ecc71" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemTitle}>Personal Information</Text>
                <Text style={styles.menuItemDescription}>
                  Update your profile details
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemTitle}>Password & Security</Text>
                <Text style={styles.menuItemDescription}>
                  Manage your password and security settings
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="language-outline" size={24} color="#333" />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemTitle}>Language</Text>
                <Text style={styles.menuItemDescription}>
                  Choose your preferred language
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
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
    flex: 1,
    marginRight: 16,
  },
  menuItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff3f3",
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ff4757",
    fontSize: 16,
    fontWeight: "600",
  },
});
