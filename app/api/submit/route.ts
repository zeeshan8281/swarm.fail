import { NextResponse } from "next/server";
import { scorePolicy } from "@/lib/sandbox";
import { upsert, policyId, list } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  let body: { name?: string; src?: string; n?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "anon").toString().trim().slice(0, 32) || "anon";
  const src = (body.src || "").toString();
  const n = Number(body.n ?? 120);
  if (!src.trim()) return NextResponse.json({ error: "empty policy" }, { status: 400 });

  let r;
  try {
    r = scorePolicy(src, n); // official, sandboxed, deterministic
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const id = policyId(src, r.n);
  await upsert({ id, name, n: r.n, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok, src, createdAt: Date.now() });

  // ok=false means it failed to cover some map — logged but not ranked.
  let rank = 0, total = 0;
  if (r.ok) {
    const board = await list();
    rank = board.findIndex((e) => e.id === id) + 1;
    total = board.length;
  }
  return NextResponse.json({
    id, name, n: r.n, meanSteps: r.meanSteps, score: r.score, ok: r.ok, per: r.per, rank, total,
  });
}
