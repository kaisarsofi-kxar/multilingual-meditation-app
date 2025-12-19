import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "@/hooks/use-translation";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FullScreenMusicPlayer } from "@/components/full-screen-music-player";

const musicPlaylists = [
  {
    id: 1,
    title: "natureSounds",
    description: "natureSoundsDesc",
    tracks: 12,
    icon: "tree.fill",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "rainSounds",
    description: "rainSoundsDesc",
    tracks: 8,
    icon: "cloud.rain.fill",
    color: "#2196F3",
  },
  {
    id: 3,
    title: "oceanWaves",
    description: "oceanWavesDesc",
    tracks: 10,
    icon: "water.waves",
    color: "#00BCD4",
  },
  {
    id: 4,
    title: "forestAmbience",
    description: "forestAmbienceDesc",
    tracks: 15,
    icon: "leaf.fill",
    color: "#8BC34A",
  },
  {
    id: 5,
    title: "meditationMusic",
    description: "meditationMusicDesc",
    tracks: 20,
    icon: "music.note",
    color: "#9C27B0",
  },
  {
    id: 6,
    title: "singingBowls",
    description: "singingBowlsDesc",
    tracks: 6,
    icon: "bell.fill",
    color: "#FF9800",
  },
];

const recentlyPlayed = [
  {
    id: 1,
    title: "calmForest",
    duration: "45:30",
    icon: "leaf.fill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "gentleRain",
    duration: "60:00",
    icon: "cloud.rain.fill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "oceanBreeze",
    duration: "30:15",
    icon: "water.waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const audioTracks = [
  {
    id: 1,
    title: "Isochronic tones",
    artist: "Meditation Music",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    artwork:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
  },
  {
    id: 2,
    title: "Rain Sounds",
    artist: "Nature Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    artwork:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Calm Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    artwork:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
  },
  {
    id: 4,
    title: "Forest Ambience",
    artist: "Nature Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    artwork:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  },
  {
    id: 5,
    title: "Meditation Music",
    artist: "Zen Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    artwork:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
  },
  {
    id: 6,
    title: "Singing Bowls",
    artist: "Healing Sounds",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    artwork:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
  },
];

export default function MusicScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [selectedTrack, setSelectedTrack] = useState<{
    url: string;
    title: string;
    artist: string;
    artwork?: string;
  } | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t("music")}
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {t("musicSubtitle")}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("playlists")}
        </ThemedText>
        <View style={styles.playlistsGrid}>
          {musicPlaylists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={[
                styles.playlistCard,
                colorScheme === "dark" && styles.playlistCardDark,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                const track = audioTracks.find((t) => t.id === playlist.id);
                if (track) {
                  setSelectedTrack({
                    url: track.url,
                    title: track.title,
                    artist: track.artist,
                    artwork: track.artwork,
                  });
                  setPlayerVisible(true);
                }
              }}
            >
              <View
                style={[
                  styles.playlistIconContainer,
                  { backgroundColor: `${playlist.color}20` },
                ]}
              >
                <IconSymbol
                  name={playlist.icon as any}
                  size={32}
                  color={playlist.color}
                />
              </View>
              <ThemedText style={styles.playlistTitle}>
                {t(playlist.title)}
              </ThemedText>
              <ThemedText style={styles.playlistDescription}>
                {t(playlist.description)}
              </ThemedText>
              <View style={styles.playlistMeta}>
                <IconSymbol name="music.note.list" size={14} color="#687076" />
                <ThemedText style={styles.playlistTracks}>
                  {playlist.tracks} {t("tracks")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t("recentlyPlayed")}
        </ThemedText>
        <View style={styles.recentContainer}>
          {recentlyPlayed.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.recentCard,
                colorScheme === "dark" && styles.recentCardDark,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.recentContent}>
                <View
                  style={[
                    styles.recentIcon,
                    { backgroundColor: "rgba(10, 126, 164, 0.1)" },
                  ]}
                >
                  <IconSymbol
                    name={track.icon as any}
                    size={24}
                    color="#0a7ea4"
                  />
                </View>
                <View style={styles.recentInfo}>
                  <ThemedText style={styles.recentTitle}>
                    {t(track.title)}
                  </ThemedText>
                  <ThemedText style={styles.recentDuration}>
                    {track.duration}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const audioTrack = audioTracks.find(
                      (t) => t.title === track.title
                    );
                    setSelectedTrack({
                      url: track.url,
                      title: audioTrack?.title || t(track.title),
                      artist: audioTrack?.artist || "Meditation Music",
                      artwork: audioTrack?.artwork,
                    });
                    setPlayerVisible(true);
                  }}
                >
                  <IconSymbol
                    name="play.circle.fill"
                    size={32}
                    color="#0a7ea4"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View
          style={[
            styles.featuredCard,
            colorScheme === "dark" && styles.featuredCardDark,
          ]}
        >
          <View style={styles.featuredContent}>
            <IconSymbol name="star.fill" size={32} color="#FFD700" />
            <View style={styles.featuredText}>
              <ThemedText type="subtitle" style={styles.featuredTitle}>
                {t("featuredPlaylist")}
              </ThemedText>
              <ThemedText style={styles.featuredDescription}>
                {t("featuredPlaylistDesc")}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      <Modal
        visible={playerVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setPlayerVisible(false);
          setSelectedTrack(null);
        }}
      >
        {selectedTrack && (
          <FullScreenMusicPlayer
            key={selectedTrack.url}
            source={{ uri: selectedTrack.url }}
            title={selectedTrack.title}
            artist={selectedTrack.artist}
            artwork={selectedTrack.artwork}
            onClose={() => {
              setPlayerVisible(false);
              setSelectedTrack(null);
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
  playlistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  playlistCard: {
    width: "47%",
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
  playlistIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  playlistMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playlistTracks: {
    fontSize: 12,
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
    gap: 12,
  },
  recentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  recentDuration: {
    fontSize: 14,
    opacity: 0.6,
  },
  featuredCard: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  featuredCardDark: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    marginBottom: 4,
  },
  featuredDescription: {
    opacity: 0.8,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
