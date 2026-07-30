import TransitionPanel from './TransitionPanel.jsx'

// Section four — section-ai-delivery (meta.sectionOrder id "ai-delivery").
// STEP A ONLY: the minimal dark shell needed as the cover target for the
// gap-2 -> ai-delivery pin/cover transition (see SectionGap2.jsx). No
// cards, connectors, or icons yet — those arrive in later steps.
//
// Dark Onyx ground, proportional to the 1920-wide reference frame's real
// height (4254px), same top transition-panel seam used at every other
// section boundary, and the shared 3-rule vertical grid.
const FRAME_W = 1920

const pct = (value, frame) => `${(value / frame) * 100}%`

export default function SectionAiDelivery() {
  return (
    <section id="ai-delivery" className="section-ai-delivery" aria-label="AI Delivery System">
      <TransitionPanel className="section-ai-delivery__seam" />

      <div className="section-ai-delivery__rule" style={{ left: pct(111, FRAME_W) }} aria-hidden="true" />
      <div className="section-ai-delivery__rule" style={{ left: pct(959.5, FRAME_W) }} aria-hidden="true" />
      <div className="section-ai-delivery__rule" style={{ left: pct(1808, FRAME_W) }} aria-hidden="true" />
    </section>
  )
}
