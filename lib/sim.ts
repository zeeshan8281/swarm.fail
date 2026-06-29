// Typed surface over the shared engine (lib/engine.mjs). The engine is plain JS
// so the CLI, the server sandbox, and the browser all run the identical code.
import {
  ENGINE_SRC, simulate, scoreOne, scoreSeeds, mulberry32,
  W, H, TARGET, CAP, SEEDS, FLOOR,
} from "./engine.mjs";

export { ENGINE_SRC, W, H, TARGET, CAP, SEEDS, FLOOR };

export type Move = { dx: number; dy: number };
export type Agent = { id: number; n: number; x: number; y: number; heading: number; mem: Record<string, unknown> };
export type SimEnv = { w: number; h: number; here: boolean };
export type Policy = (a: Agent, env: SimEnv, rng: () => number) => Move;
export type Sim = {
  agents: Agent[];
  covered: Uint8Array;
  tick: () => number;
  readonly step: number;
  readonly frac: number;
  runToScore: () => number;
};
export type SeedScore = { per: number[]; meanSteps: number; ok: boolean; score: number };

const _simulate = simulate as (step: Policy, n: number, seed: number) => Sim;
const _scoreOne = scoreOne as (step: Policy, n: number, seed: number) => number;
const _scoreSeeds = scoreSeeds as (step: Policy, n: number, seeds: number[]) => SeedScore;
const _mulberry32 = mulberry32 as (seed: number) => () => number;

export {
  _simulate as simulate,
  _scoreOne as scoreOne,
  _scoreSeeds as scoreSeeds,
  _mulberry32 as mulberry32,
};

/** Compile untrusted policy source on the CLIENT (arena preview only). Throws on bad source. */
export function compilePolicy(src: string): Policy {
  const fn = new Function(src + "\n;return step;")();
  if (typeof fn !== "function") throw new Error("no step() function found");
  return fn as Policy;
}
