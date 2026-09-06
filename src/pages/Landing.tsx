import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOURCE_URL =
  "https://github.com/luckyjaiswal1130-dotcom/Techsense-project/blob/master/simulation-code-5d.html";

const RUN_URL = "https://onecompiler.com/html#draft-x5ce";

/* ------------------------------------------------------------------ */
/* Archival primitives                                                 */
/* ------------------------------------------------------------------ */

function CapsLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`caps-label ${className}`}>{children}</div>;
}

function Formula({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="ink-formula overflow-x-auto px-4 py-3">
      {label ? <CapsLabel className="mb-1.5">{label}</CapsLabel> : null}
      <div className="font-mono text-[13px] leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function Stamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`stamp px-3 py-1.5 text-[10px] ${className}`}>{children}</span>
  );
}

function SectionHeading({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <CapsLabel className="text-oxblood/80">{kicker}</CapsLabel>
      <h2 className="mt-3 text-3xl text-ink sm:text-4xl">{title}</h2>
      <div className="rule-double mx-auto mt-5 w-24" />
      {lede ? <p className="mt-5 text-base leading-relaxed text-ink-soft">{lede}</p> : null}
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/* ------------------------------------------------------------------ */
/* Hand-drawn figures (inline SVG, engraved-plate style)               */
/* ------------------------------------------------------------------ */

function FlatLatticeFigure() {
  const cols = 9,
    rows = 5,
    s = 22,
    x0 = 16,
    y0 = 14;
  const h: string[] = [];
  const v: string[] = [];
  for (let r = 0; r <= rows; r++) h.push(`M ${x0} ${y0 + r * s} H ${x0 + cols * s}`);
  for (let c = 0; c <= cols; c++) v.push(`M ${x0 + c * s} ${y0} V ${y0 + rows * s}`);
  const dots: ReactNode[] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++)
      dots.push(<circle key={`${r}-${c}`} cx={x0 + c * s} cy={y0 + r * s} r={1.7} fill="#2e2417" opacity={0.75} />);
  return (
    <svg viewBox="0 0 236 140" className="mx-auto w-full max-w-sm" role="img" aria-label="Uniform cubic lattice of nodes and edges">
      <path d={h.join(" ")} stroke="#8a7a5c" strokeWidth="1" fill="none" opacity="0.6" />
      <path d={v.join(" ")} stroke="#8a7a5c" strokeWidth="1" fill="none" opacity="0.6" />
      {dots}
      <text x={x0 + cols * s - 40} y={y0 - 3} fontSize="8" fill="#8a7a5c" fontStyle="italic">
        every edge equal — no mass, no curve
      </text>
    </svg>
  );
}

function WarpSheetFigure() {
  const W = 260,
    H = 150,
    cx = 130,
    top = 16,
    bottom = 132;
  const dip = (x: number, k: number) => k * Math.exp(-((x - cx) * (x - cx)) / (2 * 30 * 30));
  const rowsH = [0, 1, 2, 3, 4];
  const horiz = rowsH.map((i) => {
    const y = top + (i * (bottom - top)) / (rowsH.length - 1);
    let d = `M 14 ${y}`;
    for (let x = 14; x <= W - 14; x += 7) d += ` L ${x} ${y + dip(x, (bottom - y) * 0.5 + 4)}`;
    return <path key={i} d={d} stroke="#8a7a5c" strokeWidth="1" fill="none" opacity="0.62" />;
  });
  const vert: ReactNode[] = [];
  for (let x = 14; x <= W - 14; x += 24)
    vert.push(
      <path key={x} d={`M ${x} ${top} L ${cx + (x - cx) * 0.82} ${bottom + dip(x, 10)}`} stroke="#8a7a5c" strokeWidth="1" fill="none" opacity="0.45" />,
    );
  return (
    <svg viewBox="0 0 260 160" className="mx-auto w-full max-w-md" role="img" aria-label="The same lattice sagging into a gravity well">
      {vert}
      {horiz}
      <circle cx={cx} cy={bottom + 22} r={9} fill="#7a2e21" />
      <path d={`M ${cx + 26} ${bottom - 34} L ${cx + 26} ${bottom + 6}`} stroke="#2e2417" strokeWidth="1" strokeDasharray="3 3" />
      <path d={`M ${cx + 22} ${bottom - 30} L ${cx + 26} ${bottom - 36} L ${cx + 30} ${bottom - 30}`} stroke="#2e2417" strokeWidth="1" fill="none" />
      <text x={cx + 32} y={bottom - 12} fontSize="9" fill="#2e2417" fontStyle="italic">
        w
      </text>
      <text x={cx - 78} y={top - 4} fontSize="8" fill="#8a7a5c" fontStyle="italic">
        mass opens the gate — the fabric dips
      </text>
    </svg>
  );
}

function ThresholdCurveFigure() {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = 26 + (i / 60) * 190;
    const t = (x - 26) / 190;
    const f = Math.pow(t, 7) / (1 + Math.pow(t, 7));
    pts.push(`${x} ${122 - f * 86}`);
  }
  return (
    <svg viewBox="0 0 250 140" className="mx-auto w-full max-w-sm" role="img" aria-label="Sigmoid threshold gate over the potential ratio">
      <rect x={120} y={12} width={104} height={110} fill="#7a2e21" opacity="0.07" />
      <path d={`M ${pts.join(" L ")}`} stroke="#7a2e21" strokeWidth="1.6" fill="none" />
      <path d="M 26 12 V 122 H 230" stroke="#8a7a5c" strokeWidth="1" fill="none" />
      <path d="M 120 12 V 122" stroke="#2e2417" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      <circle cx={120} cy={79} r={3} fill="#2e2417" />
      <text x={124} y={133} fontSize="9" fill="#2e2417" fontStyle="italic">
        Φ₀ — the half-open point
      </text>
      <text x={160} y={26} fontSize="8" fill="#7a2e21" fontStyle="italic">
        gate opening
      </text>
      <text x={30} y={26} fontSize="8" fill="#8a7a5c" fontStyle="italic">
        flat: gate shut
      </text>
    </svg>
  );
}

function DeflectionFigure() {
  return (
    <svg viewBox="0 0 250 140" className="mx-auto w-full max-w-md" role="img" aria-label="A light ray bending around a mass, with the extra Lucky wedge">
      <circle cx={190} cy={70} r={11} fill="#7a2e21" />
      <path d="M 8 112 Q 120 100 178 74 Q 214 56 244 40" stroke="#2e2417" strokeWidth="1.6" fill="none" />
      <path d="M 8 112 L 244 66" stroke="#8a7a5c" strokeWidth="1" strokeDasharray="4 4" fill="none" />
      <path d="M 190 70 L 244 70" stroke="#7a2e21" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.8" />
      <path d="M 236 66 A 46 46 0 0 0 232 55" stroke="#7a2e21" strokeWidth="1.2" fill="none" />
      <text x={214} y={82} fontSize="9" fill="#7a2e21" fontStyle="italic">
        θ
      </text>
      <text x={96} y={92} fontSize="8" fill="#8a7a5c" fontStyle="italic">
        undeflected, no mass
      </text>
      <text x={150} y={124} fontSize="8" fill="#2e2417" fontStyle="italic">
        Δ is the surplus over Einstein’s 4GM/c²b
      </text>
    </svg>
  );
}

function OrbitRosterFigure() {
  const rings = [2.0, 2.6, 3.3, 4.0, 5.1, 6.2, 7.2, 8.1];
  return (
    <svg viewBox="0 0 240 150" className="mx-auto w-full max-w-md" role="img" aria-label="Concentric orbits of the simulated solar system">
      {rings.map((r, i) => (
        <ellipse key={r} cx={120} cy={78} rx={r * 13.4} ry={r * 13.4 * 0.42} stroke="#8a7a5c" strokeWidth="0.8" strokeDasharray="3 4" fill="none" opacity={0.7 - i * 0.04} />
      ))}
      <circle cx={120} cy={78} r={7} fill="#7a2e21" />
      {rings.map((r, i) => {
        const a = (i * 2.4 + 0.6) % (Math.PI * 2);
        const x = 120 + Math.cos(a) * r * 13.4;
        const y = 78 + Math.sin(a) * r * 13.4 * 0.42;
        return <circle key={r} cx={x} cy={y} r={2.4 - i * 0.12} fill="#2e2417" opacity={0.85} />;
      })}
      <text x={12} y={14} fontSize="8" fill="#8a7a5c" fontStyle="italic">
        Mercury r=2.0 … Neptune r=8.1 — v = √(GM/r)
      </text>
    </svg>
  );
}

function SequenceStripFigure() {
  const panel = "rounded-sm border border-[color:var(--rule)] bg-[color:var(--paper-deep)] p-2";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <figure className={panel}>
        <svg viewBox="0 0 100 84" className="w-full" role="img" aria-label="Two black holes spiralling together">
          <circle cx={34} cy={44} r={8} fill="#2e2417" />
          <circle cx={68} cy={40} r={6} fill="#2e2417" opacity={0.85} />
          <path d="M 44 40 A 18 10 0 0 1 60 36" stroke="#7a2e21" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
          <path d="M 60 48 A 18 10 0 0 1 44 50" stroke="#7a2e21" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        </svg>
        <figcaption className="caps-label mt-1.5 text-center">I · Inspiral</figcaption>
      </figure>
      <figure className={panel}>
        <svg viewBox="0 0 100 84" className="w-full" role="img" aria-label="Merger flash with ripple and rays">
          <circle cx={50} cy={42} r={9} fill="#2e2417" />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <path key={i} d={`M ${50 + Math.cos(a) * 12} ${42 + Math.sin(a) * 12} L ${50 + Math.cos(a) * 24} ${42 + Math.sin(a) * 24}`} stroke="#7a2e21" strokeWidth="1.3" />
            );
          })}
          <ellipse cx={50} cy={42} rx={32} ry={12} stroke="#8a7a5c" strokeWidth="1" fill="none" strokeDasharray="2 3" />
        </svg>
        <figcaption className="caps-label mt-1.5 text-center">II · Merger burst</figcaption>
      </figure>
      <figure className={panel}>
        <svg viewBox="0 0 100 84" className="w-full" role="img" aria-label="A star stretched toward a black hole">
          <circle cx={72} cy={44} r={9} fill="#2e2417" />
          <ellipse cx={38} cy={44} rx={16} ry={5.5} fill="#7a2e21" opacity={0.85} />
          {[
            [52, 40],
            [57, 46],
            [61, 42],
            [55, 50],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.4} fill="#7a2e21" opacity={0.8} />
          ))}
        </svg>
        <figcaption className="caps-label mt-1.5 text-center">III · Tidal tear</figcaption>
      </figure>
      <figure className={panel}>
        <svg viewBox="0 0 100 84" className="w-full" role="img" aria-label="A light beam captured at the event horizon">
          <circle cx={64} cy={44} r={10} fill="#2e2417" />
          <path d="M 6 66 Q 40 62 56 52" stroke="#2e2417" strokeWidth="1.5" fill="none" />
          <path d="M 56 52 L 64 44" stroke="#8a7a5c" strokeWidth="1" strokeDasharray="2 3" fill="none" />
          <text x={8} y={22} fontSize="8" fill="#8a7a5c" fontStyle="italic">
            beam cut at the horizon
          </text>
        </svg>
        <figcaption className="caps-label mt-1.5 text-center">IV · Light eaten</figcaption>
      </figure>
    </div>
  );
}

function HawkingCurveFigure() {
  const pts: string[] = [];
  for (let i = 0; i <= 50; i++) {
    const x = 30 + (i / 50) * 190;
    const y = Math.max(22, 118 - 3200 / (x - 16));
    pts.push(`${x} ${y}`);
  }
  return (
    <svg viewBox="0 0 250 140" className="mx-auto w-full max-w-sm" role="img" aria-label="Hawking temperature rises as mass falls">
      <path d={`M ${pts.join(" L ")}`} stroke="#7a2e21" strokeWidth="1.6" fill="none" />
      <path d="M 26 12 V 122 H 230" stroke="#8a7a5c" strokeWidth="1" fill="none" />
      <circle cx={210} cy={102} r={7} fill="#2e2417" />
      <text x={188} y={94} fontSize="8" fill="#2e2417" fontStyle="italic">
        heavy — cold
      </text>
      <circle cx={44} cy={40} r={2.6} fill="#7a2e21" />
      <text x={52} y={38} fontSize="8" fill="#7a2e21" fontStyle="italic">
        small — white-hot
      </text>
      <text x={116} y={134} fontSize="8" fill="#2e2417" fontStyle="italic">
        T_H ∝ 1 / M
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The interactive threshold instrument                                */
/* ------------------------------------------------------------------ */

function ThresholdInstrument() {
  const [n, setN] = useState(7);
  const [slide, setSlide] = useState(0.8); // 10^(-6 + slide*7.5) = Φ/Φ₀ — starts at ratio 1, the half-open threshold
  const [alpha, setAlpha] = useState(0.1);

  const ratio = Math.pow(10, -6 + slide * 7.5);
  const f = Math.pow(ratio, n) / (1 + Math.pow(ratio, n));
  const delta = 0.9 * alpha * f;
  const D = 1 + alpha * f;

  const regime =
    f < 0.05 ? { label: "Gate closed — fabric parallel", tone: "text-ink-soft" } : f > 0.5 ? { label: "Gate open — W extruded", tone: "text-oxblood" } : { label: "Gate ajar — W parting", tone: "text-seal" };

  const curvePts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60; // log ratio from 1e-6 to 1e1.5
    const r = Math.pow(10, -6 + t * 7.5);
    const fv = Math.pow(r, n) / (1 + Math.pow(r, n));
    curvePts.push(`${28 + t * 194} ${122 - fv * 92}`);
  }
  const markerX = 28 + slide * 194;

  const fmtRatio = ratio >= 0.01 ? ratio.toFixed(3) : ratio.toExponential(1);
  const fmtDelta = delta >= 0.005 ? (delta * 100).toFixed(2) + " %" : delta.toExponential(1);
  const fmtF = f >= 0.0001 ? f.toFixed(4) : f.toExponential(1);

  const PHI0 = 0.08;
  const presets: { name: string; slide: number }[] = [
    { name: "Sun · 3.1×10⁻⁵", slide: (Math.log10(2.5e-6 / PHI0) + 6) / 7.5 },
    { name: "Heavy Star · 0.88", slide: (Math.log10(0.07 / PHI0) + 6) / 7.5 },
    { name: "Neutron Star · 6.9", slide: (Math.log10(0.55 / PHI0) + 6) / 7.5 },
    { name: "Black Hole · 25", slide: (Math.log10(2.0 / PHI0) + 6) / 7.5 },
  ];

  const sliderRow = (label: string, value: number, min: number, max: number, step: number, display: string, onChange: (v: number) => void) => (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-[15px] italic text-ink">{label}</span>
        <span className="font-mono text-xs text-oxblood">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 w-full accent-[color:var(--oxblood)]"
      />
    </label>
  );

  return (
    <div className="plate corner-ornament mx-auto grid max-w-4xl gap-8 p-6 sm:p-9 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <CapsLabel>Interlude · The Instrument</CapsLabel>
        <h3 className="mt-2 text-2xl text-ink">Work the threshold gate yourself</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          These are the code’s own dials. The slider sets the local potential ratio Φ/Φ₀ —
          how strongly a mass squeezes the fabric at your chosen point — and the two other
          handles are n and α. Every number below is evaluated exactly as <span className="font-mono text-[13px]">deltaEff()</span> does.
        </p>
        <div className="mt-6 space-y-5">
          {sliderRow("Φ / Φ₀ — local potential ratio", slide, 0, 1, 0.001, fmtRatio, setSlide)}
          {sliderRow("n — threshold steepness", n, 1, 12, 0.1, n.toFixed(1), setN)}
          {sliderRow("α — extra-dimension coupling", alpha, 0, 0.2, 0.005, alpha.toFixed(3), setAlpha)}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => setSlide(p.slide)}
              className="rounded-sm border border-[color:var(--rule)] bg-[color:var(--paper-deep)] px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:bg-[color:var(--accent)] hover:text-ink"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-5">
        <svg viewBox="0 0 250 140" className="w-full" role="img" aria-label="The gate curve with the current point marked">
          <path d={`M ${curvePts.join(" L ")}`} stroke="#7a2e21" strokeWidth="1.6" fill="none" />
          <path d="M 28 12 V 122 H 228" stroke="#8a7a5c" strokeWidth="1" fill="none" />
          <path d={`M ${markerX} 12 V 122`} stroke="#2e2417" strokeWidth="1" strokeDasharray="4 3" opacity="0.75" />
          <circle cx={markerX} cy={122 - f * 92} r={3.4} fill="#2e2417" />
        </svg>
        <dl className="grid grid-cols-3 gap-3 border-t border-[color:var(--rule)] pt-4">
          <div>
            <dt className="caps-label">f(Φ) — gate</dt>
            <dd className="mt-1 font-mono text-sm text-ink">{fmtF}</dd>
          </div>
          <div>
            <dt className="caps-label">Δ — surplus bend</dt>
            <dd className="mt-1 font-mono text-sm text-ink">{fmtDelta}</dd>
          </div>
          <div>
            <dt className="caps-label">D(r)/ℓ²</dt>
            <dd className="mt-1 font-mono text-sm text-ink">{D.toFixed(4)}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--rule)] pt-4">
          <span className={`font-serif text-[15px] italic ${regime.tone}`}>{regime.label}</span>
          <Stamp>{f > 0.5 ? "Open" : f < 0.05 ? "Sealed" : "Ajar"}</Stamp>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The ten plates — the walkthrough proper                             */
/* ------------------------------------------------------------------ */

type PlateKind = "Principle" | "Formula" | "Method" | "Result";

interface Plate {
  numeral: string;
  id: string;
  title: string;
  kind: PlateKind;
  lede: string;
  body: ReactNode;
  figure: ReactNode;
  caption: string;
}

const PLATES: Plate[] = [
  {
    numeral: "I",
    id: "plate-i",
    title: "One file, one fabric",
    kind: "Method",
    lede: "Before any physics: what kind of object is this, and what is it drawing?",
    body: (
      <>
        <p>
          <span className="font-medium">simulation-code-5d.html</span> is a single self-contained
          HTML file — no build step, no imports of your own. It pulls Three.js r160 from a CDN,
          then runs everything else by hand: shaders, integrators, UI. A single{" "}
          <span className="font-mono text-[13px]">CONFIG</span> object near the top holds every
          default the model uses, which is why it is data-driven and re-runnable.
        </p>
        <p>
          The fabric itself is a cubic lattice of instanced cube-edges at spacing{" "}
          <span className="font-mono text-[13px]">L = 1.6</span> — over 400,000 instances —
          drawn in three nested scales, plus crimson diagonals that mark the extra dimension.
          The same simulation offers three projections of one fabric: a 2D–3D grid sheet, the
          cubic lattice, and a monochrome 5D view.
        </p>
      </>
    ),
    figure: <FlatLatticeFigure />,
    caption: "Fig. 1 — The lattice at rest: uniform nodes, no mass, no curve.",
  },
  {
    numeral: "II",
    id: "plate-ii",
    title: "The metric ansatz",
    kind: "Principle",
    lede: "The model's single geometric sentence — four terms, one hidden axis.",
    body: (
      <>
        <p>
          General relativity writes gravity as geometry through a <em>metric</em>, and this code
          inherits that habit. Its line element adds a fourth spatial term <span className="font-mono text-[13px]">D(r)dw²</span> —
          an extra axis w, folded in with its own radius that depends on distance from mass.
        </p>
        <p>
          Read the pieces as a student would: A(r) slows clocks near mass, B(r) stretches radial
          rulers, r²dΩ² is ordinary spherical space, and D(r) is the local <em>size of the w
          direction</em>. In empty space D(r) settles to ℓ², the resting size of the extra
          dimension — and with A and B Schwarzschild, the model reduces to Einstein's when w is
          closed.
        </p>
      </>
    ),
    figure: (
      <Formula label="Metric ansatz — implemented exactly as commented at the head of the file">
        ds² = −A(r)·c²dt² + B(r)·dr² + r²·dΩ² + D(r)·dw²
      </Formula>
    ),
    caption: "Fig. 2 — Four familiar terms, one stranger: dw is the fourth spatial axis.",
  },
  {
    numeral: "III",
    id: "plate-iii",
    title: "The threshold gate",
    kind: "Formula",
    lede: "A sigmoid that decides when the extra dimension is allowed to open.",
    body: (
      <>
        <p>
          D(r) does not grow gently. It is governed by a steep logistic gate built from the
          dimensionless potential Φ = GM/(c²r): below the threshold Φ₀ the gate output f(Φ) is
          effectively zero; above it, f saturates at one.
        </p>
        <p>
          Three parameters shape the gate. n = 7 is its <em>steepness</em> — how abruptly the
          answer flips. Φ₀ = 0.080 is the half-open point. α ≤ 0.10 caps the whole affair: even
          fully open, the w axis may exceed its resting size by only ten percent. That cap is the
          model's built-in modesty — new physics is permitted, but rationed.
        </p>
      </>
    ),
    figure: (
      <Formula label="Extra-dimension size — the code's thresh() in every shader">
        D(r) = ℓ² · [ 1 + α · f(Φ) ],&nbsp;&nbsp; f(Φ) = (Φ/Φ₀)ⁿ / (1 + (Φ/Φ₀)ⁿ)
      </Formula>
    ),
    caption: "Fig. 3 — The gate f(Φ): sealed far below Φ₀, open above it. Shaded: the opened regime.",
  },
  {
    numeral: "IV",
    id: "plate-iv",
    title: "Two regimes, one rule",
    kind: "Result",
    lede: "The same formula that hides the effect at the Sun reveals it at a black hole.",
    body: (
      <>
        <p>
          Evaluate Φ for ordinary matter and the gate never stirs. The Sun's compactness is about
          2.5×10⁻⁶, so Δ lands near 3×10⁻³³ — deep in the faint end of the spec's own predicted
          band (10⁻²⁸–10⁻³⁴). The fabric stays parallel; the Solar System is safe by construction,
          not by fudge.
        </p>
        <p>
          Compact objects tell the other half of the story. The code gives each body a second,
          visual mass (warpGM): a black hole carries 2.0 against Φ₀ = 0.08, driving the ratio past
          25 and slamming the gate fully open. Neutron stars and pulsars sit in between at 0.55;
          the heavy star, at 0.07, straddles the threshold deliberately.
        </p>
      </>
    ),
    figure: <WarpSheetFigure />,
    caption: "Fig. 4 — Left of the gate: a flat lattice. Right: the sheet dips and the w axis parts.",
  },
  {
    numeral: "V",
    id: "plate-v",
    title: "The Lucky Deflection",
    kind: "Formula",
    lede: "Einstein's famous angle, multiplied by (1 + Δ) — a small surcharge for the fifth dimension.",
    body: (
      <>
        <p>
          For a ray passing a mass at impact parameter b, Einstein's prediction is θ_E = 4GM/(c²b).
          The model's practical formula keeps that term whole and appends a surplus Δ, computed
          from the same gate. Nothing is re-derived from scratch; the new dimension <em>taxes</em>{" "}
          the old answer.
        </p>
        <p>
          Because Δ vanishes in weak fields, the tax is invisible for planets and stars — yet near
          compact objects it can reach its ceiling of 0.9·α ≈ 9%. The code's readout prints both
          regimes honestly: "≈0 (2.6e-31%)" for the Sun, a real percentage for the black hole.
        </p>
      </>
    ),
    figure: (
      <Formula label="Lucky Deflection — the working formula shown in the code's own panel">
        θ_Lucky = (4GM / c²b) · (1 + Δ),&nbsp;&nbsp; Δ ≈ 0.90 · α · f(Φ_b),&nbsp;&nbsp; Φ_b = GM/(c²b)
      </Formula>
    ),
    caption: "Fig. 5 — θ is Einstein's angle; Δ is the surplus wedge the open gate adds.",
  },
  {
    numeral: "VI",
    id: "plate-vi",
    title: "The exact geodesic",
    kind: "Principle",
    lede: "The rigorous version the simple formula approximates — and the limit that disciplines it.",
    body: (
      <>
        <p>
          The panel titled "Complex Geodesic Form" shows where the shortcut comes from: light
          follows null geodesics (ds² = 0) of the full 5D metric, and the bending is an integral
          over the whole trajectory, not a single evaluation. The code renders that integral in
          its formulas panel as the exact standard of comparison.
        </p>
        <p>
          Crucially, it also states its own leash: in the W-closed limit D(r) → ℓ², Δ → 0 and the
          integral collapses to the classical 4D Einstein bending. The simple formula is a
          controlled approximation of the exact one — testable, and falsifiable at the edges.
        </p>
      </>
    ),
    figure: (
      <Formula label="Null-geodesic bending integral (as printed in the file)">
        Δφ = 2 ∫[r₀ → ∞] b·√(A·B) / ( r²·√(1 − b²·A/r²) ) dr − π&nbsp;&nbsp;·&nbsp;&nbsp; b = r₀/√A(r₀)
      </Formula>
    ),
    caption: "Fig. 6 — The exact integral; the simple θ(1+Δ) is its fast field version.",
  },
  {
    numeral: "VII",
    id: "plate-vii",
    title: "The engine",
    kind: "Method",
    lede: "One potential, evaluated the same way by every moving thing in the scene.",
    body: (
      <>
        <p>
          The header comment makes a promise worth quoting: <em>"Every dynamical integrator —
          planets, meteors, tidal streams, mergers, photons — uses the same (1 + Δ) effective
          potential."</em> The code keeps it. A cached list of dynamic bodies is rebuilt each
          frame; <span className="font-mono text-[13px]">deltaEff()</span> evaluates the gate;
          <span className="font-mono text-[13px]"> accAt()</span> sums a = GM(1+Δ)/r² from every
          body onto every mover.
        </p>
        <p>
          Planets and meteors integrate with three Euler substeps. Photons run{" "}
          <span className="font-mono text-[13px]">stepPhoton()</span>, which subtracts the
          acceleration component parallel to velocity so the ray keeps |v| = c exactly — the
          observed bending is purely geometric. The same warpGM also feeds the lattice shaders,
          so the fabric you see deforms by the same rule that steers the bodies.
        </p>
      </>
    ),
    figure: (
      <Formula label="From the physics engine (condensed)">
        <span className="block">deltaEff: x = warpGM / r / Φ₀ · f = xⁿ/(1+xⁿ) · Δ = 0.9·α·f</span>
        <span className="block">accAt: a += GM·(1+Δ) / r² , summed over every dynamic body</span>
        <span className="block">stepPhoton: a −= v·(v·a)/c² , then |v| = c — null-geodesic style</span>
      </Formula>
    ),
    caption: "Fig. 7 — Three functions carry the whole dynamics. Everything else is staging.",
  },
  {
    numeral: "VIII",
    id: "plate-viii",
    title: "Matter on the fabric",
    kind: "Result",
    lede: "The cast of bodies the code builds, and the classical mechanics they obey.",
    body: (
      <>
        <p>
          A solar-system preset lays eight planets at radii 2.0 to 8.1 on circular orbits with
          v = √(GM/r); each carries its own small GM, so meteors feel the tug of planets — and of
          each other. Meteors launch on true ellipses via the vis-viva law, v = √(GM(2/r − 1/a)),
          and drift under everyone's pull at once.
        </p>
        <p>
          The exotic bodies are where the fabric reacts: the pulsar spins and its swirl shears
          nearby lattice nodes (frame-dragging, in the shader), the neutron star pulses, and the
          black hole's event horizon simply erases whatever geometry crosses it.
        </p>
      </>
    ),
    figure: <OrbitRosterFigure />,
    caption: "Fig. 8 — The preset roster: radii and speeds straight from PLANET_DEFS.",
  },
  {
    numeral: "IX",
    id: "plate-ix",
    title: "The process — how outcomes happen",
    kind: "Method",
    lede: "Four staged sequences the code runs when bodies meet. This is where the possible outcomes live.",
    body: (
      <>
        <p>
          <strong>Mergers.</strong> Two black holes within 9 units begin a seeded inspiral — a
          tangential kick of 0.5·√(GM/d) starts the spiral, then mutual gravity closes it. At 1.3
          units they merge: a ripple ring, glowing debris, a radiation flash, a "ghost" surge that
          briefly shakes the fabric at 1.5× warp strength, and a new hole with GM capped at 6 and
          warpGM raised 1.35× — a deeper well, a wider opening.
        </p>
        <p>
          <strong>Capture.</strong> A black hole eats anything within 11.5 units. The victim gets
          a tangential kick and spirals in; its core stretches redward ("spaghettification") while
          a stream of up to 200 particles winds inward, white-hot at the end. The tear is always
          visible for at least 2.8 seconds — then a radiation burst, and the body is gone.
          Neutron stars do the tearing at 10.5 units; meteors vanish with a small pop; beams of
          light are truncated at the horizon.
        </p>
      </>
    ),
    figure: <SequenceStripFigure />,
    caption: "Fig. 9 — The four staged outcomes: inspiral, merger, tidal tear, light capture.",
  },
  {
    numeral: "X",
    id: "plate-x",
    title: "Evaporation and the readout",
    kind: "Result",
    lede: "Real Hawking formulas decide the glow; a quiet readout tells you the truth.",
    body: (
      <>
        <p>
          Section 12 of the file is a small physics lecture in code. Hawking temperature
          T_H = ℏc³/(8πGMk_B) rises as mass falls; the glow colour follows Wien's law
          (λ_max = b/T), and luminosity L = ℏc⁶/(15360πG²M²) explodes for small holes — a
          solar-mass hole radiates at ~10⁻²⁸ watts, a micro-hole would blaze. Toggle evaporation
          and black holes visibly drain.
        </p>
        <p>
          The readout panel ties the loop shut: it prints Δ in full scientific notation and
          D(r)/ℓ², flagging "⇧ threshold open" the instant the gate stirs. The simulation grades
          itself, honestly, three times a second.
        </p>
      </>
    ),
    figure: <HawkingCurveFigure />,
    caption: "Fig. 10 — T_H against mass: the small end of the curve is where evaporation lives.",
  },
];

function PlateBlock({ plate, index }: { plate: Plate; index: number }) {
  return (
    <motion.article
      {...fadeUp}
      id={plate.id}
      className="plate corner-ornament scroll-mt-28 p-6 sm:p-9"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[color:var(--rule)] pb-4">
        <div>
          <CapsLabel>
            Plate {plate.numeral} of X · {plate.kind}
          </CapsLabel>
          <h3 className="mt-2 text-2xl text-ink sm:text-[1.7rem]">{plate.title}</h3>
        </div>
        <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")} / 10</span>
      </header>
      <p className="mt-4 font-serif text-[17px] italic text-ink-soft">{plate.lede}</p>
      <div className="mt-5 grid gap-7 lg:grid-cols-[1.15fr_1fr] lg:gap-9">
        <div className="space-y-4 text-[15px] leading-relaxed text-ink">{plate.body}</div>
        <figure>
          <div className="rounded-sm border border-[color:var(--rule)] bg-[color:var(--paper-deep)] p-4">
            {plate.figure}
          </div>
          <figcaption className="mt-2.5 text-center font-serif text-[13px] italic text-ink-faint">
            {plate.caption}
          </figcaption>
        </figure>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Reference tables                                                    */
/* ------------------------------------------------------------------ */

const STEPS: { n: string; title: string; text: string }[] = [
  { n: "01", title: "A mass is placed", text: "placeObject() creates a body with GM (pulls things) and warpGM (warps the fabric). It snaps to the nearest lattice node." },
  { n: "02", title: "The field is evaluated", text: "Every shader and deltaEff() computes the same Φ = warpGM/r at each point — one potential, everywhere." },
  { n: "03", title: "The gate turns", text: "f(Φ) = (Φ/Φ₀)ⁿ/(1+(Φ/Φ₀)ⁿ) decides how far the w axis may open. Weak field: shut. Compact mass: open." },
  { n: "04", title: "Feedback begins", text: "Gravity strengthens to GM(1+Δ)/r², the lattice pulls inward, and W-edges extrude by A·uWScale." },
  { n: "05", title: "Everything moves", text: "Planets, meteors and photons integrate the same field; photons hold |v| = c and bend without slowing." },
  { n: "06", title: "An outcome lands", text: "Merger, capture, tear, or evaporation — and the readout prints Δ and D(r)/ℓ² to confirm what happened." },
];

const VERDICTS: { object: string; warp: string; delta: string; outcome: string }[] = [
  { object: "Sun / Solar System", warp: "2.5×10⁻⁶", delta: "≈ 3×10⁻³³", outcome: "Gate sealed; fabric parallel — the Solar System provably unharmed." },
  { object: "Heavy Star", warp: "0.07", delta: "≈ 2.5 %", outcome: "Straddles the threshold; a faint W-parting around a modest well." },
  { object: "Neutron Star", warp: "0.55", delta: "≈ 9 % (max)", outcome: "Gate open; pulsing well; tears stars that wander too close." },
  { object: "Pulsar", warp: "0.55 ×1.35 pulse", delta: "≈ 9 % (max)", outcome: "Frame-dragging swirl shears the fabric; lighthouse beams sweep." },
  { object: "Black Hole", warp: "2.0", delta: "≈ 9 % (max)", outcome: "Deep well, fully open gate; eats meteors, stars, and light itself." },
  { object: "Two Black Holes", warp: "→ 2.7 merged", delta: "≈ 9 % (max)", outcome: "Inspiral, flash, fabric surge — one deeper, wider hole remains." },
];

const PHENOMENA: { title: string; text: string }[] = [
  { title: "Mergers", text: "Ripple ring, 42 sparks, white flash, nine radiation rays — plus a ghost mass at 1.5× that makes the whole fabric shudder once." },
  { title: "Tidal capture", text: "Tangential kick starts the spiral; 200 particles stream in white-hot; the victim stretches and reddens; swallow never before 2.8 s." },
  { title: "Light capture", text: "Beams integrate at |v| = c, bend around the well, and are cut exactly where they cross the event horizon (BH_R ≈ 0.55)." },
  { title: "Hawking glow", text: "Colour from Wien's law, temperature from ℏc³/8πGMk_B, luminosity from ℏc⁶/15360πG²M² — evaporation drains mass when enabled." },
];

const CODEMAP: { find: string; what: string }[] = [
  { find: 'Lucky Model v68', what: "The author's own theory summary, in a comment block at the top — read it first." },
  { find: "CONFIG", what: "Every default: n 7.0, Φ₀ 0.080, α 0.100, ℓ 4 km, lattice L 1.6 / N 20, body caps." },
  { find: "const VERT", what: "Lattice vertex shader — thresh() gate, radial pull, twist, and the W extrusion term." },
  { find: "SHEET_VERT", what: "The rubber-sheet projection: Lorentzian well, ghost sheet separation = local D(r)." },
  { find: "deltaEff", what: "Δ of the deflection formula, evaluated per body per frame — the engine's heart." },
  { find: "stepPhoton", what: "The photon integrator that holds |v| = c while bending." },
  { find: "PLANET_DEFS", what: "The eight planets with radii, sizes, textures and orbital GM values." },
  { find: "mergeBHs", what: "Black-hole merger: ripple, debris, radiation burst, ghost surge, upgraded remnant." },
  { find: "beginDisruption", what: "Tidal capture: the tangential kick, the particle stream, the guaranteed 2.8 s tear." },
  { find: "hawkingTemp", what: "Evaporation physics: T_H, Wien wavelength, luminosity — and the drain." },
];

const SYMBOLS: { sym: string; name: string; note: string }[] = [
  { sym: "ds²", name: "interval", note: "the spacetime ruler the whole model bends" },
  { sym: "w", name: "fourth spatial axis", note: "the extra dimension, folded in via D(r)" },
  { sym: "D(r)", name: "local size of w", note: "ℓ² at rest; opens only past the gate" },
  { sym: "ℓ", name: "rest size", note: "4 km by default — small, per experiment bounds" },
  { sym: "Φ", name: "potential", note: "GM/(c²r): compactness, the gate's input" },
  { sym: "Φ₀", name: "threshold", note: "0.080 — the half-open point of the gate" },
  { sym: "n", name: "steepness", note: "6–8; how abruptly the gate flips" },
  { sym: "α", name: "coupling", note: "≤ 0.10 — the most the dimension may open" },
  { sym: "Δ", name: "surplus bending", note: "0.90·α·f(Φ): the tax on Einstein's angle" },
  { sym: "b", name: "impact parameter", note: "how close a ray passes; sets θ = 4GM/c²b" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Landing() {
  return (
    <div className="paper-grain min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--rule)] bg-[color:var(--card)]/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="text-lg text-oxblood">⬡</span>
            <span className="font-serif text-[15px] tracking-wide text-ink">
              The Spacetime Fabric <span className="italic text-ink-soft">— a reading companion</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft sm:flex">
            <a href="#walkthrough" className="transition-colors hover:text-oxblood">Walkthrough</a>
            <a href="#process" className="transition-colors hover:text-oxblood">Process</a>
            <a href="#thecode" className="transition-colors hover:text-oxblood">The Code</a>
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-oxblood">
              Source ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <CapsLabel>An Archival Reading · Prepared for Students of the Code</CapsLabel>
          <h1 className="mt-5 text-4xl leading-[1.08] text-ink sm:text-6xl">
            The Multi-Axis <span className="italic text-oxblood">Spacetime</span> Fabric
          </h1>
          <div className="rule-double mx-auto mt-7 w-32" />
          <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
            A step-by-step companion to <span className="font-medium text-ink">simulation-code-5d.html</span> —
            the “Lucky Model v68”. We walk the theory exactly as the code implements it: a metric
            with a hidden fifth dimension, a threshold that decides when it opens, and the process
            by which masses, light and mergers produce their possible outcomes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="gap-2 rounded-sm font-serif text-[15px]">
              <a href="#plate-i">
                Begin the walkthrough
                <ArrowDown className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2 rounded-sm border-[color:var(--rule)] bg-transparent font-serif text-[15px]">
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                Open the source file
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2 rounded-sm border-oxblood/40 bg-transparent font-serif text-[15px] text-oxblood transition-colors hover:bg-oxblood hover:text-[color:var(--paper)]">
              <a href={RUN_URL} target="_blank" rel="noopener noreferrer">
                Run the test yourself
                <Play className="size-4" />
              </a>
            </Button>
          </div>
          <div className="mt-9 flex justify-center">
            <Stamp>Lucky Model · v68 · Studied &amp; Annotated</Stamp>
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-wide text-ink-faint">
            1 file · 2,543 lines · three.js r160 · every number below quoted from the source
          </p>
        </motion.div>
      </section>

      {/* Reader's guide */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <motion.div {...fadeUp} className="grid gap-5 md:grid-cols-3">
          {[
            {
              t: "The premise",
              d: "Spacetime is modelled as a fabric with a fourth spatial axis, w. Its local size D(r) is normally sealed at ℓ — but a steep threshold gate can open it near compact masses.",
            },
            {
              t: "What you will learn",
              d: "The metric and its five terms; the sigmoid gate and its three dials; the Lucky Deflection θ(1+Δ); the exact geodesic behind it; and the engine that moves every body.",
            },
            {
              t: "How to read this",
              d: "Ten plates in order, each with the formula, the plain-words reading, and where it lives in the file. The instrument in the interlude lets you turn the model's own dials.",
            },
          ].map((c) => (
            <div key={c.t} className="plate p-6">
              <CapsLabel className="text-oxblood/80">{c.t}</CapsLabel>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{c.d}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Walkthrough */}
      <section id="walkthrough" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHeading
          kicker="Part the First"
          title="The Theory, Plate by Plate"
          lede="Ten plates, in the order the code itself presents them: geometry first, then the gate, then the formula, then the machinery."
        />
        <div className="mt-12 space-y-8">
          {PLATES.map((p, i) => (
            <PlateBlock key={p.id} plate={p} index={i} />
          ))}
        </div>
      </section>

      {/* Interlude — instrument */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div {...fadeUp}>
          <ThresholdInstrument />
        </motion.div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHeading
          kicker="Part the Second"
          title="The Process, and Its Possible Outcomes"
          lede="From a single placed mass to a merger's flash: the six-step pipeline every scenario follows, and the outcomes the code actually stages."
        />

        <motion.div {...fadeUp} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="plate p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-oxblood">{s.n}</span>
                <h4 className="font-serif text-lg text-ink">{s.title}</h4>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="plate mt-10 overflow-x-auto p-6 sm:p-8">
          <CapsLabel className="text-oxblood/80">The Ledger of Outcomes</CapsLabel>
          <h3 className="mt-2 text-2xl text-ink">What each body produces, per the code's own constants</h3>
          <table className="mt-5 w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="rule-double">
                <th className="caps-label py-2.5 pr-4">Object</th>
                <th className="caps-label py-2.5 pr-4">warpGM (sim units)</th>
                <th className="caps-label py-2.5 pr-4">Δ at r = 1</th>
                <th className="caps-label py-2.5">Outcome in the simulation</th>
              </tr>
            </thead>
            <tbody>
              {VERDICTS.map((v) => (
                <tr key={v.object} className="ledger-row align-top">
                  <td className="py-3 pr-4 font-serif text-[15px] text-ink">{v.object}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-ink-soft">{v.warp}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-oxblood">{v.delta}</td>
                  <td className="py-3 text-[14px] leading-relaxed text-ink-soft">{v.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div {...fadeUp} className="mt-10 grid gap-5 sm:grid-cols-2">
          {PHENOMENA.map((p) => (
            <div key={p.title} className="plate p-6">
              <CapsLabel className="text-oxblood/80">Staged outcome</CapsLabel>
              <h4 className="mt-2 font-serif text-xl text-ink">{p.title}</h4>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{p.text}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* The code */}
      <section id="thecode" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHeading
          kicker="Part the Third"
          title="Reading the Source"
          lede="A field guide for the file itself. Search for each token (Ctrl+F) to land exactly where the theory becomes code."
        />

        <motion.div {...fadeUp} className="plate mt-12 overflow-x-auto p-6 sm:p-8">
          <CapsLabel className="text-oxblood/80">Map of the File</CapsLabel>
          <table className="mt-5 w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="rule-double">
                <th className="caps-label py-2.5 pr-4">Find</th>
                <th className="caps-label py-2.5">What happens there</th>
              </tr>
            </thead>
            <tbody>
              {CODEMAP.map((c) => (
                <tr key={c.find} className="ledger-row align-top">
                  <td className="py-3 pr-4 font-mono text-xs text-oxblood">{c.find}</td>
                  <td className="py-3 text-[14px] leading-relaxed text-ink-soft">{c.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <motion.div {...fadeUp} className="plate p-6 sm:p-8">
            <CapsLabel className="text-oxblood/80">Appendix A</CapsLabel>
            <h3 className="mt-2 text-2xl text-ink">Ledger of Symbols</h3>
            <table className="mt-5 w-full border-collapse text-left">
              <tbody>
                {SYMBOLS.map((s) => (
                  <tr key={s.sym} className="ledger-row">
                    <td className="w-16 py-2.5 font-mono text-sm text-oxblood">{s.sym}</td>
                    <td className="py-2.5 pr-4 font-serif text-[15px] italic text-ink">{s.name}</td>
                    <td className="py-2.5 text-[13.5px] text-ink-soft">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div {...fadeUp} className="plate flex flex-col justify-between gap-6 p-6 sm:p-8">
            <div>
              <CapsLabel className="text-oxblood/80">Appendix B</CapsLabel>
              <h3 className="mt-2 text-2xl text-ink">A note on provenance</h3>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
                Everything on this site is drawn from the source file itself — its comment block,
                its <span className="font-mono text-[13px]">CONFIG</span>, its formulas panel, and
                its integrators. The “Lucky Model” is the file author’s proposal, presented here
                for study; it is not established physics, and the code is careful to keep its own
                effects vanishing in the weak-field regime.
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                When in doubt, the source is the authority — open it alongside this companion.
              </p>
            </div>
            <Button asChild className="self-start gap-2 rounded-sm font-serif text-[15px]">
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                Read the source file
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[color:var(--rule)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-9 text-center sm:px-6">
          <span className="text-base text-oxblood">⬡</span>
          <p className="max-w-xl font-serif text-[13.5px] italic leading-relaxed text-ink-faint">
            Set from the source of luckyjaiswal1130-dotcom / Techsense-project · simulation-code-5d.html ·
            “Lucky Model v68”. A reading companion for students; the simulation itself remains the
            author’s work.
          </p>
          <div className="rule-hair w-24" />
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">
            Plates I–X · Interlude · Ledger · Map
          </p>
        </div>
      </footer>
    </div>
  );
}
