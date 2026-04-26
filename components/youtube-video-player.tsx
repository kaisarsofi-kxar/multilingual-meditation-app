import { StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface YouTubeVideoPlayerProps {
  videoId: string;
  title?: string;
  onClose?: () => void;
}

const EMBED_PARAMS = "?playsinline=1&modestbranding=1&rel=0&autoplay=1";

export function YouTubeVideoPlayer({
  videoId,
  title,
  onClose,
}: YouTubeVideoPlayerProps) {
  const embedUri = `https://www.youtube.com/embed/${videoId}${EMBED_PARAMS}`;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <IconSymbol name="xmark.circle.fill" size={32} color="#fff" />
          </TouchableOpacity>
        )}
        {title ? (
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
              {title}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.titleContainer} />
        )}
      </View>
      <View style={styles.webViewWrapper}>
        <WebView
          source={{ uri: embedUri }}
          style={styles.webView}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          allowsFullscreenVideo
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
  },
  webViewWrapper: {
    flex: 1,
    minHeight: 200,
  },
  webView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
});
