import { useQuery } from "@tanstack/react-query";
import type { Game, LeaderboardEntry, NewsPost } from "../backend.d";
import { useActor } from "./useActor";

export function useGetGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsPost[]>({
    queryKey: ["news"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNews();
    },
    enabled: !!actor && !isFetching,
  });
}
