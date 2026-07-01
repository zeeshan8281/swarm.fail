import { promises as fs } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";

// A submission — mirrors ecdsa.fail: account-scoped, carries a public note and
// the AI model used, so the leaderboard shows who/what made each entry.
export type Entry = {
  id: string;        // hash of (handle + source + n)
  handle: string;    // the authenticated account
  model: string;     // AI model used (e.g. "Claude Opus 4.8", "GPT-5", "human")
  note: string;      // public markdown note
  n: number;
  meanSteps: number;
  score: number;     // n × meanSteps — lower wins. Floor 1520.
  per: number[];
  ok: boolean;
  src: string;
  createdAt: number;
};

export type Account = { handle: string; keyHash: string; createdAt: number };

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
export const hashKey = (key: string) => sha(key);
export const policyId = (handle: string, src: string, n: number) => sha(handle + "\n" + src.trim() + "@" + n).slice(0, 10);
export const newApiKey = () => "swm_" + randomBytes(24).toString("hex");

const USE_PG = !!process.env.DATABASE_URL;

type Store = {
  list(limit?: number): Promise<Entry[]>;
  get(id: string): Promise<Entry | undefined>;
  mine(handle: string): Promise<Entry[]>;
  upsert(e: Entry): Promise<Entry>;
  createAccount(handle: string): Promise<{ handle: string; apiKey: string }>;
  accountByKey(key: string): Promise<Account | undefined>;
  accountByHandle(handle: string): Promise<Account | undefined>;
};

function pgStore(): Store {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as typeof import("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let ready: Promise<void> | null = null;
  const init = () =>
    (ready ??= (async () => {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS accounts (
           handle TEXT PRIMARY KEY, key_hash TEXT NOT NULL, created_at BIGINT NOT NULL )`
      );
      await pool.query(
        `CREATE TABLE IF NOT EXISTS subs (
           id TEXT PRIMARY KEY, handle TEXT NOT NULL, model TEXT NOT NULL, note TEXT NOT NULL,
           n INT NOT NULL, mean_steps INT NOT NULL, score INT NOT NULL, per JSONB NOT NULL,
           ok BOOLEAN NOT NULL, src TEXT NOT NULL, created_at BIGINT NOT NULL )`
      );
    })());
  const row = (r: Record<string, unknown>): Entry => ({
    id: r.id as string, handle: r.handle as string, model: r.model as string, note: r.note as string,
    n: r.n as number, meanSteps: r.mean_steps as number, score: r.score as number, per: r.per as number[],
    ok: r.ok as boolean, src: r.src as string, createdAt: Number(r.created_at),
  });
  return {
    async list(limit = 100) { await init(); const { rows } = await pool.query("SELECT * FROM subs WHERE ok = true ORDER BY score ASC LIMIT $1", [limit]); return rows.map(row); },
    async get(id) { await init(); const { rows } = await pool.query("SELECT * FROM subs WHERE id = $1 OR id LIKE $2 LIMIT 1", [id, id + "%"]); return rows[0] ? row(rows[0]) : undefined; },
    async mine(handle) { await init(); const { rows } = await pool.query("SELECT * FROM subs WHERE handle = $1 ORDER BY score ASC", [handle]); return rows.map(row); },
    async upsert(e) {
      await init();
      await pool.query(
        `INSERT INTO subs (id,handle,model,note,n,mean_steps,score,per,ok,src,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO UPDATE SET model=EXCLUDED.model, note=EXCLUDED.note, created_at=EXCLUDED.created_at`,
        [e.id, e.handle, e.model, e.note, e.n, e.meanSteps, e.score, JSON.stringify(e.per), e.ok, e.src, e.createdAt]
      );
      return e;
    },
    async createAccount(handle) {
      await init();
      const apiKey = newApiKey();
      await pool.query("INSERT INTO accounts (handle,key_hash,created_at) VALUES ($1,$2,$3)", [handle, hashKey(apiKey), Date.now()]);
      return { handle, apiKey };
    },
    async accountByKey(key) { await init(); const { rows } = await pool.query("SELECT * FROM accounts WHERE key_hash=$1", [hashKey(key)]); return rows[0] ? { handle: rows[0].handle, keyHash: rows[0].key_hash, createdAt: Number(rows[0].created_at) } : undefined; },
    async accountByHandle(handle) { await init(); const { rows } = await pool.query("SELECT * FROM accounts WHERE handle=$1", [handle]); return rows[0] ? { handle: rows[0].handle, keyHash: rows[0].key_hash, createdAt: Number(rows[0].created_at) } : undefined; },
  };
}

function fileStore(): Store {
  const DIR = path.join(process.cwd(), ".data");
  const SUBS = path.join(DIR, "subs.json"), ACCTS = path.join(DIR, "accounts.json");
  let lock: Promise<unknown> = Promise.resolve();
  const read = async <T>(f: string): Promise<T[]> => { try { return JSON.parse(await fs.readFile(f, "utf8")); } catch { return []; } };
  const write = async (f: string, d: unknown) => { await fs.mkdir(DIR, { recursive: true }); const t = f + ".tmp"; await fs.writeFile(t, JSON.stringify(d, null, 2)); await fs.rename(t, f); };
  return {
    async list(limit = 100) { return (await read<Entry>(SUBS)).filter((e) => e.ok).sort((a, b) => a.score - b.score).slice(0, limit); },
    async get(id) { return (await read<Entry>(SUBS)).find((e) => e.id === id || e.id.startsWith(id)); },
    async mine(handle) { return (await read<Entry>(SUBS)).filter((e) => e.handle === handle).sort((a, b) => a.score - b.score); },
    upsert(e) {
      const next = lock.then(async () => {
        const all = await read<Entry>(SUBS); const i = all.findIndex((x) => x.id === e.id);
        if (i >= 0) all[i] = e; else all.push(e); await write(SUBS, all); return e;
      });
      lock = next.catch(() => {}); return next;
    },
    async createAccount(handle) {
      const apiKey = newApiKey(); const all = await read<Account>(ACCTS);
      all.push({ handle, keyHash: hashKey(apiKey), createdAt: Date.now() }); await write(ACCTS, all);
      return { handle, apiKey };
    },
    async accountByKey(key) { return (await read<Account>(ACCTS)).find((a) => a.keyHash === hashKey(key)); },
    async accountByHandle(handle) { return (await read<Account>(ACCTS)).find((a) => a.handle === handle); },
  };
}

const store: Store = USE_PG ? pgStore() : fileStore();

export const list = (limit?: number) => store.list(limit);
export const get = (id: string) => store.get(id);
export const mine = (handle: string) => store.mine(handle);
export const upsert = (e: Entry) => store.upsert(e);
export const createAccount = (handle: string) => store.createAccount(handle);
export const accountByKey = (key: string) => store.accountByKey(key);
export const accountByHandle = (handle: string) => store.accountByHandle(handle);
