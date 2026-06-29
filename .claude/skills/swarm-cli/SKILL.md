---
name: swarm-cli
description: >-
  Use when helping a solver or coding agent compete on the swarm.fail benchmark
  via the `swarm` CLI: run, submit, and board. Covers the policy interface
  (one local step function), the agents×steps product score, the coverage floor
  (1520), the OK/FAIL validation gate, local reproducibility, the score.json /
  results.tsv outputs, and the SWARM_URL override. swarm.fail is a fixed,
  deterministic benchmark — write one local rule, it's cloned into a swarm that
  covers an unknown grid, you get one number. Lower wins.
---

# swarm.fail CLI

A deterministic swarm benchmark in the shape of ecdsa.fail. You submit **one
local policy**; it is cloned into N identical agents dropped on grids they've
never seen (no shared brain, each sees only its own cell). The scalar is
**agents × mean-steps-to-95%-coverage** over a fixed public seed set. Lower wins.
Same policy + same N → identical score on any machine; anyone re-runs to verify.

## The one rule you write

A pure function, run once per agent per step, in a `.js` file:

```js
function step(a, env, rng) {
  // return a move; dx,dy each in {-1, 0, 1}
  return { dx: 1, dy: 0 };
}
```

Read-only inputs (there is **no** global map and **no** way to see other agents):

- `a.x`, `a.y` — your cell
- `a.id` — your index, `a.n` — swarm size
- `a.mem` — your private scratch object (persists across steps)
- `a.heading` — your last move direction (0=+x,1=-x,2=+y,3=-y)
- `env.w`, `env.h` — grid size (40×40)
- `env.here` — is your current cell already covered?
- `rng()` — deterministic 0..1 (do **not** use `Math.random`, `Date`, etc. —
  the sandbox blocks them and non-determinism is rejected)

Moves are 4-connected, one cell per step; walls clamp. If both dx and dy are
given, dy is dropped.

## Commands

```bash
swarm run    <file.js> [--agents N] [--name X] [--note "..."]
swarm submit <file.js> --name X [--agents N] [--url URL]
swarm board  [--url URL]
```

- **`run`** — score locally with the same engine the server uses. Prints
  per-seed steps, OK/FAIL, the product score, and % above the floor. Writes
  `score.json` and appends a row to `results.tsv`
  (`timestamp, name, agents, mean_steps, score, ok, note`).
- **`submit`** — score locally, then POST to the leaderboard. The CLI compares
  its local score to the server's and warns on any mismatch (there should be
  none — same engine).
- **`board`** — print the live leaderboard (rank, score, agents, steps, name).

`--agents` defaults to 120 (clamped 1..500). Server URL defaults to the public
deployment; override with `--url` or the `SWARM_URL` env var.

Run via `npx swarm ...` from the repo, or `node bin/swarm.mjs ...`.

## Scoring & the validation gate

- **Score = N × mean steps** to reach 95% coverage, averaged over the fixed
  public seeds. Lower wins.
- **Floor = 1520** (= 0.95 × 1600 cells). Provable: every covered cell needs at
  least one agent-step, so N × steps ≥ cells covered. You cannot beat it.
- **OK/FAIL gate** (like ecdsa.fail's "all test points must pass"): a policy
  that fails to reach 95% on *any* seed within the step cap is marked **FAIL**
  and logged but **not ranked**. Too few agents → FAIL.

Reference points: Random Walk ≈ 11400, **Lévy Flight ≈ 7680 (the baseline)**,
best-known Lane Sweep ≈ 2920 (one agent per column, N≈40). Everything between
2920 and 1520 is open frontier.

## How to improve a score

The floor rewards **no wasted agent-steps**: no idle agents, no re-covering
cells already visited. Two levers, multiplied together:

1. **Fewer agents (lower N)** — but not so few that coverage FAILs.
2. **Fewer steps** — spread the swarm so agents partition the grid with minimal
   overlap. Use `a.id` to assign each agent a disjoint region (e.g. a column or
   block) so coverage emerges with no communication.

Sweet spot is usually ~one agent per column. Beyond that, reduce the cost of
agents reaching their region and eliminate any double-covering.

## Notes

- Honesty is by reproduction: the engine is identical in browser, server, and
  CLI. `swarm board` plus the site's per-entry "verify" re-run any submission.
- To point at a private/local server: `SWARM_URL=http://localhost:3000 swarm board`.
