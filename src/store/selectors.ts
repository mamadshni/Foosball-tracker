import { useMemo } from "react";
import { usePlayersStore } from "./players";
import type { Player } from "../types/models";

export function usePlayersMap(): Map<string, Player> {
  const players = usePlayersStore((s) => s.players);
  return useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
}

