import type { Game } from "../../types/models";

export const playerDelta = (g: Game, id: string) => {
  const d = g.perPlayerDeltas?.[id];
  return typeof d === "number" ? d : undefined;
};

export const teamSumDelta = (g: Game, team: "A" | "B") => {
  if (g.perPlayerDeltas) {
    const ids = team === "A" ? g.teamA : g.teamB;
    return ids.reduce((s: number, pid: string) => s + (g.perPlayerDeltas?.[pid] ?? 0), 0);
  }
  const isWinner = g.winnerTeam === team;
  return isWinner ? g.pointsChange : -g.pointsChange;
};

