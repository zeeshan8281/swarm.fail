"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { simulate, scoreSeeds, compilePolicy, W, H, TARGET, CAP, SEEDS, FLOOR, type Sim } from "@/lib/sim";
import { POLICIES, ORDER, DEFAULT_N } from "@/lib/policies";

type Row = { key: string; name: string; tag: string; n: number; meanSteps: number; score: number; id?: string; isMine?: boolean };
type Tab = "arena" | "board" | "submit" | "how";

const REPO = "https://github.com/zeeshan8281/swarm.fail";
const COLORS: Record<string, string> = { random: "#f87171", levy: "#22d3ee", disperse: "#818cf8", stripes: "#34d399" };
const colorFor = (k: string) => COLORS[k] || "#818cf8";
const WATCH_SEEDS = [1, 2, 3, 7, 42];
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

export default function SwarmApp() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const rafRef = useRef<number>(0);
  const keyRef = useRef<string>("levy");

  const [tab, setTab] = useState<Tab>("arena");
  const [polKey, setPolKey] = useState("levy");
  const [n, setN] = useState(DEFAULT_N);
  const [seed, setSeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [liveState, setLive] = useState({ step: 0, frac: 0 });
  const [scored, setScored] = useState<{ score: number; meanSteps: number; ok: boolean } | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [verifyMsg, setVerifyMsg] = useState<Record<string, string>>({});

  const nRef = useRef(n);
  keyRef.current = polKey;
  nRef.current = n;

  const runScore = useCallback((key: string, agents: number) => {
    const r = scoreSeeds(compilePolicy(POLICIES[key].src), agents, SEEDS);
    setScored({ score: r.score, meanSteps: r.meanSteps, ok: r.ok });
  }, []);

  const draw = useCallback(() => {
    const cv = cvRef.current, sim = simRef.current;
    if (!cv || !sim) return;
    const ctx = cv.getContext("2d")!;
    const cell = cv.width / W;
    ctx.fillStyle = "#0c0a14"; ctx.fillRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
      if (sim.covered[y * W + x]) { ctx.fillStyle = "rgba(99,102,241,.22)"; ctx.fillRect(x * cell, y * cell, cell, cell); }
    const c = colorFor(keyRef.current);
    ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 6;
    for (const a of sim.agents) ctx.fillRect(a.x * cell + cell * 0.1, a.y * cell + cell * 0.1, cell * 0.8, cell * 0.8);
    ctx.shadowBlur = 0;
  }, []);

  const loop = useCallback(() => {
    const sim = simRef.current!;
    for (let i = 0; i < 3; i++) { if (sim.step >= CAP || sim.frac >= TARGET) break; sim.tick(); }
    draw(); setLive({ step: sim.step, frac: sim.frac });
    if (sim.step >= CAP || sim.frac >= TARGET) {
      setRunning(false);
      runScore(keyRef.current, nRef.current); // watch finished → fill the official 12-seed score
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, runScore]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setScored(null);
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, seed);
    setLive({ step: 0, frac: 0 }); setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  }, [polKey, n, seed, loop]);

  const pause = useCallback(() => { cancelAnimationFrame(rafRef.current); setRunning(false); }, []);
  const score = useCallback(() => {
    cancelAnimationFrame(rafRef.current); setRunning(false);
    runScore(polKey, n);
  }, [polKey, n, runScore]);

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
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, seed);
    setLive({ step: 0, frac: 0 }); draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polKey, n, seed]);

  // re-draw the canvas when switching back to the arena tab (canvas remounts)
  useEffect(() => { if (tab === "arena") requestAnimationFrame(draw); }, [tab, draw]);

  const verify = useCallback(async (id: string) => {
    setVerifyMsg((m) => ({ ...m, [id]: "…" }));
    try {
      const res = await fetch(`/api/verify/${id}`);
      const d = await res.json();
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
  const TABS: [Tab, string][] = [["arena", "Arena"], ["board", "Leaderboard"], ["submit", "Submit"], ["how", "How it works"]];

  return (
    <div className="app">
      {/* header */}
      <header className="site"><div className="wrap nav">
        <div className="brand">
          <EigenMark className="mark" />
          <span className="name">swarm<span style={{ color: "var(--primary)" }}>.fail</span></span>
          <a className="by" href="https://www.eigenlabs.org" target="_blank" rel="noreferrer">by <EigenMark /> Eigen ↗</a>
        </div>
        <div className="hstat">
          <span>best <b>{hasData ? best : "—"}</b></span>
          <span>floor <b>{FLOOR}</b></span>
          {aheadLevy != null && <span><span className="up">{aheadLevy}%</span> ahead of Lévy</span>}
          <a href={REPO} target="_blank" rel="noreferrer" className="mono" style={{ color: "var(--muted-fg)" }}>GitHub ↗</a>
        </div>
      </div></header>

      {/* tabs */}
      <div className="tabs">
        {TABS.map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      {/* panes */}
      <div className="pane">
        {tab === "arena" && (
          <div className="wrap grid2">
            <div className="panel">
              <div className="row between" style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 18 }}>Arena</h2>
                <span className="mono" style={{ fontSize: 12, color: "var(--muted-fg)" }}>watching seed {seed} · scored over {SEEDS.length} seeds</span>
              </div>
              <canvas ref={cvRef} width={400} height={400} />
              <div className="bar" style={{ marginTop: 12 }}><i style={{ width: `${Math.min(100, (liveState.frac / TARGET) * 100)}%` }} /></div>
            </div>
            <div>
              <div className="panel" style={{ marginBottom: 14 }}>
                <div className="stats">
                  <div className="stat"><span className="k">Live step</span><span className="v">{liveState.step}</span></div>
                  <div className="stat"><span className="k">Coverage</span><span className="v">{Math.round(liveState.frac * 100)}%</span></div>
                  <div className="stat"><span className="k">Agents</span><span className="v">{n}</span></div>
                  <div className="stat"><span className="k">Score</span><span className="v" style={{ color: scored ? (scored.ok ? "var(--good)" : "var(--destructive)") : "var(--fg)" }}>{scored ? scored.score : "—"}</span></div>
                </div>
                {scored && <div className="hint" style={{ marginBottom: 12 }}>{scored.ok ? <>mean {scored.meanSteps} steps × {n} agents · <b>+{Math.round(((scored.score - FLOOR) / FLOOR) * 100)}%</b> above floor</> : <span style={{ color: "var(--destructive)" }}>FAIL — didn&apos;t cover every seed</span>}</div>}
                <label className="fld" style={{ marginBottom: 12 }}>Policy
                  <select value={polKey} onChange={(e) => setPolKey(e.target.value)}>
                    {ORDER.map((k) => <option key={k} value={k}>{POLICIES[k].name}{POLICIES[k].tag === "baseline" ? " (baseline)" : ""}</option>)}
                  </select>
                </label>
                <div className="row" style={{ marginBottom: 12 }}>
                  <label className="fld" style={{ flex: 1 }}>Agents <span className="mono">{n}</span>
                    <input type="range" min={10} max={300} step={5} value={n} onChange={(e) => setN(+e.target.value)} />
                  </label>
                  <label className="fld" style={{ flex: 1 }}>Watch seed
                    <select value={seed} onChange={(e) => setSeed(+e.target.value)}>{WATCH_SEEDS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  </label>
                </div>
                <div className="row">
                  <button className="btn primary" onClick={run} disabled={running}>▶ Watch</button>
                  <button className="btn" onClick={pause} disabled={!running}>Pause</button>
                  <button className="btn" onClick={score}>Score</button>
                </div>
              </div>
              <div className="panel hint">
                Pick a policy and watch 120 clones cover the grid. <b style={{ color: "var(--fg)" }}>Score</b> = agents × mean steps to {Math.round(TARGET * 100)}% coverage over {SEEDS.length} seeds, floor <b>{FLOOR}</b>. To get on the board, submit from the repo — see the <b style={{ color: "var(--fg)" }}>Submit</b> tab.
              </div>
            </div>
          </div>
        )}

        {tab === "board" && (
          <div className="wrap">
            <div className="frontier" style={{ marginBottom: 16 }}>
              <div className="row between" style={{ alignItems: "flex-end" }}>
                <div><div className="big">{hasData ? best : "—"}</div><div className="biglbl">Best score · {aboveFloor != null ? `+${aboveFloor}% above floor` : "—"}</div></div>
                <div style={{ textAlign: "right" }}><div className="big" style={{ fontSize: 22, color: "var(--good)" }}>{aheadLevy != null ? `${aheadLevy}%` : "—"}</div><div className="biglbl">ahead of Lévy</div></div>
              </div>
              <div className="track">
                <span className="lbl top" style={{ left: 0 }}>floor {FLOOR}</span><span className="lbl bot" style={{ left: 0 }}>optimal</span>
                {hasData && <span className="pin" style={{ left: `${pos(best)}%`, background: "var(--good)" }} />}
                {hasData && <span className="lbl top" style={{ left: `${pos(best)}%` }}>best {best}</span>}
                {levyScore && <span className="pin" style={{ left: `${pos(levyScore)}%`, background: "var(--c5)" }} />}
                {levyScore && <span className="lbl bot" style={{ left: `${pos(levyScore)}%` }}>Lévy</span>}
                <span className="lbl bot" style={{ left: "100%" }}>random</span>
              </div>
            </div>
            <div className="panel" style={{ padding: "4px 16px" }}>
              <table>
                <thead><tr><th>#</th><th>Policy</th><th></th><th className="num">Agents</th><th className="num">Steps</th><th className="num">Score</th><th className="num">vs Lévy</th><th></th></tr></thead>
                <tbody>
                  {rows.map((r, i) => {
                    const delta = levyScore != null ? r.score - levyScore : 0;
                    const dStr = delta === 0 ? "—" : delta < 0 ? `▼ ${-delta}` : `▲ ${delta}`;
                    const dCol = delta < 0 ? "var(--good)" : delta > 0 ? "var(--destructive)" : "var(--muted-fg)";
                    const tg = r.tag === "baseline" ? <span className="tag base">baseline</span> : r.tag === "win" ? <span className="tag win">beats Lévy</span> : r.tag === "floor" ? <span className="tag">floor</span> : null;
                    return (
                      <tr key={`${r.key}-${r.id ?? i}`} className={r.isMine ? "me" : ""}>
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
          </div>
        )}

        {tab === "submit" && (
          <div className="wrap grid2">
            <div className="panel">
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>Submit a policy</h2>
              <p className="hint" style={{ margin: "0 0 14px" }}>One way in: clone the repo, write a policy, run the CLI. It scores locally with the same engine the server uses, then posts — so your number is reproducible by anyone.</p>
              <pre className="cli">{`git clone ${REPO}
cd swarm.fail && npm install

# write policy.js (see the example →), then:
npx swarm run    policy.js --agents 40   # score locally
npx swarm submit policy.js --name you    # post to the board`}</pre>
              <p className="hint" style={{ margin: 0 }}><b style={{ color: "var(--fg)" }}>Score</b> = agents × mean steps to {Math.round(TARGET * 100)}% coverage over {SEEDS.length} fixed seeds. Lower wins, floor <b>{FLOOR}</b>. A policy that fails to cover any seed is logged <span className="mono">FAIL</span> and not ranked. Re-run <span className="mono">npx swarm board</span> to see the leaderboard from your terminal.</p>
            </div>
            <div className="panel">
              <div className="row between" style={{ marginBottom: 6 }}><b style={{ fontSize: 13 }}>policy.js</b><span className="mono" style={{ fontSize: 11, color: "var(--muted-fg)" }}>example · beats Lévy</span></div>
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
        )}

        {tab === "how" && (
          <div className="wrap">
            <div className="how">
              <div className="panel"><div className="n">01</div><h3>One rule</h3><p>You write a single local policy — a pure function from what one agent senses to one move. No model calls, no network, no global state.</p></div>
              <div className="panel"><div className="n">02</div><h3>Cloned into a swarm</h3><p>The same rule runs in every agent. Coordination has to <i>emerge</i> from local behavior — there&apos;s no central controller telling them where to go.</p></div>
              <div className="panel"><div className="n">03</div><h3>One honest number</h3><p>Maps are seeded deterministically and scored locally and server-side with the same engine. Anyone re-runs your code and gets the identical number — honesty is free.</p></div>
            </div>
            <p className="hint" style={{ marginTop: 16 }}>Score = agents × mean steps to {Math.round(TARGET * 100)}% coverage over {SEEDS.length} seeds. Provable floor {FLOOR}: every covered cell needs ≥1 agent-step, so agents × steps can&apos;t go lower. Named baseline: the Lévy-flight forager. swarm.fail is an Eigen project · <a href={REPO} target="_blank" rel="noreferrer">github ↗</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
