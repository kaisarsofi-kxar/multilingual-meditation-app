import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in minutes
  date: string; // ISO date string
  type: "meditation" | "breathing" | "music" | "video";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: number;
  type: "sessions" | "streak" | "time" | "category";
}

interface ProgressState {
  sessions: MeditationSession[];
  totalSessions: number;
  totalTimeMinutes: number;
  currentStreak: number;
  lastMeditationDate: string | null;
  achievements: Achievement[];
  favorites: string[]; // Array of content IDs
  journalEntries: JournalEntry[];
  
  // Actions
  addSession: (session: Omit<MeditationSession, "id" | "date">) => Promise<void>;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "date">) => Promise<void>;
  getTodayMinutes: () => number;
  getTodaySessions: () => number;
  checkAchievements: () => Promise<void>;
  initialize: () => Promise<void>;
}

export interface JournalEntry {
  id: string;
  date: string;
  sessionId?: string;
  sessionTitle: string;
  notes: string;
  mood: "great" | "good" | "okay" | "difficult";
}

const STORAGE_KEYS = {
  SESSIONS: "@progress_sessions",
  ACHIEVEMENTS: "@progress_achievements",
  FAVORITES: "@progress_favorites",
  JOURNAL: "@progress_journal",
  LAST_DATE: "@progress_last_date",
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    title: "First Steps",
    description: "Complete your first meditation session",
    icon: "star.fill",
    unlocked: false,
    requirement: 1,
    type: "sessions",
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Meditate for 7 days straight",
    icon: "flame.fill",
    unlocked: false,
    requirement: 7,
    type: "streak",
  },
  {
    id: "month_master",
    title: "Month Master",
    description: "Meditate for 30 days straight",
    icon: "crown.fill",
    unlocked: false,
    requirement: 30,
    type: "streak",
  },
  {
    id: "hour_meditator",
    title: "Hour Meditator",
    description: "Complete 1 hour of total meditation time",
    icon: "clock.fill",
    unlocked: false,
    requirement: 60,
    type: "time",
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Complete 100 meditation sessions",
    icon: "trophy.fill",
    unlocked: false,
    requirement: 100,
    type: "sessions",
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete 10 morning meditations",
    icon: "sunrise.fill",
    unlocked: false,
    requirement: 10,
    type: "category",
  },
];

const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isConsecutiveDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d1.getTime() - d2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  sessions: [],
  totalSessions: 0,
  totalTimeMinutes: 0,
  currentStreak: 0,
  lastMeditationDate: null,
  achievements: INITIAL_ACHIEVEMENTS,
  favorites: [],
  journalEntries: [],

  addSession: async (session) => {
    const newSession: MeditationSession = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const sessions = [...get().sessions, newSession];
    const totalSessions = sessions.length;
    const totalTimeMinutes = sessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    // Calculate streak
    const lastDate = get().lastMeditationDate;
    const today = new Date().toISOString().split("T")[0];
    let currentStreak = get().currentStreak;

    if (!lastDate) {
      currentStreak = 1;
    } else if (isSameDay(lastDate, today)) {
      // Same day, keep streak
      currentStreak = get().currentStreak;
    } else if (isConsecutiveDay(lastDate, today)) {
      // Consecutive day, increment streak
      currentStreak = get().currentStreak + 1;
    } else {
      // Streak broken, reset to 1
      currentStreak = 1;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(sessions)
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_DATE,
      today
    );

    set({
      sessions,
      totalSessions,
      totalTimeMinutes,
      currentStreak,
      lastMeditationDate: today,
    });

    // Check achievements after adding session
    await get().checkAchievements();
  },

  addFavorite: async (id: string) => {
    const favorites = [...get().favorites, id];
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
    set({ favorites });
  },

  removeFavorite: async (id: string) => {
    const favorites = get().favorites.filter((f) => f !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
    set({ favorites });
  },

  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },

  addJournalEntry: async (entry) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const journalEntries = [...get().journalEntries, newEntry];
    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL,
      JSON.stringify(journalEntries)
    );
    set({ journalEntries });
  },

  getTodayMinutes: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().sessions
      .filter((s) => s.date.startsWith(today))
      .reduce((sum, s) => sum + s.duration, 0);
  },

  getTodaySessions: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().sessions.filter((s) => s.date.startsWith(today)).length;
  },

  checkAchievements: async () => {
    const state = get();
    const updatedAchievements = state.achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let unlocked = false;
      switch (achievement.type) {
        case "sessions":
          unlocked = state.totalSessions >= achievement.requirement;
          break;
        case "streak":
          unlocked = state.currentStreak >= achievement.requirement;
          break;
        case "time":
          unlocked = state.totalTimeMinutes >= achievement.requirement;
          break;
        case "category":
          // For category achievements, check if user has done enough of that type
          const categoryCount = state.sessions.filter(
            (s) => s.title.toLowerCase().includes(achievement.title.toLowerCase().split(" ")[0].toLowerCase())
          ).length;
          unlocked = categoryCount >= achievement.requirement;
          break;
      }

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlocked && !achievement.unlockedAt
          ? new Date().toISOString()
          : achievement.unlockedAt,
      };
    });

    await AsyncStorage.setItem(
      STORAGE_KEYS.ACHIEVEMENTS,
      JSON.stringify(updatedAchievements)
    );
    set({ achievements: updatedAchievements });
  },

  initialize: async () => {
    try {
      const [sessionsData, achievementsData, favoritesData, journalData, lastDateData] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
          AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.JOURNAL),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE),
        ]);

      const sessions: MeditationSession[] = sessionsData
        ? JSON.parse(sessionsData)
        : [];
      const achievements: Achievement[] = achievementsData
        ? JSON.parse(achievementsData)
        : INITIAL_ACHIEVEMENTS;
      const favorites: string[] = favoritesData
        ? JSON.parse(favoritesData)
        : [];
      const journalEntries: JournalEntry[] = journalData
        ? JSON.parse(journalData)
        : [];

      const totalSessions = sessions.length;
      const totalTimeMinutes = sessions.reduce(
        (sum, s) => sum + s.duration,
        0
      );

      // Calculate current streak
      let currentStreak = 0;
      if (lastDateData) {
        const today = new Date().toISOString().split("T")[0];
        if (isSameDay(lastDateData, today)) {
          // Count consecutive days from last date
          const sortedDates = [...new Set(sessions.map((s) => s.date.split("T")[0]))]
            .sort()
            .reverse();
          
          let streak = 0;
          let expectedDate = today;
          for (const date of sortedDates) {
            if (date === expectedDate) {
              streak++;
              const d = new Date(expectedDate);
              d.setDate(d.getDate() - 1);
              expectedDate = d.toISOString().split("T")[0];
            } else {
              break;
            }
          }
          currentStreak = streak;
        }
      }

      set({
        sessions,
        totalSessions,
        totalTimeMinutes,
        currentStreak,
        lastMeditationDate: lastDateData,
        achievements,
        favorites,
        journalEntries,
      });
    } catch (error) {
      console.error("Error initializing progress store:", error);
    }
  },
}));
