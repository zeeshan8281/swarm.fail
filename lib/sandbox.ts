import vm from "node:vm";
import { ENGINE_SRC } from "./sim";

export type ScoreResult = {
  n: number;
  meanSteps: number;
  score: number;   // n × meanSteps — lower wins. Floor 1520.
  per: number[];
  ok: boolean;     // reached coverage on EVERY public seed (else FAIL, unranked)
};

const TIMEOUT_MS = 8000; // covers the whole seed sweep, incl. any infinite loop

/**
 * Official scorer. The whole simulation (trusted engine + the user's step body)
 * runs inside one vm.runInContext call, so the timeout kills a while(true)
 * anywhere. The context is bare — no require/process/fetch — so a policy reads
 * and reaches nothing. Pure function in, one validated number out.
 *
 * ponytail: node:vm isn't a hard boundary (shared heap, no mem cap). Fine for a
 * deterministic benchmark. Upgrade path: isolated-vm / a separate process.
 */
export function scorePolicy(src: string, n: number): ScoreResult {
  if (typeof src !== "string" || src.length > 20000) throw new Error("policy source too large");
  const N = Math.floor(n);
  if (!Number.isFinite(N) || N < 1 || N > 500) throw new Error("agents must be an integer in 1..500");

  const context = vm.createContext(Object.create(null)); // no inherited globals
  const program = `
    "use strict";
    ${ENGINE_SRC}
    var __step = (function () { ${src}\n; return step; })();
    if (typeof __step !== "function") throw new Error("no step() function found");
    JSON.stringify(scoreSeeds(__step, ${N}, SEEDS));
  `;

  let out: string;
  try {
    out = vm.runInContext(program, context, { timeout: TIMEOUT_MS, displayErrors: false });
  } catch (e) {
    const msg = (e as Error).message || String(e);
    if (/timed out/i.test(msg)) throw new Error("policy timed out (infinite loop or too slow)");
    throw new Error("policy error: " + msg);
  }
  const r = JSON.parse(out) as { per: number[]; meanSteps: number; ok: boolean; score: number };
  if (!Number.isFinite(r.score)) throw new Error("policy produced no valid score");
  return { n: N, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok };
}
