import { NextResponse } from "next/server";
import { createAccount, accountByHandle } from "@/lib/store";

export const runtime = "nodejs";

// Claim a handle, get an API key. Mirrors ecdsa.fail's "get a key, then login".
export async function POST(req: Request) {
  let body: { handle?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }
  const handle = (body.handle || "").toString().trim().toLowerCase();
  if (!/^[a-z0-9_-]{3,32}$/.test(handle)) return NextResponse.json({ error: "handle must be 3–32 chars: a–z 0–9 _ -" }, { status: 400 });
  if (await accountByHandle(handle)) return NextResponse.json({ error: "handle taken" }, { status: 409 });
  const { apiKey } = await createAccount(handle);
  return NextResponse.json({ handle, apiKey });
}
