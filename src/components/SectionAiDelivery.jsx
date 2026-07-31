import content from '../content.js'
import TransitionWall from './TransitionWall.jsx'
import bulletPrequel from '../assets/bullet-prequel.svg'

// Section four — section-ai-delivery (meta.sectionOrder id "ai-delivery").
// Steps B + C: the collapsed AI Prequel icon box (static section content —
// it rides in with Step A's cover, no separate reveal here) that later
// expands into the full Prequel card, scroll-driven from SectionGap2.jsx's
// pinned timeline (see that file for the choreography). This component only
// owns markup/CSS; every property GSAP touches (card width/height/padding/
// radius, icon size, content opacity) defaults here to the EXPANDED, final
// look — that's the reduced-motion/no-JS static state, matching the same
// "CSS owns the resting state, JS enters a temporary earlier state" pattern
// used everywhere else on this page.
//
// Dark Onyx ground, proportional to the 1920-wide reference frame's real
// height (4254px), the same rising ∧-wall seam used at the hero boundary
// (here: the darkest Onyx #030511 — the dark section's own edge rising
// in a ∧ into the light Onyx-1 above — top-anchored, externally driven by
// SectionGap2.jsx's cover — see TransitionWall.jsx), and the shared
// 3-rule vertical grid.
const FRAME_W = 1920

const pct = (value, frame) => `${(value / frame) * 100}%`
const vw = (value) => `${(value / FRAME_W) * 100}vw`

// AI Prequel four-point mark — same path geometry as
// src/assets/prequel-glyph.svg, but that asset's own path has opacity:0.02
// baked in (tuned for a faint background watermark on a LIGHT ground in
// SectionGap2) and is loaded via <img>, so its internal opacity can't be
// overridden externally. This icon needs the opposite: fully visible, on a
// DARK ground. Rendered inline (not that asset) so it can take a plain
// fill instead.
function PrequelMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 664 664" fill="none" aria-hidden="true">
      <path
        d="M311.25 352.75V456.5L103.75 664H0V560.25L207.5 352.75H311.25ZM664 560.25V664H560.25L352.75 456.5V352.75H456.5L664 560.25ZM311.25 207.5V311.25H207.5L0 103.75V0H103.75L311.25 207.5ZM664 103.75L456.5 311.25H352.75V207.5L560.25 0H664V103.75Z"
        fill="var(--onyx-1)"
      />
    </svg>
  )
}

export default function SectionAiDelivery() {
  const prequel = content.offerings.find((offering) => offering.id === 'ai-prequel')

  return (
    <section id="ai-delivery" className="section-ai-delivery" aria-label="AI Delivery System">
      <TransitionWall id="ai-delivery-seam-wall" color="var(--onyx)" edge="top" externallyDriven />

      <div className="section-ai-delivery__rule" style={{ left: pct(111, FRAME_W) }} aria-hidden="true" />
      <div className="section-ai-delivery__rule" style={{ left: pct(959.5, FRAME_W) }} aria-hidden="true" />
      <div className="section-ai-delivery__rule" style={{ left: pct(1808, FRAME_W) }} aria-hidden="true" />

      <div id="ai-delivery-prequel-card" className="ai-delivery-card" style={{ top: vw(206) }}>
        <div className="ai-delivery-card__header">
          <div className="ai-delivery-card__icon">
            <PrequelMark className="ai-delivery-card__icon-mark" />
          </div>
          <h3 className="ai-delivery-card__title">{prequel.name}</h3>
        </div>

        <p className="ai-delivery-card__tagline">{prequel.tagline}</p>

        <div className="ai-delivery-card__capabilities">
          {prequel.capabilities.map((capability) => (
            <p className="ai-delivery-card__capability" key={capability.term}>
              <img className="ai-delivery-card__capability-bullet" src={bulletPrequel} alt="" aria-hidden="true" />
              <span className="ai-delivery-card__capability-label">{capability.term}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
