import { useTranslation } from "@/hooks/use-translation";
import Slider from "@react-native-community/slider";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTROLS_HIDE_DELAY = 3000; // 3 seconds
const SEEK_AMOUNT = 10; // 10 seconds

interface VideoPlayerProps {
  uri: string;
  title?: string;
  onClose?: () => void;
}

type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export function VideoPlayer({ uri, title, onClose }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showSeekIndicator, setShowSeekIndicator] = useState(false);
  const [seekDirection, setSeekDirection] = useState<"forward" | "backward">("forward");
  const { t } = useTranslation();

  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.muted = false;
    player.volume = volume;
  });

  // Update playback speed
  useEffect(() => {
    if (player) {
      player.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, player]);

  // Update volume
  useEffect(() => {
    if (player) {
      player.volume = volume;
      player.muted = volume === 0;
    }
  }, [volume, player]);

  const lastTimeRef = useRef(0);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    const updateState = () => {
      setIsPlaying(player.playing);
      const time = player.currentTime || 0;
      const dur = player.duration || 0;
      
      if (!isSeeking) {
        setCurrentTime(time);
      }
      setDuration(dur);
      
      // Check buffering state - detect if video is loading by checking if playing but time not advancing
      // This is a simple heuristic - in a real app you might want to use player events
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      const timeDifference = Math.abs(time - lastTimeRef.current);
      
      if (isPlaying && dur > 0 && timeSinceLastUpdate > 500) {
        // If playing but time hasn't changed much in 500ms, likely buffering
        if (timeDifference < 0.1) {
          setIsBuffering(true);
        } else {
          setIsBuffering(false);
        }
      } else {
        setIsBuffering(false);
      }
      
      lastTimeRef.current = time;
      lastUpdateTimeRef.current = now;
      
      if (dur > 0 && isLoading) {
        setIsLoading(false);
      }
    };

    updateState();
    const interval = setInterval(updateState, 250);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, isLoading, isSeeking]);

  useEffect(() => {
    return () => {
      try {
        if (player && player.playing) {
          player.pause();
        }
      } catch {
        // Player might not be initialized yet, ignore
      }
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [player]);

  const showControlsWithAutoHide = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowControls(false);
        });
      }
    }, CONTROLS_HIDE_DELAY);
  };

  const hideControls = () => {
    if (isPlaying) {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowControls(false);
      });
    }
  };

  useEffect(() => {
    if (isPlaying && showControls) {
      showControlsWithAutoHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const togglePlayPause = async () => {
    try {
      if (player.playing) {
        await player.pause();
        showControlsWithAutoHide();
      } else {
        await player.play();
        showControlsWithAutoHide();
      }
    } catch (error) {
      console.error("Error toggling video playback:", error);
    }
  };

  const handleSeek = (value: number) => {
    setIsSeeking(true);
    setSeekTime(value);
  };

  const handleSeekComplete = (value: number) => {
    try {
      player.currentTime = value;
      setCurrentTime(value);
      setIsSeeking(false);
      showControlsWithAutoHide();
    } catch (error) {
      console.error("Error seeking:", error);
      setIsSeeking(false);
    }
  };

  const seekForward = () => {
    const newTime = Math.min(currentTime + SEEK_AMOUNT, duration);
    try {
      player.currentTime = newTime;
      setCurrentTime(newTime);
      showControlsWithAutoHide();
    } catch {
      // Ignore errors
    }
  };

  const seekBackward = () => {
    const newTime = Math.max(currentTime - SEEK_AMOUNT, 0);
    try {
      player.currentTime = newTime;
      setCurrentTime(newTime);
      showControlsWithAutoHide();
    } catch {
      // Ignore errors
    }
  };

  const handleDoubleTap = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const screenCenter = SCREEN_WIDTH / 2;
      if (x < screenCenter) {
        // Left side - seek backward
        seekBackward();
        setSeekDirection("backward");
      } else {
        // Right side - seek forward
        seekForward();
        setSeekDirection("forward");
      }
      
      setTapPosition({ x, y });
      setShowSeekIndicator(true);
      setTimeout(() => {
        setShowSeekIndicator(false);
      }, 1000);
    } else {
      // Single tap - toggle controls
      if (showControls) {
        hideControls();
      } else {
        showControlsWithAutoHide();
      }
    }
    setLastTap(now);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playbackSpeeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const changePlaybackSpeed = () => {
    const currentIndex = playbackSpeeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % playbackSpeeds.length;
    setPlaybackSpeed(playbackSpeeds[nextIndex]);
    setShowSettings(false);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  const progressPercentage = duration > 0 ? ((isSeeking ? seekTime : currentTime) / duration) * 100 : 0;

  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={styles.videoPressable}
        onPress={handleDoubleTap}
      >
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls={false}
            contentFit="contain"
            allowsPictureInPicture
          />
          
          {/* Loading Indicator */}
          {(isLoading || isBuffering) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0a7ea4" />
              {isBuffering && (
                <ThemedText style={styles.bufferingText}>
                  {t("buffering") || "Buffering..."}
                </ThemedText>
              )}
            </View>
          )}

          {/* Seek Indicator */}
          {showSeekIndicator && (
            <View
              style={[
                styles.seekIndicator,
                { top: tapPosition.y - 30, left: tapPosition.x - 30 },
              ]}
            >
              <IconSymbol
                name={seekDirection === "forward" ? "forward.fill" : "backward.fill"}
                size={40}
                color="#fff"
              />
              <ThemedText style={styles.seekAmount}>
                {SEEK_AMOUNT}s
              </ThemedText>
            </View>
          )}

          {/* Controls Overlay */}
          <Animated.View
            style={[
              styles.controlsOverlay,
              { opacity: controlsOpacity },
            ]}
            pointerEvents={showControls ? "auto" : "none"}
          >
            {/* Top Controls */}
            <View style={styles.topControls}>
              {onClose && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="xmark.circle.fill" size={32} color="#fff" />
                </TouchableOpacity>
              )}
              
              {title && (
                <View style={styles.titleContainer}>
                  <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
                    {title}
                  </ThemedText>
                </View>
              )}

              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowSettings(!showSettings)}
                activeOpacity={0.7}
              >
                <IconSymbol name="ellipsis.circle.fill" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Center Play Button */}
            {!isPlaying && (
              <TouchableOpacity
                style={styles.centerPlayButton}
                onPress={togglePlayPause}
                activeOpacity={0.8}
              >
                <IconSymbol name="play.circle.fill" size={80} color="#fff" />
              </TouchableOpacity>
            )}

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
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
                  value={isSeeking ? seekTime : currentTime}
                  onValueChange={handleSeek}
                  onSlidingComplete={handleSeekComplete}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="transparent"
                />
              </View>

              {/* Control Buttons */}
              <View style={styles.controlsRow}>
                <View style={styles.leftControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={seekBackward}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="gobackward.10" size={28} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={togglePlayPause}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
                      size={48}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={seekForward}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="goforward.10" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.rightControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleMute}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={volume === 0 ? "speaker.slash.fill" : volume < 0.5 ? "speaker.wave.1.fill" : "speaker.wave.3.fill"}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <View style={styles.volumeContainer}>
                    <Slider
                      style={styles.volumeSlider}
                      minimumValue={0}
                      maximumValue={1}
                      value={volume}
                      onValueChange={setVolume}
                      minimumTrackTintColor="#0a7ea4"
                      maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                      thumbTintColor="#fff"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={changePlaybackSpeed}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={styles.speedText}>
                      {playbackSpeed}x
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Time Display */}
              <View style={styles.timeRow}>
                <ThemedText style={styles.timeText}>
                  {formatTime(isSeeking ? seekTime : currentTime)}
                </ThemedText>
                <ThemedText style={styles.timeText}>
                  {formatTime(duration)}
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        </View>
      </Pressable>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.settingsMenu}>
            <ThemedText type="subtitle" style={styles.settingsTitle}>
              {t("settings") || "Settings"}
            </ThemedText>
            
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={changePlaybackSpeed}
              activeOpacity={0.7}
            >
              <IconSymbol name="speedometer" size={24} color="#0a7ea4" />
              <View style={styles.settingsItemContent}>
                <ThemedText style={styles.settingsItemText}>
                  {t("playbackSpeed") || "Playback Speed"}
                </ThemedText>
                <ThemedText style={styles.settingsItemValue}>
                  {playbackSpeed}x
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                player.loop = !player.loop;
                setShowSettings(false);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={player.loop ? "repeat" : "repeat.circle"}
                size={24}
                color={player.loop ? "#0a7ea4" : "#687076"}
              />
              <View style={styles.settingsItemContent}>
                <ThemedText style={styles.settingsItemText}>
                  {t("loop") || "Loop"}
                </ThemedText>
                <ThemedText style={styles.settingsItemValue}>
                  {player.loop ? t("on") || "On" : t("off") || "Off"}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoPressable: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bufferingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
  },
  seekIndicator: {
    position: "absolute",
    zIndex: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  seekAmount: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
  },
  settingsButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 4,
  },
  centerPlayButton: {
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 40,
  },
  bottomControls: {
    backgroundColor: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  progressContainer: {
    position: "relative",
    marginBottom: 12,
    height: 40,
    justifyContent: "center",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    position: "relative",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#0a7ea4",
    borderRadius: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0a7ea4",
    position: "absolute",
    top: -4,
    marginLeft: -6,
  },
  slider: {
    position: "absolute",
    width: "100%",
    height: 40,
    top: 0,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  leftControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    padding: 4,
  },
  volumeContainer: {
    width: 80,
  },
  volumeSlider: {
    width: 80,
    height: 40,
  },
  speedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  settingsMenu: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  settingsTitle: {
    color: "#fff",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingsItemContent: {
    flex: 1,
    marginLeft: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsItemText: {
    color: "#fff",
    fontSize: 16,
  },
  settingsItemValue: {
    color: "#0a7ea4",
    fontSize: 16,
    fontWeight: "600",
  },
});
