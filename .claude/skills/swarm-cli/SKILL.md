---
name: swarm-cli
description: >-
  Use when helping a solver or coding agent compete on the swarm.fail benchmark
  via the `swarm` CLI: new, run, board, benchmark. Covers the policy interface
  (one local step function), the agents×steps product score, the coverage floor
  (931), the OK/FAIL validation gate, local reproducibility, the score.json
  output, coordination via env.shared/env.trail/env.near, and the fork+PR flow.
  swarm.fail is a fixed, deterministic benchmark — write one local rule, it's
  cloned into a swarm that covers an unknown grid, you get one number. Lower wins.
---

# swarm.fail CLI

A deterministic swarm benchmark in the shape of ecdsa.fail. You submit **one
local policy**; it is cloned into N identical agents dropped on grids they've
never seen. No leader and no global map, but the swarm **coordinates**: one shared brain it
all reads and writes, plus scent on the grid (see `env.shared`/`env.trail`). The scalar is
**agents × mean-steps-to-95%-coverage** over a fixed public seed set. Lower wins.
Same policy + same N → identical score on any machine; anyone re-runs to verify.

## The one rule you write

A pure function, run once per agent per step, in a `.js` file:

```js
function step(a, env, rng) {
  // return a move; dx,dy each in {-1, 0, 1}; optional mark 0..1 drops scent
  return { dx: 1, dy: 0 };
}
```

Inputs. Sensing is local (radius 1) and read-only; `a.mem` and `env.shared` are
yours to write:

- `a.x`, `a.y` — your cell
- `a.id` — your index, `a.n` — swarm size
- `a.mem` — your private scratch object (persists across steps)
- `a.heading` — your last move direction (0=+x,1=-x,2=+y,3=-y)
- `env.w`, `env.h` — grid size (40×40)
- `env.up/down/left/right` — is that neighbour a wall or edge?
- `env.here` — is your current cell already covered?
- `env.near` — `{up,down,left,right}`: how many other agents sit on each
  neighbour cell right now (occupancy — sense the crowd, disperse)
- `env.trail` — `{here,up,down,left,right}`: the shared, evaporating **scent
  field** at your cell + neighbours. Deposit with `return {..., mark: 0..1}`.
  Ant-style stigmergy — information left on the grid for the swarm's future self
- `env.shared` — the swarm's **shared brain**: one plain object every agent
  reads and writes, reset for each map. Build a collective map, claim cells,
  pass messages. Agents step in fixed id order, so a write lands for later
  agents the same tick. Use this, never module-level vars — those leak across
  maps and make a run non-reproducible. The current best policy is built on it
- `rng()` — deterministic 0..1 (do **not** use `Math.random`, `Date`, etc. —
  the sandbox blocks them and non-determinism is rejected)

Moves are 4-connected, one cell per step; walls clamp. If both dx and dy are
given, dy is dropped. Set your agent count with a `// @agents N` header line
(default 120, clamped 1..500).

## Commands

```bash
swarm new  <handle>     scaffold submissions/<handle>.js
swarm run  <file.js>    score a policy locally
swarm board             score the whole leaderboard locally
swarm benchmark         show the fixed task
```

- **`new`** — scaffold `submissions/<handle>.js` with the header + a starter rule.
- **`run`** — score locally with the same engine the server uses. Prints
  per-seed steps, OK/FAIL, the product score, and % above the floor. Writes
  `score.json` (local scratch, gitignored). Agent count is read from the file's
  `// @agents` header, not a flag.
- **`board`** — score the whole leaderboard locally (built-in references +
  every committed submission).

Run via `npx swarm ...` from the repo, or `node bin/swarm.mjs ...`.

**To enter:** fork the repo, add `submissions/<handle>.js`, open a PR. CI scores
it and comments the number; if it beats the current best it auto-merges and the
live board redeploys. There is no account, no API key, no `submit` command —
your GitHub handle is your id and the git history of `submissions/` is the board.

## Scoring & the validation gate

- **Score = N × mean steps** to reach 95% coverage, averaged over the 12 fixed
  public seeds. Lower wins.
- **Maps come from three families**, one per seed (`seed % 3`): rooms (open
  floor), braided mazes (1-cell corridors, dead ends), caves (organic blobs).
  4 of each in the 12 seeds — a policy tuned for open floor will FAIL the mazes.
- **Floor = 931** (= mean of ⌈0.95 × open cells⌉ per map; the maps have walls,
  so it's ~931, not 0.95×1600). Provable: every covered cell needs at least one
  agent-step, so N × steps ≥ cells covered. You cannot beat it.
- **OK/FAIL gate** (like ecdsa.fail's "all test points must pass"): a policy
  that fails to reach 95% on *any* seed within the step cap is marked **FAIL**
  and logged but **not ranked**. Too few agents → FAIL.

Reference points on the current board: Dispersed Walk 18360, Random Walk 9840,
**Lévy Flight 7080 (the baseline landmark)**, Bounce Sweep FAIL (a structured
serpentine drowns in the mazes). Best-known is **hive-mind 1740** (shared brain
+ stigmergy). Everything between 1740 and the 931 floor is open frontier.

## How to improve a score

The floor rewards **no wasted agent-steps**: no idle agents, no re-covering
cells already visited. Levers, roughly in order of payoff:

1. **Share a map in `env.shared`.** The biggest single win available. Write the
   cell you're on into a collective set, walk to an open neighbour nobody has
   stood on, and claim your destination so two agents never chase the same
   fresh cell. That is hive-mind, the current best. Scent (`mark`) is the
   weaker-but-still-strong version of the same idea: steer to the
   *least-scented* open neighbour so the swarm stops re-covering ground — how
   trail-blazer roughly halves a structured solo sweep. Bonus: both are nearly
   **flat across N**, so they don't need a hand-tuned agent count to win.
2. **Disperse early** with `env.near` — flip/sidestep away from crowded
   neighbours so agents don't stack up and waste the first moves clumped.
3. **Hold a heading, but stay reactive.** Long correlated runs cover more new
   ground per step than a random walk — but a *rigid* serpentine now FAILs: the
   braided mazes are 1-cell corridors, and Bounce Sweep (which used to beat
   Lévy on open floor) never finishes them. Commit to a direction while it's
   productive, re-decide the moment the walls say otherwise.
4. **Tune N** — fewer agents lowers the N multiplier but raises steps (and can
   FAIL if too sparse); more agents lowers steps but raises the multiplier.
   A coordinating rule is far less sensitive to this than a solo one.

## Notes

- Honesty is by reproduction: the engine is identical in browser, server, and
  CLI. `swarm board` plus the site's per-entry "verify" re-run any submission.
- Any engine change (new env channels, map tweaks) resets the leaderboard —
  old scores are on different physics. Re-run `swarm board` after pulling.
