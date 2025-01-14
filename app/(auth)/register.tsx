import { Link } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function RegisterScreen() {
  const theme = useTheme(); // Để sử dụng theme hiện tại
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    // Thực hiện logic đăng ký (API call)
    alert(`Đăng ký thành công: ${name}, ${email}`);
  };

  return (
    <>
      {/* <Link
        href={"/login"}
        className="bg-violet-600 h-[40px] w-[120px] border-0 rounded-xl flex justify-center items-center"
      >
        <View className="h-full w-full flex justify-center items-center">
          <View className="flex flex-row items-center">
            <AntDesign name="caretleft" size={24} color="white" />
            <Text className="!text-white text-2xl font-bold ml-2">Login</Text>
          </View>
        </View>
      </Link> */}
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Đăng ký
        </Text>

        <TextInput
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        <TextInput
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        <Button
          className="!bg-violet-600"
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
        >
          Đăng ký
        </Button>
        <View className="flex justify-center items-center ">
          <Link className="w-[100px] h-[40px] " href="/login">
            <View className="flex justify-center items-center h-full w-full">
              <Text className="!text-blue-500">Đăng Nhập</Text>
            </View>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
