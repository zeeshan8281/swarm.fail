/*
 * Deterministic swarm engine — THE single source of truth.
 *
 * Plain JS (no types) so the EXACT same code runs everywhere:
 *   - the browser arena, the server sandbox (vm), and the `swarm` CLI.
 *
 * Task: N agents, each running ONE local policy, must EXPLORE a building —
 * a 40×40 grid with procedurally-generated rooms and walls, a different real
 * layout for each seed. Cover every reachable open cell.
 *   policy: step(a, env, rng) -> {dx,dy},  dx,dy ∈ {-1,0,1}
 *   env exposes only local info: env.up/down/left/right (is the neighbour a
 *   wall or edge?) and env.here (is my cell already explored?). No global map.
 *
 * Score (lower wins): agents × mean-steps-to-95%-explored, over a fixed seed set.
 */
export const ENGINE_SRC = String.raw`
var W = 40, H = 40, TARGET = 0.95, CAP = 4000;
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

// Procedural map: scatter rectangular wall blocks, then keep only the largest
// connected open region (so every target cell is reachable). Deterministic per seed.
function genMap(seed) {
  var rng = mulberry32((seed * 40503 + 7) >>> 0);
  var wall = new Uint8Array(W * H);
  var blocks = 14 + ((rng() * 9) | 0);
  for (var b = 0; b < blocks; b++) {
    var bw = 2 + ((rng() * 6) | 0), bh = 2 + ((rng() * 6) | 0);
    var bx = 1 + ((rng() * (W - bw - 2)) | 0), by = 1 + ((rng() * (H - bh - 2)) | 0);
    for (var y = by; y < by + bh; y++) for (var x = bx; x < bx + bw; x++) wall[y * W + x] = 1;
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
  var covered = new Uint8Array(W * H), coveredCount = 0, agents = [];
  for (var i = 0; i < n; i++) {
    var c = cells[(spawn() * cells.length) | 0], x = c % W, y = (c / W) | 0;
    agents.push({ id: i, n: n, x: x, y: y, heading: 0, mem: {} });
    if (!covered[c]) { covered[c] = 1; coveredCount++; }
  }
  var rngs = agents.map(function (a) { return mulberry32((seed * 97 + a.id * 1009 + 1) >>> 0); });
  var env = { w: W, h: H, here: false, up: false, down: false, left: false, right: false };
  var step_ = 0;
  function solid(x, y) { return x < 0 || x >= W || y < 0 || y >= H || wall[y * W + x] === 1; }

  function tick() {
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      env.here = covered[a.y * W + a.x] === 1;
      env.up = solid(a.x, a.y - 1); env.down = solid(a.x, a.y + 1);
      env.left = solid(a.x - 1, a.y); env.right = solid(a.x + 1, a.y);
      var mv; try { mv = step(a, env, rngs[i]); } catch (e) { mv = { dx: 0, dy: 0 }; }
      var dx = Math.sign((mv && mv.dx) || 0), dy = Math.sign((mv && mv.dy) || 0);
      if (dx && dy) dy = 0;
      var nx = a.x + dx, ny = a.y + dy;
      if (solid(nx, ny)) { nx = a.x; ny = a.y; }   // walls block
      a.x = nx; a.y = ny; a.heading = dx ? (dx > 0 ? 0 : 1) : (dy > 0 ? 2 : 3);
      var k = ny * W + nx; if (!covered[k]) { covered[k] = 1; coveredCount++; }
    }
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
