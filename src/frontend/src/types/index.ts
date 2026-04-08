// Local type definitions (backend has no exported types)
export interface Game {
  id: bigint;
  title: string;
  description: string;
  imageUrl: string;
  genre: string;
  rating: bigint;
}

export interface LeaderboardEntry {
  rank: bigint;
  playerName: string;
  gameName: string;
  score: bigint;
  timestamp: string;
  avatar: string;
}

export interface NewsPost {
  id: bigint;
  title: string;
  date: string;
  summary: string;
}
