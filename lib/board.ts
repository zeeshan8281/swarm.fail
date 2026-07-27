import { createHash } from "node:crypto";
import { readSubmissions } from "@/lib/submissions.mjs";
import { scorePolicy, MIN_AGENTS } from "@/lib/score.mjs";
import { submissionOrigins, recordProgression, modelCredit } from "@/lib/history.mjs";
import { POLICIES, ORDER } from "@/lib/policies";

/*
 * The board, computed from the committed files. Shared by the API route and the
 * page shell so the record is in the prerendered HTML instead of arriving after
 * a fetch — it is the number the whole page is about.
 */
export type Entry = { kind: "reference" | "submission"; handle: string; model: string; tag: string; note: string; n: number; meanSteps: number; score: number; landedAt?: string | null; author?: string | null; login?: string | null };
export type Attempt = { handle: string; model: string; note: string; n: number; score: number | null; ok: boolean; reason: string; landedAt: string | null; author: string | null; login: string | null };
export type Board = {
  entries: Entry[];
  attempts: Attempt[];
  progression: ReturnType<typeof recordProgression>;
  models: ReturnType<typeof modelCredit>;
};
let cache: { key: string; board: Board } | null = null;

export function buildBoard(): Board {
  const subs = readSubmissions() as { handle: string; model: string; note: string; agents: number; src: string }[];
  const key = createHash("sha256").update(subs.map((s) => s.handle + s.agents + s.src).join("|")).digest("hex");

  if (!cache || cache.key !== key) {
    const entries: Entry[] = [];
    for (const k of ORDER) {
      const b = POLICIES[k];
      const r = scorePolicy(b.src, b.n);
      // same gate as submissions — a reference that can't cover the maps (Bounce
      // Sweep, since the mazes landed) is not a leaderboard entry either
      if (r.ok) entries.push({ kind: "reference", handle: b.name, model: "reference", tag: b.tag, note: "", n: r.n, meanSteps: r.meanSteps, score: r.score });
    }

    // Every attempt, not just the ones that rank — with the reason it didn't.
    const origins = submissionOrigins(subs.map((s) => s.handle)) as Record<string, { landedAt: string | null; author: string | null; login: string | null }>;
    const attempts: Attempt[] = [];
    for (const s of subs) {
      const o = origins[s.handle] ?? { landedAt: null, author: null, login: null };
      const base = { handle: s.handle, model: s.model, note: s.note, n: s.agents, ...o };
      try {
        const r = scorePolicy(s.src, s.agents);
        const reason = r.ok ? "" : s.agents < MIN_AGENTS
          ? `fielded ${s.agents} ${s.agents === 1 ? "agent" : "agents"} — a ranked run needs at least ${MIN_AGENTS}`
          : "did not explore 95% of every map inside the step cap";
        attempts.push({ ...base, score: r.score, ok: r.ok, reason });
        if (r.ok) entries.push({ kind: "submission", tag: "", meanSteps: r.meanSteps, score: r.score, ...base });
      } catch (e) {
        attempts.push({ ...base, score: null, ok: false, reason: `could not be scored: ${(e as Error).message}` });
      }
    }

    entries.sort((a, b) => a.score - b.score);
    attempts.sort((a, b) => (b.landedAt ?? "").localeCompare(a.landedAt ?? ""));
    const progression = recordProgression(entries.filter((e) => e.kind === "submission"));
    cache = { key, board: { entries, attempts, progression, models: modelCredit(progression, entries.filter((e) => e.kind === "submission")) } };
  }
  return cache.board;
}
