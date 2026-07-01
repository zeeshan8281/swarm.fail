import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Each submission is submissions/<handle>.js — a normal policy file with a
// `function step(...)` and a metadata header of `// @key value` comment lines.
// The file is read as TEXT (never imported), so its code only ever runs inside
// the scoring sandbox. Handle = filename.
const DIR = join(process.cwd(), "submissions");

const meta = (src, key, dflt) => {
  const m = src.match(new RegExp("^//\\s*@" + key + "\\s+(.+)$", "m"));
  return m ? m[1].trim() : dflt;
};

export function readSubmissions() {
  let files;
  try { files = readdirSync(DIR).filter((f) => f.endsWith(".js")); } catch { return []; }
  return files.map((f) => {
    const src = readFileSync(join(DIR, f), "utf8");
    const agents = parseInt(meta(src, "agents", "120"), 10);
    return {
      handle: f.replace(/\.js$/, ""),
      model: meta(src, "model", "unknown"),
      note: meta(src, "note", ""),
      agents: Math.max(1, Math.min(500, Number.isFinite(agents) ? agents : 120)),
      src,
    };
  });
}
