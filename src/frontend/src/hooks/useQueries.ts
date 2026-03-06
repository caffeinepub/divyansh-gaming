import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    LeaderboardEntry[],
    Error,
    { playerName: string; score: number; gameName: string; avatar: string }
  >({
    mutationFn: async ({ playerName, score, gameName, avatar }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitScore(
        playerName,
        BigInt(score),
        gameName,
        new Date().toISOString(),
        avatar,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
