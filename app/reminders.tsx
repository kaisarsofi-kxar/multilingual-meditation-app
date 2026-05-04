import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "@/hooks/use-translation";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function RemindersScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t("reminders"),
          headerBackTitle: t("profile"),
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.title}>
            {t("comingSoon")}
          </ThemedText>
          <ThemedText style={styles.body}>{t("remindersDesc")}</ThemedText>
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
  },
  card: {
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },
});
