"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { simulate, scoreSeeds, compilePolicy, W, H, TARGET, CAP, SEEDS, FLOOR, MIN_AGENTS, type Sim } from "@/lib/sim";
import { POLICIES, ORDER, DEFAULT_N } from "@/lib/policies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RecordChart, { type Point } from "@/components/RecordChart";
import type { Board, Attempt } from "@/lib/board";

type Row = { key: string; name: string; tag: string; n: number; meanSteps: number; score: number; id?: string; handle?: string; model?: string; note?: string };

const REPO = "https://github.com/zeeshan8281/swarm.fail";
// light-mode agent colors — tuned to read on the white canvas
// agent colours read on the navy arena panel, not on white
const COLORS: Record<string, string> = { random: "#ff9a8b", levy: "#7fd8e8", disperse: "#b5c7ff", stripes: "#8fe6ab" };
const colorFor = (k: string) => COLORS[k] || "#b5c7ff";
const MEDAL = ["🥇", "🥈", "🥉"];
// which map family a seed produces — the engine picks with seed % 3
const FAMILY = ["rooms", "maze", "cave"];
const familyOf = (seed: number) => FAMILY[seed % 3];
// deterministic monogram tint per handle — these are file names, not GitHub
// accounts, so we must not fetch anyone's avatar for them
const monoHue = (h: string) => (Array.from(h).reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7));

function EigenMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 804.216 919.055" fill="currentColor" aria-hidden>
      <path d="M459.55 459.55H344.665V689.255H229.752V459.479V0H0V459.479V689.255V918.983V919.055H229.752V918.983H344.665V919.055H459.55V918.983H689.328V689.255H459.55V459.55Z" />
      <path d="M804.216 0H689.352V229.752H804.216V0Z" />
      <path d="M574.438 0H459.55V0.0241462H349.323V114.888H459.55V459.479H574.438V459.433H689.328V229.679H574.438V0Z" />
    </svg>
  );
}

// The five things a solver has to understand before their first submission,
// in the order they hit them.
const STEPS = [
  { title: "One rule, cloned into a swarm", body: "You write a single step(a, env, rng) function. It is copied into every agent — 50 to 500 of them — and they all run it at the same time. There is no leader and no second rule for special cases." },
  { title: "Twelve maps, three shapes", body: "Four open-room maps, four braided mazes of 1-cell corridors, four cave systems. Same twelve every run, generated from fixed seeds. A rule tuned for open floor tends to drown in the corridors." },
  { title: "Score is agents × moves", body: "Mean moves to explore 95% of each map, multiplied by how many agents you fielded. Lower wins. You cannot buy your way up with more agents, and you cannot win by taking forever with one." },
  { title: "Covering every map is the gate", body: "Miss 95% on any one of the twelve, or field fewer than 50 agents, and the run is logged but unranked — no partial credit. Both failure modes show up on the board with the reason." },
  { title: "The git history is the leaderboard", body: "Open a PR adding submissions/<you>.js. CI re-scores it in a sandbox and comments the number; beat the record and it merges itself and the site redeploys. Same engine in your terminal, in CI, and in the browser — anyone can re-run your score." },
];

const CARDS = [
  { c: "var(--indigo)", l: "No orchestrator", h: "Nobody is in charge", p: "Every agent runs the identical rule. No leader hands out regions — any coordination has to emerge from local behavior alone." },
  { c: "var(--teal)", l: "Local senses", h: "Each agent sees one cell", p: "An agent senses only its own cell and its four neighbours — but the swarm shares one brain: a common scratch object every agent reads and writes, plus scent it leaves on the grid." },
  { c: "var(--violet)", l: "Emergent", h: "Order from a single rule", p: "Hundreds of dumb agents, one policy, and the whole map gets covered — the way ants forage or birds flock, with no plan." },
  { c: "var(--amber)", l: "Reproducible", h: "Anyone re-runs your score", p: "Maps are seeded deterministically. Same policy + agent count → the identical number on any machine. No trust required." },
];

const toRows = (entries: Board["entries"]): Row[] => entries.map((e) => ({
  key: e.kind + e.handle,
  name: e.kind === "reference" ? e.handle : "@" + e.handle,
  handle: e.kind === "submission" ? e.handle : undefined,
  note: e.note,
  tag: e.tag, n: e.n, meanSteps: e.meanSteps, score: e.score, model: e.model,
}));

export default function SwarmApp({ initial }: { initial: Board }) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const rafRef = useRef<number>(0);
  const scoreRafRef = useRef<number>(0);
  const boardRafRef = useRef<number>(0);
  const keyRef = useRef<string>("levy");

  const [polKey, setPolKey] = useState("levy");
  const [n, setN] = useState(DEFAULT_N);
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState({ step: 0, frac: 0 });
  const [scored, setScored] = useState<{ score: number; meanSteps: number; ok: boolean; partial: boolean } | null>(null);
  const [rows, setRows] = useState<Row[]>(() => toRows(initial.entries));
  const [tab, setTab] = useState<"arena" | "board" | "attempts" | "submit" | "how" | "faq">("arena");
  // which board row has its note open — every entry says what it tried, like the
  // sibling site's submission list
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [progression, setProgression] = useState<Point[]>(initial.progression);
  const [models, setModels] = useState(initial.models);
  const [attempts, setAttempts] = useState<Attempt[]>(initial.attempts);
  // the arena used to be hardcoded to seed 1 — which is a maze, so every visitor
  // only ever saw corridors. Start on rooms and cycle a new map on each watch.
  const [seed, setSeed] = useState<number>(SEEDS.find((s: number) => s % 3 === 0) ?? SEEDS[0]);

  const nRef = useRef(n);
  const seedRef = useRef(seed);
  // mirror latest state into refs so the rAF loop closure reads current values
  useEffect(() => { keyRef.current = polKey; nRef.current = n; seedRef.current = seed; });

  // Score one seed per animation frame. A policy that never covers burns the full
  // step cap on all 12 maps — seconds of work — and doing that in one synchronous
  // call locked up the tab. The number ticks up as seeds land.
  const runScore = useCallback((key: string, agents: number) => {
    cancelAnimationFrame(scoreRafRef.current);
    const step = compilePolicy(POLICIES[key].src);
    let sum = 0, done = 0, ok = true;
    const nextSeed = () => {
      const s = simulate(step, agents, SEEDS[done]);
      s.runToScore();
      sum += s.step; done++; ok = ok && s.frac >= TARGET;
      const mean = Math.round(sum / done);
      setScored({ score: agents * mean, meanSteps: mean, ok: ok && agents >= MIN_AGENTS, partial: done < SEEDS.length });
      if (done < SEEDS.length) scoreRafRef.current = requestAnimationFrame(nextSeed);
    };
    nextSeed();
  }, []);

  const draw = useCallback(() => {
    const cv = cvRef.current, sim = simRef.current;
    if (!cv || !sim) return;
    const ctx = cv.getContext("2d")!;
    const cell = cv.width / W;
    ctx.fillStyle = "#232246"; ctx.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < W * H; i++) {
      const x = i % W, y = (i / W) | 0;
      if (sim.wall[i]) { ctx.fillStyle = "#4b4b78"; ctx.fillRect(x * cell, y * cell, cell, cell); }
      else if (sim.covered[i]) { ctx.fillStyle = "rgba(181,199,255,.20)"; ctx.fillRect(x * cell, y * cell, cell, cell); }
    }
    const c = colorFor(keyRef.current);
    ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 4;
    for (const a of sim.agents) ctx.fillRect(a.x * cell + cell * 0.1, a.y * cell + cell * 0.1, cell * 0.8, cell * 0.8);
    ctx.shadowBlur = 0;
  }, []);

  const loop = useCallback(function loop() {
    const sim = simRef.current!;
    for (let i = 0; i < 3; i++) { if (sim.step >= CAP || sim.frac >= TARGET) break; sim.tick(); }
    draw(); setLive({ step: sim.step, frac: sim.frac });
    if (sim.step >= CAP || sim.frac >= TARGET) { setRunning(false); runScore(keyRef.current, nRef.current); return; }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, runScore]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current); cancelAnimationFrame(scoreRafRef.current); setScored(null);
    const next = SEEDS[(SEEDS.indexOf(seed) + 1) % SEEDS.length];   // walk the seed list; families interleave, all three inside four watches
    setSeed(next); seedRef.current = next;
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, next);
    setLive({ step: 0, frac: 0 }); setRunning(true);
    rafRef.current = requestAnimationFrame(loop);
  }, [polKey, n, seed, loop]);

  const pause = useCallback(() => { cancelAnimationFrame(rafRef.current); setRunning(false); }, []);
  const score = useCallback(() => { cancelAnimationFrame(rafRef.current); setRunning(false); runScore(polKey, n); }, [polKey, n, runScore]);

  const refreshBoard = useCallback(async () => {
    // the board is scored server-side from the committed submissions + built-ins
    try {
      const res = await fetch("/api/leaderboard");
      const { entries, progression: prog, models: mods, attempts: atts } = await res.json();
      setProgression(prog ?? []); setModels(mods ?? []); setAttempts(atts ?? []);
      setRows(toRows(entries));
    } catch {
      // Fall back to the built-ins if the API is unreachable — one policy per
      // frame, and drop the ones that can't cover the maps, the same as the API
      // does. Scoring the whole set in one go is ~13s of frozen tab, and this is
      // exactly the path a visitor hits when the API is down.
      const out: Row[] = [];
      let i = 0;
      const nextPolicy = () => {
        const k = ORDER[i++], b = POLICIES[k];
        const r = scoreSeeds(compilePolicy(b.src), b.n, SEEDS);
        if (r.ok) out.push({ key: k, name: b.name, tag: b.tag, n: b.n, meanSteps: r.meanSteps, score: r.score, model: "reference" });
        setRows([...out].sort((a, b2) => a.score - b2.score));
        if (i < ORDER.length) boardRafRef.current = requestAnimationFrame(nextPolicy);
      };
      nextPolicy();
    }
  }, []);

  useEffect(() => {
    simRef.current = simulate(compilePolicy(POLICIES.levy.src), DEFAULT_N, seedRef.current);
    draw(); refreshBoard();
    return () => { cancelAnimationFrame(rafRef.current); cancelAnimationFrame(scoreRafRef.current); cancelAnimationFrame(boardRafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current); cancelAnimationFrame(scoreRafRef.current);
    setRunning(false); setScored(null);
    simRef.current = simulate(compilePolicy(POLICIES[polKey].src), n, seedRef.current);
    setLive({ step: 0, frac: 0 }); draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polKey, n]);
  // canvas remounts when the Arena tab shows — redraw the current frame
  useEffect(() => { if (tab === "arena") requestAnimationFrame(draw); }, [tab, draw]);

  const leader = rows[0];   // the API sorts by score, so row 0 is the record
  const best = rows.reduce((m, r) => Math.min(m, r.score), Infinity);
  const worst = rows.reduce((m, r) => Math.max(m, r.score), FLOOR);
  const levyScore = rows.find((r) => r.tag === "baseline")?.score;
  const hasData = Number.isFinite(best);
  const aboveFloor = hasData ? Math.round(((best - FLOOR) / FLOOR) * 100) : null;
  const aheadLevy = levyScore && hasData ? Math.round(((levyScore - best) / levyScore) * 100) : null;
  const pos = (s: number) => Math.max(0, Math.min(100, ((s - FLOOR) / (worst - FLOOR)) * 100));
  // keep track labels from overflowing / colliding at the ends: left-anchor near 0%,
  // right-anchor near 100%, centered in the middle.
  const lblAlign = (p: number) => (p < 14 ? { transform: "none" } : p > 86 ? { transform: "translateX(-100%)" } : undefined);

  const TABS: [typeof tab, string][] = [["arena", "Arena"], ["board", "Leaderboard"], ["attempts", "Attempts"], ["submit", "Submit"], ["how", "How it works"], ["faq", "FAQ"]];

  // group every attempt under the account that committed it — the git author is
  // the only identity this benchmark has, and it is the one that opened the PR
  const byPerson = attempts.reduce<Record<string, { who: string; login: string | null; items: Attempt[] }>>((acc, a) => {
    const id = a.login || a.author || "unattributed";
    (acc[id] ||= { who: a.author || id, login: a.login, items: [] }).items.push(a);
    return acc;
  }, {});
  const people = Object.values(byPerson).sort((a, b) => b.items.length - a.items.length);

  return (
    <>
      <header className="site"><div className="wrap nav">
        <div className="brand">
          <EigenMark className="mark" />
          <span className="name">swarm<span style={{ color: "var(--indigo)" }}>.fail</span></span>
          <a className="by" href="https://www.eigenlabs.org" target="_blank" rel="noreferrer">by <EigenMark /> Eigen ↗</a>
        </div>
        <div className="nav-right">
          <Button variant="outline" size="sm" asChild><a href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a></Button>
          <Button size="sm" onClick={() => setTab("submit")}>Submit</Button>
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
          <h1>One rule.<br />A hundred agents.<br /><span className="dim">Explore the whole map.</span></h1>
          <p className="lead">
            You write <b style={{ color: "var(--fg)" }}>one simple rule</b>. We copy it into a hundred agents and drop them into a maze
            they&apos;ve never seen — no leader, no map to start with, just one shared brain they build together as they go. No single agent is smart; the right rule makes the whole crowd
            smart. <b style={{ color: "var(--fg)" }}>Write a better rule than everyone else and climb the leaderboard.</b>
          </p>
          <div className="cta">
            <Button size="lg" onClick={run}>▶ Watch them explore</Button>
            <Button variant="outline" size="lg" onClick={() => setTab("how")}>How it works</Button>
          </div>
          {/* the three numbers that say what you are actually up against */}
          <div className="beat">
            <div className="b-item target">
              <span className="k">the score to beat</span>
              {leader
                ? <><b>{leader.score}</b><span className="v">{leader.name} · {leader.model}</span></>
                : <><span className="skeleton" style={{ display: "block", height: 30, width: 90, margin: "2px 0 6px" }} /><span className="v">loading the record…</span></>}
            </div>
            <div className="b-item">
              <span className="k">a good rule passes</span>
              {levyScore ? <b>{levyScore}</b> : <b>—</b>}
              <span className="v">Lévy Flight — the natural baseline</span>
            </div>
            <div className="b-item">
              <span className="k">nothing can beat</span>
              <b>{FLOOR}</b>
              <span className="v">one visit per cell, nothing less</span>
            </div>
          </div>
          <p className="beat-line">
            {leader
              ? <>Land a rule under <b>{leader.score}</b> and you are #1. Everything between it and <b>{FLOOR}</b> is unsolved.</>
              : <>Land a rule under the current record and you are #1. Everything between it and {FLOOR} is unsolved.</>}
            {" "}<button className="linkish" onClick={() => setTab("board")}>See the board →</button>
          </p>
        </div>

        {/* live terminal panel */}
        <div className="term">
          <div className="term-bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="t">{n} agents · rule: {POLICIES[polKey].name.toLowerCase()} · map: {familyOf(seed)}</span>
          </div>
          <div className="term-body">
            <canvas ref={cvRef} width={400} height={400} />
            <div className="cap"><span><i className="sw-dot" /> agents</span><span><i className="sw-cell" /> explored</span><span><i className="sw-wall" /> walls</span><span className="grow" />goal: explore every open cell</div>
            <div className="bar"><i style={{ width: `${Math.min(100, (live.frac / TARGET) * 100)}%` }} /></div>
            <div className="term-foot">
              <span>moves <b>{live.step}</b></span>
              <span>explored <b>{Math.round(live.frac * 100)}%</b></span>
              <span>score <b style={{ color: scored && !scored.partial ? (scored.ok ? "var(--good)" : "var(--destructive)") : "var(--fg)" }}>{scored ? scored.score : "—"}{scored?.partial ? "…" : ""}</b></span>
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
              <Button variant="outline" size="sm" onClick={running ? pause : run}>{running ? "Pause" : "▶ Watch"}</Button>
              <Button variant="outline" size="sm" onClick={score}>Score</Button>
            </div>
          </div>
        </div>
      </div></section>

      {/* objective — the goal / score / win, in plain words */}
      <div className="obj"><div className="wrap"><div className="obj-in">
        <div className="cell">
          <span className="k"><span className="num">01</span> The goal</span>
          <p>Get the agents to <b>explore the whole map</b> — every cell visited at least once.</p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">02</span> The catch</span>
          <p>They all follow <b>the same one rule</b> you write. <span className="m">No leader, no map to start with — each agent sees only the cell it&apos;s standing on, plus whatever the swarm has written into its shared brain.</span></p>
        </div>
        <div className="cell">
          <span className="k"><span className="num">03</span> The win</span>
          <p>Finish in the <b>fewest total moves</b>. <span className="m">Beat whoever&apos;s #1 on the leaderboard and get as close as you can to the perfect score — the fewest moves physically possible.</span></p>
        </div>
      </div></div></div>
      </>}

      {/* ── ATTEMPTS: every submission, ranked or not, per account ── */}
      {tab === "attempts" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Attempts</div>
        <p className="sub" style={{ marginTop: 0, marginBottom: 22, maxWidth: 680 }}>
          Every rule anyone has landed, ranked or not, grouped by the account that committed it.
          A run that misses a map or fields too few agents still shows up here — <b style={{ color: "var(--fg)" }}>with the
          reason it didn&apos;t rank</b>. Failing in the open is the point.
        </p>
        {!people.length && <div className="skeleton" style={{ height: 120 }} />}
        {people.map((p) => {
          const ranked = p.items.filter((a) => a.ok).length;
          return (
            <div className="who" key={p.who}>
              <div className="who-head">
                <span className="avatar" style={{ background: `oklch(0.86 0.07 ${monoHue(p.who)})` }}>{p.who[0].toUpperCase()}</span>
                <span className="n">
                  {p.login
                    ? <a href={`https://github.com/${p.login}`} target="_blank" rel="noreferrer">{p.who} <span style={{ color: "var(--ink-faint)" }}>@{p.login}</span></a>
                    : p.who}
                </span>
                <span className="grow" />
                <span className="tally">{ranked}/{p.items.length} ranked</span>
              </div>
              {p.items.map((a) => (
                <div className="att" key={a.handle}>
                  <span className="h">
                    <a href={`${REPO}/blob/main/submissions/${a.handle}.js`} target="_blank" rel="noreferrer">{a.handle}.js</a>
                    {" "}<span className={a.ok ? "pill ok" : "pill fail"}>{a.ok ? "ranked" : "unranked"}</span>
                  </span>
                  <span className="sc">{a.ok ? a.score : "FAIL"} · {a.n} agents · {a.model}</span>
                  {!a.ok && <p className="why">{a.reason}</p>}
                  {a.ok && a.note && <p className="why">{a.note}</p>}
                </div>
              ))}
            </div>
          );
        })}
      </div></section>}

      {/* ── HOW IT WORKS: why it's hard ── */}
      {tab === "how" && <section className="sec" style={{ paddingTop: 36, paddingBottom: 0 }}><div className="wrap">
        <div className="eyebrow">How it works</div>
        <h2 style={{ marginTop: 10 }}>One rule, one number.</h2>
        <ol className="steps">
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <span className="sn">{String(i + 1).padStart(2, "0")}</span>
              <div><h4>{st.title}</h4><p>{st.body}</p></div>
            </li>
          ))}
        </ol>
      </div></section>}

      {tab === "how" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
        <div className="eyebrow">Why it&apos;s hard</div>
        <h2>A single agent can&apos;t see the whole map. A swarm doesn&apos;t have to.</h2>
        <p className="sub">Coordination has to come from the rule itself — there&apos;s nothing else to lean on.</p>
        <div className="cards">
          {CARDS.map((c) => (
            <Card key={c.l}>
              <CardContent style={{ padding: 22 }}>
                <span className="card-lbl" style={{ color: c.c }}>{c.l}</span>
                <h4 style={{ fontSize: 18, margin: "12px 0 8px", fontWeight: 600 }}>{c.h}</h4>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{c.p}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div></section>}

      {/* ── LEADERBOARD ── */}
      {tab === "board" && <section className="sec" style={{ paddingTop: 36 }}><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Leaderboard</div>
        <p className="sub" style={{ marginTop: 0, marginBottom: 20, maxWidth: 680 }}>
          Each row is one rule. <b style={{ color: "var(--fg)" }}>Score = agents × moves to explore every maze — lower wins.</b> The bar
          below runs from the <b style={{ color: "var(--fg)" }}>best score physically possible</b> (left) to <b style={{ color: "var(--fg)" }}>aimless
          wandering</b> (right). Your goal: <b style={{ color: "var(--fg)" }}>beat whoever&apos;s #1 and creep toward the best-possible score on the left</b> — that gap is the open challenge. <b style={{ color: "var(--fg)" }}>Lévy Flight</b> (the pattern real animals use) is just a landmark you pass along the way.
        </p>
        <div className="frontier" style={{ marginBottom: 18 }}>
          <div className="row between" style={{ alignItems: "flex-end" }}>
            <div><div className="big">{hasData ? best : "—"}</div><div className="biglbl">Best score · {aboveFloor != null ? `+${aboveFloor}% above the best possible` : "—"}</div></div>
            <div style={{ textAlign: "right" }}><div className="big" style={{ fontSize: 24, color: "var(--good)" }}>{aheadLevy != null ? `${aheadLevy}%` : "—"}</div><div className="biglbl">ahead of Lévy</div></div>
          </div>
          <div className="track">
            {/* floor number folded into its own bottom label so it can't collide with the best pin */}
            <span className="lbl bot" style={{ left: 0, transform: "none" }}>{FLOOR} · best possible</span>
            {hasData && <span className="pin" style={{ left: `${pos(best)}%`, background: "var(--good)" }} />}
            {hasData && <span className="lbl top" style={{ left: `${pos(best)}%`, ...lblAlign(pos(best)) }}>best so far · {best}</span>}
            {levyScore && <span className="pin" style={{ left: `${pos(levyScore)}%`, background: "var(--cyan)" }} />}
            {levyScore && <span className="lbl top" style={{ left: `${pos(levyScore)}%`, ...lblAlign(pos(levyScore)) }}>Lévy</span>}
            <span className="lbl bot" style={{ left: "100%", transform: "translateX(-100%)" }}>aimless</span>
          </div>
        </div>
        {progression.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <RecordChart points={progression} floor={FLOOR} />
          </div>
        )}

        {models.length > 0 && (() => {
          const top = Math.max(...models.map((m) => m.gained), 1);
          return (
            <div className="panel" style={{ marginBottom: 18 }}>
              <span className="eyebrow">Which model moved the frontier</span>
              <p className="sub" style={{ margin: "8px 0 0", fontSize: 13.5, maxWidth: 620 }}>
                Taking the record earns a model the percentage it cut off the previous one. Holding
                the record isn&apos;t the same as having moved it.
              </p>
              <div className="models">
                {models.map((m) => (
                  <div className="mrow" key={m.model}>
                    <div className="mname">
                      <span className="avatar" style={{ background: `oklch(0.86 0.07 ${monoHue(m.model)})` }}>{m.model[0]}</span>
                      <span>{m.model}</span>
                    </div>
                    <div className="mbar"><i style={{ width: `${(m.gained / top) * 100}%` }} /></div>
                    <div className="mnum"><b>{m.gained}%</b><br />
                      <span style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>{m.records} record{m.records === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="panel" style={{ padding: "4px 18px" }}>
          <table>
            <thead><tr><th>#</th><th>Author</th><th>Model</th><th className="num">Agents</th><th className="num">Moves</th><th className="num">Score</th><th className="num">vs Lévy</th></tr></thead>
            <tbody>
              {rows.map((r, i) => {
                const d = levyScore != null ? r.score - levyScore : 0;
                const dStr = d === 0 ? "—" : d < 0 ? `▼ ${-d}` : `▲ ${d}`;
                const dCol = d < 0 ? "var(--good)" : d > 0 ? "var(--destructive)" : "var(--faint)";
                const isRef = r.model === "reference";
                const tg = r.tag === "baseline" ? <Badge variant="secondary">baseline</Badge> : r.tag === "win" ? <Badge variant="outline" style={{ color: "var(--good)", borderColor: "var(--good)" }}>beats Lévy</Badge> : r.tag === "floor" ? <Badge variant="outline">worst</Badge> : null;
                const rowKey = `${r.key}-${r.id ?? i}`;
                const open = openRow === rowKey;
                return (
                  <Fragment key={rowKey}>
                  <tr className={r.note ? "clickable" : undefined} onClick={r.note ? () => setOpenRow(open ? null : rowKey) : undefined}>
                    <td>{i < 3 ? <span className="medal">{MEDAL[i]}</span> : <span className="rank">{i + 1}</span>}</td>
                    <td style={{ fontWeight: 500 }}><span className="solver">
                      {r.handle
                        ? <a className="solver" href={`${REPO}/blob/main/submissions/${r.handle}.js`} target="_blank" rel="noreferrer">
                            <span className="avatar" style={{ background: `oklch(0.86 0.07 ${monoHue(r.handle)})` }}>{r.handle[0].toUpperCase()}</span>
                            {r.name}
                          </a>
                        : r.name}
                      {i === 0 && <span className="pill record">current record</span>}
                      {tg}
                      {r.note && (
                        <button
                          className="caret-btn"
                          aria-expanded={open}
                          aria-label={`${open ? "Hide" : "Show"} ${r.name}'s approach`}
                          onClick={(e) => { e.stopPropagation(); setOpenRow(open ? null : rowKey); }}
                        >
                          <span className={open ? "caret open" : "caret"} aria-hidden>›</span>
                        </button>
                      )}
                    </span></td>
                    <td>{isRef ? <Badge variant="outline">reference</Badge> : <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.model}</span>}</td>
                    <td className="num">{r.n}</td><td className="num">{r.meanSteps}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.score}</td>
                    <td className="num" style={{ color: dCol }}>{dStr}</td>
                  </tr>
                  {open && r.note && (
                    <tr className="detail"><td colSpan={7}>
                      <div className="note">
                        <span className="k">approach</span>
                        <p>{r.note}</p>
                        {r.handle && <a href={`${REPO}/blob/main/submissions/${r.handle}.js`} target="_blank" rel="noreferrer">read the rule ↗</a>}
                      </div>
                    </td></tr>
                  )}
                  </Fragment>
                );
              })}
              {!rows.length && Array.from({ length: 6 }, (_, i) => (
                <tr key={`sk${i}`}>
                  <td colSpan={7}><span className="skeleton" style={{ display: "block", height: 18 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Badge variant="outline">reference</Badge> = built-in example rules to beat ·{" "}
          <Badge variant="secondary">baseline</Badge> = Lévy Flight, a natural landmark to pass ·{" "}
          <b style={{ color: "var(--good)" }}>▼</b> better than Lévy, <b style={{ color: "var(--destructive)" }}>▲</b> worse ·{" "}
          🥇 current best · <b style={{ color: "var(--fg)" }}>Agents × Moves = Score</b>, lower wins.
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
            <p className="hint" style={{ margin: 0 }}>CI scores your PR and comments the number. If it <b style={{ color: "var(--fg)" }}>beats the current best</b>, it auto-merges and the live board redeploys. Score = agents × moves to explore {Math.round(TARGET * 100)}% of each map over {SEEDS.length} maps, floor <b style={{ color: "var(--fg)" }}>{FLOOR}</b>. A run that fails to explore any map — or fields <b style={{ color: "var(--fg)" }}>fewer than 50 agents</b> (it&apos;s a swarm, not a solo sweeper) — is unranked. No accounts — your GitHub handle is your identity.</p>
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
              <li><code className="k">env.shared</code> the swarm&apos;s shared brain — one object all agents read/write, reset per map</li>
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
            <p><b>Each agent moves one cell.</b> It knows its own position, a private scratchpad, and the swarm&apos;s shared brain — a collective memory every agent reads and writes in real time.</p>
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
            <p>A game. You write <b>one simple rule</b> for a agent. We copy it into ~100 agents and drop them into a maze. They scurry around exploring it, and you get one number: how fast they explored the whole thing. Lower is better. Everyone&apos;s number goes on a leaderboard.</p>
          </div>
          <div className="faq-item">
            <h4>Where do the mazes come from?</h4>
            <p>The computer builds them from a <b>fixed list of 12 numbers</b> (seeds). They come in <b>three flavours</b> — open rooms, tight corridor mazes, and cave-like blobs — four of each, so one rule has to cope with all of them. Each number always produces the <b>exact same maze</b>, the same walls in the same spots, so everyone is judged on the identical mazes and your score comes out the same on any computer. Your rule can&apos;t peek at the layout: each agent only feels the walls right next to it, so a maze is &quot;unseen&quot; until the agents bump into it.</p>
          </div>
          <div className="faq-item">
            <h4>How do I take part?</h4>
            <p>Fork the code on GitHub, add one file — <code className="k">submissions/your-name.js</code> with your rule — and open a Pull Request. A bot scores it automatically and comments the number. If it <b>beats the current best</b>, it joins the board and the site updates itself. You can use any AI model to help write your rule, or write it by hand.</p>
          </div>
          <div className="faq-item">
            <h4>How is the score worked out? What&apos;s a good one?</h4>
            <p>Score = <b>how many agents × how many moves</b> it took to explore {Math.round(TARGET * 100)}% of each maze, averaged over {SEEDS.length} mazes. Lower wins. The best possible is around <b>{FLOOR}</b> — you can&apos;t beat that (it&apos;s the number of squares to visit), so the real game is getting as <i>close</i> to it as you can. You&apos;re racing <b>everyone else on the board</b>, not one policy. <b>Lévy Flight</b>{levyScore ? <> (<span className="mono">{levyScore}</span>)</> : null} — the pattern real animals use — is just a famous landmark: pass it and you know your rule is genuinely good.</p>
          </div>
          <div className="faq-item">
            <h4>Do the agents learn or talk to each other?</h4>
            <p>They don&apos;t learn, but they <b>coordinate</b> — three ways, all in real time. They share a <b>brain</b> (<code className="k">env.shared</code>): one collective memory every agent reads and writes each step, so the swarm can build a map together, claim squares, and leave notes for each other. Each agent can also drop <b>scent</b> on its square (<code className="k">env.trail</code>) that fades over time — how ants do it — and sense how many agents stand next to it right now (<code className="k">env.near</code>). There&apos;s still no leader: nobody hands out orders, the same one rule runs in every agent, and the smart behavior emerges from what they write into the brain. All the cleverness lives in the rule <i>you</i> write.</p>
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
