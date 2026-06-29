import { NextResponse } from "next/server";
import { get } from "@/lib/store";
import { scorePolicy } from "@/lib/sandbox";

export const runtime = "nodejs";
export const maxDuration = 30;

// The honesty model, enforced: re-run a stored submission and confirm the score.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await get(id);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const fresh = scorePolicy(entry.src, entry.n);
  return NextResponse.json({
    id,
    n: entry.n,
    stored: entry.score,
    recomputed: fresh.score,
    match: fresh.score === entry.score && fresh.ok === entry.ok,
    ok: fresh.ok,
    per: fresh.per,
  });
}
