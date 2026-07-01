import { NextResponse } from "next/server";
import { scorePolicy } from "@/lib/sandbox";
import { upsert, policyId, list } from "@/lib/store";
import { authHandle } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

// Authenticated submit. Like ecdsa.fail: a public note and the --model used are
// both REQUIRED, and the submission is attributed to your account.
export async function POST(req: Request) {
  const handle = await authHandle(req);
  if (!handle) return NextResponse.json({ error: "unauthorized — run: swarm login <api-key>" }, { status: 401 });

  let body: { src?: string; n?: number; model?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }

  const src = (body.src || "").toString();
  const model = (body.model || "").toString().trim().slice(0, 60);
  const note = (body.note || "").toString().slice(0, 10240); // 10 KiB, like ecdsa
  const n = Number(body.n ?? 120);
  if (!src.trim()) return NextResponse.json({ error: "empty policy" }, { status: 400 });
  if (!model) return NextResponse.json({ error: "--model is required (the AI model you used, e.g. \"Claude Opus 4.8\", \"GPT-5\", or \"human\")" }, { status: 400 });
  if (!note.trim()) return NextResponse.json({ error: "--note-file is required (public markdown explaining your approach)" }, { status: 400 });

  let r;
  try { r = scorePolicy(src, n); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 400 }); }

  const id = policyId(handle, src, r.n);
  await upsert({ id, handle, model, note, n: r.n, meanSteps: r.meanSteps, score: r.score, per: r.per, ok: r.ok, src, createdAt: Date.now() });

  let rank = 0, total = 0;
  if (r.ok) { const board = await list(); rank = board.findIndex((e) => e.id === id) + 1; total = board.length; }
  return NextResponse.json({ id, handle, model, n: r.n, meanSteps: r.meanSteps, score: r.score, ok: r.ok, rank, total });
}
