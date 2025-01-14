import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler"; // Import GestureHandlerRootView
import { Link, useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "test@example.com" && password === "password123") {
      Alert.alert("Đăng nhập thành công!");
      router.push("/"); // Navigate to Home page
    } else {
      Alert.alert("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="">
        <Link
          href={"/"}
          className="h-[40px] w-[120px] bg-blue-600 border-0 rounded-2xl text-white flex justify-center items-center"
        >
          <View className=" flex justify-center items-center h-full w-full">
            <Text className="text-white text-xl font-bold"> Go Back </Text>
          </View>
        </Link>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Đăng Nhập" onPress={handleLogin} />
        <View style={styles.linkContainer}>
          <Text>Bạn chưa có tài khoản?</Text>
          <Link href="/register" style={styles.link}>
            Đăng ký
          </Link>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    marginTop: 5,
  },
});
