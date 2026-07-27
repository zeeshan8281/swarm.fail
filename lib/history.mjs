import { execFileSync } from "node:child_process";

/*
 * Who landed what, and when — read straight out of git.
 *
 * The git history of submissions/ IS the leaderboard, so it is also the only
 * honest source for "when did this record fall" and "whose account landed it".
 * No database, nothing to keep in sync: the commit that added the file is the
 * submission event.
 *
 * Degrades to nulls if git isn't available (a shallow build clone, a tarball
 * deploy). Callers must treat the history as optional — the board still works
 * without it, it just loses the timeline.
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

/** handle -> { landedAt, author, login } for every submissions/<handle>.js */
export function submissionOrigins(handles) {
  const out = {};
  for (const handle of handles) {
    // last line = the oldest commit that touched it = when it landed
    const log = git(["log", "--diff-filter=A", "--format=%aI%x00%an%x00%ae", "--", `submissions/${handle}.js`]);
    const line = log ? log.split("\n").pop() : "";
    const [at, name, email] = line ? line.split("\0") : [];
    out[handle] = { landedAt: at || null, author: name || null, login: loginFromEmail(email) };
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
