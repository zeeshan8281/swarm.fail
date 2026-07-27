"use client";

import { useState } from "react";

export type Point = { at: string; score: number; handle: string; model: string; from: number | null; gained: number | null };

const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const full = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/*
 * Record progression — every time the best score fell, and who took it.
 * Hand-rolled SVG: the whole page is one dependency-free bundle and a chart
 * library would be an order of magnitude more code than the ~30 lines of maths
 * a step plot needs.
 */
export default function RecordChart({ points, floor }: { points: Point[]; floor: number }) {
  const [hover, setHover] = useState<number | null>(null);
  if (points.length < 1) return null;

  const W = 760, H = 200, PAD = { l: 8, r: 8, t: 18, b: 26 };
  const t0 = new Date(points[0].at).getTime();
  // run the axis past the newest record so the current one visibly holds. No
  // clock: this renders at build time and again on the client, and Date.now()
  // would make those two disagree.
  const last = new Date(points[points.length - 1].at).getTime();
  const t1 = last + Math.max(864e5, (last - t0) * 0.18);
  const span = Math.max(1, t1 - t0);
  const hi = points[0].from ?? points[0].score;
  const lo = floor;
  const x = (at: string) => PAD.l + ((new Date(at).getTime() - t0) / span) * (W - PAD.l - PAD.r);
  const y = (s: number) => PAD.t + (1 - (hi - s) / Math.max(1, hi - lo)) * (H - PAD.t - PAD.b);

  // step path: hold the record flat until the next one lands
  let d = `M ${x(points[0].at).toFixed(1)} ${y(points[0].score).toFixed(1)}`;
  points.slice(1).forEach((p) => { d += ` H ${x(p.at).toFixed(1)} V ${y(p.score).toFixed(1)}`; });
  d += ` H ${(W - PAD.r).toFixed(1)}`;
  // the band between the record and the floor is the part of the problem nobody
  // has solved yet — fill it, so the empty half of the chart is the message
  const gap = `${d} V ${y(lo).toFixed(1)} H ${x(points[0].at).toFixed(1)} Z`;
  const best = points[points.length - 1].score;
  const above = Math.round(((best - lo) / lo) * 100);

  const active = hover != null ? points[hover] : points[points.length - 1];

  return (
    <div className="chart">
      <div className="chart-head">
        <div>
          <span className="k">Record progression</span>
          <p>Every time the best score fell — and which model took it.</p>
        </div>
        <div className="chart-now">
          <b>{points[points.length - 1].score}</b>
          <span>current record</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Record score over time, lower is better">
        {/* the floor — the score nobody can beat */}
        <path d={gap} className="c-gap" />
        <line x1={PAD.l} x2={W - PAD.r} y1={y(lo)} y2={y(lo)} className="c-floor" />
        <text x={PAD.l} y={y(lo) - 6} className="c-lbl">floor {floor} · nothing can go lower</text>
        <text x={W - PAD.r - 6} y={y(lo) + (y(best) - y(lo)) / 2} className="c-gap-lbl" textAnchor="end">
          open frontier · record is {above}% above the floor
        </text>
        <path d={d} className="c-line" />
        {points.map((p, i) => (
          <g key={p.at + p.handle} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={x(p.at) - 14} y={0} width={28} height={H} fill="transparent" />
            <circle cx={x(p.at)} cy={y(p.score)} r={hover === i ? 6 : 4} className="c-dot" />
            <text x={x(p.at)} y={H - 8} className="c-lbl" textAnchor={i === 0 ? "start" : "middle"}>{fmt.format(new Date(p.at))}</text>
          </g>
        ))}
      </svg>

      <div className="chart-foot">
        <span className="pill record">{active.handle}</span>
        <span>{active.model}</span>
        <span className="grow" />
        <span>{full.format(new Date(active.at))}</span>
        <b>{active.score}</b>
        {active.gained != null && <span className="down">−{active.gained}%</span>}
      </div>
    </div>
  );
}
