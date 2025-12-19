import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface VideoPlayerProps {
  uri: string;
  title?: string;
  onClose?: () => void;
}

export function VideoPlayer({ uri, title, onClose }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const colorScheme = useColorScheme();

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

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
      console.error("Error toggling video playback:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ThemedView style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <IconSymbol name="xmark.circle.fill" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      
      {title && (
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
        </View>
      )}

      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false}
          contentFit="contain"
          fullscreenOptions={{ enterFullscreenButton: true }}
          allowsPictureInPicture
        />
        {isLoading && duration === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          activeOpacity={0.7}
        >
          <IconSymbol
            name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
            size={48}
            color="#0a7ea4"
          />
        </TouchableOpacity>
        <View style={styles.timeContainer}>
          <ThemedText style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  titleContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 80,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    gap: 16,
  },
  playButton: {
    padding: 8,
  },
  timeContainer: {
    flex: 1,
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
  },
});

