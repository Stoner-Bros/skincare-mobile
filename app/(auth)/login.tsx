import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Login = () => {
  return (
    <View className="pt-10">
      <Text className="text-center">Login</Text>
      <View className="w-[120px] h-[50px] border-0 bg-violet-600 rounded-2xl justify-center ">
        <Link className="text-center text-white" href={"/"}>
          Tab
        </Link>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
