import { useState } from "react";
import { StyleSheet, TouchableOpacity, Modal, Platform } from "react-native";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { useLanguageStore, Language } from "@/store/languageStore";
import { useTranslation } from "@/hooks/use-translation";
import { IconSymbol } from "./ui/icon-symbol";

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

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
    setModalVisible(false);
  };

  const currentLanguageName =
    languages.find((l) => l.code === language)?.name || "English";

  return (
    <>
      <TouchableOpacity
        className=""
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <IconSymbol name="globe" size={20} color="#0a7ea4" />
        <ThemedText style={styles.buttonText}>{currentLanguageName}</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {t("changeLanguage")}
            </ThemedText>

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
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(10, 126, 164, 0.1)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0a7ea4",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 24,
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
