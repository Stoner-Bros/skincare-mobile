import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { api } from "@/lib/api/endpoints";

interface MomoPaymentProps {
  amount: number;
  orderInfo: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const MomoPayment = ({
  amount,
  orderInfo,
  onSuccess,
  onError,
}: MomoPaymentProps) => {
  const [loading, setLoading] = useState(false);

  const handleMomoPayment = async () => {
    try {
      setLoading(true);

      // Tạo orderId unique
      const orderId = `ORDER_${Date.now()}`;

      // Gọi API tạo payment
      const response = await api.momo.createPayment({
        amount: amount.toString(),
        orderId,
        orderInfo,
      });

      // Kiểm tra response và mở link thanh toán
      if (response?.payUrl) {
        // Mở URL thanh toán MoMo
        await Linking.openURL(response.payUrl);

        // Xử lý callback khi user quay lại app
        // Bạn cần implement deep linking để handle callback URL
        onSuccess?.();
      } else {
        throw new Error("Invalid payment URL");
      }
    } catch (error) {
      console.error("MoMo payment error:", error);
      Alert.alert("Payment Error", "Failed to process MoMo payment");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4">
      <TouchableOpacity
        onPress={handleMomoPayment}
        disabled={loading}
        className={`bg-[#A50064] p-4 rounded-lg flex-row items-center justify-center ${
          loading ? "opacity-50" : ""
        }`}
      >
        <Text className="text-white font-semibold text-center">
          {loading ? "Processing..." : "Pay with MoMo"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MomoPayment;
