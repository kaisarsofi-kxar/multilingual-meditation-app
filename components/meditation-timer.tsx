import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface MeditationTimerProps {
  visible: boolean;
  onClose: () => void;
  defaultDuration?: number; // in minutes
  sessionTitle?: string;
}

export function MeditationTimer({
  visible,
  onClose,
  defaultDuration = 10,
  sessionTitle,
}: MeditationTimerProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [duration, setDuration] = useState(defaultDuration);
  const [timeRemaining, setTimeRemaining] = useState(defaultDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const addSession = useProgressStore((state) => state.addSession);

  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration * 60);
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);
    }
  }, [visible, duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRunning, scaleAnim]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTimeRemaining(duration * 60);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleComplete = async () => {
    if (sessionTitle) {
      await addSession({
        title: sessionTitle,
        duration: duration,
        type: "meditation",
      });
    }
    handleReset();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (duration * 60 - timeRemaining) / (duration * 60) : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#687076" />
          </TouchableOpacity>
          {!isRunning && !isCompleted && (
            <View style={styles.durationSelector}>
              <ThemedText style={styles.durationLabel}>
                {t("duration")}: {duration} {t("minutes")}
              </ThemedText>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                value={duration}
                onValueChange={(value) => {
                  setDuration(Math.round(value));
                  setTimeRemaining(Math.round(value) * 60);
                }}
                minimumTrackTintColor="#0a7ea4"
                maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
                thumbTintColor="#0a7ea4"
              />
            </View>
          )}
        </View>

        <View style={styles.timerContainer}>
          {sessionTitle && (
            <ThemedText type="subtitle" style={styles.sessionTitle}>
              {sessionTitle}
            </ThemedText>
          )}

          <Animated.View
            style={[
              styles.timerCircle,
              {
                transform: [{ scale: scaleAnim }],
                borderColor: isCompleted
                  ? "#4CAF50"
                  : isRunning
                  ? "#0a7ea4"
                  : "#687076",
              },
            ]}
          >
            <View
              style={[
                styles.progressRing,
                {
                  borderColor: isCompleted
                    ? "#4CAF50"
                    : isRunning
                    ? "#0a7ea4"
                    : "#687076",
                },
              ]}
            />
            <ThemedText type="title" style={styles.timerText}>
              {formatTime(timeRemaining)}
            </ThemedText>
          </Animated.View>

          {isCompleted ? (
            <View style={styles.completedContainer}>
              <IconSymbol name="checkmark.circle.fill" size={64} color="#4CAF50" />
              <ThemedText type="subtitle" style={styles.completedText}>
                {t("meditationComplete")}
              </ThemedText>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
              >
                <ThemedText style={styles.completeButtonText}>
                  {t("finish")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controls}>
              {!isRunning && !isPaused && (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStart}
                >
                  <IconSymbol name="play.fill" size={32} color="#fff" />
                  <ThemedText style={styles.startButtonText}>
                    {t("start")}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {isRunning && (
                <TouchableOpacity
                  style={styles.pauseButton}
                  onPress={handlePause}
                >
                  <IconSymbol name="pause.fill" size={32} color="#fff" />
                  <ThemedText style={styles.pauseButtonText}>
                    {t("pause")}
                  </ThemedText>
                </TouchableOpacity>
              )}

              {isPaused && (
                <View style={styles.pausedControls}>
                  <TouchableOpacity
                    style={styles.resumeButton}
                    onPress={handleStart}
                  >
                    <IconSymbol name="play.fill" size={24} color="#fff" />
                    <ThemedText style={styles.resumeButtonText}>
                      {t("resume")}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
                  >
                    <IconSymbol name="arrow.counterclockwise" size={24} color="#687076" />
                    <ThemedText style={styles.resetButtonText}>
                      {t("reset")}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
  },
  durationSelector: {
    flex: 1,
    marginLeft: 20,
  },
  durationLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  sessionTitle: {
    marginBottom: 40,
    textAlign: "center",
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  progressRing: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  timerText: {
    fontSize: 64,
    fontWeight: "300",
  },
  controls: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  pauseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  pauseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  pausedControls: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  resetButtonText: {
    color: "#687076",
    fontSize: 16,
    fontWeight: "600",
  },
  completedContainer: {
    alignItems: "center",
    gap: 24,
  },
  completedText: {
    fontSize: 24,
    color: "#4CAF50",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
