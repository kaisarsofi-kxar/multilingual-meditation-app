import { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View, Modal } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { VideoPlayer } from "@/components/video-player";

const videoCategories = [
  {
    id: 1,
    title: "guidedMeditations",
    count: 25,
    icon: "person.wave.2.fill",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "natureVideos",
    count: 18,
    icon: "mountain.2.fill",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "yogaSessions",
    count: 15,
    icon: "figure.yoga",
    color: "#FF9800",
  },
  {
    id: 4,
    title: "breathingExercises",
    count: 12,
    icon: "wind",
    color: "#00BCD4",
  },
  {
    id: 5,
    title: "sleepStories",
    count: 20,
    icon: "moon.stars.fill",
    color: "#9C27B0",
  },
  {
    id: 6,
    title: "mindfulness",
    count: 22,
    icon: "brain.head.profile",
    color: "#E91E63",
  },
];

const featuredVideos = [
  {
    id: 1,
    title: "morningMeditationVideo",
    duration: "15:30",
    views: "12.5K",
    thumbnail: "sunrise.fill",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "forestWalk",
    duration: "30:00",
    views: "8.2K",
    thumbnail: "tree.fill",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "oceanMeditation",
    duration: "20:15",
    views: "15.3K",
    thumbnail: "water.waves",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

const recentVideos = [
  {
    id: 1,
    title: "stressReliefVideo",
    duration: "25:00",
    date: "today",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 2,
    title: "bodyScanVideo",
    duration: "30:00",
    date: "yesterday",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 3,
    title: "focusMeditationVideo",
    duration: "12:00",
    date: "2 days ago",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];

export default function VideosScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t("videos")}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {t("videosSubtitle")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("videoCategories")}
        </ThemedText>
        <View style={styles.categoriesGrid}>
          {videoCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { borderColor: category.color },
                colorScheme === "dark" && styles.categoryCardDark,
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: `${category.color}20` },
                ]}
              >
                <IconSymbol
                  name={category.icon as any}
                  size={28}
                  color={category.color}
                />
              </View>
              <ThemedText style={styles.categoryTitle}>
                {t(category.title)}
              </ThemedText>
              <ThemedText style={styles.categoryCount}>
                {category.count} {t("videos")}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("featuredVideos")}
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.featuredContainer}>
            {featuredVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={[
                  styles.videoCard,
                  colorScheme === "dark" && styles.videoCardDark,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedVideo({
                    url: video.url,
                    title: t(video.title),
                  });
                  setPlayerVisible(true);
                }}
              >
                <View
                  style={[
                    styles.videoThumbnail,
                    { backgroundColor: "rgba(10, 126, 164, 0.1)" },
                  ]}
                >
                  <IconSymbol
                    name={video.thumbnail as any}
                    size={48}
                    color="#0a7ea4"
                  />
                  <View style={styles.playOverlay}>
                    <IconSymbol name="play.fill" size={24} color="#fff" />
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <ThemedText style={styles.videoTitle} numberOfLines={2}>
                    {t(video.title)}
                  </ThemedText>
                  <View style={styles.videoMeta}>
                    <ThemedText style={styles.videoDuration}>
                      {video.duration}
                    </ThemedText>
                    <ThemedText style={styles.videoViews}>
                      • {video.views} {t("views")}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("recentVideos")}
        </ThemedText>
        <View style={styles.recentContainer}>
          {recentVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={[
                styles.recentVideoCard,
                colorScheme === "dark" && styles.recentVideoCardDark,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedVideo({
                  url: video.url,
                  title: t(video.title),
                });
                setPlayerVisible(true);
              }}
            >
              <View style={styles.recentVideoContent}>
                <View
                  style={[
                    styles.recentVideoThumbnail,
                    { backgroundColor: "rgba(10, 126, 164, 0.1)" },
                  ]}
                >
                  <IconSymbol name="play.circle.fill" size={32} color="#0a7ea4" />
                </View>
                <View style={styles.recentVideoInfo}>
                  <ThemedText style={styles.recentVideoTitle}>
                    {t(video.title)}
                  </ThemedText>
                  <ThemedText style={styles.recentVideoMeta}>
                    {t(video.date)} • {video.duration}
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#687076" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <Modal
        visible={playerVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setPlayerVisible(false);
          setSelectedVideo(null);
        }}
      >
        {selectedVideo && (
          <VideoPlayer
            key={selectedVideo.url}
            uri={selectedVideo.url}
            title={selectedVideo.title}
            onClose={() => {
              setPlayerVisible(false);
              setSelectedVideo(null);
            }}
          />
        )}
      </Modal>
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
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    gap: 8,
  },
  categoryCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  featuredContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 20,
  },
  videoCard: {
    width: 280,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  videoCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  videoThumbnail: {
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playOverlay: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoDuration: {
    fontSize: 12,
    opacity: 0.6,
  },
  videoViews: {
    fontSize: 12,
    opacity: 0.6,
  },
  recentContainer: {
    gap: 12,
  },
  recentVideoCard: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  recentVideoCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  recentVideoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentVideoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  recentVideoInfo: {
    flex: 1,
  },
  recentVideoTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  recentVideoMeta: {
    fontSize: 14,
    opacity: 0.6,
  },
});

