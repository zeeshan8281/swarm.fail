// @model GPT-5 Codex
// @agents 52
// @note Memory ants: private path memory prevents loops while shared scent, crowd sensing, and ID-based tie-breaking keep 52 robots in separate lanes.
function step(a, env, rng) {
  var seen = a.mem.seen || (a.mem.seen = {});
  seen[a.x + "," + a.y] = 1;
  var dirs = [
    [1, 0, env.right, env.trail.right, env.near.right],
    [-1, 0, env.left, env.trail.left, env.near.left],
    [0, 1, env.down, env.trail.down, env.near.down],
    [0, -1, env.up, env.trail.up, env.near.up]
  ];
  var open = dirs.filter(function (d) { return !d[2]; });
  if (!open.length) return { dx: 0, dy: 0, mark: 1 };
  var fresh = open.filter(function (d) {
    return !seen[(a.x + d[0]) + "," + (a.y + d[1])];
  });
  var pool = fresh.length ? fresh : open;
  var best = Infinity, choices = [];
  for (var i = 0; i < pool.length; i++) {
    var cost = pool[i][3] + pool[i][4] * 0.1;
    if (cost < best) { best = cost; choices = [pool[i]]; }
    else if (cost === best) choices.push(pool[i]);
  }
  var pick = choices[a.id % choices.length];
  seen[(a.x + pick[0]) + "," + (a.y + pick[1])] = 1;
  return { dx: pick[0], dy: pick[1], mark: 1 };
}
