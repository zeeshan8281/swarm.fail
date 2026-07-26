# swarm.fail

A deterministic swarm benchmark — an Eigen project. **Write one local rule. It's
cloned into a swarm that covers an unknown grid. You get one number.**

Live: https://web-production-54527.up.railway.app

## The idea

You submit a single policy — a pure function run once per agent per step:

```js
function step(a, env, rng) {
  // return a move; dx,dy each in {-1, 0, 1}
  return { dx: 1, dy: 0 };
}
```

It's cloned into N identical agents dropped on 40×40 grids they've never seen —
12 maps from three families: **rooms** (open floor), **braided mazes** (1-cell
corridors and dead ends) and **caves** (organic blobs). One rule has to handle
all three.
No leader — but the swarm shares one brain. Agents coordinate three ways: a
common scratch object every agent reads and writes in real time (`env.shared`,
reset per map — build a collective map, claim cells, leave messages), an
evaporating scent field on the grid (`env.trail`, ant-style), and sensing who's
on the cells next to them (`env.near`). The score is:

```
score = agents × mean steps to 95% coverage   (over 12 fixed seeds)
```

**Lower wins.** Provable floor **1228** (every covered cell needs ≥1 agent-step,
so `agents × steps` can't go lower). Named baseline: the **Lévy-flight forager**.
Same policy + same agent count → identical score on any machine.

## Contribute — fork, add a file, open a PR

Your submission is one file: `submissions/<your-handle>.js`. The git history of
that folder **is** the leaderboard. No accounts — your GitHub handle is your id.

```bash
# 1. fork this repo, then:
node bin/swarm.mjs new you           # scaffolds submissions/you.js
#    ...edit submissions/you.js with any model/agent you like...
node bin/swarm.mjs run submissions/you.js   # score it locally
node bin/swarm.mjs board             # the whole leaderboard, locally

# 2. commit + open a Pull Request
git add submissions/you.js && git commit -m "you: my swarm" && git push
```

**CI scores your PR and comments the number.** If it **beats the current best**,
it auto-merges and the live site redeploys. A run that fails to explore any map
is unranked. Everything is reproducible — the scoring code is in the repo, CI
runs it in the open, you can re-run it yourself.

### Submission file format

```js
// @model Claude Opus 4.8        (the AI model you used, or "human")
// @agents 100                    (how many robots — part of your strategy)
// @note One line on your approach.
function step(a, env, rng) {       // dx,dy each in {-1,0,1}
  // env.up/down/left/right = is that neighbour a wall or edge?
  return { dx: 1, dy: 0 };
}
```

## Auto-deploy setup (one-time)

Either connect the repo in **Railway → project → Settings → Source** (it then
auto-deploys on every merge to `main`), or add a `RAILWAY_TOKEN` repo secret and
the included `.github/workflows/deploy.yml` will deploy for you.

### Policy inputs (read-only)

| | |
|---|---|
| `a.x` `a.y` | your cell |
| `a.id` `a.n` | your index, swarm size |
| `a.mem` | your private scratch object (persists across steps) |
| `a.heading` | your last move direction |
| `env.w` `env.h` | grid size (40×40) |
| `env.here` | is your cell already covered? |
| `env.near` | `{up,down,left,right}` — how many other agents sit on each neighbour cell right now (radius 1, so still no global map) |
| `env.trail` | `{here,up,down,left,right}` — the shared scent field at your cell + neighbours; deposit with `return {..., mark: 0..1}`; evaporates each tick |
| `env.shared` | the swarm's shared brain: one plain object all agents read/write, reset per map. Agents run in fixed id order, so writes are visible to later agents the same tick. Use this — module-level vars leak across maps |
| `rng()` | deterministic 0..1 (no `Math.random` / `Date` — they're blocked) |

Moves are 4-connected, one cell per step; walls clamp.

### Validation gate

A policy that fails to reach 95% coverage on **any** of the 12 seeds is marked
**FAIL** and logged but not ranked — like ecdsa.fail's "all test points must pass."

## Develop

```bash
npm run dev      # Next.js dev server
npm run build    # production build
```

Stack: Next.js + React 19 + Tailwind v4, eigen-design tokens, Postgres
(`DATABASE_URL`) for the leaderboard with a local JSON-file fallback. The
scoring engine (`lib/engine.mjs`) is one source of truth shared by the browser,
the server sandbox, and the CLI.
