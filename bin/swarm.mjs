#!/usr/bin/env node
/*
 * swarm — the swarm.fail solver CLI. Same contribution mechanism as ecdsa.fail:
 * authenticate with an API key, then submit account-scoped runs with a required
 * public note and the AI model you used.
 *
 *   swarm register <handle>                          claim a handle, get an API key
 *   swarm login    <api-key>                          save your key locally
 *   swarm whoami                                      show the logged-in account
 *   swarm benchmark                                   show the fixed task
 *   swarm run      <file.js> [--agents N]             score locally (score.json + results.tsv)
 *   swarm submit   <file.js> --note-file <md> --model "<model>" [--agents N]
 *   swarm submissions [--all]                         list your (or all public) submissions
 *   swarm note     <id>                               print a submission's public note
 *   swarm sync     [file.js]                          pull the current best policy
 *
 * A policy file defines:  function step(a, env, rng) { return {dx,dy}; }
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { scoreSeeds, SEEDS, FLOOR, W, H, TARGET, CAP } from "../lib/engine.mjs";

const DEFAULT_URL = process.env.SWARM_URL || "https://web-production-54527.up.railway.app";
const CFG_DIR = join(homedir(), ".swarmfail");
const CFG = join(CFG_DIR, "config.json");

function loadCfg() { try { return JSON.parse(readFileSync(CFG, "utf8")); } catch { return {}; } }
function saveCfg(c) { mkdirSync(CFG_DIR, { recursive: true }); writeFileSync(CFG, JSON.stringify(c, null, 2)); }

function parseArgs(argv) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) { const nx = argv[i + 1]; opt[a.slice(2)] = (nx === undefined || nx.startsWith("--")) ? true : argv[++i]; }
    else pos.push(a);
  }
  return { pos, opt };
}
const opts = (o, k, d) => (o[k] !== undefined && o[k] !== true ? o[k] : d);

function compile(src) {
  const fn = new Function(src + "\n;return step;")();
  if (typeof fn !== "function") throw new Error("policy file must define `function step(a, env, rng)`");
  return fn;
}
function scoreFile(file, n) { const src = readFileSync(file, "utf8"); return { src, ...scoreSeeds(compile(src), n, SEEDS) }; }

async function api(cfg, path, { method = "GET", body, auth = false } = {}) {
  const url = (cfg.apiUrl || DEFAULT_URL).replace(/\/$/, "") + path;
  const headers = { "content-type": "application/json" };
  if (auth) { if (!cfg.token) throw new Error("not logged in — run: swarm login <api-key>"); headers.authorization = "Bearer " + cfg.token; }
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error || `${path} failed (${res.status})`);
  return d;
}

function printScore(r, n) {
  const above = (((r.score - FLOOR) / FLOOR) * 100).toFixed(1);
  console.log(`  grid        ${W}×${H}, cover ${Math.round(TARGET * 100)}%, ${SEEDS.length} seeds`);
  console.log(`  agents      ${n}`);
  console.log(`  mean steps  ${r.meanSteps}`);
  console.log(`  status      ${r.ok ? "OK" : "FAIL (did not cover every seed — unranked)"}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  SCORE       ${r.score}   (agents × steps, lower wins)`);
  console.log(`  floor       ${FLOOR}   (+${above}% above the floor)`);
}

const HELP = `swarm — swarm.fail solver CLI

  swarm register <handle>                          claim a handle, get an API key
  swarm login    <api-key>                          save your key locally
  swarm whoami                                      show the logged-in account
  swarm benchmark                                   show the fixed task
  swarm run      <file.js> [--agents N]             score locally
  swarm submit   <file.js> --note-file <md> --model "<model>" [--agents N]
  swarm submissions [--all]                         list your / all submissions
  swarm note     <id>                               print a submission's note
  swarm sync     [file.js]                           pull the current best policy

policy file:  function step(a, env, rng) { return {dx, dy}; }   // dx,dy ∈ -1,0,1
score:        agents × mean-steps-to-${Math.round(TARGET * 100)}%-coverage, lower wins, floor ${FLOOR}`;

async function main() {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  const cmd = pos[0];
  const cfg = loadCfg();
  if (opt.url) cfg.apiUrl = opts(opt, "url");
  const n = Math.max(1, Math.min(500, parseInt(opts(opt, "agents", "120"), 10) || 120));

  if (cmd === "register") {
    if (!pos[1]) throw new Error("usage: swarm register <handle>");
    const d = await api(cfg, "/api/register", { method: "POST", body: { handle: pos[1] } });
    saveCfg({ apiUrl: cfg.apiUrl || DEFAULT_URL, token: d.apiKey, handle: d.handle });
    console.log(`\n  registered as @${d.handle}`);
    console.log(`  API key:  ${d.apiKey}`);
    console.log(`  saved to ${CFG} — you're logged in. Keep the key safe.\n`);
    return;
  }
  if (cmd === "login") {
    if (!pos[1]) throw new Error("usage: swarm login <api-key>");
    const next = { apiUrl: cfg.apiUrl || DEFAULT_URL, token: pos[1] };
    const me = await api(next, "/api/me", { auth: true });
    saveCfg({ ...next, handle: me.handle });
    console.log(`\n  logged in as @${me.handle}\n`);
    return;
  }
  if (cmd === "whoami" || cmd === "config") {
    if (!cfg.handle) { console.log("\n  not logged in — run: swarm register <handle>  (or) swarm login <api-key>\n"); return; }
    console.log(`\n  @${cfg.handle}  ·  ${cfg.apiUrl || DEFAULT_URL}\n`);
    return;
  }
  if (cmd === "benchmark") {
    console.log(`\nswarm.fail · the fixed task\n`);
    console.log(`  cover an unknown ${W}×${H} grid with N agents running ONE shared local policy`);
    console.log(`  score = agents × mean steps to ${Math.round(TARGET * 100)}% coverage, over ${SEEDS.length} fixed seeds`);
    console.log(`  seeds = ${SEEDS.join(", ")}`);
    console.log(`  lower wins · floor ${FLOOR} · cap ${CAP} steps · baseline: the Lévy-flight forager\n`);
    return;
  }

  if (cmd === "run") {
    if (!pos[1]) throw new Error("usage: swarm run <file.js> [--agents N]");
    const r = scoreFile(pos[1], n);
    console.log(`\nswarm.fail · ${pos[1]}\n`); printScore(r, n);
    const stamp = new Date().toISOString();
    writeFileSync("score.json", JSON.stringify({ timestamp: stamp, agents: n, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok, floor: FLOOR }, null, 2));
    if (!existsSync("results.tsv")) appendFileSync("results.tsv", "timestamp\thandle\tagents\tmean_steps\tscore\tok\n");
    appendFileSync("results.tsv", `${stamp}\t${cfg.handle || "local"}\t${n}\t${r.meanSteps}\t${r.score}\t${r.ok ? "OK" : "FAIL"}\n`);
    console.log(`\n  wrote score.json, appended results.tsv`);
    return;
  }

  if (cmd === "submit") {
    if (!pos[1]) throw new Error("usage: swarm submit <file.js> --note-file <md> --model \"<model>\"");
    const model = opts(opt, "model", "");
    const noteFile = opts(opt, "note-file", "");
    if (!model || model === true) throw new Error("--model is required (the AI model you used, e.g. \"Claude Opus 4.8\", \"GPT-5\", or \"human\")");
    if (!noteFile || noteFile === true) throw new Error("--note-file is required (public markdown explaining your approach)");
    const note = readFileSync(noteFile, "utf8");
    const r = scoreFile(pos[1], n);
    console.log(`\nswarm.fail · submitting ${pos[1]} as @${cfg.handle || "?"} (local score ${r.score})\n`); printScore(r, n);
    const d = await api(cfg, "/api/submit", { method: "POST", auth: true, body: { src: r.src, n, model, note } });
    if (d.score !== r.score) console.log(`\n  ⚠ server score ${d.score} ≠ local ${r.score} — engine mismatch!`);
    console.log(`\n  submitted [${d.id}] · model ${d.model}` + (d.ok ? ` · rank ${d.rank}/${d.total}` : ` · FAIL (unranked)`) + `\n`);
    return;
  }

  if (cmd === "submissions") {
    const all = !!opt.all;
    const d = await api(cfg, "/api/submissions" + (all ? "?all=1" : ""), { auth: !all });
    console.log(`\nswarm.fail · ${all ? "all submissions" : "your submissions"} · floor ${FLOOR}\n`);
    console.log("  id          score   agents  handle            model");
    d.entries.forEach((e) => console.log(`  ${e.id.padEnd(10)}  ${String(e.score).padStart(6)}  ${String(e.n).padStart(6)}  ${("@" + e.handle).padEnd(16)}  ${e.model || ""}`));
    if (!d.entries.length) console.log("  (none)");
    console.log("");
    return;
  }
  if (cmd === "note") {
    if (!pos[1]) throw new Error("usage: swarm note <id>");
    const d = await api(cfg, "/api/note/" + pos[1]);
    console.log(`\n# ${d.id} · @${d.handle} · ${d.model} · score ${d.score}\n\n${d.note}\n`);
    return;
  }
  if (cmd === "sync") {
    const file = pos[1] || "best-policy.js";
    const d = await api(cfg, "/api/best");
    writeFileSync(file, d.src);
    console.log(`\n  current best: ${d.score} by @${d.handle} (${d.model})`);
    console.log(`  wrote ${file} — improve from the frontier, then submit\n`);
    return;
  }
  if (cmd === "board") { const d = await api(cfg, "/api/submissions?all=1"); console.log(""); d.entries.forEach((e, i) => console.log(`  ${String(i + 1).padStart(2)}  ${String(e.score).padStart(6)}  @${e.handle}  ${e.model || ""}`)); console.log(""); return; }

  console.log(HELP);
}

main().catch((e) => { console.error("\n  error: " + e.message + "\n"); process.exit(1); });
