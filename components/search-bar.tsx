import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
}: SearchBarProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.container,
        colorScheme === "dark" && styles.containerDark,
      ]}
    >
      <IconSymbol name="magnifyingglass" size={20} color="#687076" />
      <TextInput
        style={[
          styles.input,
          colorScheme === "dark" && styles.inputDark,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || t("searchPlaceholder")}
        placeholderTextColor="#687076"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => {
          onChangeText("");
          onClear?.();
        }}>
          <IconSymbol name="xmark.circle.fill" size={20} color="#687076" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  containerDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  inputDark: {
    color: "#fff",
  },
});
