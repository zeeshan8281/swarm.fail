import vm from "node:vm";
import { ENGINE_SRC } from "./engine.mjs";

// Score an untrusted policy in a bare vm sandbox — the whole run happens inside
// one timed runInContext, so an infinite loop is killed and the policy can reach
// no ambient globals (no require/process/fetch). Same engine everywhere.
const TIMEOUT_MS = 8000;

export function scorePolicy(src, n) {
  if (typeof src !== "string" || src.length > 20000) throw new Error("policy source too large");
  const N = Math.floor(n);
  if (!Number.isFinite(N) || N < 1 || N > 500) throw new Error("agents must be an integer in 1..500");

  const context = vm.createContext(Object.create(null));
  const program = `
    "use strict";
    ${ENGINE_SRC}
    var __step = (function () { ${src}\n; return step; })();
    if (typeof __step !== "function") throw new Error("no step() function found");
    JSON.stringify(scoreSeeds(__step, ${N}, SEEDS));
  `;
  let out;
  try {
    out = vm.runInContext(program, context, { timeout: TIMEOUT_MS, displayErrors: false });
  } catch (e) {
    const m = (e && e.message) || String(e);
    if (/timed out/i.test(m)) throw new Error("policy timed out (infinite loop or too slow)");
    throw new Error("policy error: " + m);
  }
  const r = JSON.parse(out);
  if (!Number.isFinite(r.score)) throw new Error("policy produced no valid score");
  return { n: N, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok };
}
