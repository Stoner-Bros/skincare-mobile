import React from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { api } from "@/lib/api/endpoints";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleNavigationStateChange = async (navState: any) => {
    // Kiểm tra URL callback từ MoMo
    if (navState.url.includes("momo-callback")) {
      const urlParams = new URLSearchParams(navState.url.split("?")[1]);
      const callbackData = {
        orderId: urlParams.get("orderId"),
        requestId: urlParams.get("requestId"),
        amount: Number(urlParams.get("amount")),
        orderInfo: urlParams.get("orderInfo"),
        orderType: urlParams.get("orderType"),
        transId: Number(urlParams.get("transId")),
        resultCode: Number(urlParams.get("resultCode")),
        message: urlParams.get("message"),
        payType: urlParams.get("payType"),
        responseTime: urlParams.get("responseTime"),
        extraData: urlParams.get("extraData"),
        signature: urlParams.get("signature"),
      };

      try {
        await api.momo.handleCallback(callbackData);
        if (callbackData.resultCode === 0) {
          // Thanh toán thành công
          router.push("/(booking-flow)/success");
        } else {
          // Thanh toán thất bại
          router.push("/(booking-flow)/failed");
        }
      } catch (error) {
        console.error("Error handling MoMo callback:", error);
        router.push("/(booking-flow)/failed");
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: params.payUrl as string }}
        onNavigationStateChange={handleNavigationStateChange}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
