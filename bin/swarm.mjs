#!/usr/bin/env node
/*
 * swarm — the swarm.fail CLI.
 *
 * Scores a local policy with the SAME engine the server runs, so the number is
 * reproducible by anyone: clone, run, get the identical score. The leaderboard
 * is just a viewer over results people can re-derive.
 *
 *   swarm run     <file.js> [--agents N]            score locally, write score.json + results.tsv
 *   swarm submit  <file.js> --name NAME [--agents N] [--url U]   score, then post to the board
 *   swarm board   [--url U]                          show the leaderboard
 *
 * A policy file defines:  function step(a, env, rng) { return {dx,dy}; }
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { scoreSeeds, SEEDS, FLOOR, W, H, TARGET } from "../lib/engine.mjs";

const DEFAULT_URL = process.env.SWARM_URL || "https://web-production-54527.up.railway.app";

function parseArgs(argv) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) opt[a.slice(2)] = argv[i + 1]?.startsWith("--") || i + 1 >= argv.length ? true : argv[++i];
    else pos.push(a);
  }
  return { pos, opt };
}

function compile(src) {
  const fn = new Function(src + "\n;return step;")();
  if (typeof fn !== "function") throw new Error("policy file must define `function step(a, env, rng)`");
  return fn;
}

function scoreFile(file, n) {
  const src = readFileSync(file, "utf8");
  const r = scoreSeeds(compile(src), n, SEEDS);
  return { src, ...r };
}

function printScore(r, n) {
  const aboveFloor = (((r.score - FLOOR) / FLOOR) * 100).toFixed(1);
  console.log(`  grid        ${W}×${H}, cover ${Math.round(TARGET * 100)}%, ${SEEDS.length} seeds`);
  console.log(`  agents      ${n}`);
  console.log(`  mean steps  ${r.meanSteps}`);
  console.log(`  per-seed    ${r.per.join(", ")}`);
  console.log(`  status      ${r.ok ? "OK" : "FAIL (did not cover every seed — unranked)"}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  SCORE       ${r.score}   (agents × steps, lower wins)`);
  console.log(`  floor       ${FLOOR}   (+${aboveFloor}% above the floor)`);
}

const HELP = `swarm — swarm.fail CLI

  swarm run    <file.js> [--agents N]
  swarm submit <file.js> --name NAME [--agents N] [--url URL]
  swarm board  [--url URL]

policy file:  function step(a, env, rng) { return {dx, dy}; }   // dx,dy ∈ -1,0,1
score:        agents × mean-steps-to-${Math.round(TARGET * 100)}%-coverage, lower wins, floor ${FLOOR}`;

async function main() {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  const cmd = pos[0];
  const n = Math.max(1, Math.min(500, parseInt(opt.agents ?? "120", 10) || 120));
  const url = (opt.url && opt.url !== true ? opt.url : DEFAULT_URL).replace(/\/$/, "");

  if (cmd === "run") {
    if (!pos[1]) throw new Error("usage: swarm run <file.js> [--agents N]");
    const r = scoreFile(pos[1], n);
    console.log(`\nswarm.fail · ${pos[1]}\n`);
    printScore(r, n);

    const stamp = new Date().toISOString();
    writeFileSync("score.json", JSON.stringify(
      { timestamp: stamp, agents: n, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok, floor: FLOOR }, null, 2));
    if (!existsSync("results.tsv"))
      appendFileSync("results.tsv", "timestamp\tname\tagents\tmean_steps\tscore\tok\tnote\n");
    const note = (opt.note && opt.note !== true ? opt.note : "").replace(/\t|\n/g, " ");
    appendFileSync("results.tsv", `${stamp}\t${opt.name ?? "local"}\t${n}\t${r.meanSteps}\t${r.score}\t${r.ok ? "OK" : "FAIL"}\t${note}\n`);
    console.log(`\n  wrote score.json, appended results.tsv`);
    return;
  }

  if (cmd === "submit") {
    if (!pos[1]) throw new Error("usage: swarm submit <file.js> --name NAME [--agents N]");
    const r = scoreFile(pos[1], n);
    console.log(`\nswarm.fail · submitting ${pos[1]} (local score ${r.score})\n`);
    printScore(r, n);
    const res = await fetch(`${url}/api/submit`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: opt.name && opt.name !== true ? opt.name : "anon", src: r.src, n }),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || `submit failed (${res.status})`);
    if (d.score !== r.score) console.log(`\n  ⚠ server score ${d.score} ≠ local ${r.score} — engine mismatch!`);
    console.log(`\n  server confirmed score ${d.score}` + (d.ok ? ` · rank ${d.rank}/${d.total}` : ` · FAIL (unranked)`));
    return;
  }

  if (cmd === "board") {
    const res = await fetch(`${url}/api/leaderboard`);
    const { entries } = await res.json();
    console.log(`\nswarm.fail leaderboard · floor ${FLOOR}\n`);
    console.log("  #   score   agents  steps  policy");
    entries.forEach((e, i) => {
      console.log(`  ${String(i + 1).padStart(2)}  ${String(e.score).padStart(6)}  ${String(e.n).padStart(6)}  ${String(e.meanSteps).padStart(5)}  ${e.name}`);
    });
    if (!entries.length) console.log("  (empty)");
    return;
  }

  console.log(HELP);
}

main().catch((e) => { console.error("\n  error: " + e.message + "\n"); process.exit(1); });
