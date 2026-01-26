import { BreathingExercise } from "@/components/breathing-exercise";
import { MeditationTimer } from "@/components/meditation-timer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const meditationSessions = [
  {
    id: 1,
    title: "morningMeditation",
    duration: "10 min",
    icon: "sunrise.fill",
  },
  { id: 2, title: "sleepMeditation", duration: "15 min", icon: "moon.fill" },
  { id: 3, title: "anxietyRelief", duration: "20 min", icon: "heart.fill" },
  {
    id: 4,
    title: "focusMeditation",
    duration: "12 min",
    icon: "brain.head.profile",
  },
  { id: 5, title: "bodyScan", duration: "25 min", icon: "figure.walk" },
  { id: 6, title: "breathingExercise", duration: "5 min", icon: "wind" },
];

const categories = [
  { id: 1, title: "beginner", icon: "star.fill", color: "#4CAF50" },
  { id: 2, title: "intermediate", icon: "flame.fill", color: "#FF9800" },
  { id: 3, title: "advanced", icon: "crown.fill", color: "#9C27B0" },
  { id: 4, title: "sleep", icon: "bed.double.fill", color: "#2196F3" },
  { id: 5, title: "stress", icon: "leaf.fill", color: "#00BCD4" },
  { id: 6, title: "focus", icon: "target", color: "#E91E63" },
];

export default function MeditateScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [timerVisible, setTimerVisible] = useState(false);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    title: string;
    duration: number;
  } | null>(null);

  const handleSessionPress = (session: typeof meditationSessions[0]) => {
    if (session.title === "breathingExercise") {
      setBreathingVisible(true);
    } else {
      const duration = parseInt(session.duration.split(" ")[0]);
      setSelectedSession({
        title: t(session.title),
        duration: duration,
      });
      setTimerVisible(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t("meditate")}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {t("meditateSubtitle")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("quickStart")}
        </ThemedText>
        <View style={styles.quickStartGrid}>
          {meditationSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionCard,
                colorScheme === "dark" && styles.sessionCardDark,
              ]}
              activeOpacity={0.7}
              onPress={() => handleSessionPress(session)}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${
                      session.icon === "sunrise.fill"
                        ? "#FFB74D"
                        : session.icon === "moon.fill"
                        ? "#64B5F6"
                        : session.icon === "heart.fill"
                        ? "#F06292"
                        : session.icon === "brain.head.profile"
                        ? "#BA68C8"
                        : session.icon === "figure.walk"
                        ? "#81C784"
                        : "#4DD0E1"
                    }20`,
                  },
                ]}
              >
                <IconSymbol
                  name={session.icon as any}
                  size={32}
                  color={
                    session.icon === "sunrise.fill"
                      ? "#FFB74D"
                      : session.icon === "moon.fill"
                      ? "#64B5F6"
                      : session.icon === "heart.fill"
                      ? "#F06292"
                      : session.icon === "brain.head.profile"
                      ? "#BA68C8"
                      : session.icon === "figure.walk"
                      ? "#81C784"
                      : "#4DD0E1"
                  }
                />
              </View>
              <ThemedText style={styles.sessionTitle}>
                {t(session.title)}
              </ThemedText>
              <ThemedText style={styles.sessionDuration}>
                {session.duration}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("categories")}
        </ThemedText>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { borderColor: category.color },
                colorScheme === "dark" && styles.categoryCardDark,
              ]}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={category.icon as any}
                size={24}
                color={category.color}
              />
              <ThemedText style={styles.categoryTitle}>
                {t(category.title)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <TouchableOpacity
          style={[
            styles.dailyChallenge,
            colorScheme === "dark" && styles.dailyChallengeDark,
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.challengeContent}>
            <IconSymbol name="sparkles" size={32} color="#FFD700" />
            <View style={styles.challengeText}>
              <ThemedText type="subtitle" style={styles.challengeTitle}>
                {t("dailyChallenge")}
              </ThemedText>
              <ThemedText style={styles.challengeDescription}>
                {t("dailyChallengeDesc")}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>

    <MeditationTimer
      visible={timerVisible}
      onClose={() => {
        setTimerVisible(false);
        setSelectedSession(null);
      }}
      defaultDuration={selectedSession?.duration}
      sessionTitle={selectedSession?.title}
    />

    <BreathingExercise
      visible={breathingVisible}
      onClose={() => setBreathingVisible(false)}
    />
    </>
  );
}

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
  sectionTitle: {
    marginBottom: 16,
  },
  quickStartGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sessionCard: {
    width: "47%",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  sessionCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 12,
    opacity: 0.6,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    gap: 8,
  },
  categoryCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  dailyChallenge: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  dailyChallengeDark: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  challengeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  challengeText: {
    flex: 1,
  },
  challengeTitle: {
    marginBottom: 4,
  },
  challengeDescription: {
    opacity: 0.8,
    fontSize: 14,
  },
});
