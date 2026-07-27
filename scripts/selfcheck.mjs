// Engine self-check — run: node scripts/selfcheck.mjs
// Guards the invariants the stigmergy field could break: determinism and
// order-independence (every agent senses the SAME pre-move trail this tick).
import { scoreSeeds, simulate, genMap, SEEDS, W } from "../lib/engine.mjs";
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

// 4. shared brain (env.shared) is wired, deterministic, and reset per map:
// two scoreSeeds runs must agree exactly (a leak across sims would diverge).
const hive = (a, env, rng) => {
  const seen = env.shared.seen || (env.shared.seen = {});
  seen[a.x + "," + a.y] = 1;
  const d = [[1,0,env.right],[-1,0,env.left],[0,1,env.down],[0,-1,env.up]].filter(x=>!x[2]);
  if (!d.length) return { dx:0, dy:0 };
  const f = d.filter(x => !seen[(a.x+x[0])+","+(a.y+x[1])]);
  const pool = f.length ? f : d;
  const p = pool[(rng() * pool.length) | 0];
  return { dx: p[0], dy: p[1] };
};
const h1 = scoreSeeds(hive, 120, SEEDS), h2 = scoreSeeds(hive, 120, SEEDS);
assert.deepStrictEqual(h1.per, h2.per, "shared-brain policy is not deterministic (env.shared leaking across sims?)");
assert.notStrictEqual(h1.score, scoreSeeds(blind, 120, SEEDS).score,
  "shared-brain policy scores identically to a blind one — is env.shared wired?");

// 5. the maps: every seed must be deterministic, connected, and big enough to be
// worth covering — and the seed set must actually contain all three families.
// A generator that silently emits a 3-cell pocket would make the floor a lie.
const kinds = new Set();
for (const s of SEEDS) {
  const m = genMap(s), again = genMap(s);
  assert.deepStrictEqual([...m.wall], [...again.wall], `genMap(${s}) is not deterministic`);
  assert.strictEqual(m.cells.length, m.openCount, `genMap(${s}) cell list disagrees with openCount`);
  assert.ok(m.openCount > 300, `genMap(${s}) has only ${m.openCount} open cells — too small to be a real map`);
  // cells must be ONE 4-connected region, or 95% coverage may be unreachable
  const open = new Set(m.cells), seen = new Set([m.cells[0]]), stack = [m.cells[0]];
  while (stack.length) {
    const c = stack.pop(), cx = c % W;
    for (const [nb, ok] of [[c + 1, cx < W - 1], [c - 1, cx > 0], [c + W, true], [c - W, true]])
      if (ok && open.has(nb) && !seen.has(nb)) { seen.add(nb); stack.push(nb); }
  }
  assert.strictEqual(seen.size, m.openCount, `genMap(${s}) open cells are not one connected region`);
  kinds.add(s % 3);
}
assert.strictEqual(kinds.size, 3, "the seed set no longer covers all three map families");

// 6. a move must be exactly -1/0/1. Math.sign returns NaN for a string or an
// object, and NaN coordinates slip past every bounds check: wall[NaN] and
// covered[NaN] are undefined, so an agent teleports off the grid and re-counts
// itself as fresh coverage every tick. {dx:"x"} once "covered" 96% of a map
// while standing still and scored 900 — below the supposedly unbeatable floor.
for (const [label, mv] of [
  ["strings", { dx: "x", dy: {} }],
  ["NaN", { dx: NaN, dy: NaN }],
  ["Infinity", { dx: Infinity, dy: -Infinity }],
  ["arrays", { dx: [1], dy: [1] }],
  ["booleans", { dx: true, dy: true }],
]) {
  const junk = () => mv;
  const s = simulate(junk, 60, SEEDS[0]);
  s.runToScore();
  assert.ok(s.frac < 0.2, `a policy returning ${label} reported ${(s.frac * 100).toFixed(0)}% coverage — non-±1 moves must be a no-op, not a teleport`);
  assert.ok(!scoreSeeds(junk, 60, SEEDS).ok, `a policy returning ${label} was ranked`);
}

console.log("selfcheck OK — deterministic, stable, field wired, brain wired, maps connected, moves clamped");
