/*
 * Deterministic swarm engine — THE single source of truth.
 *
 * Plain JS (no types) so the EXACT same code runs everywhere:
 *   - the browser arena (compiled below)
 *   - the server sandbox (sandbox.ts injects ENGINE_SRC into a vm)
 *   - the `swarm` CLI (imports the compiled fns directly)
 * One string => the number is reproducible by anyone who runs it.
 *
 * Task: N agents, each running ONE local policy, cover an unknown 40×40 grid.
 *   policy: step(a, env, rng) -> {dx,dy},  dx,dy ∈ {-1,0,1}
 *   no globals, no DOM, no time, no Math.random — only the seeded rng().
 *
 * Score (lower wins): agents × mean-steps-to-95%-coverage, over the public
 * seed set. Provable floor = ceil(0.95 × 1600) = 1520, because every covered
 * cell needs ≥1 agent-step: N × steps ≥ cells covered. Approach the floor.
 */
export const ENGINE_SRC = String.raw`
var W = 40, H = 40, TARGET = 0.95, CAP = 4000;
// Published, fixed seed set — the analog of ecdsa's 9024 test points.
// Policies can't see the seed/map (local observation only), so this can't be
// gamed; more seeds just lowers variance.
var SEEDS = [1, 2, 3, 7, 42, 101, 256, 777, 1009, 2024, 31337, 65535];

function mulberry32(seed) {
  var s = seed >>> 0;
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate(step, n, seed) {
  var spawn = mulberry32((seed * 2654435761) >>> 0);
  var covered = new Uint8Array(W * H);
  var coveredCount = 0;
  var agents = [];
  for (var i = 0; i < n; i++) {
    var x = Math.min(W - 1, Math.floor(spawn() * W));
    var y = Math.min(H - 1, Math.floor(spawn() * H));
    agents.push({ id: i, n: n, x: x, y: y, heading: 0, mem: {} });
    var k0 = y * W + x;
    if (!covered[k0]) { covered[k0] = 1; coveredCount++; }
  }
  var rngs = agents.map(function (a) { return mulberry32((seed * 97 + a.id * 1009 + 1) >>> 0); });
  var env = { w: W, h: H, here: false };
  var step_ = 0;

  function tick() {
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      env.here = covered[a.y * W + a.x] === 1;
      var mv;
      try { mv = step(a, env, rngs[i]); } catch (e) { mv = { dx: 0, dy: 0 }; }
      var dx = Math.sign((mv && mv.dx) || 0);
      var dy = Math.sign((mv && mv.dy) || 0);
      if (dx && dy) dy = 0;
      var nx = a.x + dx, ny = a.y + dy;
      if (nx < 0 || nx >= W) nx = a.x;
      if (ny < 0 || ny >= H) ny = a.y;
      a.x = nx; a.y = ny;
      a.heading = dx ? (dx > 0 ? 0 : 1) : (dy > 0 ? 2 : 3);
      var k = ny * W + nx;
      if (!covered[k]) { covered[k] = 1; coveredCount++; }
    }
    step_++;
    return coveredCount / (W * H);
  }

  return {
    agents: agents, covered: covered, tick: tick,
    get step() { return step_; },
    get frac() { return coveredCount / (W * H); },
    runToScore: function () { while (step_ < CAP && coveredCount / (W * H) < TARGET) tick(); return step_; }
  };
}

function scoreOne(step, n, seed) { return simulate(step, n, seed).runToScore(); }

// Score over a seed set. Returns per-seed steps, mean, completion flag.
// ok === false means a seed never reached TARGET within CAP (a FAIL — like
// ecdsa's "all test points must pass"); such a score is logged but not ranked.
function scoreSeeds(step, n, seeds) {
  var per = [], ok = true, sum = 0;
  for (var i = 0; i < seeds.length; i++) {
    var s = simulate(step, n, seeds[i]);
    s.runToScore();
    per.push(s.step);
    sum += s.step;
    if (s.frac < TARGET) ok = false;
  }
  var meanSteps = Math.round(sum / seeds.length);
  return { per: per, meanSteps: meanSteps, ok: ok, score: n * meanSteps };
}
`;

const engine = new Function(
  ENGINE_SRC +
    "\nreturn { mulberry32, simulate, scoreOne, scoreSeeds, W, H, TARGET, CAP, SEEDS };"
)();

export const { mulberry32, simulate, scoreOne, scoreSeeds, W, H, TARGET, CAP, SEEDS } = engine;

// Provable lower bound on agents × steps: every covered cell needs ≥1 agent-step.
export const FLOOR = Math.ceil(TARGET * W * H); // 1520
