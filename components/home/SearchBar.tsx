import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        style={styles.input}
        placeholder="Search treatments..."
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="gray"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});
