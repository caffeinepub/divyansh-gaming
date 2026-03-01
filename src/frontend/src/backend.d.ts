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
    playerName: string;
    gameName: string;
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
    getNews(): Promise<Array<NewsPost>>;
}
