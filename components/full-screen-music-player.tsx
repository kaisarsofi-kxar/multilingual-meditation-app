import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, AudioSource } from "expo-audio";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface FullScreenMusicPlayerProps {
  source: AudioSource;
  title?: string;
  artist?: string;
  artwork?: string;
  onClose?: () => void;
}

export function FullScreenMusicPlayer({
  source,
  title = "Isochronic tones",
  artist = "Meditation Music",
  artwork,
  onClose,
}: FullScreenMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [showDetails, setShowDetails] = useState(false);
  const colorScheme = useColorScheme();

  const player = useAudioPlayer(source);

  useEffect(() => {
    const updateState = () => {
      setIsPlaying(player.playing);
      const time = player.currentTime || 0;
      const dur = player.duration || 0;
      setCurrentTime(time);
      setDuration(dur);

      if (dur > 0 && isLoading) {
        setIsLoading(false);
      }
    };

    updateState();
    const interval = setInterval(updateState, 250);

    return () => {
      clearInterval(interval);
    };
  }, [player, isLoading]);

  useEffect(() => {
    return () => {
      try {
        if (player && player.playing) {
          player.pause();
        }
      } catch (error) {
        // Player might not be initialized yet, ignore
      }
    };
  }, [player]);

  const togglePlayPause = async () => {
    try {
      if (player.playing) {
        await player.pause();
      } else {
        await player.play();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const handleSeek = (value: number) => {
    try {
      player.seekTo(value);
      setCurrentTime(value);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === "off") {
      setRepeatMode("all");
    } else if (repeatMode === "all") {
      setRepeatMode("one");
    } else {
      setRepeatMode("off");
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <ThemedView style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <IconSymbol name="chevron.down" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={styles.artworkContainer}>
        {artwork ? (
          <Image source={{ uri: artwork }} style={styles.artwork} />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <LinearGradient
              colors={["#FFB74D", "#FF9800", "#F57C00"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol name="music.note" size={80} color="#fff" />
            </LinearGradient>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.trackInfo}>
          <View style={styles.trackTitleRow}>
            <ThemedText style={styles.trackTitle} numberOfLines={1}>
              {title}
            </ThemedText>
            <TouchableOpacity activeOpacity={0.7}>
              <IconSymbol name="heart" size={20} color="#FFB6C1" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.artistName} numberOfLines={1}>
            {artist}
          </ThemedText>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
              <View
                style={[
                  styles.progressThumb,
                  { left: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration || 1}
              value={currentTime}
              onValueChange={handleSeek}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
          </View>
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeText}>
              {formatTime(currentTime)}
            </ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(duration)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsShuffle(!isShuffle)}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="shuffle"
              size={24}
              color={isShuffle ? "#FFB6C1" : "#11181C"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <IconSymbol name="backward.end.fill" size={24} color="#11181C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <IconSymbol
                name={isPlaying ? "pause.fill" : "play.fill"}
                size={32}
                color="#000"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <IconSymbol name="forward.end.fill" size={24} color="#11181C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleRepeat}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={repeatMode === "one" ? "repeat.1" : "repeat"}
              size={24}
              color={
                repeatMode !== "off" ? "#FFB6C1" : "#11181C"
              }
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => setShowDetails(!showDetails)}
          activeOpacity={0.7}
        >
          <IconSymbol
            name={showDetails ? "chevron.up" : "chevron.down"}
            size={16}
            color="#11181C"
          />
          <ThemedText style={styles.detailsText}>More details</ThemedText>
        </TouchableOpacity>

        {showDetails && (
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.detailsTitle}>Track Information</ThemedText>
            <ThemedText style={styles.detailsText}>
              Duration: {formatTime(duration)}
            </ThemedText>
            <ThemedText style={styles.detailsText}>
              Format: MP3
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkContainer: {
    width: "100%",
    height: height * 0.5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
  },
  artwork: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  artworkPlaceholder: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  trackInfo: {
    marginBottom: 32,
  },
  trackTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
    flex: 1,
    marginRight: 12,
  },
  artistName: {
    fontSize: 16,
    color: "#11181C",
    opacity: 0.7,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressBarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
    position: "relative",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#FFB6C1",
    borderRadius: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFB6C1",
    position: "absolute",
    top: -4,
    marginLeft: -6,
  },
  slider: {
    position: "absolute",
    width: "100%",
    height: 40,
    top: -18,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 14,
    color: "#11181C",
    opacity: 0.6,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFB6C1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  detailsText: {
    fontSize: 14,
    color: "#11181C",
    opacity: 0.7,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#11181C",
  },
});

