import { NextResponse } from "next/server";
import { list } from "@/lib/store";

export const runtime = "nodejs";

// The current best promoted submission — `swarm sync` pulls this so you build
// from the frontier, not a stale baseline (mirrors ecdsa.fail sync).
export async function GET() {
  const best = (await list(1))[0];
  if (!best) return NextResponse.json({ error: "no submissions yet" }, { status: 404 });
  return NextResponse.json({ id: best.id, handle: best.handle, model: best.model, score: best.score, n: best.n, src: best.src });
}
