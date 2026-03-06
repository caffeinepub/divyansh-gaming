// Achievements / Badges System — localStorage-persisted
import { useEffect, useState } from "react";
import type { XPProfile } from "./useXPSystem";

export type AchievementCategory =
  | "level"
  | "xp"
  | "challenge"
  | "tournament"
  | "social"
  | "secret";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (profile: XPProfile & { scoresSubmitted: number }) => boolean;
  category: AchievementCategory;
  rarity: AchievementRarity;
  isSecret?: boolean;
}

export interface AchievementRecord {
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

const STORAGE_KEY = "dg_achievements";
const SCORES_KEY = "dg_scores_submitted";

// ─── Cryptic hints for locked secret achievements ────────────────────────────
const SECRET_HINTS: Record<string, string> = {
  secret_ghost_racer: "A ghost never moves...",
  secret_speed_demon: "How fast can you really go?",
  secret_untouchable: "They never even scratched you.",
  secret_stargazer: "Sometimes waiting is the answer.",
  secret_nuke_happy: "Overkill is underrated.",
  secret_bullet_storm: "More bullets, more problems?",
  secret_night_owl: "The real gamers never sleep.",
  secret_speed_reader: "No mistakes. Not one.",
  secret_clicker: "You really like that button.",
  secret_admirer: "The secret is at the very bottom.",
};

// ─── Achievement definitions ────────────────────────────────────────────────
const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Level achievements
  {
    id: "level_2",
    name: "First Steps",
    description: "Reach Level 2",
    icon: "🌟",
    condition: (p) => p.level >= 2,
    category: "level",
    rarity: "common",
  },
  {
    id: "level_5",
    name: "Rookie Initiation",
    description: "Reach Level 5",
    icon: "🎮",
    condition: (p) => p.level >= 5,
    category: "level",
    rarity: "common",
  },
  {
    id: "level_10",
    name: "Battle-Hardened",
    description: "Reach Level 10",
    icon: "⚔️",
    condition: (p) => p.level >= 10,
    category: "level",
    rarity: "rare",
  },
  {
    id: "level_15",
    name: "Elite Gamer",
    description: "Reach Level 15",
    icon: "💎",
    condition: (p) => p.level >= 15,
    category: "level",
    rarity: "epic",
  },
  {
    id: "level_20",
    name: "Champion",
    description: "Reach Level 20",
    icon: "🏆",
    condition: (p) => p.level >= 20,
    category: "level",
    rarity: "epic",
  },
  {
    id: "level_25",
    name: "Legend",
    description: "Reach Level 25",
    icon: "🌌",
    condition: (p) => p.level >= 25,
    category: "level",
    rarity: "legendary",
  },
  {
    id: "level_30",
    name: "Grandmaster",
    description: "Reach Level 30",
    icon: "👑",
    condition: (p) => p.level >= 30,
    category: "level",
    rarity: "legendary",
  },

  // XP achievements
  {
    id: "xp_500",
    name: "XP Collector",
    description: "Earn 500 total XP",
    icon: "⭐",
    condition: (p) => p.totalXpEarned >= 500,
    category: "xp",
    rarity: "common",
  },
  {
    id: "xp_2000",
    name: "XP Hunter",
    description: "Earn 2,000 total XP",
    icon: "🔥",
    condition: (p) => p.totalXpEarned >= 2000,
    category: "xp",
    rarity: "rare",
  },
  {
    id: "xp_5000",
    name: "XP Addict",
    description: "Earn 5,000 total XP",
    icon: "🌀",
    condition: (p) => p.totalXpEarned >= 5000,
    category: "xp",
    rarity: "epic",
  },
  {
    id: "xp_10000",
    name: "XP Legend",
    description: "Earn 10,000 total XP",
    icon: "💥",
    condition: (p) => p.totalXpEarned >= 10000,
    category: "xp",
    rarity: "legendary",
  },

  // Challenge achievements
  {
    id: "challenge_1",
    name: "Challenge Accepted",
    description: "Complete 1 daily challenge",
    icon: "🎯",
    condition: (p) => p.completedChallenges >= 1,
    category: "challenge",
    rarity: "common",
  },
  {
    id: "challenge_5",
    name: "Daily Grinder",
    description: "Complete 5 daily challenges",
    icon: "🔄",
    condition: (p) => p.completedChallenges >= 5,
    category: "challenge",
    rarity: "rare",
  },
  {
    id: "challenge_10",
    name: "Grind Warrior",
    description: "Complete 10 daily challenges",
    icon: "⚡",
    condition: (p) => p.completedChallenges >= 10,
    category: "challenge",
    rarity: "epic",
  },
  {
    id: "challenge_20",
    name: "Challenge Master",
    description: "Complete 20 daily challenges",
    icon: "🏅",
    condition: (p) => p.completedChallenges >= 20,
    category: "challenge",
    rarity: "epic",
  },

  // Tournament achievements
  {
    id: "tournament_1",
    name: "First Victory",
    description: "Win 1 tournament",
    icon: "🥇",
    condition: (p) => p.tournamentsWon >= 1,
    category: "tournament",
    rarity: "rare",
  },
  {
    id: "tournament_5",
    name: "Tournament Champion",
    description: "Win 5 tournaments",
    icon: "🎖️",
    condition: (p) => p.tournamentsWon >= 5,
    category: "tournament",
    rarity: "epic",
  },
  {
    id: "tournament_10",
    name: "Undefeated King",
    description: "Win 10 tournaments",
    icon: "🦁",
    condition: (p) => p.tournamentsWon >= 10,
    category: "tournament",
    rarity: "legendary",
  },

  // Social / score achievements
  {
    id: "score_1",
    name: "Score Poster",
    description: "Submit 1 score to the leaderboard",
    icon: "📊",
    condition: (p) => p.scoresSubmitted >= 1,
    category: "social",
    rarity: "common",
  },
  {
    id: "score_10",
    name: "Score Fanatic",
    description: "Submit 10 scores to the leaderboard",
    icon: "📈",
    condition: (p) => p.scoresSubmitted >= 10,
    category: "social",
    rarity: "rare",
  },
  {
    id: "score_25",
    name: "Leaderboard Legend",
    description: "Submit 25 scores to the leaderboard",
    icon: "🎲",
    condition: (p) => p.scoresSubmitted >= 25,
    category: "social",
    rarity: "epic",
  },

  // ─── Secret achievements ──────────────────────────────────────────────────
  {
    id: "secret_ghost_racer",
    name: "Ghost Racer",
    description: "Drive without switching lanes for 60 seconds",
    icon: "👻",
    condition: () => false,
    category: "secret",
    rarity: "epic",
    isSecret: true,
  },
  {
    id: "secret_speed_demon",
    name: "Speed Demon",
    description: "Hit max speed in Car Racing",
    icon: "🔥",
    condition: () => false,
    category: "secret",
    rarity: "legendary",
    isSecret: true,
  },
  {
    id: "secret_untouchable",
    name: "Untouchable",
    description: "Finish a race with no lives lost",
    icon: "🛡️",
    condition: () => false,
    category: "secret",
    rarity: "epic",
    isSecret: true,
  },
  {
    id: "secret_stargazer",
    name: "Stargazer",
    description: "Stare at the Space Shooter start screen for 10 seconds",
    icon: "🌠",
    condition: () => false,
    category: "secret",
    rarity: "rare",
    isSecret: true,
  },
  {
    id: "secret_nuke_happy",
    name: "Nuke Happy",
    description: "Use 3 nukes in one Space Shooter session",
    icon: "💣",
    condition: () => false,
    category: "secret",
    rarity: "epic",
    isSecret: true,
  },
  {
    id: "secret_bullet_storm",
    name: "Bullet Storm",
    description: "Fire 100 bullets in one Space Shooter session",
    icon: "🌊",
    condition: () => false,
    category: "secret",
    rarity: "rare",
    isSecret: true,
  },
  {
    id: "secret_night_owl",
    name: "Night Owl",
    description: "Play between midnight and 4am",
    icon: "🦉",
    condition: () => false,
    category: "secret",
    rarity: "rare",
    isSecret: true,
  },
  {
    id: "secret_speed_reader",
    name: "Speed Reader",
    description: "Finish Typing Test with zero errors",
    icon: "⌨️",
    condition: () => false,
    category: "secret",
    rarity: "epic",
    isSecret: true,
  },
  {
    id: "secret_clicker",
    name: "ARIA Clicker",
    description: "Open and close the ARIA chatbot 5 times quickly",
    icon: "🤖",
    condition: () => false,
    category: "secret",
    rarity: "rare",
    isSecret: true,
  },
  {
    id: "secret_admirer",
    name: "Secret Admirer",
    description: "Read every word on the page by scrolling to the bottom",
    icon: "👀",
    condition: () => false,
    category: "secret",
    rarity: "legendary",
    isSecret: true,
  },
];

// ─── localStorage helpers ────────────────────────────────────────────────────
function loadRecords(): Record<string, AchievementRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AchievementRecord>;
  } catch {
    return {};
  }
}

function saveRecords(records: Record<string, AchievementRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

function getScoresSubmitted(): number {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return 0;
    const val = Number.parseInt(raw, 10);
    return Number.isNaN(val) ? 0 : val;
  } catch {
    return 0;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Returns all achievements merged with their unlock status from localStorage */
export function getAchievements(): AchievementWithStatus[] {
  const records = loadRecords();
  return ACHIEVEMENT_DEFINITIONS.map((a) => {
    const isUnlocked = records[a.id]?.unlocked ?? false;

    // For locked secret achievements, mask the real name/description/icon
    if (a.isSecret && !isUnlocked) {
      const hint = SECRET_HINTS[a.id] ?? "A secret waits to be discovered...";
      return {
        ...a,
        name: "??? Secret Badge ???",
        description: hint,
        icon: "🔮",
        unlocked: false,
        unlockedAt: undefined,
      };
    }

    return {
      ...a,
      unlocked: isUnlocked,
      unlockedAt: records[a.id]?.unlockedAt,
    };
  });
}

/** Increment the score submission counter in localStorage */
export function incrementScoresSubmitted(): void {
  const current = getScoresSubmitted();
  try {
    localStorage.setItem(SCORES_KEY, String(current + 1));
  } catch {
    /* ignore */
  }
}

/**
 * Directly unlock a secret achievement by ID and fire achievement-unlocked event.
 * Idempotent — already-unlocked achievements are silently ignored.
 */
export function unlockSecretAchievement(id: string): void {
  const records = loadRecords();
  if (records[id]?.unlocked) return; // already unlocked — no-op

  const achievement = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
  if (!achievement) return;

  records[id] = {
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  };
  saveRecords(records);

  // Dispatch with the real achievement data (not masked)
  window.dispatchEvent(
    new CustomEvent("achievement-unlocked", {
      detail: {
        achievement,
        profile: {
          level: 0,
          totalXpEarned: 0,
          completedChallenges: 0,
          tournamentsWon: 0,
          scoresSubmitted: 0,
        },
      },
    }),
  );
}

/**
 * Check all not-yet-unlocked achievements, unlock new ones, and fire
 * `achievement-unlocked` events for each.
 */
export function checkAndUnlockAchievements(profile: XPProfile): void {
  const records = loadRecords();
  const scoresSubmitted = getScoresSubmitted();
  const enrichedProfile = { ...profile, scoresSubmitted };

  let changed = false;

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (records[achievement.id]?.unlocked) continue; // already unlocked
    if (achievement.isSecret) continue; // secrets only via event triggers
    if (achievement.condition(enrichedProfile)) {
      records[achievement.id] = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      changed = true;

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("achievement-unlocked", {
          detail: { achievement, profile },
        }),
      );
    }
  }

  if (changed) {
    saveRecords(records);
  }
}

// Module-level flag so we only register once
let _secretListenerRegistered = false;

/**
 * Set up a window listener for `secret-trigger` custom events.
 * Call once on app mount. Safe to call multiple times (de-duped).
 */
export function initSecretAchievementListener(): void {
  if (_secretListenerRegistered) return;
  _secretListenerRegistered = true;

  window.addEventListener("secret-trigger", (e: Event) => {
    const evt = e as CustomEvent<{ id: string }>;
    const id = evt.detail?.id;
    if (id) {
      unlockSecretAchievement(id);
    }
  });
}

/** React hook — re-renders when achievements are unlocked */
export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>(
    () => getAchievements(),
  );

  useEffect(() => {
    const handler = () => setAchievements(getAchievements());
    window.addEventListener("achievement-unlocked", handler);
    return () => window.removeEventListener("achievement-unlocked", handler);
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return { achievements, unlockedCount, totalCount };
}
