# Foosball Rating & Points Engine — Design Proposal

Author: You + Codex (data science, game theory, React)

Status: Draft for review

Scope: Define how we calculate post‑match rating/points adjustments for 1v1 and 2v2, with dynamic rewards/penalties that reflect expectations, skill gaps, uncertainty, and team composition.

Goals

- Fair: Upsets grant more points; expected wins grant fewer.
- Stable: Ratings converge and resist exploitation (smurfing, farming).
- Transparent: Each change can be explained to players.
- Extensible: Start simple (Elo‑like), allow TrueSkill/openskill integration later.
- Back‑compatible: Can map to current 1000‑based ratings.

Key Concepts

- Rating: A scalar skill number the UI displays (today: `rating`, base 1000). Optionally, a distribution (`mu`, `sigma`) when using openskill/TrueSkill.
- Uncertainty: Confidence in a rating. Lower uncertainty means smaller changes; new or inactive players have higher uncertainty and change faster.
- Expectation: Probability a side should win given ratings. Surprising outcomes move ratings more.
- Allocation: Split a team’s rating delta among its members to reflect who was “carried” or “carrying”.

Two Implementation Tracks

1) Pragmatic Elo‑style (Phase 1 — quick to ship)
   - Scalar ratings only.
   - Team strength = sum (or average) of member ratings.
   - Expected score uses a logistic function.
   - K‑factor scales by uncertainty and match importance (1v1 vs 2v2).
   - Team delta = K × (actual − expected).
   - Per‑player allocation weights favor the less‑rated teammate in an upset and dampen the more‑rated teammate when the win was “supposed” to happen.

2) openskill.js (TrueSkill‑style) (Phase 2 — advanced)
   - Each player has a Gaussian skill `Rating(mu, sigma)`.
   - Team performance is the sum of Gaussians; posterior inference updates `mu` and `sigma`.
   - UI rating is the conservative estimate: `ordinal = mu − c * sigma` (c≈3).
   - Parameters: `beta` (match performance noise), `tau` (skill drift), `drawProbability`.
   - Supports ties, multi‑team, uneven team sizes, leagues.

The two tracks can coexist: keep current `rating` for display and add internal `mu/sigma`. We can migrate gradually and/or compute deltas via openskill then map to our 1000 scale.

Phase 1: Elo‑style Engine (Recommended Baseline)

Inputs

- Players: `{ id, rating, gamesPlayed, ... }` for all participants.
- Match: `{ teamA: PlayerId[], teamB: PlayerId[], winnerTeam: 'A'|'B' }`.
- Config:
  - `kBase1v1 = 32`, `kBase2v2 = 24` (typical Elo magnitudes).
  - `uncertaintyBoost(newness)` — e.g., `1.25` for < 10 games, `1.1` for < 30, then `1.0`.
  - `ratingScale = 400` for logistic expectation.
  - Caps: `deltaMaxPerPlayer = 50`, `deltaMinPerPlayer = 1`.

Team Strength and Expectation

- Team rating: `R_A = avg(ratings of teamA)`, `R_B = avg(ratings of teamB)` (sum also works; average is invariant to team size).
- Expected win probability (Elo logistic):
  - `E_A = 1 / (1 + 10^((R_B − R_A) / ratingScale))`
  - `E_B = 1 − E_A`
- Actual score: `S_A = winnerTeam==='A' ? 1 : 0`, `S_B = 1 − S_A`.

Team Delta

- Base K: `K = kBase1v1` if each team has one player, else `kBase2v2`.
- Uncertainty factor:
  - For each player p: `u_p = uncertaintyBoost(p.gamesPlayed)`.
  - Team uncertainty: `U_A = avg(u_p for p in teamA)`, `U_B = avg(u_p for p in teamB)`.
- Surprise multiplier (optional): emphasize large upsets.
  - `surprise = 1 + s * |S_A − E_A|` with `s` in `[0, 1]` (default `0.5`).
- Team delta magnitude:
  - `Δ_teamA = clamp( K * U_A * surprise * (S_A − E_A), −cap, +cap )`
  - `Δ_teamB = −Δ_teamA`

Per‑Player Allocation (carry/underdog aware)

We distribute `Δ_team` among teammates with weights `w_i` that favor the underdog and contextual difficulty:

Option A — Inverse‑rating weight (simple, effective)

- Let `R_team = avg(team ratings)` and `R_opp = avg(opponent ratings)`.
- Define each player’s difficulty score:
  - `d_i = sigmoid( (R_opp − r_i) / ratingScale_local )` where `ratingScale_local ≈ 200`.
  - Intuition: a player far below opponents gets `d_i` near 1 (more credit), far above gets near 0 (less credit).
- Weights:
  - `w_i_raw = max(ε, d_i)` with small `ε = 0.1` to avoid zero weight.
  - Normalize: `w_i = w_i_raw / sum(w_j_raw in team)`.
- Player delta: `Δ_i = Δ_team * w_i`.
- Effect: In a 2v2 where one teammate is much lower rated, that player takes a larger share when the team wins (and loses less when the team loses). The stronger teammate still gains/loses, but less than their partner.

Option B — Matchup‑based weight (more granular)

- Compare a player to each opponent:
  - `m_i = avg( sigmoid((r_opp − r_i) / ratingScale_local) for r_opp in opponentRatings )`.
  - `w_i_raw = max(ε, m_i)`; normalize as above.
- Advantage: Feels fairer when opponents have very different ratings.

Option C — Shapley‑inspired (theoretically sound, heavier)

- Estimate marginal contribution by considering subsets of the team and expected win probability against opponents.
- For 2v2, a practical proxy:
  - `w_low = α * sigmoid((R_opp − r_low)/ratingScale_local)`
  - `w_high = 1 − w_low` with bounds `(0.3, 0.7)`.
- Gives underdog the majority, but caps extremes to avoid absurd splits.

Recommended default: Option B (matchup‑based) with bounding:

- After normalization, clamp weights: `w_i ∈ [0.3, 0.7]` for 2v2; for 1v1, `w=1`.

Safeguards & Quality Controls

- Per‑player clamp: `|Δ_i| ≤ deltaMaxPerPlayer` and `|Δ_i| ≥ deltaMinPerPlayer` (unless zero expected movement).
- Rating floor/ceiling: prevent going below 0 or above a very high cap (optional).
- Inactivity decay: slowly increase `sigma` (or uncertaintyBoost) for inactive players, so they adjust faster on return.
- Anti‑smurf: when a player is new (few games), allow faster movement but also require more games before they appear on leaderboards.
- No‑spam: Optional cool‑down or diminishing returns for many games in a short period.

Examples (intuition)

1v1, 1200 beats 1000

- `E_1200 ≈ 0.91`. Team delta small: winner gains ~3–5; loser loses ~3–5.

1v1, 1000 beats 1200 (upset)

- `E_1000 ≈ 0.09`. Winner gains ~25–35; loser loses similar magnitude.

2v2, (1400, 950) beats (1300, 1250)

- Team expectation low; big upset → large team delta.
- Allocation: 950 player receives larger positive share, 1400 gets moderate; losers split loss weighted toward the 1250 who “underperformed” relative to 1300 (via matchup weights).

Phase 2: openskill.js Integration (TrueSkill)

When we adopt openskill, we represent players by distributions and update with `rate(teams, options)`.

- Initialize: `rating()` gives `{ mu, sigma }`. Typical defaults: `mu=25`, `sigma=25/3`. We can scale to UI rating: `display = 1000 + scale*(mu − 25)`; `ordinal = mu − 3*sigma` for conservative display if desired.
- Update: `rate([teamA, teamB], { score: [1, 0] })` returns new ratings. Then map `Δ_ui = display(new) − display(old)` to store per‑game `pointsChange` if we want to keep that field, or store `mu/sigma` directly in the player store.
- Parameters to tune:
  - `beta` (skill performance variability): higher makes results noisier → larger swings.
  - `tau` (dynamics): non‑zero allows slow drift over time.
  - `drawProbability`: we can keep near zero for foosball.
- Team size > 1: openskill handles team sum automatically and properly splits updates based on relative uncertainties.

Mapping Between Models

- If we maintain both `rating` and `mu/sigma`, choose one to be canonical:
  - Canonical TrueSkill: store `mu/sigma`; derive UI `rating = round(1000 + scale*(mu − 25))` and `pointsChange` = delta of display.
  - Canonical Elo: keep `rating`; when migrating to TrueSkill, initialize `mu` from `rating` (`mu = 25 + (rating − 1000)/scale`, `sigma = 25/3` initially) and let `sigma` shrink with play.

API Proposal

TypeScript signatures (to be implemented in `src/lib/rating/points.ts` in the next step):

```
export type WinnerTeam = 'A' | 'B';

export interface EngineConfig {
  kBase1v1: number;
  kBase2v2: number;
  ratingScale: number;          // logistic scale, default 400
  ratingScaleLocal: number;     // for allocation, default 200
  surpriseFactor: number;       // 0..1, default 0.5
  deltaMaxPerPlayer: number;    // cap, e.g. 50
  deltaMinPerPlayer: number;    // floor, e.g. 1
}

export interface ComputeInput {
  teamA: { id: string; rating: number; gamesPlayed: number }[];
  teamB: { id: string; rating: number; gamesPlayed: number }[];
  winnerTeam: WinnerTeam;
  config?: Partial<EngineConfig>;
}

export interface ComputeOutput {
  deltas: Record<string, number>; // per-player delta
  summary: {
    teamDeltaA: number;
    teamDeltaB: number;
    expectedA: number;
    expectedB: number;
    weights: Record<string, number>; // allocation weights used
    reasons: string[];               // human-readable notes
  };
}

export function computePoints(input: ComputeInput): ComputeOutput { /* impl */ }
```

For openskill (phase 2), an alternative function:

```
export interface TrueSkillInput {
  teamA: { id: string; mu: number; sigma: number }[];
  teamB: { id: string; mu: number; sigma: number }[];
  winnerTeam: WinnerTeam;
  options?: { beta?: number; tau?: number; drawProbability?: number };
}

export interface TrueSkillOutput {
  updated: Record<string, { mu: number; sigma: number; display: number; deltaDisplay: number }>;
  summary: { ordinal: Record<string, number> };
}
```

UI/UX Considerations

- Show “Expected vs Actual” on the match confirmation screen.
- In Player Detail, annotate large swings with badges (e.g., “Upset +28”).
- Tooltip over points change: “Expected 23% to win, underdog bonus applied.”
- Optionally expose weight split in 2v2 to explain carry.

Data Persistence

- Phase 1: Keep `rating` numeric. Store per‑game `pointsChange` (sum of absolute team deltas divided across players). Note: once per‑player deltas exist, consider storing individual deltas for auditability.
- Phase 2: Add `mu`, `sigma` to player model; use them as canonical and derive `rating`/UI display.

Testing Plan

- Deterministic test cases for symmetric matches (no change), large underdog upsets (large change), and mixed 2v2 (carry split).
- Property tests: total delta for a match should sum to zero (closed system) unless we intentionally add inflation/deflation.
- Regression tests to validate caps and floors.

Next Steps (after your review)

1) Implement `src/lib/rating/points.ts` with Phase 1 algorithm (Option B allocation) and ship behind a feature flag.
2) Add a toggle in settings to switch between “Simple (fixed 20/30)” and “Dynamic”.
3) Add an explainer tooltip in New Game confirmation.
4) Spike openskill integration (Phase 2) and design migration to `mu/sigma`.

