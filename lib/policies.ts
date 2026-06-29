// Built-in policies — pre-seed the board and give writers a starting point.
// Each carries a recommended agent count: with the agents×steps product metric,
// picking n IS part of the strategy (like balancing qubits vs Toffolis).
export type Builtin = { key: string; name: string; tag: "" | "floor" | "baseline" | "win"; n: number; src: string };

export const DEFAULT_N = 120;

export const POLICIES: Record<string, Builtin> = {
  random: {
    key: "random", name: "Random Walk", tag: "floor", n: 120,
    src: `// the dumb floor: step anywhere, every step
function step(a, env, rng){
  const d = [[1,0],[-1,0],[0,1],[0,-1]][(rng()*4)|0];
  return {dx:d[0], dy:d[1]};
}`,
  },
  levy: {
    key: "levy", name: "Lévy Flight", tag: "baseline", n: 120,
    src: `// the named adversary: commit to a heading, walk it for a
// heavy-tailed run length, then re-aim. Near-optimal for a
// SINGLE searcher — your job is to beat it with a swarm.
function step(a, env, rng){
  if(!a.mem.left || a.mem.left <= 0){
    const d = [[1,0],[-1,0],[0,1],[0,-1]][(rng()*4)|0];
    a.mem.dir = d;
    a.mem.left = 1 + Math.floor(1 / Math.pow(rng(), 0.6)); // Lévy-ish run
  }
  a.mem.left--;
  return {dx:a.mem.dir[0], dy:a.mem.dir[1]};
}`,
  },
  disperse: {
    key: "disperse", name: "Dispersed Walk", tag: "", n: 120,
    src: `// correlated walk, but each id starts on a different heading
// so the swarm fans out before it wanders
function step(a, env, rng){
  if(a.mem.dir === undefined){
    a.mem.dir = [[1,0],[-1,0],[0,1],[0,-1]][a.id % 4];
    a.mem.left = 8;
  }
  if(a.mem.left-- <= 0){
    a.mem.dir = [[1,0],[-1,0],[0,1],[0,-1]][(rng()*4)|0];
    a.mem.left = 4 + ((rng()*6)|0);
  }
  return {dx:a.mem.dir[0], dy:a.mem.dir[1]};
}`,
  },
  stripes: {
    key: "stripes", name: "Lane Sweep", tag: "win", n: 40,
    src: `// each agent owns a column by id and sweeps it top-to-bottom.
// One agent per column (n≈40) means almost no wasted coverage —
// emergent full coverage, zero communication, near the floor.
function step(a, env, rng){
  const lane = a.id % env.w;            // my column
  if(a.x !== lane) return {dx: a.x < lane ? 1 : -1, dy:0};
  if(a.mem.up === undefined) a.mem.up = (a.id % 2 === 0);
  if(a.y <= 0) a.mem.up = false;
  if(a.y >= env.h-1) a.mem.up = true;
  return {dx:0, dy: a.mem.up ? -1 : 1};  // sweep the lane
}`,
  },
};

export const ORDER = ["random", "levy", "disperse", "stripes"];
