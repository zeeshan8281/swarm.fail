// Built-in reference policies (worst → baseline → best) + a starting point for
// writers. Plain JS so the site, CLI, and CI all share one source. Wall-aware:
// env.up/down/left/right say whether the neighbouring cell is a wall or edge.
export const DEFAULT_N = 120;

export const POLICIES = {
  random: {
    key: "random", name: "Random Walk", tag: "floor", n: 120,
    src: `// the dumb floor: step to any open neighbour, at random
function step(a, env, rng){
  const open = [[1,0],[-1,0],[0,1],[0,-1]].filter(function(m){
    return !((m[0]>0&&env.right)||(m[0]<0&&env.left)||(m[1]>0&&env.down)||(m[1]<0&&env.up));
  });
  if(!open.length) return {dx:0, dy:0};
  const m = open[(rng()*open.length)|0];
  return {dx:m[0], dy:m[1]};
}`,
  },
  levy: {
    key: "levy", name: "Lévy Flight", tag: "baseline", n: 120,
    src: `// the named adversary: commit to a heading, walk it for a
// heavy-tailed run, re-aim when it ends or hits a wall.
function step(a, env, rng){
  function blocked(m){ return (m[0]>0&&env.right)||(m[0]<0&&env.left)||(m[1]>0&&env.down)||(m[1]<0&&env.up); }
  if(!a.mem.dir || a.mem.left<=0 || blocked(a.mem.dir)){
    const open=[[1,0],[-1,0],[0,1],[0,-1]].filter(function(m){ return !blocked(m); });
    if(!open.length) return {dx:0, dy:0};
    a.mem.dir=open[(rng()*open.length)|0];
    a.mem.left=1+Math.floor(1/Math.pow(rng(),0.6));
  }
  a.mem.left--;
  return {dx:a.mem.dir[0], dy:a.mem.dir[1]};
}`,
  },
  disperse: {
    key: "disperse", name: "Dispersed Walk", tag: "", n: 120,
    src: `// correlated walk, but each id starts on a different heading
function step(a, env, rng){
  function blocked(m){ return (m[0]>0&&env.right)||(m[0]<0&&env.left)||(m[1]>0&&env.down)||(m[1]<0&&env.up); }
  if(a.mem.dir===undefined){ a.mem.dir=[[1,0],[-1,0],[0,1],[0,-1]][a.id%4]; a.mem.left=8; }
  if(a.mem.left-- <= 0 || blocked(a.mem.dir)){
    const open=[[1,0],[-1,0],[0,1],[0,-1]].filter(function(m){ return !blocked(m); });
    a.mem.dir = open.length ? open[(rng()*open.length)|0] : [0,0];
    a.mem.left=4+((rng()*6)|0);
  }
  return {dx:a.mem.dir[0], dy:a.mem.dir[1]};
}`,
  },
  stripes: {
    key: "stripes", name: "Bounce Sweep", tag: "win", n: 100,
    src: `// serpentine sweep: run vertically, bounce off walls, nudge sideways
function step(a, env, rng){
  if(a.mem.vy===undefined){ a.mem.vy = a.id%2 ? 1 : -1; a.mem.sx = (a.id>>1)%2 ? 1 : -1; }
  const vBlocked = a.mem.vy>0 ? env.down : env.up;
  if(vBlocked){
    a.mem.vy = -a.mem.vy;
    if(a.mem.sx>0 ? env.right : env.left) a.mem.sx = -a.mem.sx;
    if(!(a.mem.sx>0 ? env.right : env.left)) return {dx:a.mem.sx, dy:0};
  }
  return {dx:0, dy:a.mem.vy};
}`,
  },
};

export const ORDER = ["random", "levy", "disperse", "stripes"];
