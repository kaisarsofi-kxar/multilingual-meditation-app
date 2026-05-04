// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

/** SF Symbol names used in the app; Android/web map to Material Icons where possible. */
const MAPPING: Partial<
  Record<SymbolViewProps["name"], MaterialIconName>
> = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "leaf.fill": "spa",
  "book.fill": "menu-book",
  "music.note": "music-note",
  "play.rectangle.fill": "play-circle-filled",
  "person.fill": "person",
  "play.fill": "play-arrow",
  "play.circle.fill": "play-circle-filled",
  "xmark.circle.fill": "cancel",
  "xmark": "close",
  "checkmark.circle.fill": "check-circle",
  "pause.fill": "pause",
  "arrow.counterclockwise": "refresh",
  "trophy.fill": "emoji-events",
  "heart.fill": "favorite",
  "quote.opening": "format-quote",
  magnifyingglass: "search",
  globe: "language",
  sparkles: "auto-awesome",
  "chevron.down": "keyboard-arrow-down",
  heart: "favorite-border",
  "backward.end.fill": "skip-previous",
  "forward.end.fill": "skip-next",
  "ellipsis.circle.fill": "more-horiz",
  "gobackward.10": "replay-10",
  "goforward.10": "forward-10",
  speedometer: "speed",
  "music.note.list": "queue-music",
  "star.fill": "star",
  "bell.fill": "notifications",
  "clock.fill": "schedule",
  "speaker.wave.2.fill": "volume-up",
  "lock.fill": "lock",
  "info.circle.fill": "info",
};

type IconSymbolName = SymbolViewProps["name"];
const FALLBACK_MATERIAL: MaterialIconName = "apps";

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols; unmapped names use a generic Material icon.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialName = MAPPING[name] ?? FALLBACK_MATERIAL;
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={materialName}
      style={style}
    />
  );
}
