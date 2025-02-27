import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { DefaultTheme as PaperDefaultTheme } from "react-native-paper";
import { useEffect } from "react";
import "../global.css";

import "react-native-reanimated";

import { PaperProvider } from "react-native-paper"; // Import PaperProvider
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BookProvider from "./context/BookingContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const paperTheme =
    colorScheme === "dark" ? PaperDefaultTheme : PaperDefaultTheme;

  return (
    <GestureHandlerRootView>
      <PaperProvider theme={paperTheme}>
        <BookProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="(booking-flow)"
                options={{ headerShown: false }}
              />
            </Stack>
          </ThemeProvider>
        </BookProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
