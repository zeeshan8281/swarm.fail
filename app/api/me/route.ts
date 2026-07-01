import { NextResponse } from "next/server";
import { authHandle } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const handle = await authHandle(req);
  if (!handle) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ handle });
}
