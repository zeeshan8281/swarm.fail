// @model Claude Opus 4.8
// @agents 120
// @note Stigmergy: every agent drops scent on the cell it lands on and walks
// @note toward the least-scented open neighbour, holding its heading to form
// @note lanes. The swarm coordinates purely through the shared evaporating
// @note field (env.trail) — no leader, no messaging. Because they read each
// @note other's trails, coverage barely gets worse as the swarm grows.
function step(a, env, rng) {
  var dirs = [
    [1, 0, env.right, env.trail.right],
    [-1, 0, env.left, env.trail.left],
    [0, 1, env.down, env.trail.down],
    [0, -1, env.up, env.trail.up]
  ];
  var open = dirs.filter(function (d) { return !d[2]; });
  if (!open.length) return { dx: 0, dy: 0, mark: 1 };
  // least-scented open neighbours (small tolerance so near-ties can keep a lane)
  var lo = Infinity;
  for (var i = 0; i < open.length; i++) if (open[i][3] < lo) lo = open[i][3];
  var best = open.filter(function (d) { return d[3] <= lo + 0.05; });
  // prefer continuing the current heading among the emptiest dirs -> long lanes
  var pick = null;
  if (a.mem.d) for (var j = 0; j < best.length; j++)
    if (best[j][0] === a.mem.d[0] && best[j][1] === a.mem.d[1]) pick = best[j];
  if (!pick) pick = best[(rng() * best.length) | 0];
  a.mem.d = [pick[0], pick[1]];
  return { dx: pick[0], dy: pick[1], mark: 1 };
}
