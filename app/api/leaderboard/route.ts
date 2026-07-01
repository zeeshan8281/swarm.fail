import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { readSubmissions } from "@/lib/submissions.mjs";
import { scorePolicy } from "@/lib/score.mjs";
import { POLICIES, ORDER } from "@/lib/policies";

export const runtime = "nodejs";

type Entry = { kind: "reference" | "submission"; handle: string; model: string; tag: string; note: string; n: number; meanSteps: number; score: number };
let cache: { key: string; entries: Entry[] } | null = null;

export async function GET() {
  const subs = readSubmissions() as { handle: string; model: string; note: string; agents: number; src: string }[];
  const key = createHash("sha256").update(subs.map((s) => s.handle + s.agents + s.src).join("|")).digest("hex");

  if (!cache || cache.key !== key) {
    const entries: Entry[] = [];
    for (const k of ORDER) {
      const b = POLICIES[k];
      const r = scorePolicy(b.src, b.n);
      entries.push({ kind: "reference", handle: b.name, model: "reference", tag: b.tag, note: "", n: r.n, meanSteps: r.meanSteps, score: r.score });
    }
    for (const s of subs) {
      try {
        const r = scorePolicy(s.src, s.agents);
        if (r.ok) entries.push({ kind: "submission", handle: s.handle, model: s.model, tag: "", note: s.note, n: r.n, meanSteps: r.meanSteps, score: r.score });
      } catch { /* skip unscoreable submission */ }
    }
    entries.sort((a, b) => a.score - b.score);
    cache = { key, entries };
  }
  return NextResponse.json({ entries: cache.entries });
}
