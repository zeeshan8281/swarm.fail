import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

export type Entry = {
  id: string;        // hash of (source + n) — same submission => same id (dedup)
  name: string;
  n: number;         // agent count chosen by submitter
  meanSteps: number; // mean steps to coverage over the public seeds
  score: number;     // n × meanSteps — lower wins. Floor 1520.
  per: number[];
  ok: boolean;       // reached coverage on every seed (only ok entries are ranked)
  src: string;
  createdAt: number;
};

export function policyId(src: string, n: number): string {
  return createHash("sha256").update(src.trim() + "@" + n).digest("hex").slice(0, 10);
}

const USE_PG = !!process.env.DATABASE_URL;

type Store = {
  list(limit?: number): Promise<Entry[]>;   // ranked: ok only, by score asc
  get(id: string): Promise<Entry | undefined>;
  upsert(e: Entry): Promise<Entry>;
};

function pgStore(): Store {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as typeof import("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let ready: Promise<void> | null = null;
  const init = () =>
    (ready ??= pool
      .query(
        `CREATE TABLE IF NOT EXISTS submissions (
           id TEXT PRIMARY KEY, name TEXT NOT NULL, n INT NOT NULL,
           mean_steps INT NOT NULL, score INT NOT NULL, per JSONB NOT NULL,
           ok BOOLEAN NOT NULL, src TEXT NOT NULL, created_at BIGINT NOT NULL
         )`
      )
      .then(() => undefined));

  const row = (r: Record<string, unknown>): Entry => ({
    id: r.id as string, name: r.name as string, n: r.n as number,
    meanSteps: r.mean_steps as number, score: r.score as number, per: r.per as number[],
    ok: r.ok as boolean, src: r.src as string, createdAt: Number(r.created_at),
  });

  return {
    async list(limit = 100) {
      await init();
      const { rows } = await pool.query(
        "SELECT * FROM submissions WHERE ok = true ORDER BY score ASC LIMIT $1", [limit]
      );
      return rows.map(row);
    },
    async get(id) {
      await init();
      const { rows } = await pool.query("SELECT * FROM submissions WHERE id = $1", [id]);
      return rows[0] ? row(rows[0]) : undefined;
    },
    async upsert(e) {
      await init();
      await pool.query(
        `INSERT INTO submissions (id, name, n, mean_steps, score, per, ok, src, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, created_at = EXCLUDED.created_at`,
        [e.id, e.name, e.n, e.meanSteps, e.score, JSON.stringify(e.per), e.ok, e.src, e.createdAt]
      );
      return e;
    },
  };
}

function fileStore(): Store {
  const DIR = path.join(process.cwd(), ".data");
  const FILE = path.join(DIR, "leaderboard.json");
  let lock: Promise<unknown> = Promise.resolve();

  const readAll = async (): Promise<Entry[]> => {
    try { return JSON.parse(await fs.readFile(FILE, "utf8")) as Entry[]; } catch { return []; }
  };
  const writeAll = async (entries: Entry[]) => {
    await fs.mkdir(DIR, { recursive: true });
    const tmp = FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(entries, null, 2));
    await fs.rename(tmp, FILE);
  };

  return {
    async list(limit = 100) {
      return (await readAll()).filter((e) => e.ok).sort((a, b) => a.score - b.score).slice(0, limit);
    },
    async get(id) {
      return (await readAll()).find((e) => e.id === id);
    },
    upsert(e) {
      const next = lock.then(async () => {
        const all = await readAll();
        const i = all.findIndex((x) => x.id === e.id);
        if (i >= 0) all[i] = { ...all[i], name: e.name, createdAt: e.createdAt };
        else all.push(e);
        await writeAll(all);
        return e;
      });
      lock = next.catch(() => {});
      return next;
    },
  };
}

const store: Store = USE_PG ? pgStore() : fileStore();

export const list = (limit?: number) => store.list(limit);
export const get = (id: string) => store.get(id);
export const upsert = (e: Entry) => store.upsert(e);
