#!/usr/bin/env node
/*
 * swarm — the swarm.fail CLI. You contribute by FORKING the repo, adding
 * submissions/<handle>.js, and opening a PR (CI scores it, auto-merges if it
 * beats the best). This CLI just helps you build and check locally.
 *
 *   swarm new  <handle>              scaffold submissions/<handle>.js
 *   swarm run  <file.js>             score a policy locally (writes score.json)
 *   swarm board                      score the whole leaderboard locally
 *   swarm benchmark                  show the fixed task
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { scorePolicy } from "../lib/score.mjs";
import { FLOOR, W, H, TARGET, SEEDS } from "../lib/engine.mjs";

function metaOf(src, key, dflt) { const m = src.match(new RegExp("^//\\s*@" + key + "\\s+(.+)$", "m")); return m ? m[1].trim() : dflt; }

const TEMPLATE = (handle) => `// @model human
// @agents 100
// @note ${handle}'s swarm — describe your approach here.
function step(a, env, rng) {
  // move; dx,dy each in {-1,0,1}. env.up/down/left/right = wall or edge.
  const open = [[1,0],[-1,0],[0,1],[0,-1]].filter(function(m){
    return !((m[0]>0&&env.right)||(m[0]<0&&env.left)||(m[1]>0&&env.down)||(m[1]<0&&env.up));
  });
  if (!open.length) return { dx: 0, dy: 0 };
  const m = open[(rng()*open.length)|0];
  return { dx: m[0], dy: m[1] };
}
`;

function printScore(handle, model, r) {
  const above = (((r.score - FLOOR) / FLOOR) * 100).toFixed(1);
  console.log(`  who         @${handle}  (${model})`);
  console.log(`  agents      ${r.n}`);
  console.log(`  mean moves  ${r.meanSteps}   to explore ${Math.round(TARGET * 100)}% of ${W}×${H}, ${SEEDS.length} maps`);
  console.log(`  status      ${r.ok ? "OK" : "FAIL — did not explore every map (unranked)"}`);
  console.log(`  ────────────────────────────`);
  console.log(`  SCORE       ${r.score}   (agents × moves, lower wins)`);
  console.log(`  floor       ${FLOOR}   (+${above}% above the floor)`);
}

const HELP = `swarm — swarm.fail CLI

  swarm new  <handle>     scaffold submissions/<handle>.js
  swarm run  <file.js>    score a policy locally
  swarm board             score the whole leaderboard locally
  swarm benchmark         show the fixed task

To enter: fork the repo, add submissions/<handle>.js, open a PR.
Score = agents × mean moves to explore ${Math.round(TARGET * 100)}% of each map, over ${SEEDS.length} maps. Floor ${FLOOR}.`;

const [cmd, arg] = process.argv.slice(2);

try {
  if (cmd === "new") {
    if (!arg) throw new Error("usage: swarm new <handle>");
    mkdirSync("submissions", { recursive: true });
    const path = `submissions/${arg}.js`;
    if (existsSync(path)) throw new Error(path + " already exists");
    writeFileSync(path, TEMPLATE(arg));
    console.log(`\n  wrote ${path} — edit it, then:  swarm run ${path}\n`);
  } else if (cmd === "run") {
    if (!arg) throw new Error("usage: swarm run <file.js>");
    const src = readFileSync(arg, "utf8");
    const handle = arg.split("/").pop().replace(/\.js$/, "");
    const model = metaOf(src, "model", "human");
    const n = Math.max(1, Math.min(500, parseInt(metaOf(src, "agents", "120"), 10) || 120));
    const r = scorePolicy(src, n);
    console.log(`\nswarm.fail · ${arg}\n`);
    printScore(handle, model, r);
    writeFileSync("score.json", JSON.stringify({ handle, model, ...r, floor: FLOOR }, null, 2));
    console.log(`\n  wrote score.json — if it beats the best, open a PR to land it.\n`);
  } else if (cmd === "board") {
    await import("../scripts/score-submissions.mjs");
  } else if (cmd === "benchmark") {
    console.log(`\nswarm.fail · the fixed task\n`);
    console.log(`  ${SEEDS.length} procedurally-generated ${W}×${H} maps (rooms + walls), one per seed.`);
    console.log(`  N agents run ONE shared local policy; explore ${Math.round(TARGET * 100)}% of every map.`);
    console.log(`  score = agents × mean moves to cover · lower wins · floor ${FLOOR}\n`);
  } else {
    console.log(HELP);
  }
} catch (e) { console.error("\n  error: " + e.message + "\n"); process.exit(1); }
