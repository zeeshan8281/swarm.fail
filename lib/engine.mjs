/*
 * Deterministic swarm engine — THE single source of truth.
 *
 * Plain JS (no types) so the EXACT same code runs everywhere:
 *   - the browser arena, the server sandbox (vm), and the `swarm` CLI.
 *
 * Task: N agents, each running ONE local policy, must EXPLORE a building —
 * a 40×40 grid, a different real layout for each seed, drawn from three map
 * families — rooms, braided mazes, caves. Cover every reachable open cell.
 *   policy: step(a, env, rng) -> {dx,dy},  dx,dy ∈ {-1,0,1}
 *   env exposes only local info: env.up/down/left/right (is the neighbour a
 *   wall or edge?) and env.here (is my cell already explored?). No global map.
 *
 * Score (lower wins): agents × mean-steps-to-95%-explored, over a fixed seed set.
 */
export const ENGINE_SRC = String.raw`
// CAP is the give-up point: a run that hasn't covered 95% by then is a FAIL.
// Worst single seed among policies that currently pass is 570 steps (Dispersed
// Walk), so 1500 is ~2.6x headroom and changes no ranked score. Anything slower
// than this can't rank anyway: >1500 steps at the 50-agent minimum is a score of
// 75000+, ~80x the floor. What it buys is not paying 12s of CPU to watch a
// hopeless policy flail, which is what the mazes turned Bounce Sweep into.
var W = 40, H = 40, TARGET = 0.95, CAP = 1500;
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

// Procedural map: three FAMILIES, one per seed (seed % 3), so the fixed seed set
// is a mix and a policy has to generalise instead of overfitting one topology:
//   0 rooms   — scattered rectangular blocks, wide open floor
//   1 maze    — braided corridor maze, 1-cell passages and dead ends
//   2 cave    — cellular-automata blobs, organic chambers
// Then keep only the largest connected open region (every target cell reachable).
// Deterministic per seed.
function genMap(seed) {
  var rng = mulberry32((seed * 40503 + 7) >>> 0);
  var wall = new Uint8Array(W * H);
  var kind = seed % 3, x, y, b;
  if (kind === 0) {
    var blocks = 14 + ((rng() * 9) | 0);
    for (b = 0; b < blocks; b++) {
      var bw = 2 + ((rng() * 6) | 0), bh = 2 + ((rng() * 6) | 0);
      var bx = 1 + ((rng() * (W - bw - 2)) | 0), by = 1 + ((rng() * (H - bh - 2)) | 0);
      for (y = by; y < by + bh; y++) for (x = bx; x < bx + bw; x++) wall[y * W + x] = 1;
    }
  } else if (kind === 1) {
    // recursive backtracker on odd cells, then braid: knock out some dead-end
    // walls so it isn't a perfect maze (a perfect maze is a coverage nightmare).
    wall.fill(1);
    var st = [1, 1], DIR = [[2, 0], [-2, 0], [0, 2], [0, -2]];
    wall[1 * W + 1] = 0;
    while (st.length) {
      var cy = st.pop(), cx = st.pop(), cand = [];
      for (var d = 0; d < 4; d++) {
        var nx = cx + DIR[d][0], ny = cy + DIR[d][1];
        if (nx > 0 && nx < W - 1 && ny > 0 && ny < H - 1 && wall[ny * W + nx]) cand.push(DIR[d]);
      }
      if (!cand.length) continue;
      st.push(cx, cy);
      var p = cand[(rng() * cand.length) | 0];
      wall[(cy + p[1] / 2) * W + cx + p[0] / 2] = 0;
      wall[(cy + p[1]) * W + cx + p[0]] = 0;
      st.push(cx + p[0], cy + p[1]);
    }
    for (b = 0; b < 160; b++) {  // ponytail: fixed braid count; tune if mazes score wild
      x = 1 + ((rng() * (W - 2)) | 0); y = 1 + ((rng() * (H - 2)) | 0);
      wall[y * W + x] = 0;
    }
  } else {
    for (var i0 = 0; i0 < W * H; i0++) wall[i0] = rng() < 0.45 ? 1 : 0;
    for (var it = 0; it < 4; it++) {
      var next = new Uint8Array(W * H);
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var c8 = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          var ax = x + dx, ay = y + dy;
          if (ax < 0 || ax >= W || ay < 0 || ay >= H || wall[ay * W + ax]) c8++;
        }
        next[y * W + x] = c8 > 4 ? 1 : c8 < 4 ? 0 : wall[y * W + x];
      }
      wall = next;
    }
  }
  // largest connected open component (4-connected flood fill)
  var visited = new Uint8Array(W * H), stack = new Int32Array(W * H), bestArr = null;
  for (var i = 0; i < W * H; i++) {
    if (wall[i] || visited[i]) continue;
    var arr = [], sp = 0; stack[sp++] = i; visited[i] = 1;
    while (sp) {
      var c = stack[--sp]; arr.push(c);
      var cx = c % W, cy = (c / W) | 0;
      var nb = [c + 1, c - 1, c + W, c - W], edge = [cx < W - 1, cx > 0, cy < H - 1, cy > 0];
      for (var k = 0; k < 4; k++) { if (!edge[k]) continue; var j = nb[k]; if (wall[j] || visited[j]) continue; visited[j] = 1; stack[sp++] = j; }
    }
    if (!bestArr || arr.length > bestArr.length) bestArr = arr;
  }
  var open = new Uint8Array(W * H);
  for (var m = 0; m < bestArr.length; m++) open[bestArr[m]] = 1;
  for (var p = 0; p < W * H; p++) if (!open[p]) wall[p] = 1; // fill unreachable pockets
  return { wall: wall, cells: bestArr, openCount: bestArr.length };
}

function simulate(step, n, seed) {
  var map = genMap(seed), wall = map.wall, cells = map.cells, openCount = map.openCount;
  var spawn = mulberry32((seed * 2654435761) >>> 0);
  var covered = new Uint8Array(W * H), occ = new Uint16Array(W * H), coveredCount = 0, agents = [];
  // stigmergy field: a shared scalar every agent can read (its 4 neighbours +
  // own cell) and write to (mark on the cell it lands on). Evaporates each tick,
  // so it's a *dynamic* signal, not a global map — the swarm's only way to leave
  // information for its future self. This is coordination through the shared
  // environment, ant-style: no leader. (For direct coordination, see env.shared.)
  var trail = new Float32Array(W * H), deposit = new Float32Array(W * H);
  var DECAY = 0.9;  // ponytail: fixed evaporation; expose per-policy only if a submission needs it
  // shared brain: ONE plain object per simulation that every agent can read and
  // write (env.shared) — a collective map, claims, messages, whatever the policy
  // wants. Direct coordination, sanctioned. Still deterministic: agents run in
  // fixed id order, so a write is visible to higher-id agents the same tick.
  // Reset for every map — use this, not module-level vars (those leak across seeds).
  var shared = {};
  for (var i = 0; i < n; i++) {
    var c = cells[(spawn() * cells.length) | 0], x = c % W, y = (c / W) | 0;
    agents.push({ id: i, n: n, x: x, y: y, heading: 0, mem: {} });
    if (!covered[c]) { covered[c] = 1; coveredCount++; }
  }
  var rngs = agents.map(function (a) { return mulberry32((seed * 97 + a.id * 1009 + 1) >>> 0); });
  // env.near (reused object) is the only agent→agent channel: a count of the
  // OTHER agents sitting on each of your 4 neighbour cells this step. Radius 1,
  // so still no global map — just "is it crowded that way?" for dispersion.
  var near = { up: 0, down: 0, left: 0, right: 0 };
  // env.trail (reused object): the stigmergy field read at this cell + neighbours.
  var tr = { here: 0, up: 0, down: 0, left: 0, right: 0 };
  var env = { w: W, h: H, here: false, up: false, down: false, left: false, right: false, near: near, trail: tr, shared: shared };
  var step_ = 0;
  function solid(x, y) { return x < 0 || x >= W || y < 0 || y >= H || wall[y * W + x] === 1; }
  function crowd(x, y) { return x < 0 || x >= W || y < 0 || y >= H ? 0 : occ[y * W + x]; }
  function scent(x, y) { return x < 0 || x >= W || y < 0 || y >= H ? 0 : trail[y * W + x]; }

  function tick() {
    // snapshot positions first so every agent senses the SAME pre-move world
    // (order-independent — agent 0's move can't change what agent 1 sees).
    occ.fill(0); deposit.fill(0);
    for (var q = 0; q < agents.length; q++) occ[agents[q].y * W + agents[q].x]++;
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      env.here = covered[a.y * W + a.x] === 1;
      env.up = solid(a.x, a.y - 1); env.down = solid(a.x, a.y + 1);
      env.left = solid(a.x - 1, a.y); env.right = solid(a.x + 1, a.y);
      near.up = crowd(a.x, a.y - 1); near.down = crowd(a.x, a.y + 1);
      near.left = crowd(a.x - 1, a.y); near.right = crowd(a.x + 1, a.y);
      tr.here = scent(a.x, a.y);
      tr.up = scent(a.x, a.y - 1); tr.down = scent(a.x, a.y + 1);
      tr.left = scent(a.x - 1, a.y); tr.right = scent(a.x + 1, a.y);
      var mv; try { mv = step(a, env, rngs[i]); } catch (e) { mv = { dx: 0, dy: 0 }; }
      var dx = Math.sign((mv && mv.dx) || 0), dy = Math.sign((mv && mv.dy) || 0);
      if (dx && dy) dy = 0;
      var nx = a.x + dx, ny = a.y + dy;
      if (solid(nx, ny)) { nx = a.x; ny = a.y; }   // walls block
      a.x = nx; a.y = ny; a.heading = dx ? (dx > 0 ? 0 : 1) : (dy > 0 ? 2 : 3);
      var k = ny * W + nx; if (!covered[k]) { covered[k] = 1; coveredCount++; }
      // deposit onto the cell you land on; clamp so one step can't flood the field
      var m = mv && mv.mark; if (m > 0) deposit[k] += m > 1 ? 1 : m;
    }
    // evaporate, then fold in this tick's marks (deposits read next tick, so the
    // field an agent senses is a stable pre-move snapshot — order-independent).
    for (var t = 0; t < trail.length; t++) trail[t] = trail[t] * DECAY + deposit[t];
    step_++;
    return coveredCount / openCount;
  }

  return {
    agents: agents, covered: covered, wall: wall, openCount: openCount, tick: tick,
    get step() { return step_; },
    get frac() { return coveredCount / openCount; },
    runToScore: function () { while (step_ < CAP && coveredCount / openCount < TARGET) tick(); return step_; }
  };
}

function scoreOne(step, n, seed) { return simulate(step, n, seed).runToScore(); }
function scoreSeeds(step, n, seeds) {
  var per = [], ok = true, sum = 0;
  for (var i = 0; i < seeds.length; i++) { var s = simulate(step, n, seeds[i]); s.runToScore(); per.push(s.step); sum += s.step; if (s.frac < TARGET) ok = false; }
  var meanSteps = Math.round(sum / seeds.length);
  return { per: per, meanSteps: meanSteps, ok: ok, score: n * meanSteps };
}

// Floor = mean over seeds of the min agent-steps to explore 95% of that map's
// open cells (every explored cell needs ≥1 agent-step). The number to approach.
var FLOOR = (function () { var s = 0; for (var i = 0; i < SEEDS.length; i++) s += Math.ceil(TARGET * genMap(SEEDS[i]).openCount); return Math.round(s / SEEDS.length); })();
`;

const engine = new Function(
  ENGINE_SRC + "\nreturn { mulberry32, genMap, simulate, scoreOne, scoreSeeds, W, H, TARGET, CAP, SEEDS, FLOOR };"
)();

export const { mulberry32, genMap, simulate, scoreOne, scoreSeeds, W, H, TARGET, CAP, SEEDS, FLOOR } = engine;

// Minimum swarm size to be ranked. Lives here, not in the scorer, so the browser
// arena applies the same gate as CI instead of showing a 10-agent run as OK.
export const MIN_AGENTS = 50;
