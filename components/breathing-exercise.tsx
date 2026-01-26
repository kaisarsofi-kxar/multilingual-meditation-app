import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { useProgressStore } from "@/store/progressStore";
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

interface BreathingExerciseProps {
  visible: boolean;
  onClose: () => void;
}

type BreathingPhase = "inhale" | "hold" | "exhale" | "pause";

const DEFAULT_BREATHING_PATTERN = {
  inhale: 4, // seconds
  hold: 4,
  exhale: 4,
  pause: 2,
};

export function BreathingExercise({
  visible,
  onClose,
}: BreathingExerciseProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [cycle, setCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_BREATHING_PATTERN.inhale);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const addSession = useProgressStore((state) => state.addSession);

  useEffect(() => {
    if (visible) {
      resetExercise();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return moveToNextPhase();
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
  }, [isRunning, phase]);

  useEffect(() => {
    if (phase === "inhale") {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: DEFAULT_BREATHING_PATTERN.inhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === "exhale") {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: DEFAULT_BREATHING_PATTERN.exhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(scaleAnim._value);
    }
  }, [phase, scaleAnim]);

  const moveToNextPhase = (): number => {
    let nextPhase: BreathingPhase;
    let nextDuration: number;

    switch (phase) {
      case "inhale":
        nextPhase = "hold";
        nextDuration = DEFAULT_BREATHING_PATTERN.hold;
        break;
      case "hold":
        nextPhase = "exhale";
        nextDuration = DEFAULT_BREATHING_PATTERN.exhale;
        break;
      case "exhale":
        nextPhase = "pause";
        nextDuration = DEFAULT_BREATHING_PATTERN.pause;
        setCycle((prev) => prev + 1);
        break;
      case "pause":
        nextPhase = "inhale";
        nextDuration = DEFAULT_BREATHING_PATTERN.inhale;
        break;
    }

    setPhase(nextPhase);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    return nextDuration;
  };

  const resetExercise = () => {
    setIsRunning(false);
    setPhase("inhale");
    setCycle(0);
    setTimeRemaining(DEFAULT_BREATHING_PATTERN.inhale);
    scaleAnim.setValue(1);
  };

  const handleStart = () => {
    setIsRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePause = () => {
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleComplete = async () => {
    await addSession({
      title: t("breathingExercise"),
      duration: Math.ceil(cycle * 0.5), // Approximate minutes
      type: "breathing",
    });
    resetExercise();
    onClose();
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return t("inhale");
      case "hold":
        return t("hold");
      case "exhale":
        return t("exhale");
      case "pause":
        return t("breathingPause");
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "#4CAF50";
      case "hold":
        return "#FF9800";
      case "exhale":
        return "#2196F3";
      case "pause":
        return "#9E9E9E";
    }
  };

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
          <ThemedText type="subtitle" style={styles.title}>
            {t("breathingExercise")}
          </ThemedText>
          <View style={styles.cycleCounter}>
            <ThemedText style={styles.cycleText}>
              {t("cycles")}: {cycle}
            </ThemedText>
          </View>
        </View>

        <View style={styles.exerciseContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: `${getPhaseColor()}20`,
                borderColor: getPhaseColor(),
              },
            ]}
          >
            <View style={[styles.innerCircle, { borderColor: getPhaseColor() }]}>
              <ThemedText
                type="title"
                style={[styles.phaseText, { color: getPhaseColor() }]}
              >
                {getPhaseText()}
              </ThemedText>
              <ThemedText style={[styles.timeText, { color: getPhaseColor() }]}>
                {timeRemaining}
              </ThemedText>
            </View>
          </Animated.View>

          <View style={styles.instructions}>
            <ThemedText style={styles.instructionText}>
              {phase === "inhale" && t("breatheInSlowly")}
              {phase === "hold" && t("holdYourBreath")}
              {phase === "exhale" && t("breatheOutSlowly")}
              {phase === "pause" && t("pauseAndRelax")}
            </ThemedText>
          </View>

          <View style={styles.controls}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: getPhaseColor() }]}
                onPress={handleStart}
              >
                <IconSymbol name="play.fill" size={24} color="#fff" />
                <ThemedText style={styles.startButtonText}>
                  {t("start")}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={handlePause}
              >
                <IconSymbol name="pause.fill" size={24} color="#687076" />
                <ThemedText style={styles.pauseButtonText}>
                  {t("pause")}
                </ThemedText>
              </TouchableOpacity>
            )}

            {cycle > 0 && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
              >
                <ThemedText style={styles.completeButtonText}>
                  {t("finish")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
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
  title: {
    flex: 1,
    textAlign: "center",
  },
  cycleCounter: {
    padding: 8,
  },
  cycleText: {
    fontSize: 14,
    opacity: 0.7,
  },
  exerciseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  breathingCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  phaseText: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "300",
  },
  instructions: {
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  instructionText: {
    fontSize: 18,
    textAlign: "center",
    opacity: 0.8,
  },
  controls: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
  },
  pauseButtonText: {
    color: "#687076",
    fontSize: 18,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
