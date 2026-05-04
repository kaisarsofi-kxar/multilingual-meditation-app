import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "@app_settings_v1";

export interface AppSettings {
  hapticsEnabled: boolean;
  keepScreenAwakeDuringSessions: boolean;
}

interface SettingsState extends AppSettings {
  setHapticsEnabled: (value: boolean) => Promise<void>;
  setKeepScreenAwakeDuringSessions: (value: boolean) => Promise<void>;
  initialize: () => Promise<void>;
}

const DEFAULTS: AppSettings = {
  hapticsEnabled: true,
  keepScreenAwakeDuringSessions: true,
};

function parseSettings(raw: string | null): AppSettings {
  if (!raw) return DEFAULTS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "hapticsEnabled" in parsed &&
      "keepScreenAwakeDuringSessions" in parsed
    ) {
      const o = parsed as Record<string, unknown>;
      return {
        hapticsEnabled: Boolean(o.hapticsEnabled),
        keepScreenAwakeDuringSessions: Boolean(o.keepScreenAwakeDuringSessions),
      };
    }
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULTS,

  setHapticsEnabled: async (value) => {
    const { keepScreenAwakeDuringSessions } = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hapticsEnabled: value,
        keepScreenAwakeDuringSessions,
      })
    );
    set({ hapticsEnabled: value });
  },

  setKeepScreenAwakeDuringSessions: async (value) => {
    const { hapticsEnabled } = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hapticsEnabled,
        keepScreenAwakeDuringSessions: value,
      })
    );
    set({ keepScreenAwakeDuringSessions: value });
  },

  initialize: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = parseSettings(raw);
      set(parsed);
    } catch {
      set(DEFAULTS);
    }
  },
}));
