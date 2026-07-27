import { NextResponse } from "next/server";
import { buildBoard } from "@/lib/board";

export const runtime = "nodejs";
// The board is derived entirely from files committed to this repo, so it is
// build-time data: prerender it once instead of rescoring every submission on
// every cold start. That was ~13s of CPU per cold start and had already blown
// the function budget once (a bare 500 in production). Route Handlers are not
// cached by default in Next 16 — force-static is the opt-in, and it applies
// because this project does not enable cacheComponents.
export const dynamic = "force-static";
// belt and braces: if it ever does run at request time, give it room
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json(buildBoard());
}
