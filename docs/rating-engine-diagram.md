# Rating Engine — System & Flow Diagrams

This document visualizes the design in `docs/rating-engine.md`. It covers both tracks:
1) Dynamic Elo-style baseline (Phase 1)
2) TrueSkill-like (openskill concepts) implemented in-house (Phase 2)

Legend: [Box] = component/module, -> = data flow, ~> = derived/compute

System Overview

    +--------------------+            +---------------------+
    | Players Store      |            | Match Input         |
    | - id, rating       |            | - teamA, teamB      |
    | - gamesPlayed      |            | - winnerTeam        |
    | (- mu, sigma)      |            | - timestamp         |
    +---------+----------+            +----------+----------+
              |                                  |
              v                                  v
    +---------+----------------------------------+--------+
    |           Rating Engine (src/lib/rating)            |
    |   - Router: simple vs dynamic vs trueskill-like     |
    |   - Config: K, scales, caps, safeguards             |
    +---------+------------------+------------------------+
              |                  |
              |                  |
              v                  v
    +---------+---------+   +----+-----------------------+
    | Elo-style Path    |   | TrueSkill-like Path        |
    | - team expect     |   | - priors (mu,sigma)        |
    | - surprise factor |   | - team factor graph        |
    | - team delta      |   | - posterior (mu',sigma')   |
    | - allocation      |   | - ordinal/display mapping  |
    +---------+---------+   +----+-----------------------+
              |                       |
              +-----------+-----------+
                          v
                +---------+----------------------------+
                | Outputs                            |
                | - per-player deltas (points)       |
                | - updated rating (and mu/sigma)    |
                | - match summary (expected, weights)|
                +---------+----------------------------+
                          |
                          v
                +---------+----------------------------+
                | Stores & UI                         |
                | - Update Players Store              |
                | - Append Game log (pointsChange)    |
                | - UI: PlayerDetail, GamesList       |
                +-------------------------------------+

Match Processing (Elo-style Baseline)

    [Match] -> [Collect Ratings]
      |            |
      |            +-- teamA ratings -> avg(R_A)
      |            +-- teamB ratings -> avg(R_B)
      v
    [Expectation]
      E_A = 1/(1+10^((R_B-R_A)/scale))
      E_B = 1 - E_A
      |
      v
    [K & Multipliers]
      K = K_1v1 or K_2v2
      U = team uncertainty (from gamesPlayed)
      S = surprise = 1 + s*|S_A - E_A|
      |
      v
    [Team Delta]
      Δ_teamA = clamp(K * U_A * S * (S_A - E_A))
      Δ_teamB = -Δ_teamA
      |
      v
    [Allocation]
      For player i on team: w_i = f(matchup difficulty)
      normalize w_i; clamp (e.g., 0.3..0.7 in 2v2)
      Δ_i = Δ_team * w_i
      |
      v
    [Safeguards]
      clamp |Δ_i| <= deltaMaxPerPlayer; >= deltaMinPerPlayer
      |
      v
    [Persist & Emit]
      rating_i' = rating_i + Δ_i
      log pointsChange per player (or team summary)
      return deltas + summary (expected, weights, reasons)

Allocation Functions (2v2)

    Option A: inverse-rating vs opponents
      d_i = σ((avgOpp - r_i)/localScale)
      w_i ∝ max(ε, d_i)

    Option B: matchup-average (recommended)
      m_i = avg( σ((r_opp - r_i)/localScale) )
      w_i ∝ max(ε, m_i)

    Option C: capped underdog boost (Shapley-inspired)
      w_low = clamp(α * σ((avgOpp - r_low)/localScale), 0.3, 0.7)
      w_high = 1 - w_low

TrueSkill-like Flow (openskill concepts, in-house)

    [Players] --> [Priors]
      rating_i ~ N(mu_i, sigma_i^2)
      |
      v
    [Performance]
      perf_i ~ N(mu_i, (beta^2 + sigma_i^2))
      |
      v
    [Team Sum]
      teamPerf_A = Σ perf_i in A
      teamPerf_B = Σ perf_i in B
      |
      v
    [Outcome Likelihood]
      compare teamPerf_A vs teamPerf_B (no draw)
      |
      v
    [Posterior Update]
      infer mu', sigma' for each player (message passing)
      |
      v
    [Display Mapping]
      ordinal_i = mu'_i - c*sigma'_i   (conservative)
      uiRating_i = 1000 + scale*(mu'_i - mu0)
      Δ_display_i = uiRating_i - uiRating_i(prev)
      |
      v
    [Persist]
      store mu', sigma', and/or derived uiRating

Integration Points (App)

    - src/lib/rating/points.ts : computePoints() (Phase 1)
    - src/lib/rating/trueskill.ts : computeTrueSkill() (Phase 2, optional)
    - store/games.tsx : call engine, write per-player deltas, log points
    - store/players.tsx : apply rating updates (and later mu/sigma)
    - pages/NewGame.tsx : shows expected vs actual, confirmation
    - pages/PlayerDetail.tsx : shows split weights, upset badges

State & Migration

    +-----------------------------+
    | Player model (today)       |
    |  id, name, rating, W/L/G   |
    +--------------+--------------+
                   |
                   v
    +--------------+--------------+
    | Player model (Phase 2)     |
    |  id, name, rating (display)|
    |  mu, sigma (canonical)     |
    +-----------------------------+

Feature Flags

    Settings -> Scoring Mode: [Simple 20/30] [Dynamic Elo] [TrueSkill-like]
      - Engine router selects implementation
      - Same UI surfaces; different explanation strings

Error Handling & Invariants

    - Sum of all player deltas in a match ≈ 0 (closed system)
    - Caps prevent runaway changes
    - Hooks/calls are pure (no side effects) until store update stage

