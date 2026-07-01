// Typed re-export over the shared data module (lib/policies.mjs).
import { POLICIES as P, ORDER as O, DEFAULT_N as D } from "./policies.mjs";

export type Builtin = { key: string; name: string; tag: "" | "floor" | "baseline" | "win"; n: number; src: string };

export const POLICIES = P as Record<string, Builtin>;
export const ORDER = O as string[];
export const DEFAULT_N = D as number;
