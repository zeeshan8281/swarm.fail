#!/usr/bin/env node
/*
 * Freeze "when did each submission land, and who landed it" into data/landed.json.
 *
 * Why a file and not just git at build time: hosts shallow-clone. In a truncated
 * history the oldest commit *appears* to add every file that exists in it, so
 * `git log --diff-filter=A` silently returns the wrong date — production had
 * every July entry stamped with the same timestamp. A wrong timeline is worse
 * than no timeline.
 *
 * Run from a full clone after landing a submission:  node scripts/landed.mjs
 * Entries missing from the file still fall back to live git, which is correct
 * for anything recent enough to be inside a shallow window.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();

if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
  console.error("refusing to run in a shallow clone — the add-commits would be wrong");
  process.exit(1);
}

const loginFromEmail = (email) => {
  const m = /^(?:\d+\+)?([A-Za-z0-9-]+)@users\.noreply\.github\.com$/.exec(email || "");
  return m ? m[1] : null;
};

const handles = readdirSync("submissions").filter((f) => f.endsWith(".js")).map((f) => f.replace(/\.js$/, ""));
const out = {};
for (const handle of handles) {
  const log = git(["log", "--diff-filter=A", "--format=%aI%x00%an%x00%ae", "--", `submissions/${handle}.js`]);
  const [at, name, email] = (log.split("\n").pop() || "").split("\0");
  if (!at) continue;
  out[handle] = { landedAt: at, author: name || null, login: loginFromEmail(email) };
}

mkdirSync("data", { recursive: true });
writeFileSync(join("data", "landed.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`wrote data/landed.json — ${Object.keys(out).length} submissions`);
for (const [h, v] of Object.entries(out)) console.log(`  ${h.padEnd(18)} ${v.landedAt.slice(0, 10)}  ${v.login || v.author}`);
