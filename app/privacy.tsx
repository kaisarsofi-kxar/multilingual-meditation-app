import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
import { Stack } from "expo-router";
import { useCallback } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const buildExportSnapshot = useProgressStore((s) => s.buildExportSnapshot);
  const clearAllLocalData = useProgressStore((s) => s.clearAllLocalData);

  const handleExport = useCallback(async () => {
    try {
      const payload = buildExportSnapshot();
      const text = JSON.stringify(payload, null, 2);
      const result = await Share.share(
        Platform.OS === "web"
          ? { title: t("exportMyData"), message: text }
          : { title: t("exportMyData"), message: text }
      );
      if (result.action === Share.dismissedAction && Platform.OS === "ios") {
        /* user dismissed sheet */
      }
    } catch {
      Alert.alert(t("errorTitle"), t("exportFailed"));
    }
  }, [buildExportSnapshot, t]);

  const handleClear = useCallback(() => {
    Alert.alert(t("clearAllDataConfirm"), t("clearAllDataWarning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("clearAllData"),
        style: "destructive",
        onPress: () => {
          void clearAllLocalData().then(() => {
            Alert.alert("", t("dataCleared"));
          });
        },
      },
    ]);
  }, [clearAllLocalData, t]);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("privacy"),
          headerBackTitle: t("profile"),
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ThemedText style={styles.lead}>{t("privacyExportDesc")}</ThemedText>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => void handleExport()}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.primaryLabel}>{t("exportMyData")}</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.spacer} />

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClear}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.dangerLabel}>{t("clearAllData")}</ThemedText>
        </TouchableOpacity>
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
  lead: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.88,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 8,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "rgba(211, 47, 47, 0.55)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(211, 47, 47, 0.06)",
  },
  dangerLabel: {
    color: "#c62828",
    fontSize: 16,
    fontWeight: "600",
  },
});
