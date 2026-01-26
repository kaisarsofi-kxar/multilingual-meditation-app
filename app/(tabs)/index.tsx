import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const quickActions = [
  {
    id: 1,
    title: "startMeditation",
    icon: "play.circle.fill",
    color: "#4CAF50",
    route: "meditate",
  },
  {
    id: 2,
    title: "browseLibrary",
    icon: "book.fill",
    color: "#2196F3",
    route: "library",
  },
  {
    id: 3,
    title: "music",
    icon: "music.note",
    color: "#9C27B0",
    route: "music",
  },
  {
    id: 4,
    title: "videos",
    icon: "play.rectangle.fill",
    color: "#E91E63",
    route: "videos",
  },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const getTodayMinutes = useProgressStore((state) => state.getTodayMinutes);
  const getTodaySessions = useProgressStore((state) => state.getTodaySessions);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const initialize = useProgressStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const todayStats = [
    { id: 1, label: "todayMinutes", value: getTodayMinutes().toString(), unit: "min" },
    { id: 2, label: "sessions", value: getTodaySessions().toString(), unit: "" },
    { id: 3, label: "streak", value: currentStreak.toString(), unit: "days" },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.greeting}>{t("goodMorning")}</ThemedText>
            <ThemedText type="title" style={styles.title}>
              {t("readyToMeditate")}
            </ThemedText>
          </View>
          <LanguageSwitcher />
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.statsContainer}>
          {todayStats.map((stat) => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                colorScheme === "dark" && styles.statCardDark,
              ]}
            >
              <ThemedText type="title" style={styles.statValue}>
                {stat.value}
              </ThemedText>
              {stat.unit && (
                <ThemedText style={styles.statUnit}>{stat.unit}</ThemedText>
              )}
              <ThemedText style={styles.statLabel}>{t(stat.label)}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("quickActions")}
        </ThemedText>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionCard,
                { backgroundColor: `${action.color}15` },
                colorScheme === "dark" && styles.actionCardDark,
              ]}
              onPress={() => {
                if (action.route === "meditate") {
                  router.push("/(tabs)/meditate" as any);
                } else if (action.route === "library") {
                  router.push("/(tabs)/library" as any);
                } else if (action.route === "music") {
                  router.push("/(tabs)/music" as any);
                } else if (action.route === "videos") {
                  router.push("/(tabs)/videos" as any);
                }
              }}
              activeOpacity={0.7}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: action.color }]}
              >
                <IconSymbol name={action.icon as any} size={28} color="#fff" />
              </View>
              <ThemedText style={styles.actionTitle}>
                {t(action.title)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("recommendedForYou")}
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.recommendedCard,
            colorScheme === "dark" && styles.recommendedCardDark,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            router.push("/(tabs)/meditate" as any);
          }}
        >
          <View style={styles.recommendedContent}>
            <View style={styles.recommendedIcon}>
              <IconSymbol name="heart.fill" size={32} color="#F06292" />
            </View>
            <View style={styles.recommendedText}>
              <ThemedText type="subtitle" style={styles.recommendedTitle}>
                {t("anxietyRelief")}
              </ThemedText>
              <ThemedText style={styles.recommendedDescription}>
                {t("anxietyReliefDesc")}
              </ThemedText>
              <ThemedText style={styles.recommendedDuration}>20 min</ThemedText>
            </View>
            <IconSymbol name="play.circle.fill" size={40} color="#0a7ea4" />
          </View>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View
          style={[
            styles.quoteCard,
            colorScheme === "dark" && styles.quoteCardDark,
          ]}
        >
          <IconSymbol name="quote.opening" size={24} color="#0a7ea4" />
          <ThemedText style={styles.quoteText}>{t("dailyQuote")}</ThemedText>
          <ThemedText style={styles.quoteAuthor}>— {t("buddha")}</ThemedText>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsContainer: {
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
  statValue: {
    fontSize: 28,
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "22%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  actionCardDark: {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  recommendedCard: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  recommendedCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  recommendedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  recommendedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(240, 98, 146, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedText: {
    flex: 1,
  },
  recommendedTitle: {
    marginBottom: 4,
  },
  recommendedDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  recommendedDuration: {
    fontSize: 12,
    opacity: 0.6,
  },
  quoteCard: {
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.2)",
  },
  quoteCardDark: {
    backgroundColor: "rgba(10, 126, 164, 0.15)",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    marginVertical: 12,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "right",
  },
});
