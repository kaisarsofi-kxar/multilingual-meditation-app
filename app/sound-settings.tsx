import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "@/hooks/use-translation";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettingsStore } from "@/store/settingsStore";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

export default function SoundSettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const keepScreenAwakeDuringSessions = useSettingsStore(
    (s) => s.keepScreenAwakeDuringSessions
  );
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const setKeepScreenAwakeDuringSessions = useSettingsStore(
    (s) => s.setKeepScreenAwakeDuringSessions
  );

  const trackFalse = colorScheme === "dark" ? "#3a3a3c" : "#e5e5ea";

  return (
    <>
      <Stack.Screen
        options={{
          title: t("soundSettings"),
          headerBackTitle: t("profile"),
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ThemedText style={styles.intro}>{t("soundSettingsDesc")}</ThemedText>

        <ThemedView
          style={[
            styles.card,
            colorScheme === "dark" ? styles.cardDark : null,
          ]}
        >
          <View style={styles.row}>
            <ThemedText style={styles.label}>{t("hapticFeedback")}</ThemedText>
            <Switch
              value={hapticsEnabled}
              onValueChange={(v) => void setHapticsEnabled(v)}
              trackColor={{ false: trackFalse, true: "#7ec8da" }}
              thumbColor={hapticsEnabled ? "#0a7ea4" : "#f4f3f4"}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <ThemedText style={styles.label}>{t("keepScreenAwake")}</ThemedText>
            <Switch
              value={keepScreenAwakeDuringSessions}
              onValueChange={(v) => void setKeepScreenAwakeDuringSessions(v)}
              trackColor={{ false: trackFalse, true: "#7ec8da" }}
              thumbColor={
                keepScreenAwakeDuringSessions ? "#0a7ea4" : "#f4f3f4"
              }
            />
          </View>
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
    gap: 16,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
  },
  cardDark: {
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginLeft: 16,
  },
});
