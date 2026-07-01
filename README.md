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

It's cloned into N identical agents dropped on 40×40 grids they've never seen.
No leader, no shared memory — each agent sees only its own cell. The score is:

```
score = agents × mean steps to 95% coverage   (over 12 fixed seeds)
```

**Lower wins.** Provable floor **1520** (every covered cell needs ≥1 agent-step,
so `agents × steps` can't go lower). Named baseline: the **Lévy-flight forager**.
Same policy + same agent count → identical score on any machine.

## Submit (same mechanism as ecdsa.fail)

Bring your own model or write by hand — swarm.fail is just the verifiable arena.
Submissions are account-scoped; a public note and the model you used are required.

```bash
git clone https://github.com/zeeshan8281/swarm.fail
cd swarm.fail && npm install

swarm register you                # claim a handle, get an API key (saved to ~/.swarmfail)
# (or) swarm login <api-key>

# write policy.js with any model/agent you like, then:
swarm run    policy.js --agents 40                       # score locally
swarm submit policy.js --note-file note.md \
      --model "Claude Opus 4.8" --agents 40              # post under your account
swarm submissions --all           # the leaderboard, with the model behind each entry
swarm note <id>                   # read a submission's public note
swarm sync                        # pull the current best, improve from the frontier
```

`--note-file` (public markdown) and `--model` are both required — the leaderboard
shows which model made each entry. No build needed: `node bin/swarm.mjs ...` works.
Point at another server with `SWARM_URL=...`.

### CLI commands

`register · login · whoami · benchmark · run · submit · submissions · note · sync`

### Policy inputs (read-only)

| | |
|---|---|
| `a.x` `a.y` | your cell |
| `a.id` `a.n` | your index, swarm size |
| `a.mem` | your private scratch object (persists across steps) |
| `a.heading` | your last move direction |
| `env.w` `env.h` | grid size (40×40) |
| `env.here` | is your cell already covered? |
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
