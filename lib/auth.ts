import { accountByKey } from "./store";

// Resolve the account handle from a Bearer API key, or null.
export async function authHandle(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const acct = await accountByKey(m[1].trim());
  return acct?.handle ?? null;
}
