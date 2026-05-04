import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { ErrorBoundary } from "@/components/error-boundary";
import { LanguageSelectionScreen } from "@/components/language-selection-screen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguageStore } from "@/store/languageStore";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";

void SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { hasSelectedLanguage, initializeLanguage } = useLanguageStore();
  const initializeProgress = useProgressStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          initializeLanguage(),
          initializeProgress(),
          initializeSettings(),
        ]);
      } finally {
        setIsInitializing(false);
        await SplashScreen.hideAsync();
      }
    };
    void init();
  }, [initializeLanguage, initializeProgress, initializeSettings]);

  if (isInitializing) {
    return null;
  }

  if (!hasSelectedLanguage) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ErrorBoundary
          title={t("errorTitle")}
          message={t("errorMessage")}
          retryLabel={t("tryAgain")}
        >
          <LanguageSelectionScreen />
          <StatusBar style="auto" />
        </ErrorBoundary>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ErrorBoundary
        title={t("errorTitle")}
        message={t("errorMessage")}
        retryLabel={t("tryAgain")}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
