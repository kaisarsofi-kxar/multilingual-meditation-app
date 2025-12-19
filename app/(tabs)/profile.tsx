import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageSwitcher } from "@/components/language-switcher";

const settingsItems = [
  { id: 1, title: "notifications", icon: "bell.fill", hasArrow: true },
  { id: 2, title: "reminders", icon: "clock.fill", hasArrow: true },
  {
    id: 3,
    title: "soundSettings",
    icon: "speaker.wave.2.fill",
    hasArrow: true,
  },
  { id: 4, title: "privacy", icon: "lock.fill", hasArrow: true },
  { id: 5, title: "about", icon: "info.circle.fill", hasArrow: true },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatarContainer}>
          <View
            style={[styles.avatar, colorScheme === "dark" && styles.avatarDark]}
          >
            <IconSymbol name="person.fill" size={48} color="#0a7ea4" />
          </View>
        </ThemedView>
        <ThemedText type="title" style={styles.userName}>
          {t("welcome")}
        </ThemedText>
        <ThemedText style={styles.userEmail}>
          {t("meditationJourney")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("preferences")}
        </ThemedText>
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>{t("language")}</ThemedText>
            <LanguageSwitcher />
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("settings")}
        </ThemedText>
        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingsCard,
                colorScheme === "dark" && styles.settingsCardDark,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.settingsContent}>
                <View style={styles.settingsIcon}>
                  <IconSymbol
                    name={item.icon as any}
                    size={24}
                    color="#0a7ea4"
                  />
                </View>
                <ThemedText style={styles.settingsTitle}>
                  {t(item.title)}
                </ThemedText>
              </View>
              {item.hasArrow && (
                <IconSymbol name="chevron.right" size={20} color="#687076" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <TouchableOpacity
          style={[
            styles.achievementCard,
            colorScheme === "dark" && styles.achievementCardDark,
          ]}
          activeOpacity={0.8}
        >
          <IconSymbol name="trophy.fill" size={32} color="#FFD700" />
          <View style={styles.achievementContent}>
            <ThemedText type="subtitle" style={styles.achievementTitle}>
              {t("achievements")}
            </ThemedText>
            <ThemedText style={styles.achievementDescription}>
              {t("achievementsDesc")}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0a7ea4",
  },
  avatarDark: {
    backgroundColor: "rgba(10, 126, 164, 0.2)",
  },
  userName: {
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    opacity: 0.7,
    fontSize: 16,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingsList: {
    gap: 12,
  },
  settingsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  settingsCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  settingsContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsIcon: {
    marginRight: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
    gap: 16,
  },
  achievementCardDark: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    marginBottom: 4,
  },
  achievementDescription: {
    opacity: 0.8,
    fontSize: 14,
  },
});
