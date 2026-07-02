"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { simulate, scoreSeeds, compilePolicy, W, H, TARGET, CAP, SEEDS, FLOOR, type Sim } from "@/lib/sim";
import { POLICIES, ORDER, DEFAULT_N } from "@/lib/policies";

type Row = { key: string; name: string; tag: string; n: number; meanSteps: number; score: number; id?: string; handle?: string; model?: string };

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
  const [tab, setTab] = useState<"arena" | "board" | "submit" | "how" | "faq">("arena");

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
    for (let i = 0; i < W * H; i++) {
      const x = i % W, y = (i / W) | 0;
      if (sim.wall[i]) { ctx.fillStyle = "#24242f"; ctx.fillRect(x * cell, y * cell, cell, cell); }
      else if (sim.covered[i]) { ctx.fillStyle = "rgba(99,102,241,.24)"; ctx.fillRect(x * cell, y * cell, cell, cell); }
    }
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
    // the board is scored server-side from the committed submissions + built-ins
    try {
      const res = await fetch("/api/leaderboard");
      const { entries } = await res.json();
      setRows(entries.map((e: { kind: string; handle: string; model: string; tag: string; n: number; meanSteps: number; score: number }) => ({
        key: e.kind + e.handle,
        name: e.kind === "reference" ? e.handle : "@" + e.handle,
        tag: e.tag, n: e.n, meanSteps: e.meanSteps, score: e.score, model: e.model,
      })));
    } catch {
      // fall back to just the built-ins if the API is unreachable
      setRows(ORDER.map((k) => {
        const b = POLICIES[k], r = scoreSeeds(compilePolicy(b.src), b.n, SEEDS);
        return { key: k, name: b.name, tag: b.tag, n: b.n, meanSteps: r.meanSteps, score: r.score, model: "reference" };
      }).sort((a, b) => a.score - b.score));
    }
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
  // canvas remounts when the Arena tab shows — redraw the current frame
  useEffect(() => { if (tab === "arena") requestAnimationFrame(draw); }, [tab, draw]);

  const best = rows.reduce((m, r) => Math.min(m, r.score), Infinity);
  const worst = rows.reduce((m, r) => Math.max(m, r.score), FLOOR);
  const levyScore = rows.find((r) => r.tag === "baseline")?.score;
  const hasData = Number.isFinite(best);
  const aboveFloor = hasData ? Math.round(((best - FLOOR) / FLOOR) * 100) : null;
  const aheadLevy = levyScore && hasData ? Math.round(((levyScore - best) / levyScore) * 100) : null;
  const pos = (s: number) => Math.max(0, Math.min(100, ((s - FLOOR) / (worst - FLOOR)) * 100));

  const TABS: [typeof tab, string][] = [["arena", "Arena"], ["board", "Leaderboard"], ["submit", "Submit"], ["how", "How it works"], ["faq", "FAQ"]];

  return (
    <>
      <header className="site"><div className="wrap nav">
        <div className="brand">
          <EigenMark className="mark" />
          <span className="name">swarm<span style={{ color: "var(--indigo)" }}>.fail</span></span>
          <a className="by" href="https://www.eigenlabs.org" target="_blank" rel="noreferrer">by <EigenMark /> Eigen ↗</a>
        </div>
        <div className="nav-right">
          <a className="btn sm" href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a>
          <button className="btn primary sm" onClick={() => setTab("submit")}>Submit</button>
        </div>
      </div></header>

      <div className="tabbar"><div className="wrap"><div className="tabbar-in">
        {TABS.map(([t, label]) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div></div></div>

      {/* ── ARENA ── */}
      {tab === "arena" && <>
      <section className="hero" style={{ paddingBottom: 24 }}><div className="wrap hero-grid">
        <div>
          <div className="eyebrow">A swarm coordination puzzle</div>
          <h1>One rule.<br />A hundred robots.<br /><span className="dim">Explore the whole map.</span></h1>
          <p className="lead">
            You write <b style={{ color: "var(--fg)" }}>one simple rule</b>. We copy it into a hundred robots and drop them into a maze
            they&apos;ve never seen — no leader, no map, no talking. No single robot is smart; the right rule makes the whole crowd
            smart. <b style={{ color: "var(--fg)" }}>Write a better rule than everyone else and climb the leaderboard.</b>
          </p>
          <div className="cta">
            <button className="btn primary" onClick={run}>▶ Watch them explore</button>
            <button className="btn" onClick={() => setTab("how")}>How it works</button>
          </div>
          <div className="npm">
            <span className="lbl">Contribute</span>
            <code>fork → add submissions/you.js → open a PR</code>
          </div>
        </div>

        {/* live terminal panel */}
        <div className="term">
          <div className="term-bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="t">{n} robots · rule: {POLICIES[polKey].name.toLowerCase()}</span>
          </div>
          <div className="term-body">
            <canvas ref={cvRef} width={400} height={400} />
            <div className="cap"><span><i className="sw-dot" /> robots</span><span><i className="sw-cell" /> explored</span><span><i className="sw-wall" /> walls</span><span className="grow" />goal: explore every open cell</div>
            <div className="bar"><i style={{ width: `${Math.min(100, (live.frac / TARGET) * 100)}%` }} /></div>
            <div className="term-foot">
              <span>moves <b>{live.step}</b></span>
              <span>explored <b>{Math.round(live.frac * 100)}%</b></span>
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
          <p>Get the robots to <b>explore the whole map</b> — every cell visited at least once.</p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">02</span> The catch</span>
          <p>They all follow <b>the same one rule</b> you write. <span className="m">No leader, no map, no talking — each robot sees only the cell it&apos;s standing on.</span></p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">03</span> The win</span>
          <p>Finish in the <b>fewest total moves</b>. <span className="m">Beat whoever&apos;s #1 on the leaderboard and get as close as you can to the perfect score — the fewest moves physically possible.</span></p>
        </div>
      </div></div></div>
      </>}

      {/* ── HOW IT WORKS: why it's hard ── */}
      {tab === "how" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
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
      </div></section>}

      {/* ── LEADERBOARD ── */}
      {tab === "board" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Leaderboard</div>
        <p className="sub" style={{ marginTop: 0, marginBottom: 20, maxWidth: 680 }}>
          Each row is one rule. <b style={{ color: "var(--fg)" }}>Score = robots × moves to explore every maze — lower wins.</b> The bar
          below runs from the <b style={{ color: "var(--fg)" }}>best score physically possible</b> (left) to <b style={{ color: "var(--fg)" }}>aimless
          wandering</b> (right). Your goal: <b style={{ color: "var(--fg)" }}>beat whoever&apos;s #1 and creep toward the best-possible score on the left</b> — that gap is the open challenge. <b style={{ color: "var(--fg)" }}>Lévy Flight</b> (the pattern real animals use) is just a landmark you pass along the way.
        </p>
        <div className="frontier" style={{ marginBottom: 18 }}>
          <div className="row between" style={{ alignItems: "flex-end" }}>
            <div><div className="big">{hasData ? best : "—"}</div><div className="biglbl">Best score · {aboveFloor != null ? `+${aboveFloor}% above the best possible` : "—"}</div></div>
            <div style={{ textAlign: "right" }}><div className="big" style={{ fontSize: 24, color: "var(--good)" }}>{aheadLevy != null ? `${aheadLevy}%` : "—"}</div><div className="biglbl">ahead of Lévy</div></div>
          </div>
          <div className="track">
            <span className="lbl top" style={{ left: 0, transform: "none" }}>{FLOOR}</span><span className="lbl bot" style={{ left: 0, transform: "none" }}>best possible</span>
            {hasData && <span className="pin" style={{ left: `${pos(best)}%`, background: "var(--good)" }} />}
            {hasData && <span className="lbl top" style={{ left: `${pos(best)}%` }}>best so far {best}</span>}
            {levyScore && <span className="pin" style={{ left: `${pos(levyScore)}%`, background: "var(--cyan)" }} />}
            {levyScore && <span className="lbl bot" style={{ left: `${pos(levyScore)}%` }}>Lévy</span>}
            <span className="lbl bot" style={{ left: "100%", transform: "translateX(-100%)" }}>aimless</span>
          </div>
        </div>
        <div className="panel" style={{ padding: "4px 18px" }}>
          <table>
            <thead><tr><th>#</th><th>Author</th><th>Model</th><th className="num">Robots</th><th className="num">Moves</th><th className="num">Score</th><th className="num">vs Lévy</th></tr></thead>
            <tbody>
              {rows.map((r, i) => {
                const d = levyScore != null ? r.score - levyScore : 0;
                const dStr = d === 0 ? "—" : d < 0 ? `▼ ${-d}` : `▲ ${d}`;
                const dCol = d < 0 ? "var(--good)" : d > 0 ? "var(--destructive)" : "var(--faint)";
                const isRef = r.model === "reference";
                const tg = r.tag === "baseline" ? <span className="tag base">baseline</span> : r.tag === "win" ? <span className="tag win">beats Lévy</span> : r.tag === "floor" ? <span className="tag">worst</span> : null;
                return (
                  <tr key={`${r.key}-${r.id ?? i}`}>
                    <td>{i < 3 ? <span className="medal">{MEDAL[i]}</span> : <span className="rank">{i + 1}</span>}</td>
                    <td style={{ fontWeight: 500 }}>{r.name} {tg}</td>
                    <td>{isRef ? <span className="tag">reference</span> : <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.model}</span>}</td>
                    <td className="num">{r.n}</td><td className="num">{r.meanSteps}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.score}</td>
                    <td className="num" style={{ color: dCol }}>{dStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="hint" style={{ marginTop: 14 }}>
          <span className="tag">reference</span> = built-in example rules to beat ·{" "}
          <span className="tag base">baseline</span> = Lévy Flight, a natural landmark to pass ·{" "}
          <b style={{ color: "var(--good)" }}>▼</b> better than Lévy, <b style={{ color: "var(--destructive)" }}>▲</b> worse ·{" "}
          🥇 current best · <b style={{ color: "var(--fg)" }}>Robots × Moves = Score</b>, lower wins.
        </p>
      </div></section>}

      {/* ── SUBMIT ── */}
      {tab === "submit" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Submit</div>
        <h2>Fork, add a file, open a PR.</h2>
        <p className="sub">Bring your own model or write by hand — swarm.fail is just the verifiable arena. Your submission is one file in the repo; the git history is the whole leaderboard.</p>
        <div className="grid2" style={{ marginTop: 28 }}>
          <div className="panel">
            <pre className="cli">{`# 1. fork ${REPO.replace("https://github.com/", "")}
# 2. add your policy
node bin/swarm.mjs new you          # scaffolds submissions/you.js
#    ...edit submissions/you.js with any model/agent you like...
node bin/swarm.mjs run submissions/you.js   # check it locally

# 3. open a Pull Request
git add submissions/you.js && git commit -m "you: my swarm"
git push   # then open the PR on GitHub`}</pre>
            <p className="hint" style={{ margin: 0 }}>CI scores your PR and comments the number. If it <b style={{ color: "var(--fg)" }}>beats the current best</b>, it auto-merges and the live board redeploys. Score = agents × moves to explore {Math.round(TARGET * 100)}% of each map over {SEEDS.length} maps, floor <b style={{ color: "var(--fg)" }}>{FLOOR}</b>. A run that fails to explore any map is unranked. No accounts — your GitHub handle is your identity.</p>
          </div>
          <div className="panel">
            <div className="row between" style={{ marginBottom: 8 }}><b style={{ fontSize: 13 }}>policy.js</b><span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>example · beats Lévy</span></div>
            <pre className="cli" style={{ margin: "0 0 12px" }}>{POLICIES.stripes.src}</pre>
            <b style={{ fontSize: 13 }}>Inputs (read-only)</b>
            <ul className="hint" style={{ marginTop: 6 }}>
              <li><code className="k">a.x a.y</code> cell · <code className="k">a.id</code> index · <code className="k">a.n</code> size</li>
              <li><code className="k">a.mem</code> private scratch · <code className="k">a.heading</code> last dir</li>
              <li><code className="k">env.w env.h</code> grid ({W}×{H}) · <code className="k">env.here</code> covered?</li>
              <li><code className="k">env.near</code> {`{up,down,left,right}`} — agents on each neighbour cell</li>
              <li><code className="k">env.trail</code> {`{here,up,down,left,right}`} — shared scent; drop via <code className="k">return {`{mark}`}</code></li>
              <li><code className="k">rng()</code> deterministic 0..1 — no Math.random/Date</li>
            </ul>
          </div>
        </div>
      </div></section>}

      {/* ── HOW IT WORKS: the steps ── */}
      {tab === "how" && <section className="sec" style={{ paddingTop: 8 }}><div className="wrap">
        <div className="eyebrow">The loop</div>
        <h2>Write a rule. Agents react. Coverage emerges.</h2>
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
      </div></section>}

      {/* ── FAQ ── */}
      {tab === "faq" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow">FAQ</div>
        <h2 style={{ marginBottom: 8 }}>Questions, answered simply.</h2>
        <div className="faq">
          <div className="faq-item">
            <h4>What is this?</h4>
            <p>A game. You write <b>one simple rule</b> for a robot. We copy it into ~100 robots and drop them into a maze. They scurry around exploring it, and you get one number: how fast they explored the whole thing. Lower is better. Everyone&apos;s number goes on a leaderboard.</p>
          </div>
          <div className="faq-item">
            <h4>Where do the mazes come from?</h4>
            <p>The computer builds them from a <b>fixed list of 12 numbers</b> (seeds). Each number always produces the <b>exact same maze</b> — the same rooms and walls in the same spots — so everyone is judged on the identical mazes and your score comes out the same on any computer. Your rule can&apos;t peek at the layout: each robot only feels the walls right next to it, so a maze is &quot;unseen&quot; until the robots bump into it.</p>
          </div>
          <div className="faq-item">
            <h4>How do I take part?</h4>
            <p>Fork the code on GitHub, add one file — <code className="k">submissions/your-name.js</code> with your rule — and open a Pull Request. A bot scores it automatically and comments the number. If it <b>beats the current best</b>, it joins the board and the site updates itself. You can use any AI model to help write your rule, or write it by hand.</p>
          </div>
          <div className="faq-item">
            <h4>How is the score worked out? What&apos;s a good one?</h4>
            <p>Score = <b>how many robots × how many moves</b> it took to explore {Math.round(TARGET * 100)}% of each maze, averaged over {SEEDS.length} mazes. Lower wins. The best possible is around <b>{FLOOR}</b> — you can&apos;t beat that (it&apos;s the number of squares to visit), so the real game is getting as <i>close</i> to it as you can. You&apos;re racing <b>everyone else on the board</b>, not one policy. <b>Lévy Flight</b>{levyScore ? <> (<span className="mono">{levyScore}</span>)</> : null} — the pattern real animals use — is just a famous landmark: pass it and you know your rule is genuinely good.</p>
          </div>
          <div className="faq-item">
            <h4>Do the robots learn or talk to each other?</h4>
            <p>They don&apos;t <i>talk</i> and they don&apos;t learn — but they <b>coordinate</b>. Every robot runs the same rule, alone, with no leader and no shared map. The only way they work together is through the world itself: each can drop a bit of <b>scent</b> on the square it&apos;s on (<code className="k">env.trail</code>) and smell it on the squares around it, and it can tell how many robots are standing next to it right now (<code className="k">env.near</code>). Scent fades over time, so it&apos;s a live signal, not a memory. It&apos;s exactly how ants coordinate — no messages, no boss, just marks in the environment — and it&apos;s enough for a swarm to fan out and cover ground far faster than robots that ignore each other. All the cleverness still lives in the rule <i>you</i> write.</p>
          </div>
          <div className="faq-item">
            <h4>How do I know the scores are real?</h4>
            <p>Everything is <b>reproducible</b>: the same rule gives the exact same score on any computer. The scoring code is public in the repo, the bot runs it in the open, and you can re-run it yourself with <code className="k">node bin/swarm.mjs run</code>. There&apos;s no secret server to trust.</p>
          </div>
        </div>
      </div></section>}

      <footer className="site"><div className="wrap row between">
        <span>swarm.fail — a deterministic swarm benchmark · an Eigen project</span>
        <a href={REPO} target="_blank" rel="noreferrer" className="mono">github ↗</a>
      </div></footer>
    </>
  );
}
