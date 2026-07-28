import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'
import { radialSpokes, wrapText } from '../lib/radial.js'

// Slide 1 — the radial "challenge cloud". STATIC (Phase 2); layered so Phase 3 can
// animate ring, center, and each spoke independently.
//
// Geometry (tune in QA, keep the algorithm):
const CX = 410
const CY = 380
const R_RING = 150 // ring radius; center prompt lives inside; leaders start here
const R_TEXT = 196 // leader end / where a label begins
const CENTER_LH = 24 // center-prompt line height

export default function ChallengeCloud({ challengeCloud }) {
  const { eyebrow, headline, body, center, labels } = challengeCloud
  const spokes = radialSpokes(labels, R_TEXT)
  const centerLines = wrapText(center, 24) // 2–3 lines inside R_ring
  const centerStartY = -((centerLines.length - 1) * CENTER_LH) / 2

  return (
    <SectionShell id="challenge-cloud" surface="onyx" className="cloud" ariaLabel={headline}>
      <div className="cloud__grid">
        <div className="cloud__intro">
          <SectionMarker>{eyebrow}</SectionMarker>
          <h2 className="cloud__headline">{headline}</h2>
          <p className="cloud__body">{body}</p>
        </div>

        <div className="cloud__figure">
          <svg
            className="cloud__svg"
            viewBox="0 0 820 760"
            role="img"
            aria-labelledby="cloud-title cloud-desc"
          >
            <title id="cloud-title">{center}</title>
            <desc id="cloud-desc">
              A radial cloud of {labels.length} challenges organizations face on their AI
              transformation journey, arranged around the central question.
            </desc>

            <g transform={`translate(${CX},${CY})`}>
              {/* Layer: ring */}
              <g className="cloud-rings" aria-hidden="true">
                <circle r={R_RING} className="cloud-ring" />
              </g>

              {/* Layer: spokes (leader + label), each independently animatable */}
              <g className="cloud-spokes">
                {spokes.map((s) => (
                  <g key={s.i} className="cloud-spoke-group" transform={`rotate(${s.A})`}>
                    <line
                      x1={R_RING}
                      y1="0"
                      x2={R_TEXT - 4}
                      y2="0"
                      className="cloud-spoke"
                      aria-hidden="true"
                    />
                    <text
                      transform={s.textTransform}
                      textAnchor={s.anchor}
                      dominantBaseline="middle"
                      className="cloud-label"
                      aria-hidden="true"
                    >
                      {s.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Layer: center prompt (manual tspan line breaks) */}
              <g className="cloud-center" aria-hidden="true">
                <text textAnchor="middle" className="cloud-center-text">
                  {centerLines.map((line, idx) => (
                    <tspan key={idx} x="0" y={centerStartY + idx * CENTER_LH}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            </g>
          </svg>

          {/* Screen-reader list so the 36 labels read as a list, not loose nodes */}
          <ul className="sr-only">
            {labels.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
