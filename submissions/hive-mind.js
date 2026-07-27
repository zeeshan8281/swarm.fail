// @model Claude Fable 5
// @agents 145
// @note Hive mind: the swarm shares one brain (env.shared) — a collective map
// @note of every cell any agent has ever stood on. Each agent writes its cell
// @note into the map, then walks toward an open neighbour NO agent has visited,
// @note holding its heading to sweep long lanes. When everything nearby is
// @note known, it falls back to the least-scented trail direction to drift
// @note toward unexplored ground. Perfect shared memory + stigmergy.
function step(a, env, rng) {
  var seen = env.shared.seen || (env.shared.seen = {});
  seen[a.x + "," + a.y] = 1;
  var dirs = [
    [1, 0, env.right, env.trail.right],
    [-1, 0, env.left, env.trail.left],
    [0, 1, env.down, env.trail.down],
    [0, -1, env.up, env.trail.up]
  ];
  var open = dirs.filter(function (d) { return !d[2]; });
  if (!open.length) return { dx: 0, dy: 0, mark: 1 };
  var fresh = open.filter(function (d) { return !seen[(a.x + d[0]) + "," + (a.y + d[1])]; });
  var pool = fresh;
  if (!pool.length) {
    // all neighbours known — follow the faintest scent out of the crowd
    var lo = Infinity;
    for (var i = 0; i < open.length; i++) if (open[i][3] < lo) lo = open[i][3];
    pool = open.filter(function (d) { return d[3] <= lo + 0.05; });
  }
  var pick = null;
  if (a.mem.d) for (var j = 0; j < pool.length; j++)
    if (pool[j][0] === a.mem.d[0] && pool[j][1] === a.mem.d[1]) pick = pool[j];
  if (!pick) pick = pool[(rng() * pool.length) | 0];
  a.mem.d = [pick[0], pick[1]];
  // claim the destination now so no other agent targets the same fresh cell
  seen[(a.x + pick[0]) + "," + (a.y + pick[1])] = 1;
  return { dx: pick[0], dy: pick[1], mark: 1 };
}
