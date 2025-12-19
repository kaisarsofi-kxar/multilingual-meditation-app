import { StyleSheet, TouchableOpacity, Platform } from "react-native";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { useLanguageStore, Language } from "@/store/languageStore";
import { useTranslation } from "@/hooks/use-translation";

const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
];

export function LanguageSelectionScreen() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {t("selectLanguage")}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{t("description")}</ThemedText>

        <ThemedView style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.languageText,
                  language === lang.code && styles.languageTextActive,
                ]}
              >
                {lang.name}
              </ThemedText>
              {language === lang.code && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  languageList: {
    gap: 12,
  },
  languageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  languageButtonActive: {
    borderColor: "#0a7ea4",
    backgroundColor: "rgba(10, 126, 164, 0.1)",
  },
  languageText: {
    fontSize: 18,
    fontWeight: "500",
  },
  languageTextActive: {
    fontWeight: "bold",
    color: "#0a7ea4",
  },
  checkmark: {
    fontSize: 20,
    color: "#0a7ea4",
    fontWeight: "bold",
  },
});
