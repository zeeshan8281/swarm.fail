import { NextResponse } from "next/server";
import { get } from "@/lib/store";

export const runtime = "nodejs";

// Public note attached to a submission (by id or unique prefix).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await get(id);
  if (!e) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ id: e.id, handle: e.handle, model: e.model, score: e.score, n: e.n, note: e.note });
}
