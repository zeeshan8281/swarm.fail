import { NextResponse } from "next/server";
import { list } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const entries = (await list()).map(({ id, handle, model, score, n, meanSteps, createdAt }) => ({ id, handle, model, score, n, meanSteps, createdAt }));
  return NextResponse.json({ entries });
}
