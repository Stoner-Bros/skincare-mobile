import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface GoBackButtonProps {
  /**
   * @default "Go Back"
   */
  title?: string;
  /**
   * @default "#007bff"
   */
  buttonColor?: string;
  /**
   * @default "#fff"
   */
  textColor?: string;
  /**
   * @default 16
   */
  fontSize?: number;
  /**
   * @default 12
   */
  paddingHorizontal?: number;
  /**
   * @default 8
   */
  paddingVertical?: number;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({
  title = "Go Back",
  buttonColor = "#007bff",
  textColor = "#fff",
  fontSize = 16,
  paddingHorizontal = 12,
  paddingVertical = 8,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <TouchableOpacity
      onPress={handleGoBack}
      style={[
        styles.button,
        { backgroundColor: buttonColor, paddingHorizontal, paddingVertical },
      ]}
    >
      <Ionicons name="arrow-back" size={fontSize} color={textColor} />
      <Text
        style={[styles.text, { color: textColor, fontSize, marginLeft: 8 }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    fontWeight: "bold",
  },
});

export default GoBackButton;
