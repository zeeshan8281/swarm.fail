// @model GPT-5 Codex
// @agents 1
// @note Lone cartographer: map local walls, visit every nearby frontier, and BFS across known space only when backtracking is unavoidable.
function step(a, env, rng) {
  var s = a.mem;
  if (!s.map) {
    s.map = [];
    s.seen = [];
    s.owner = [];
  }

  var w = env.w;
  var here = a.y * w + a.x;
  s.map[here] = 1;
  s.seen[here] = 1;
  if (s.owner[here] === a.id + 1) s.owner[here] = 0;

  var sensed = [
    [1, 0, env.right],
    [-1, 0, env.left],
    [0, 1, env.down],
    [0, -1, env.up]
  ];
  for (var i = 0; i < 4; i++) {
    var sx = a.x + sensed[i][0], sy = a.y + sensed[i][1];
    if (sx >= 0 && sx < env.w && sy >= 0 && sy < env.h)
      s.map[sy * w + sx] = sensed[i][2] ? -1 : 1;
  }

  if (a.mem.target !== undefined && s.seen[a.mem.target]) {
    if (s.owner[a.mem.target] === a.id + 1) s.owner[a.mem.target] = 0;
    a.mem.target = undefined;
  }

  function route(goal) {
    var q = [here], head = 0, prev = [];
    prev[here] = here;
    var found = -1;
    while (head < q.length) {
      var c = q[head++];
      if (goal === undefined) {
        if (c !== here && !s.seen[c] && !s.owner[c]) { found = c; break; }
      } else if (c === goal) { found = c; break; }
      var x = c % w, y = (c / w) | 0;
      for (var z = 0; z < 4; z++) {
        var d = [1, 3, 2, 0][z];
        var nx = x + (d === 0 ? 1 : d === 1 ? -1 : 0);
        var ny = y + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || nx >= env.w || ny < 0 || ny >= env.h) continue;
        var n = ny * w + nx;
        if (s.map[n] === 1 && prev[n] === undefined) {
          prev[n] = c;
          q.push(n);
        }
      }
    }
    if (found < 0) return null;
    var next = found;
    while (prev[next] !== here) next = prev[next];
    return { target: found, next: next };
  }

  var r = null;
  if (a.mem.target !== undefined && s.owner[a.mem.target] === a.id + 1)
    r = route(a.mem.target);
  if (!r) {
    if (a.mem.target !== undefined && s.owner[a.mem.target] === a.id + 1)
      s.owner[a.mem.target] = 0;
    r = route();
    if (r) {
      a.mem.target = r.target;
      s.owner[r.target] = a.id + 1;
    }
  }

  if (!r) {
    var open = sensed.filter(function (d) { return !d[2]; });
    if (!open.length) return { dx: 0, dy: 0, mark: 1 };
    var best = Infinity, pool = [];
    for (var j = 0; j < open.length; j++) {
      var trail = [env.trail.right, env.trail.left, env.trail.down, env.trail.up][j];
      if (trail < best) { best = trail; pool = [open[j]]; }
      else if (trail === best) pool.push(open[j]);
    }
    var p = pool[(rng() * pool.length) | 0];
    a.mem.turn = ((a.mem.turn || 0) + 1) & 3;
    return { dx: p[0], dy: p[1], mark: 1 };
  }

  var tx = r.next % w, ty = (r.next / w) | 0;
  if (r.next === r.target) s.seen[r.target] = 1;
  return { dx: tx - a.x, dy: ty - a.y, mark: 1 };
}
