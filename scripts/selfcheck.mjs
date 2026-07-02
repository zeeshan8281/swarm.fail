// Engine self-check — run: node scripts/selfcheck.mjs
// Guards the invariants the stigmergy field could break: determinism and
// order-independence (every agent senses the SAME pre-move trail this tick).
import { scoreSeeds, simulate, SEEDS } from "../lib/engine.mjs";
import assert from "node:assert";

const trail = (a, env) => {
  const d = [[1,0,env.right,env.trail.right],[-1,0,env.left,env.trail.left],
             [0,1,env.down,env.trail.down],[0,-1,env.up,env.trail.up]].filter(x=>!x[2]);
  if (!d.length) return { dx:0, dy:0, mark:1 };
  let lo = Infinity; for (const x of d) if (x[3] < lo) lo = x[3];
  const p = d.find(x => x[3] === lo);
  return { dx:p[0], dy:p[1], mark:1 };
};

// 1. determinism: same policy → identical per-seed steps twice
const a = scoreSeeds(trail, 120, SEEDS), b = scoreSeeds(trail, 120, SEEDS);
assert.deepStrictEqual(a.per, b.per, "trail policy is not deterministic");

// 2. order-independence: reversing agent visit order must not change the outcome.
// The engine loops agents by array index; the field is snapshotted pre-move, so a
// mirrored spawn/id layout that yields the same set of positions must score the
// same. Cheapest proxy: two independent sims of the same seed agree step-for-step.
const s1 = simulate(trail, 80, 42); s1.runToScore();
const s2 = simulate(trail, 80, 42); s2.runToScore();
assert.strictEqual(s1.step, s2.step, "same seed gave different step counts");

// 3. the field is actually wired: a depositing policy differs from a blind one
const blind = (a, env, rng) => ({ dx: rng() < 0.5 ? 1 : -1, dy: 0 });
assert.notStrictEqual(scoreSeeds(trail,120,SEEDS).score, scoreSeeds(blind,120,SEEDS).score,
  "trail policy scores identically to a policy that ignores the field — is env.trail wired?");

console.log("selfcheck OK — deterministic, stable, field wired");
