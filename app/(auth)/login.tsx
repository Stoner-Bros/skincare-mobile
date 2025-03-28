import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api/endpoints";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.auth.login({
        email,
        password,
      });

      console.log("Login response:", response);

      if (response?.data?.accessToken) {
        const token = response.data.accessToken;

        // Validate token trước khi lưu
        try {
          const validateResponse = await api.auth.validateToken(token);
          console.log("Token validation response:", validateResponse);

          if (validateResponse?.status === 200) {
            // Token hợp lệ, lưu token
            await AsyncStorage.setItem("accessToken", token);
            if (response.data.refreshToken) {
              await AsyncStorage.setItem(
                "refreshToken",
                response.data.refreshToken
              );
            }

            // Gọi API lấy profile với token đã validate
            try {
              const profileResponse = await api.auth.getProfile();
              console.log("Profile response:", profileResponse);

              if (profileResponse?.data) {
                // Lưu thông tin profile đầy đủ
                const userProfile = {
                  accountId: profileResponse.data.accountId, // Thêm accountId
                  email: profileResponse.data.email,
                  fullName:
                    profileResponse.data.fullName ||
                    profileResponse.data.email.split("@")[0],
                  phone: profileResponse.data.phone || "",
                  address: profileResponse.data.address || "",
                  dob: profileResponse.data.dob || "",
                  avatar: profileResponse.data.avatar || "",
                  otherInfo: profileResponse.data.otherInfo || "",
                };
                await AsyncStorage.setItem(
                  "accountId",
                  String(profileResponse.data.accountId)
                );

                await AsyncStorage.setItem(
                  "userProfile",
                  JSON.stringify(userProfile)
                );
              }
            } catch (profileError) {
              console.error("Error fetching profile:", profileError);
            }

            router.push("/");
          } else {
            throw new Error("Invalid token");
          }
        } catch (validateError) {
          console.error("Token validation error:", validateError);
          setError("Authentication failed. Please try again.");
        }
      } else {
        setError("Login response missing token");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Image source={require("../../assets/logo.png")} style={styles.logo} /> */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          left={<TextInput.Icon icon="lock" />}
          style={styles.input}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
          disabled={loading}
        >
          Sign In
        </Button>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <Link href="/register">
            <Text style={styles.signUpText}>Sign Up</Text>
          </Link>
          <Text> OR </Text>
          <Link href="/">
            <Text style={styles.signUpText}>Skip</Text>
          </Link>
        </View>
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
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  button: {
    padding: 5,
    borderRadius: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  signUpText: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Login;
