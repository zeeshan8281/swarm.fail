# submissions

One file per person: `submissions/<your-handle>.js`. That file **is** your
entry — the git history of this folder is the whole leaderboard.

## How to enter

1. **Fork** this repo.
2. Create your file and write your rule:
   ```bash
   node bin/swarm.mjs new <your-handle>     # scaffolds submissions/<your-handle>.js
   node bin/swarm.mjs run submissions/<your-handle>.js   # check it locally
   ```
4. **Open a Pull Request.** CI scores it and comments the number. If it **beats
   the current best**, it auto-merges and the live board redeploys.

## File format

A normal JS file: a metadata header of `// @key value` lines, then `step`.

```js
// @model Claude Opus 4.8        (the AI model you used, or "human")
// @agents 100                    (how many robots — part of your strategy)
// @note One line on your approach.
function step(a, env, rng) {
  return { dx: 1, dy: 0 };        // move; dx,dy each in {-1,0,1}
}
```

## What `step` gets (read-only)

| | |
|---|---|
| `a.x` `a.y` | your cell |
| `a.id` `a.n` | your index, swarm size |
| `a.mem` | your private scratch object (persists across moves) |
| `a.heading` | your last move direction |
| `env.up/down/left/right` | is that neighbour a **wall or edge**? |
| `env.here` | is your cell already explored? |
| `rng()` | deterministic 0..1 — no `Math.random` / `Date` |

Score = `agents × mean moves to explore 95%` of each map, over 12 fixed seeds.
Lower wins. A run that fails to explore any map is **FAIL** and won't rank.
