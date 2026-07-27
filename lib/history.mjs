import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * Who landed what, and when — read straight out of git.
 *
 * The git history of submissions/ IS the leaderboard, so it is also the only
 * honest source for "when did this record fall" and "whose account landed it".
 * No database, nothing to keep in sync: the commit that added the file is the
 * submission event.
 *
 * data/landed.json is the source of truth, because hosts shallow-clone: in a
 * truncated history the oldest commit *appears* to add every file in it, so
 * `git log --diff-filter=A` returns the wrong date without erroring. Live git
 * only fills in handles the file doesn't cover — correct for anything landed
 * recently enough to sit inside a shallow window — and is ignored entirely for
 * dates that resolve to the clone's boundary commit.
 *
 * Refresh the file from a full clone with `node scripts/landed.mjs`. Degrades
 * to nulls when neither source can answer: callers treat the timeline as
 * optional and the chart hides itself rather than lying.
 */

const git = (args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

// GitHub rewrites commit emails as <id>+<login>@users.noreply.github.com, which
// is the one place a commit reliably carries the account name.
function loginFromEmail(email) {
  const m = /^(?:\d+\+)?([A-Za-z0-9-]+)@users\.noreply\.github\.com$/.exec(email || "");
  return m ? m[1] : null;
}

let frozen = null;
function snapshot() {
  if (frozen) return frozen;
  try { frozen = JSON.parse(readFileSync(join(process.cwd(), "data", "landed.json"), "utf8")); }
  catch { frozen = {}; }
  return frozen;
}

// In a shallow clone every file looks like it was added by the boundary commit.
// Anything resolving to that commit is unknowable here, not July 15th.
const boundary = (() => {
  if (git(["rev-parse", "--is-shallow-repository"]) !== "true") return null;
  return git(["rev-list", "--max-parents=0", "HEAD"]).split("\n").pop() || null;
})();

/** handle -> { landedAt, author, login } for every submissions/<handle>.js */
export function submissionOrigins(handles) {
  const known = snapshot();
  const out = {};
  for (const handle of handles) {
    if (known[handle]) { out[handle] = known[handle]; continue; }
    // last line = the oldest commit that touched it = when it landed
    const log = git(["log", "--diff-filter=A", "--format=%H%x00%aI%x00%an%x00%ae", "--", `submissions/${handle}.js`]);
    const line = log ? log.split("\n").pop() : "";
    const [sha, at, name, email] = line ? line.split("\0") : [];
    const trustworthy = at && sha !== boundary;
    out[handle] = trustworthy
      ? { landedAt: at, author: name || null, login: loginFromEmail(email) }
      : { landedAt: null, author: null, login: null };
  }
  return out;
}

/**
 * The record progression: every moment the best score improved, in order.
 * Only ranked entries can hold the record — a FAIL never counts.
 */
export function recordProgression(ranked) {
  const dated = ranked.filter((e) => e.landedAt).sort((a, b) => a.landedAt.localeCompare(b.landedAt));
  const points = [];
  let best = Infinity;
  for (const e of dated) {
    if (e.score >= best) continue;
    const from = Number.isFinite(best) ? best : null;
    best = e.score;
    points.push({
      at: e.landedAt, score: e.score, handle: e.handle, model: e.model,
      from, gained: from ? +(((from - e.score) / from) * 100).toFixed(2) : null,
    });
  }
  return points;
}

/**
 * Cumulative improvement per model: when a model takes the record, it is
 * credited with the percentage it cut off the previous one. Says which model
 * actually moved the frontier, rather than which one holds it right now.
 */
export function modelCredit(progression, ranked) {
  const by = {};
  const bump = (m) => (by[m] ||= { model: m, gained: 0, records: 0, best: Infinity, entries: 0 });
  for (const e of ranked) { const b = bump(e.model || "unknown"); b.entries++; b.best = Math.min(b.best, e.score); }
  for (const p of progression) { const b = bump(p.model || "unknown"); b.records++; b.gained += p.gained || 0; }
  return Object.values(by)
    .map((b) => ({ ...b, gained: +b.gained.toFixed(1) }))
    .sort((a, b) => b.gained - a.gained || a.best - b.best);
}
