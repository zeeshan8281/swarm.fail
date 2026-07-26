#!/usr/bin/env node
// Score the leaderboard from committed files. Used locally and by CI.
//   node scripts/score-submissions.mjs                 # print the board
//   node scripts/score-submissions.mjs --check <handle> # JSON: score + beats-best (for CI)
import { readSubmissions } from "../lib/submissions.mjs";
import { scorePolicy } from "../lib/score.mjs";
import { POLICIES, ORDER } from "../lib/policies.mjs";
import { FLOOR } from "../lib/engine.mjs";

function bestExcluding(handle, subs) {
  let best = Infinity;
  for (const k of ORDER) { const b = POLICIES[k]; try { const r = scorePolicy(b.src, b.n); if (r.ok && r.score < best) best = r.score; } catch {} }
  for (const s of subs) { if (s.handle === handle) continue; try { const r = scorePolicy(s.src, s.agents); if (r.ok && r.score < best) best = r.score; } catch {} }
  return best;
}

const args = process.argv.slice(2);

if (args[0] === "--check") {
  const handle = args[1];
  const subs = readSubmissions();
  const sub = subs.find((s) => s.handle === handle);
  const out = { handle, floor: FLOOR };
  if (!sub) { out.error = `no submissions/${handle}.js`; console.log(JSON.stringify(out)); process.exit(0); }
  try {
    const r = scorePolicy(sub.src, sub.agents);
    out.ok = r.ok; out.score = r.score; out.meanSteps = r.meanSteps; out.agents = r.n;
    out.best = bestExcluding(handle, subs);
    out.beats = r.ok && r.score < out.best;
  } catch (e) { out.ok = false; out.error = e.message; }
  console.log(JSON.stringify(out));
} else {
  const rows = [];
  for (const k of ORDER) { const b = POLICIES[k]; const r = scorePolicy(b.src, b.n); rows.push({ who: b.name, model: "reference", ...r }); }
  for (const s of readSubmissions()) {
    try { const r = scorePolicy(s.src, s.agents); rows.push({ who: s.handle, model: s.model, ...r }); }
    catch (e) { rows.push({ who: s.handle, model: s.model, ok: false, score: Infinity, n: s.agents, meanSteps: 0, err: e.message }); }
  }
  // unranked rows sort last and print FAIL — the API already drops them, so the
  // CLI board must not show a not-ok policy sitting on the leaderboard.
  rows.sort((a, b) => (a.ok === b.ok ? a.score - b.score : a.ok ? -1 : 1));
  console.log(`\nswarm.fail leaderboard · floor ${FLOOR}\n`);
  console.log("   score  agents  moves  who               model");
  rows.forEach((r) => console.log(
    `  ${String(r.ok ? r.score : "FAIL").padStart(6)}  ${String(r.n).padStart(6)}  ${String(r.meanSteps).padStart(5)}  ${String(r.who).padEnd(16)}  ${r.model || ""}`
  ));
  console.log("");
}
