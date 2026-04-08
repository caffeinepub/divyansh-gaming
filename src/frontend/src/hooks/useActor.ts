// Shim for useActor — backend has no methods, actor is always null at runtime
// but typed to avoid TS errors in components that guard with `if (!actor) return`
interface ActorInterface {
  getGames(): Promise<import("../types").Game[]>;
  getLeaderboard(): Promise<import("../types").LeaderboardEntry[]>;
  getNews(): Promise<import("../types").NewsPost[]>;
  submitScore(
    playerName: string,
    score: bigint,
    gameName: string,
    timestamp: string,
    avatar: string,
  ): Promise<import("../types").LeaderboardEntry[]>;
  addLeaderboardEntry(
    entry: import("../types").LeaderboardEntry,
  ): Promise<void>;
}

export function useActor() {
  return { actor: null as ActorInterface | null, isFetching: false };
}
