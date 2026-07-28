import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'
import IconSlot from './IconSlot.jsx'
import { radialSpokes, wrapText } from '../lib/radial.js'

// Slide 2 — "chaos → order". Layered SVG, back to front:
//   (1) faded cloud echo   (2) concentric rings + core
//   (3) ring-label pills   (4) AI Prequel entry card
// STATIC (Phase 2). Each layer is a <g> so Phase 3 can fade/assemble independently.

// --- Geometry (radii are starting points; tune in QA) ---
const VB_W = 860
const VB_H = 760
const CX = 410
const CY = 415
const R_CORE = 76
// bands inner -> outer, mapped to the housed services (foundation nearest core)
const BANDS = [
  { key: 'data-ai-foundations', mid: 100 },
  { key: 'legacy-modernization', mid: 142 },
  { key: 'end-to-end-ai-product-development', mid: 184 },
]
const BAND_W = 30
const R_CLOUD = 210 // faded echo sits just outside the outer ring

const rad = (deg) => (deg * Math.PI) / 180
const onCircle = (r, deg) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))]

// Pills (upper-right), each wired to its band by a short leader.
const PILLS = [
  { key: 'end-to-end-ai-product-development', y: 60, ang: -38, mid: 184 },
  { key: 'legacy-modernization', y: 150, ang: -20, mid: 142 },
  { key: 'data-ai-foundations', y: 232, ang: -6, mid: 100 },
]
const PILL_X = 622
const PILL_W = 214

export default function StructureReveal({ structureReveal, structure, offerings, cloudLabels }) {
  const byId = Object.fromEntries(offerings.map((o) => [o.id, o]))
  const container = byId[structure.container.id]
  const prequel = byId[structure.entry]
  const list = structure.displayOrder.map((id) => byId[id]).filter(Boolean)

  // Faded echo reuses the ChallengeCloud labels for visual continuity.
  const bgSpokes = radialSpokes(cloudLabels, R_CLOUD)

  // Core text
  const coreNameLines = wrapText(container.name, 16)
  const coreTagLines = wrapText(container.tagline, 18)

  // Prequel card text
  const prequelTagLines = wrapText(prequel.tagline, 26)
  const cardX = 14
  const cardY = 150
  const cardW = 202
  const cardH = 40 + prequelTagLines.length * 15

  return (
    <SectionShell
      id="structure-reveal"
      surface="onyx"
      className="structure"
      ariaLabel={structureReveal.headline}
    >
      <div className="structure__grid">
        <div className="structure__intro">
          <SectionMarker>{structureReveal.eyebrow}</SectionMarker>
          <h2 className="structure__headline">{structureReveal.headline}</h2>
          <ul className="structure__list">
            {list.map((o) => (
              <li key={o.id} className="structure__item">
                <IconSlot slot={o.iconSlot} />
                <span className="structure__item-name">{o.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="structure__figure">
          <svg
            className="structure__svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-labelledby="structure-title structure-desc"
          >
            <title id="structure-title">{structureReveal.headline}</title>
            <desc id="structure-desc">
              The {container.name} at the core, with three services as concentric rings around
              it: {BANDS.map((b) => byId[b.key].name).join(', ')}. {prequel.name} sits outside as
              the entry point.
            </desc>

            {/* (1) faded cloud echo */}
            <g className="struct-cloud-bg" aria-hidden="true">
              <g transform={`translate(${CX},${CY})`}>
                {bgSpokes.map((s) => (
                  <text
                    key={s.i}
                    transform={`rotate(${s.A}) ${s.textTransform}`}
                    textAnchor={s.anchor}
                    dominantBaseline="middle"
                    className="cloud-label"
                  >
                    {s.label}
                  </text>
                ))}
              </g>
            </g>

            {/* (2) concentric rings + core */}
            <g className="struct-rings" aria-hidden="true">
              {BANDS.map((b, idx) => (
                <circle
                  key={b.key}
                  cx={CX}
                  cy={CY}
                  r={b.mid}
                  className={`ring-band ring-band--${idx + 1}`}
                  strokeWidth={BAND_W}
                />
              ))}
              <circle cx={CX} cy={CY} r={R_CORE} className="ring-core" />
              <text x={CX} y={CY} textAnchor="middle" className="ring-core-text">
                {coreNameLines.map((line, i) => (
                  <tspan key={`n${i}`} x={CX} y={CY - 20 + i * 14} className="ring-core-name">
                    {line}
                  </tspan>
                ))}
                {coreTagLines.map((line, i) => (
                  <tspan key={`t${i}`} x={CX} y={CY + 12 + i * 11} className="ring-core-tag">
                    {line}
                  </tspan>
                ))}
              </text>
            </g>

            {/* (3) ring-label pills + leaders */}
            <g className="struct-pills">
              {PILLS.map((p) => {
                const o = byId[p.key]
                const lines = wrapText(o.name.toUpperCase(), 24)
                const h = 20 + lines.length * 13
                const cy = p.y + h / 2
                const [bx, by] = onCircle(p.mid, p.ang)
                return (
                  <g key={p.key}>
                    <line x1={bx} y1={by} x2={PILL_X} y2={cy} className="struct-leader" />
                    <rect
                      x={PILL_X}
                      y={p.y}
                      width={PILL_W}
                      height={h}
                      rx="6"
                      className="struct-pill"
                    />
                    <text x={PILL_X + 12} y={p.y + 15} className="struct-pill-text">
                      {lines.map((line, i) => (
                        <tspan key={i} x={PILL_X + 12} dy={i === 0 ? 0 : 13}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                )
              })}
            </g>

            {/* (4) AI Prequel entry card */}
            <g className="struct-prequel">
              <line
                x1={cardX + cardW}
                y1={cardY + cardH - 6}
                x2={onCircle(R_CORE + 6, 221)[0]}
                y2={onCircle(R_CORE + 6, 221)[1]}
                className="struct-leader struct-leader--entry"
                markerEnd="url(#entry-arrow)"
              />
              <defs>
                <marker
                  id="entry-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" className="struct-arrow-head" />
                </marker>
              </defs>
              <rect
                x={cardX}
                y={cardY}
                width={cardW}
                height={cardH}
                rx="10"
                className="prequel-card"
              />
              <text x={cardX + 16} y={cardY + 24} className="prequel-card-name">
                {prequel.name}
              </text>
              <text className="prequel-card-tag">
                {prequelTagLines.map((line, i) => (
                  <tspan key={i} x={cardX + 16} y={cardY + 42 + i * 15}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </SectionShell>
  )
}
