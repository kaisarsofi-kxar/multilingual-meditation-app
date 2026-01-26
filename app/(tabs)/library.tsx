import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const playlists = [
  {
    id: 1,
    title: "morningRoutine",
    count: 8,
    icon: "sunrise.fill",
    color: "#FFB74D",
  },
  {
    id: 2,
    title: "sleepStories",
    count: 12,
    icon: "moon.stars.fill",
    color: "#64B5F6",
  },
  {
    id: 3,
    title: "stressRelief",
    count: 6,
    icon: "leaf.fill",
    color: "#81C784",
  },
  {
    id: 4,
    title: "focusBoost",
    count: 10,
    icon: "brain.head.profile",
    color: "#BA68C8",
  },
];

const recentSessions = [
  { id: 1, title: "breathingExercise", date: "today", duration: "5 min" },
  { id: 2, title: "bodyScan", date: "yesterday", duration: "25 min" },
  { id: 3, title: "anxietyRelief", date: "2 days ago", duration: "20 min" },
];

export default function LibraryScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const totalSessions = useProgressStore((state) => state.totalSessions);
  const totalTimeMinutes = useProgressStore((state) => state.totalTimeMinutes);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const sessions = useProgressStore((state) => state.sessions);
  const initialize = useProgressStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const formatTotalTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const recentSessions = sessions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((session, index) => {
      const date = new Date(session.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel = "";
      if (date.toDateString() === today.toDateString()) {
        dateLabel = t("today");
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = t("yesterday");
      } else {
        dateLabel = date.toLocaleDateString();
      }

      return {
        id: session.id,
        title: session.title,
        date: dateLabel,
        duration: `${session.duration} min`,
      };
    });

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t("library")}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {t("librarySubtitle")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("myPlaylists")}
        </ThemedText>
        <View style={styles.playlistContainer}>
          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={[
                styles.playlistCard,
                colorScheme === "dark" && styles.playlistCardDark,
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.playlistIcon,
                  { backgroundColor: `${playlist.color}20` },
                ]}
              >
                <IconSymbol
                  name={playlist.icon as any}
                  size={28}
                  color={playlist.color}
                />
              </View>
              <View style={styles.playlistInfo}>
                <ThemedText style={styles.playlistTitle}>
                  {t(playlist.title)}
                </ThemedText>
                <ThemedText style={styles.playlistCount}>
                  {playlist.count} {t("sessions")}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#687076" />
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("recentSessions")}
        </ThemedText>
        <View style={styles.recentContainer}>
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.recentCard,
                colorScheme === "dark" && styles.recentCardDark,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.recentContent}>
                <View style={styles.recentIcon}>
                  <IconSymbol
                    name="play.circle.fill"
                    size={24}
                    color="#0a7ea4"
                  />
                </View>
                <View style={styles.recentInfo}>
                  <ThemedText style={styles.recentTitle}>
                    {t(session.title)}
                  </ThemedText>
                  <ThemedText style={styles.recentMeta}>
                    {t(session.date)} • {session.duration}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                {t("noSessionsYet")}
              </ThemedText>
              <ThemedText style={styles.emptyStateDesc}>
                {t("noSessionsYetDesc")}
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("statistics")}
        </ThemedText>
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              colorScheme === "dark" && styles.statCardDark,
            ]}
          >
            <ThemedText type="title" style={styles.statNumber}>
              {totalSessions}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              {t("totalSessions")}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statCard,
              colorScheme === "dark" && styles.statCardDark,
            ]}
          >
            <ThemedText type="title" style={styles.statNumber}>
              {formatTotalTime(totalTimeMinutes)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t("totalTime")}</ThemedText>
          </View>
          <View
            style={[
              styles.statCard,
              colorScheme === "dark" && styles.statCardDark,
            ]}
          >
            <ThemedText type="title" style={styles.statNumber}>
              {currentStreak}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t("dayStreak")}</ThemedText>
          </View>
        </View>
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
  playlistContainer: {
    gap: 12,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  playlistCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  playlistIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 14,
    opacity: 0.6,
  },
  recentContainer: {
    gap: 12,
  },
  recentCard: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  recentCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  recentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIcon: {
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  recentMeta: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  statCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statNumber: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.7,
  },
  emptyStateDesc: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: "center",
  },
});
