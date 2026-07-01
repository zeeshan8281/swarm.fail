import { NextResponse } from "next/server";
import { list, mine } from "@/lib/store";
import { authHandle } from "@/lib/auth";

export const runtime = "nodejs";

// ?all=1 → every public submission. Otherwise your own (requires auth).
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all");
  if (all) {
    const entries = (await list()).map(({ id, handle, model, score, n, meanSteps, createdAt }) => ({ id, handle, model, score, n, meanSteps, createdAt }));
    return NextResponse.json({ entries });
  }
  const handle = await authHandle(req);
  if (!handle) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const entries = (await mine(handle)).map(({ id, handle, model, score, n, meanSteps, ok, createdAt }) => ({ id, handle, model, score, n, meanSteps, ok, createdAt }));
  return NextResponse.json({ entries });
}
