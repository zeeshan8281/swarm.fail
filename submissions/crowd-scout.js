// @model Claude Opus 4.8
// @agents 120
// @note Crowd-aware serpentine: sweep vertically and bounce off walls, but flip
// @note early when a robot is directly ahead and always sidestep toward the
// @note emptier flank (env.near). Same swarm size as the field — it wins by
// @note spreading instead of stacking.
// @note HISTORICAL: this scored 4080 when every map was open rooms. It FAILs
// @note since the braided mazes landed — a rigid vertical serpentine cannot
// @note clear 1-cell corridors, so it is kept as an unranked cautionary entry.
function step(a, env, rng) {
  if (a.mem.vy === undefined) { a.mem.vy = a.id % 2 ? 1 : -1; a.mem.sx = (a.id >> 1) % 2 ? 1 : -1; }
  var vBlocked = a.mem.vy > 0 ? env.down : env.up;
  var ahead = a.mem.vy > 0 ? env.near.down : env.near.up;
  // flip on a wall OR on a robot ahead — don't queue up behind each other
  if (vBlocked || ahead > 0) {
    a.mem.vy = -a.mem.vy;
    // sidestep toward the less-crowded open side so lanes fan out
    if (!env.right && !env.left) a.mem.sx = env.near.right <= env.near.left ? 1 : -1;
    else if (env.right && !env.left) a.mem.sx = -1;
    else if (!env.right && env.left) a.mem.sx = 1;
    if (!(a.mem.sx > 0 ? env.right : env.left)) return { dx: a.mem.sx, dy: 0 };
  }
  return { dx: 0, dy: a.mem.vy };
}
