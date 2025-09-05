import type { Game, Player } from "../../types/models";

export type StreakType = "W" | "L" | null;

export interface PlayerStreak {
  playerId: string;
  type: StreakType;
  length: number;
  lastDate?: string;
}

export function computeCurrentStreaks(players: Player[], games: Game[]): Record<string, PlayerStreak> {
  const byId: Record<string, PlayerStreak> = {};
  const sorted = games.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const p of players) {
    let type: StreakType = null;
    let length = 0;
    let lastDate: string | undefined;
    for (const g of sorted) {
      const inA = g.teamA.includes(p.id);
      const inB = g.teamB.includes(p.id);
      if (!inA && !inB) continue;
      const isWin = (g.winnerTeam === "A" && inA) || (g.winnerTeam === "B" && inB);
      const r: StreakType = isWin ? "W" : "L";
      if (type == null) {
        type = r; length = 1; lastDate = g.date;
      } else if (type === r) {
        length += 1; lastDate = g.date;
      } else {
        break;
      }
    }
    byId[p.id] = { playerId: p.id, type, length, lastDate };
  }
  return byId;
}

export function computeLastNDelta(games: Game[], n: number): Record<string, number> {
  // Sum of per-player deltas over each player's last N games
  const byId: Record<string, number[]> = {};
  const sorted = games.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const g of sorted) {
    const ids = [...g.teamA, ...g.teamB];
    for (const id of ids) {
      const d = g.perPlayerDeltas?.[id];
      if (typeof d !== "number") continue; // ignore legacy for improvement trend
      if (!byId[id]) byId[id] = [];
      if (byId[id].length < n) byId[id].push(d);
    }
  }
  const sums: Record<string, number> = {};
  for (const [id, arr] of Object.entries(byId)) sums[id] = Math.round(arr.reduce((s, x) => s + x, 0));
  return sums;
}

export function computeLastNSeries(games: Game[], n: number): Record<string, number[]> {
  const series: Record<string, number[]> = {};
  const sorted = games.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const g of sorted) {
    if (!g.perPlayerDeltas) continue;
    for (const [id, d] of Object.entries(g.perPlayerDeltas)) {
      if (!series[id]) series[id] = [];
      if (series[id].length < n) series[id].push(d);
    }
  }
  return series; // most recent first
}

export function computeActivityLastDays(games: Game[], days: number): Record<string, number> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const counts: Record<string, number> = {};
  for (const g of games) {
    const t = new Date(g.date).getTime();
    if (t < cutoff) continue;
    const ids = [...g.teamA, ...g.teamB];
    for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

export function teamImpact(g: Game): number {
  if (g.perPlayerDeltas) {
    const ids = g.winnerTeam === "A" ? g.teamA : g.teamB;
    return Math.abs(ids.reduce((s, id) => s + (g.perPlayerDeltas?.[id] ?? 0), 0));
  }
  return Math.abs(g.pointsChange);
}

export function recentUpsets(games: Game[], limit = 5): Game[] {
  return games
    .slice()
    .sort((a, b) => teamImpact(b) - teamImpact(a))
    .slice(0, limit);
}

export function winRate(p: Player): number {
  return p.gamesPlayed > 0 ? (p.wins / p.gamesPlayed) : 0;
}
