export type WinnerTeam = "A" | "B";

export interface EngineConfig {
  kBase1v1: number;
  kBase2v2: number;
  ratingScale: number; // logistic scale for expectation
  ratingScaleLocal: number; // scale for allocation weights
  surpriseFactor: number; // 0..1 emphasis of upsets
}

export interface ComputeInput {
  teamA: { id: string; rating: number; gamesPlayed: number }[];
  teamB: { id: string; rating: number; gamesPlayed: number }[];
  winnerTeam: WinnerTeam;
  config?: Partial<EngineConfig>;
}

export interface ComputeOutput {
  deltas: Record<string, number>; // integer deltas per player
  summary: {
    teamDeltaA: number;
    teamDeltaB: number;
    expectedA: number;
    expectedB: number;
    weights: Record<string, number>;
    reasons: string[];
  };
}

const DEFAULTS: EngineConfig = {
  kBase1v1: 32,
  kBase2v2: 24,
  ratingScale: 400,
  ratingScaleLocal: 200,
  surpriseFactor: 0.5,
};

const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const logisticElo = (ra: number, rb: number, scale: number) => 1 / (1 + Math.pow(10, (rb - ra) / scale));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

function teamAvgRating(team: { rating: number }[]) {
  if (team.length === 0) return 0;
  return team.reduce((s, p) => s + p.rating, 0) / team.length;
}

function teamUncertainty(team: { gamesPlayed: number }[]) {
  // Higher boost for fewer games
  const boosts = team.map((p) => (p.gamesPlayed < 10 ? 1.25 : p.gamesPlayed < 30 ? 1.1 : 1.0));
  return boosts.reduce((s, x) => s + x, 0) / boosts.length;
}

function allocationWeights(
  team: { id: string; rating: number }[],
  opponents: { rating: number }[],
  ratingScaleLocal: number
): Record<string, number> {
  if (team.length === 1) return { [team[0].id]: 1 };

  const oppRatings = opponents.map((o) => o.rating);
  const weightsRaw = team.map((p) => {
    const m = oppRatings.reduce((s, r) => s + sigmoid((r - p.rating) / ratingScaleLocal), 0) / oppRatings.length;
    const eps = 0.1; // avoid zeros
    return { id: p.id, raw: Math.max(eps, m) };
  });
  const sumRaw = weightsRaw.reduce((s, w) => s + w.raw, 0);
  let weights: Record<string, number> = {};
  for (const w of weightsRaw) weights[w.id] = w.raw / (sumRaw || 1);

  // Clamp in 2v2 for explainability (e.g., 30/70 bounds)
  if (team.length === 2) {
    const ids = team.map((t) => t.id);
    const [a, b] = ids;
    const minW = 0.3;
    const maxW = 0.7;
    const wa = clamp(weights[a], minW, maxW);
    const wb = clamp(1 - wa, minW, maxW);
    weights[a] = wa;
    weights[b] = wb;
  }
  return weights;
}

function roundSplitPreserveSum(values: Record<string, number>, targetSum: number): Record<string, number> {
  // Largest Remainder Method: round but preserve total sum
  const entries = Object.entries(values).map(([id, v]) => ({ id, v, floor: Math.trunc(v), frac: v - Math.trunc(v) }));
  let sumFloor = entries.reduce((s, e) => s + e.floor, 0);
  const diff = Math.round(targetSum - sumFloor);
  entries.sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < Math.abs(diff); i++) {
    const idx = i % entries.length;
    entries[idx].floor += diff > 0 ? 1 : -1;
  }
  const out: Record<string, number> = {};
  for (const e of entries) out[e.id] = e.floor;
  return out;
}

export function computePoints(input: ComputeInput): ComputeOutput {
  const cfg = { ...DEFAULTS, ...(input.config || {}) };
  const { teamA, teamB, winnerTeam } = input;

  const RA = teamAvgRating(teamA);
  const RB = teamAvgRating(teamB);
  const EA = logisticElo(RA, RB, cfg.ratingScale);
  const EB = 1 - EA;
  const SA = winnerTeam === "A" ? 1 : 0;
  const SB = 1 - SA;
  const KA = teamA.length === 1 && teamB.length === 1 ? cfg.kBase1v1 : cfg.kBase2v2;
  const UA = teamUncertainty(teamA);
  const UB = teamUncertainty(teamB);
  const surpriseA = 1 + cfg.surpriseFactor * Math.abs(SA - EA);
  const surpriseB = 1 + cfg.surpriseFactor * Math.abs(SB - EB);

  const deltaTeamAFloat = KA * UA * surpriseA * (SA - EA);
  const deltaTeamBFloat = -(KA * UB * surpriseB * (SA - EA));
  // In theory deltaTeamBFloat ≈ -deltaTeamAFloat; small difference due to U/surprise per side.
  // Force conservation by averaging magnitude and assigning opposite signs.
  const mag = (Math.abs(deltaTeamAFloat) + Math.abs(deltaTeamBFloat)) / 2;
  const deltaTeamA = SA === 1 ? mag : -mag;
  const deltaTeamB = -deltaTeamA;

  // Allocation within teams
  const wA = allocationWeights(teamA, teamB, cfg.ratingScaleLocal);
  const wB = allocationWeights(teamB, teamA, cfg.ratingScaleLocal);

  const deltasFloatA: Record<string, number> = {};
  for (const p of teamA) deltasFloatA[p.id] = deltaTeamA * wA[p.id];
  const deltasFloatB: Record<string, number> = {};
  for (const p of teamB) deltasFloatB[p.id] = deltaTeamB * wB[p.id];

  const deltasA = roundSplitPreserveSum(deltasFloatA, Math.round(deltaTeamA));
  const deltasB = roundSplitPreserveSum(deltasFloatB, Math.round(deltaTeamB));

  const deltas: Record<string, number> = { ...deltasA, ...deltasB };
  const weights: Record<string, number> = { ...wA, ...wB };

  const summary = {
    teamDeltaA: Math.round(deltaTeamA),
    teamDeltaB: Math.round(deltaTeamB),
    expectedA: EA,
    expectedB: EB,
    weights,
    reasons: [
      `teamA_avg=${Math.round(RA)} teamB_avg=${Math.round(RB)}`,
      `expectedA=${EA.toFixed(3)} winner=${winnerTeam}`,
      `uncertaintyA=${UA.toFixed(2)} uncertaintyB=${UB.toFixed(2)}`,
    ],
  };

  return { deltas, summary };
}

