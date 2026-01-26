import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const achievements = useProgressStore((state) => state.achievements);
  const initialize = useProgressStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t("achievements")}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {unlockedCount} / {totalCount} {t("unlocked")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <ThemedView
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.unlocked && styles.achievementCardUnlocked,
                colorScheme === "dark" && styles.achievementCardDark,
              ]}
            >
              <View
                style={[
                  styles.achievementIcon,
                  {
                    backgroundColor: achievement.unlocked
                      ? `${getAchievementColor(achievement.icon)}20`
                      : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
              >
                <IconSymbol
                  name={achievement.icon as any}
                  size={32}
                  color={
                    achievement.unlocked
                      ? getAchievementColor(achievement.icon)
                      : "#9E9E9E"
                  }
                />
              </View>
              <View style={styles.achievementContent}>
                <ThemedText
                  type="subtitle"
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked,
                  ]}
                >
                  {achievement.description}
                </ThemedText>
                {achievement.unlocked && achievement.unlockedAt && (
                  <ThemedText style={styles.achievementDate}>
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </ThemedText>
                )}
                {!achievement.unlocked && (
                  <ThemedText style={styles.achievementRequirement}>
                    {t("requirement")}: {achievement.requirement}{" "}
                    {achievement.type === "sessions"
                      ? t("sessions")
                      : achievement.type === "streak"
                      ? t("days")
                      : achievement.type === "time"
                      ? t("minutes")
                      : achievement.type === "category"
                      ? ""
                      : ""}
                  </ThemedText>
                )}
              </View>
              {achievement.unlocked && (
                <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
              )}
            </ThemedView>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const getAchievementColor = (icon: string): string => {
  switch (icon) {
    case "star.fill":
      return "#FFD700";
    case "flame.fill":
      return "#FF9800";
    case "crown.fill":
      return "#9C27B0";
    case "clock.fill":
      return "#2196F3";
    case "trophy.fill":
      return "#FFC107";
    case "sunrise.fill":
      return "#FFB74D";
    default:
      return "#0a7ea4";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    gap: 16,
  },
  achievementCardUnlocked: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  achievementCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    marginBottom: 4,
  },
  achievementTitleLocked: {
    opacity: 0.5,
  },
  achievementDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  achievementDescriptionLocked: {
    opacity: 0.4,
  },
  achievementDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  achievementRequirement: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
});
