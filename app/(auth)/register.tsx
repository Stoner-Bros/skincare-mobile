import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { api } from "@/lib/api/endpoints";
import type { AccountCreationRequest } from "@/lib/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<
    AccountCreationRequest & { confirmPassword: string }
  >({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate form
      if (!formData.fullName || !formData.email || !formData.password) {
        setError("Please fill all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      console.log("Registration attempt with:", {
        email: formData.email,
        password: "****",
        fullName: formData.fullName,
      });

      // Call API to register user
      const response = await api.auth.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      console.log("Registration response:", response);

      // Check if registration was successful
      if (response.status === 200 || response.status === 201) {
        // Option 1: Auto login user
        if (response?.data?.accessToken) {
          await AsyncStorage.setItem("authToken", response.data.accessToken);
          if (response.data.refreshToken) {
            await AsyncStorage.setItem(
              "refreshToken",
              response.data.refreshToken
            );
          }
          alert("Registration successful! You are now logged in.");
          router.push("/");
        }
        // Option 2: Redirect to login
        else {
          alert("Registration successful! Please login.");
          router.push("/login");
        }
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        label="Full Name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock-check" />}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
        disabled={loading}
      >
        Sign Up
      </Button>

      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <Link href="/login">
          <Text style={styles.signInText}>Sign In</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#6200EE",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signInText: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RegisterScreen;
