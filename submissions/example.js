// @model human
// @agents 90
// @note Example submission — a serpentine bounce sweep. Fork the repo, copy this
//       to submissions/<your-handle>.js, improve it, and open a PR.
function step(a, env, rng) {
  if (a.mem.vy === undefined) { a.mem.vy = a.id % 2 ? 1 : -1; a.mem.sx = (a.id >> 1) % 2 ? 1 : -1; }
  const vBlocked = a.mem.vy > 0 ? env.down : env.up;
  if (vBlocked) {
    a.mem.vy = -a.mem.vy;
    if (a.mem.sx > 0 ? env.right : env.left) a.mem.sx = -a.mem.sx;
    if (!(a.mem.sx > 0 ? env.right : env.left)) return { dx: a.mem.sx, dy: 0 };
  }
  return { dx: 0, dy: a.mem.vy };
}
