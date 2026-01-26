import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { LanguageSelectionScreen } from "@/components/language-selection-screen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLanguageStore } from "@/store/languageStore";
import { useProgressStore } from "@/store/progressStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { hasSelectedLanguage, initializeLanguage } = useLanguageStore();
  const initializeProgress = useProgressStore((state) => state.initialize);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeLanguage();
      await initializeProgress();
      setIsInitializing(false);
    };
    init();
  }, [initializeLanguage, initializeProgress]);

  if (isInitializing) {
    return null;
  }

  if (!hasSelectedLanguage) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LanguageSelectionScreen />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
