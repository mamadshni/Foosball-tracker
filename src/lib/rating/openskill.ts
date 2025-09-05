import type { PlayerId } from "../../types/models";
import type { EngineConfig, ComputeInput, ComputeOutput } from "./points";

// Openskill integration: map our 1000-based rating to mu/sigma, update with `rate`, and map back.
// We keep per-player deltas as integer display rating changes.

export interface OpenSkillConfig extends Partial<EngineConfig> {
  scale?: number; // display scaling between mu and our 1000-base rating (rating = 1000 + scale*(mu - 25))
  c?: number;    // conservative factor for ordinal if needed (not used for delta)
}

const DEFAULTS: Required<OpenSkillConfig> = {
  kBase1v1: 32,
  kBase2v2: 24,
  ratingScale: 400,
  ratingScaleLocal: 200,
  surpriseFactor: 0.5,
  scale: 20, // 1 mu step = 20 display points
  c: 3,
};

export async function computePointsOpenSkill(input: ComputeInput, cfg?: OpenSkillConfig): Promise<ComputeOutput> {
  const config = { ...DEFAULTS, ...(cfg || {}) };
  const { teamA, teamB, winnerTeam } = input;
  const openskill = await import("openskill");
  const rating = (openskill as any).rating as (args?: { mu?: number; sigma?: number }) => { mu: number; sigma: number };
  const rate = (openskill as any).rate as (teams: Array<Array<{ mu: number; sigma: number }>>, options?: any) => Array<Array<{ mu: number; sigma: number }>>;

  const toMu = (display: number) => 25 + (display - 1000) / config.scale;
  const toDisplay = (mu: number) => Math.round(1000 + config.scale * (mu - 25));

  const teamARatings = teamA.map((p) => rating({ mu: toMu(p.rating) }));
  const teamBRatings = teamB.map((p) => rating({ mu: toMu(p.rating) }));

  const teams = winnerTeam === "A" ? [teamARatings, teamBRatings] : [teamBRatings, teamARatings];
  const updated = rate(teams, { score: [1, 0] });
  const newA = winnerTeam === "A" ? updated[0] : updated[1];
  const newB = winnerTeam === "B" ? updated[0] : updated[1];

  const deltas: Record<PlayerId, number> = {};
  teamA.forEach((p, i) => {
    const before = p.rating;
    const after = toDisplay(newA[i].mu);
    deltas[p.id] = after - before;
  });
  teamB.forEach((p, i) => {
    const before = p.rating;
    const after = toDisplay(newB[i].mu);
    deltas[p.id] = after - before;
  });

  const teamDeltaA = Math.round(teamA.reduce((s, p) => s + (deltas[p.id] ?? 0), 0));
  const teamDeltaB = Math.round(teamB.reduce((s, p) => s + (deltas[p.id] ?? 0), 0));

  return {
    deltas,
    summary: {
      teamDeltaA,
      teamDeltaB,
      expectedA: 0.5, // Not directly from openskill; optional to compute separately
      expectedB: 0.5,
      weights: {},
      reasons: ["openskill rate applied"],
    },
  };
}
