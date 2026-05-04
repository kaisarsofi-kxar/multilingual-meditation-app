import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "@/hooks/use-translation";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function AboutScreen() {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <>
      <Stack.Screen
        options={{
          title: t("aboutTitle"),
          headerBackTitle: t("profile"),
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ThemedView style={styles.block}>
          <ThemedText style={styles.body}>{t("aboutBody")}</ThemedText>
          <ThemedText style={styles.version}>
            {t("versionLabel", { version })}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  block: {
    gap: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  version: {
    fontSize: 14,
    opacity: 0.65,
    marginTop: 8,
  },
});
