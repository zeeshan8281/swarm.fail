#!/usr/bin/env node
/*
 * Which of these files actually changed their CODE between two commits?
 *
 * A copy sweep across submissions/ (renaming a word in the `// @note` headers,
 * say) is not a submission and shouldn't be scored — but a diff can't tell the
 * difference, so CI complained about a PR that touched four policies without
 * changing a single instruction.
 *
 *   node scripts/code-changed.mjs <baseRef> <headRef> <file...>   # prints the code-changed files
 *
 * Conservative on purpose: only whole-line comments and blank lines are ignored.
 * A trailing comment on a line of code (`return m; // why`) counts as a code
 * change, so the answer errs toward scoring. Nothing can be smuggled past the
 * scorer by hiding it in a string that happens to contain `//`.
 */
import { execFileSync } from "node:child_process";

const show = (ref, file) => {
  try {
    return execFileSync("git", ["show", `${ref}:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null; // absent on that side — a genuinely new or deleted file
  }
};

// strip full-line `//` comments and blank lines; normalise trailing whitespace
const code = (src) =>
  src
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l !== "" && !/^\s*\/\//.test(l))
    .join("\n");

const [base, head, ...files] = process.argv.slice(2);
if (!base || !head || !files.length) {
  console.error("usage: code-changed.mjs <baseRef> <headRef> <file...>");
  process.exit(2);
}

for (const f of files) {
  const before = show(base, f), after = show(head, f);
  if (before === null || after === null) { console.log(f); continue; }  // added or removed
  if (code(before) !== code(after)) console.log(f);
}
