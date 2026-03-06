// XP and Leveling System — localStorage-persisted

export interface XPProfile {
  xp: number;
  level: number;
  totalXpEarned: number;
  completedChallenges: number;
  tournamentsWon: number;
  lastUpdated: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  progress: number;
  xpForNextLevel: number;
  xpCurrent: number;
  xpNeeded: number;
}

const STORAGE_KEY = "divyansh_xp_profile";

function getLevelTitle(level: number): string {
  if (level <= 4) return "Rookie";
  if (level <= 9) return "Warrior";
  if (level <= 14) return "Elite";
  if (level <= 19) return "Champion";
  if (level <= 24) return "Legend";
  return "Grandmaster";
}

function calcLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)));
}

function xpForLevel(level: number): number {
  return level * level * 100;
}

function getLevelInfo(profile: XPProfile): LevelInfo {
  const level = profile.level;
  const xpCurrentLevel = xpForLevel(level);
  const xpNextLevel = xpForLevel(level + 1);
  const progress =
    xpNextLevel > xpCurrentLevel
      ? Math.min(
          100,
          ((profile.xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) *
            100,
        )
      : 100;

  return {
    level,
    title: getLevelTitle(level),
    progress,
    xpForNextLevel: xpNextLevel,
    xpCurrent: profile.xp,
    xpNeeded: Math.max(0, xpNextLevel - profile.xp),
  };
}

function getDefaultProfile(): XPProfile {
  return {
    xp: 0,
    level: 1,
    totalXpEarned: 0,
    completedChallenges: 0,
    tournamentsWon: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function getProfile(): XPProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    return JSON.parse(raw) as XPProfile;
  } catch {
    return getDefaultProfile();
  }
}

function saveProfile(profile: XPProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function awardXP(amount: number, reason: string): XPProfile {
  const profile = getProfile();
  const oldLevel = profile.level;
  const newXp = profile.xp + amount;
  const newLevel = Math.max(1, calcLevel(newXp));

  const updatedProfile: XPProfile = {
    ...profile,
    xp: newXp,
    level: newLevel,
    totalXpEarned: profile.totalXpEarned + amount,
    completedChallenges:
      reason === "Daily Challenge"
        ? profile.completedChallenges + 1
        : profile.completedChallenges,
    tournamentsWon:
      reason === "Tournament Win"
        ? profile.tournamentsWon + 1
        : profile.tournamentsWon,
    lastUpdated: new Date().toISOString(),
  };

  saveProfile(updatedProfile);

  // Dispatch custom event
  window.dispatchEvent(
    new CustomEvent("xp-awarded", {
      detail: {
        amount,
        reason,
        newProfile: updatedProfile,
        leveledUp: newLevel > oldLevel,
        oldLevel,
      },
    }),
  );

  return updatedProfile;
}

export function useXPSystem() {
  const profile = getProfile();
  const levelInfo = getLevelInfo(profile);

  return {
    profile,
    awardXP,
    levelInfo,
  };
}
