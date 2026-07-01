"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { simulate, scoreSeeds, compilePolicy, W, H, TARGET, CAP, SEEDS, FLOOR, type Sim } from "@/lib/sim";
import { POLICIES, ORDER, DEFAULT_N } from "@/lib/policies";

type Row = { key: string; name: string; tag: string; n: number; meanSteps: number; score: number; id?: string };

const REPO = "https://github.com/zeeshan8281/swarm.fail";
const COLORS: Record<string, string> = { random: "#f87171", levy: "#22d3ee", disperse: "#818cf8", stripes: "#4ade80" };
const colorFor = (k: string) => COLORS[k] || "#818cf8";
const MEDAL = ["🥇", "🥈", "🥉"];

function EigenMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 804.216 919.055" fill="currentColor" aria-hidden>
      <path d="M459.55 459.55H344.665V689.255H229.752V459.479V0H0V459.479V689.255V918.983V919.055H229.752V918.983H344.665V919.055H459.55V918.983H689.328V689.255H459.55V459.55Z" />
      <path d="M804.216 0H689.352V229.752H804.216V0Z" />
      <path d="M574.438 0H459.55V0.0241462H349.323V114.888H459.55V459.479H574.438V459.433H689.328V229.679H574.438V0Z" />
    </svg>
  );
}

const CARDS = [
  { c: "var(--indigo)", l: "No orchestrator", h: "Nobody is in charge", p: "Every agent runs the identical rule. No leader hands out regions — any coordination has to emerge from local behavior alone." },
  { c: "var(--teal)", l: "Local only", h: "Each agent sees one cell", p: "No global map, no messaging. An agent knows its own position, a private scratchpad, and whether its cell is covered. That's it." },
  { c: "var(--violet)", l: "Emergent", h: "Order from a single rule", p: "Hundreds of dumb agents, one policy, and the whole map gets covered — the way ants forage or birds flock, with no plan." },
  { c: "var(--amber)", l: "Reproducible", h: "Anyone re-runs your score", p: "Maps are seeded deterministically. Same policy + agent count → the identical number on any machine. No trust required." },
];

export default function SwarmApp() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const rafRef = useRef<number>(0);
  const keyRef = useRef<string>("levy");

  const [polKey, setPolKey] = useState("levy");
  const [n, setN] = useState(DEFAULT_N);
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState({ step: 0, frac: 0 });
  const [scored, setScored] = useState<{ score: number; meanSteps: number; ok: boolean } | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [verifyMsg, setVerifyMsg] = useState<Record<string, string>>({});

  const nRef = useRef(n);
  keyRef.current = polKey; nRef.current = n;

  const runScore = useCallback((key: string, agents: number) => {
    const r = scoreSeeds(compilePolicy(POLICIES[key].src), agents, SEEDS);
    setScored({ score: r.score, meanSteps: r.meanSteps, ok: r.ok });
  }, []);

  const draw = useCallback(() => {
    const cv = cvRef.current, sim = simRef.current;
    if (!cv || !sim) return;
    const ctx = cv.getContext("2d")!;
    const cell = cv.width / W;
    ctx.fillStyle = "#08070d"; ctx.fillRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
      if (sim.covered[y * W + x]) { ctx.fillStyle = "rgba(99,102,241,.20)"; ctx.fillRect(x * cell, y * cell, cell, cell); }
    const c = colorFor(keyRef.current);
    ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 7;
    for (const a of sim.agents) ctx.fillRect(a.x * cell + cell * 0.1, a.y * cell + cell * 0.1, cell * 0.8, cell * 0.8);
    ctx.shadowBlur = 0;
  }, []);

  const loop = useCallback(() => {
    const sim = simRef.current!;
    for (let i = 0; i < 3; i++) { if (sim.step >= CAP || sim.frac >= TARGET) break; sim.tick(); }
    draw(); setLive({ step: sim.step, frac: sim.frac });
    if (sim.step >= CAP || sim.frac >= TARGET) { setRunning(false); runScore(keyRef.current, nRef.current); return; }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, runScore]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current); setScored(null);
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, 1);
    setLive({ step: 0, frac: 0 }); setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  }, [polKey, n, loop]);

  const pause = useCallback(() => { cancelAnimationFrame(rafRef.current); setRunning(false); }, []);
  const score = useCallback(() => { cancelAnimationFrame(rafRef.current); setRunning(false); runScore(polKey, n); }, [polKey, n, runScore]);

  const refreshBoard = useCallback(async () => {
    const builtins: Row[] = ORDER.map((k) => {
      const b = POLICIES[k], r = scoreSeeds(compilePolicy(b.src), b.n, SEEDS);
      return { key: k, name: b.name, tag: b.tag, n: b.n, meanSteps: r.meanSteps, score: r.score };
    });
    let userRows: Row[] = [];
    try {
      const res = await fetch("/api/leaderboard");
      const { entries } = await res.json();
      userRows = entries.map((e: { id: string; name: string; n: number; meanSteps: number; score: number }) => ({
        key: "custom", name: e.name, tag: "win", n: e.n, meanSteps: e.meanSteps, score: e.score, id: e.id,
      }));
    } catch {}
    setRows([...builtins, ...userRows].sort((a, b) => a.score - b.score));
  }, []);

  useEffect(() => {
    simRef.current = simulate(compilePolicy(POLICIES.levy.src), DEFAULT_N, 1);
    draw(); refreshBoard();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current); setRunning(false); setScored(null);
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, 1);
    setLive({ step: 0, frac: 0 }); draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polKey, n]);

  const verify = useCallback(async (id: string) => {
    setVerifyMsg((m) => ({ ...m, [id]: "…" }));
    try {
      const res = await fetch(`/api/verify/${id}`); const d = await res.json();
      setVerifyMsg((m) => ({ ...m, [id]: d.match ? `✓ ${d.recomputed}` : `✗ ${d.recomputed}≠${d.stored}` }));
    } catch { setVerifyMsg((m) => ({ ...m, [id]: "err" })); }
  }, []);

  const best = rows.reduce((m, r) => Math.min(m, r.score), Infinity);
  const worst = rows.reduce((m, r) => Math.max(m, r.score), FLOOR);
  const levyScore = rows.find((r) => r.key === "levy")?.score;
  const hasData = Number.isFinite(best);
  const aboveFloor = hasData ? Math.round(((best - FLOOR) / FLOOR) * 100) : null;
  const aheadLevy = levyScore && hasData ? Math.round(((levyScore - best) / levyScore) * 100) : null;
  const pos = (s: number) => Math.max(0, Math.min(100, ((s - FLOOR) / (worst - FLOOR)) * 100));

  return (
    <>
      <header className="site"><div className="wrap nav">
        <div className="brand">
          <EigenMark className="mark" />
          <span className="name">swarm<span style={{ color: "var(--indigo)" }}>.fail</span></span>
          <a className="by" href="https://www.eigenlabs.org" target="_blank" rel="noreferrer">by <EigenMark /> Eigen ↗</a>
        </div>
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#why">Why</a><a href="#board">Leaderboard</a><a href="#submit">Submit</a><a href="#how">How it works</a>
          </nav>
          <a className="btn sm" href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="btn primary sm" href="#board">Leaderboard</a>
        </div>
      </div></header>

      {/* Hero */}
      <section className="hero"><div className="wrap hero-grid">
        <div>
          <div className="eyebrow">Deterministic swarm benchmark · 40×40 · 12 seeds</div>
          <h1>Write one rule.<br />Command a swarm.<br /><span className="dim">No orchestrator.</span></h1>
          <p className="lead">
            Submit one local policy. It&apos;s cloned into hundreds of identical agents dropped on maps they&apos;ve never
            seen — no leader, no shared memory, each sees only its own cell. One number comes out: <b style={{ color: "var(--fg)" }}>agents × steps to cover</b>. Beat the Lévy forager; approach the floor.
          </p>
          <div className="cta">
            <button className="btn primary" onClick={run}>▶ Watch the swarm</button>
            <a className="btn" href="#submit">Write a policy</a>
          </div>
          <div className="npm">
            <span className="lbl">Submit from your terminal</span>
            <code>npx swarm submit policy.js --name you</code>
          </div>
        </div>

        {/* live terminal panel */}
        <div className="term">
          <div className="term-bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="t">swarm · {POLICIES[polKey].name.toLowerCase()} · seed 1 · {n} agents</span>
          </div>
          <div className="term-body">
            <canvas ref={cvRef} width={400} height={400} />
            <div className="bar"><i style={{ width: `${Math.min(100, (live.frac / TARGET) * 100)}%` }} /></div>
            <div className="term-foot">
              <span>step <b>{live.step}</b></span>
              <span>cov <b>{Math.round(live.frac * 100)}%</b></span>
              <span>score <b style={{ color: scored ? (scored.ok ? "var(--good)" : "var(--destructive)") : "var(--fg)" }}>{scored ? scored.score : "—"}</b></span>
              <span className="grow" />
              <select value={polKey} onChange={(e) => setPolKey(e.target.value)}>
                {ORDER.map((k) => <option key={k} value={k}>{POLICIES[k].name}</option>)}
              </select>
            </div>
            <div className="term-foot">
              <label className="fld" style={{ flexDirection: "row", alignItems: "center", gap: 8, textTransform: "none", letterSpacing: 0, color: "var(--muted)" }}>
                <span className="mono" style={{ fontSize: 12 }}>agents {n}</span>
                <input type="range" min={10} max={300} step={5} value={n} onChange={(e) => setN(+e.target.value)} style={{ width: 120 }} />
              </label>
              <span className="grow" />
              <button className="btn sm" onClick={running ? pause : run}>{running ? "Pause" : "▶ Watch"}</button>
              <button className="btn sm" onClick={score}>Score</button>
            </div>
          </div>
        </div>
      </div></section>

      {/* objective — the goal / score / win, in plain words */}
      <div className="obj"><div className="wrap"><div className="obj-in">
        <div className="cell">
          <span className="k"><span className="num">01</span> The goal</span>
          <p>Cover a map you can&apos;t see. Hundreds of identical agents, <b>one shared rule, no leader</b> — each sees only its own cell.</p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">02</span> The score</span>
          <p><b>agents × steps</b> to cover 95% of the grid. <span className="m">Lower wins. The best possible is <b>{FLOOR}</b>{hasData ? <> — best so far <b>{best}</b></> : null}.</span></p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">03</span> How you win</span>
          <p>Beat the <b>Lévy forager</b>{levyScore ? <> <span className="m mono">({levyScore})</span></> : null} — nature&apos;s best solo search — and top the board. <span className="m">Every score re-runs to the same number.</span></p>
        </div>
      </div></div></div>

      {/* Why */}
      <section id="why" className="sec"><div className="wrap">
        <div className="eyebrow">Why it&apos;s hard</div>
        <h2>A single robot can&apos;t see the whole map. A swarm doesn&apos;t have to.</h2>
        <p className="sub">Coordination has to come from the rule itself — there&apos;s nothing else to lean on.</p>
        <div className="cards">
          {CARDS.map((c) => (
            <div className="card" key={c.l}>
              <span className="lbl" style={{ color: c.c }}>{c.l}</span>
              <h4>{c.h}</h4><p>{c.p}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Leaderboard */}
      <section id="board" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Leaderboard</div>
        <div className="frontier" style={{ marginBottom: 18 }}>
          <div className="row between" style={{ alignItems: "flex-end" }}>
            <div><div className="big">{hasData ? best : "—"}</div><div className="biglbl">Best score · {aboveFloor != null ? `+${aboveFloor}% above floor` : "—"}</div></div>
            <div style={{ textAlign: "right" }}><div className="big" style={{ fontSize: 24, color: "var(--good)" }}>{aheadLevy != null ? `${aheadLevy}%` : "—"}</div><div className="biglbl">ahead of Lévy</div></div>
          </div>
          <div className="track">
            <span className="lbl top" style={{ left: 0 }}>floor {FLOOR}</span><span className="lbl bot" style={{ left: 0 }}>optimal</span>
            {hasData && <span className="pin" style={{ left: `${pos(best)}%`, background: "var(--good)" }} />}
            {hasData && <span className="lbl top" style={{ left: `${pos(best)}%` }}>best {best}</span>}
            {levyScore && <span className="pin" style={{ left: `${pos(levyScore)}%`, background: "var(--cyan)" }} />}
            {levyScore && <span className="lbl bot" style={{ left: `${pos(levyScore)}%` }}>Lévy</span>}
            <span className="lbl bot" style={{ left: "100%" }}>random</span>
          </div>
        </div>
        <div className="panel" style={{ padding: "4px 18px" }}>
          <table>
            <thead><tr><th>#</th><th>Policy</th><th></th><th className="num">Agents</th><th className="num">Steps</th><th className="num">Score</th><th className="num">vs Lévy</th><th></th></tr></thead>
            <tbody>
              {rows.map((r, i) => {
                const d = levyScore != null ? r.score - levyScore : 0;
                const dStr = d === 0 ? "—" : d < 0 ? `▼ ${-d}` : `▲ ${d}`;
                const dCol = d < 0 ? "var(--good)" : d > 0 ? "var(--destructive)" : "var(--faint)";
                const tg = r.tag === "baseline" ? <span className="tag base">baseline</span> : r.tag === "win" ? <span className="tag win">beats Lévy</span> : r.tag === "floor" ? <span className="tag">floor</span> : null;
                return (
                  <tr key={`${r.key}-${r.id ?? i}`}>
                    <td>{i < 3 ? <span className="medal">{MEDAL[i]}</span> : <span className="rank">{i + 1}</span>}</td>
                    <td style={{ fontWeight: 500 }}>{r.name}</td><td>{tg}</td>
                    <td className="num">{r.n}</td><td className="num">{r.meanSteps}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.score}</td>
                    <td className="num" style={{ color: dCol }}>{dStr}</td>
                    <td className="num">{r.id && <button className="verify" onClick={() => verify(r.id!)}>{verifyMsg[r.id] ?? "verify"}</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div></section>

      {/* Submit */}
      <section id="submit" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Submit</div>
        <h2>One way in: clone, write, submit.</h2>
        <p className="sub">The CLI scores locally with the same engine the server runs, then posts — so your number is reproducible by anyone.</p>
        <div className="grid2" style={{ marginTop: 28 }}>
          <div className="panel">
            <pre className="cli">{`git clone ${REPO}
cd swarm.fail && npm install

# write policy.js (example →), then:
npx swarm run    policy.js --agents 40   # score locally
npx swarm submit policy.js --name you    # post to the board
npx swarm board                          # view from your terminal`}</pre>
            <p className="hint" style={{ margin: 0 }}>Score = agents × mean steps to {Math.round(TARGET * 100)}% coverage over {SEEDS.length} fixed seeds. Lower wins, floor <b style={{ color: "var(--fg)" }}>{FLOOR}</b>. A policy that fails to cover any seed is logged <span className="mono">FAIL</span> and not ranked.</p>
          </div>
          <div className="panel">
            <div className="row between" style={{ marginBottom: 8 }}><b style={{ fontSize: 13 }}>policy.js</b><span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>example · beats Lévy</span></div>
            <pre className="cli" style={{ margin: "0 0 12px" }}>{POLICIES.stripes.src}</pre>
            <b style={{ fontSize: 13 }}>Inputs (read-only)</b>
            <ul className="hint" style={{ marginTop: 6 }}>
              <li><code className="k">a.x a.y</code> cell · <code className="k">a.id</code> index · <code className="k">a.n</code> size</li>
              <li><code className="k">a.mem</code> private scratch · <code className="k">a.heading</code> last dir</li>
              <li><code className="k">env.w env.h</code> grid ({W}×{H}) · <code className="k">env.here</code> covered?</li>
              <li><code className="k">rng()</code> deterministic 0..1 — no Math.random/Date</li>
            </ul>
          </div>
        </div>
      </div></section>

      {/* How it works */}
      <section id="how" className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow">How it works</div>
        <h2>Write to a rule. Agents react. Coverage emerges.</h2>
        <div className="cols3">
          <div className="col"><h5>01 · You write</h5>
            <p><b>One local function.</b> <code className="k">step(a, env, rng)</code> returns a move. No model calls, no network, no global state.</p>
            <p>The same rule is copied into every agent — identical, anonymous, on a map none of them has seen.</p></div>
          <div className="col"><h5>02 · The swarm reacts</h5>
            <p><b>Each agent moves one cell.</b> It only knows its own position and a private scratchpad — never the full map or the other agents.</p>
            <p>Run it until 95% of the grid is covered. Coordination, if any, is emergent.</p></div>
          <div className="col"><h5>03 · One number</h5>
            <p><b>agents × mean steps</b> over 12 fixed seeds. Lower wins; the floor is {FLOOR}.</p>
            <p>Deterministic, so anyone re-runs your code and gets the identical score. The leaderboard is just a log of reproducible results.</p></div>
        </div>
      </div></section>

      <footer className="site"><div className="wrap row between">
        <span>swarm.fail — a deterministic swarm benchmark · an Eigen project</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="mono">github ↗</a>
      </div></footer>
    </>
  );
}
