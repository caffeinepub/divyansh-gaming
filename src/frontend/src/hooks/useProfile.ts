import { useCallback, useEffect, useState } from "react";

export type AccountType = "guest" | "player";

export interface PlayerProfile {
  username: string;
  avatar: string;
  accountType: AccountType;
  visited: boolean;
}

const AVATARS = [
  "🎮",
  "🕹️",
  "🚀",
  "⚔️",
  "🛡️",
  "🎯",
  "🏆",
  "👾",
  "🤖",
  "🐉",
  "💥",
  "⚡",
];

function randomGuestName() {
  return `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
}

function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function loadProfile(): PlayerProfile | null {
  const visited = localStorage.getItem("dg_visited");
  if (!visited) return null;
  return {
    username: localStorage.getItem("dg_username") || "",
    avatar: localStorage.getItem("dg_avatar") || "🎮",
    accountType:
      (localStorage.getItem("dg_account_type") as AccountType) || "guest",
    visited: true,
  };
}

export function saveProfile(profile: Partial<PlayerProfile>) {
  if (profile.username !== undefined)
    localStorage.setItem("dg_username", profile.username);
  if (profile.avatar !== undefined)
    localStorage.setItem("dg_avatar", profile.avatar);
  if (profile.accountType !== undefined)
    localStorage.setItem("dg_account_type", profile.accountType);
  if (profile.visited !== undefined) localStorage.setItem("dg_visited", "true");
}

export function continueAsGuest() {
  const username = randomGuestName();
  const avatar = randomAvatar();
  saveProfile({ username, avatar, accountType: "guest", visited: true });
  return { username, avatar, accountType: "guest" as AccountType };
}

export function useProfile() {
  const [profile, setProfile] = useState<PlayerProfile | null>(() =>
    loadProfile(),
  );

  const refresh = useCallback(() => {
    setProfile(loadProfile());
  }, []);

  const updateProfile = useCallback((updates: Partial<PlayerProfile>) => {
    saveProfile(updates);
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const setupGuest = useCallback(() => {
    const p = continueAsGuest();
    setProfile({ ...p, visited: true });
  }, []);

  const setupPlayer = useCallback((username: string, avatar: string) => {
    const trimmed = username.trim() || randomGuestName();
    saveProfile({
      username: trimmed,
      avatar,
      accountType: "player",
      visited: true,
    });
    setProfile({
      username: trimmed,
      avatar,
      accountType: "player",
      visited: true,
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem("dg_xp");
    localStorage.removeItem("dg_achievements");
    localStorage.removeItem("dg_streak");
    localStorage.removeItem("dg_challenge_date");
    localStorage.removeItem("dg_challenge_completed");
    refresh();
  }, [refresh]);

  const clearProfile = useCallback(() => {
    const keys = [
      "dg_username",
      "dg_avatar",
      "dg_account_type",
      "dg_visited",
      "dg_xp",
      "dg_achievements",
      "dg_streak",
      "dg_language",
    ];
    for (const k of keys) localStorage.removeItem(k);
    setProfile(null);
  }, []);

  useEffect(() => {
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const scoresSubmitted = Number(
    localStorage.getItem("dg_scores_submitted") || 0,
  );
  const achievementsUnlocked = (() => {
    try {
      return JSON.parse(localStorage.getItem("dg_achievements") || "[]").length;
    } catch {
      return 0;
    }
  })();

  return {
    profile,
    updateProfile,
    setupGuest,
    setupPlayer,
    resetProgress,
    clearProfile,
    scoresSubmitted,
    achievementsUnlocked,
  };
}

export const AVATARS_LIST = AVATARS;
