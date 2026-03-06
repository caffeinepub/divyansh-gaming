import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    rank: bigint;
    score: bigint;
    timestamp: string;
    playerName: string;
    gameName: string;
    avatar: string;
}
export interface Game {
    id: bigint;
    title: string;
    description: string;
    imageUrl: string;
    genre: string;
    rating: bigint;
}
export interface NewsPost {
    id: bigint;
    title: string;
    date: string;
    summary: string;
}
export interface backendInterface {
    addGame(game: Game): Promise<void>;
    addLeaderboardEntry(entry: LeaderboardEntry): Promise<void>;
    addNewsPost(post: NewsPost): Promise<void>;
    getGames(): Promise<Array<Game>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLeaderboardByRank(): Promise<Array<LeaderboardEntry>>;
    getNews(): Promise<Array<NewsPost>>;
    getTopLeaderboard(limit: bigint): Promise<Array<LeaderboardEntry>>;
    submitScore(playerName: string, score: bigint, gameName: string, timestamp: string, avatar: string): Promise<Array<LeaderboardEntry>>;
}
