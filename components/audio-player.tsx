import { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, AudioSource } from "expo-audio";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface AudioPlayerProps {
  source: AudioSource;
  title?: string;
  onClose?: () => void;
}

export function AudioPlayer({ source, title, onClose }: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ThemedView
      style={[
        styles.container,
        colorScheme === "dark" && styles.containerDark,
      ]}
    >
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <IconSymbol name="xmark.circle.fill" size={28} color="#687076" />
        </TouchableOpacity>
      )}

      {title && (
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
        </View>
      )}

      <View style={styles.playerContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0a7ea4" />
        ) : (
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
              size={64}
              color="#0a7ea4"
            />
          </TouchableOpacity>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeText}>
              {formatTime(currentTime)}
            </ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(duration)}
            </ThemedText>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={currentTime}
            onValueChange={handleSeek}
            minimumTrackTintColor="#0a7ea4"
            maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
            thumbTintColor="#0a7ea4"
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  containerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  titleContainer: {
    marginBottom: 20,
    paddingRight: 40,
  },
  title: {
    fontSize: 18,
  },
  playerContainer: {
    alignItems: "center",
    gap: 20,
  },
  playButton: {
    padding: 8,
  },
  progressContainer: {
    width: "100%",
    gap: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

