import { useEffect } from 'react'
import content from '../content.js'

import RoadmapHero from './RoadmapHero.jsx'
import ChallengeCloud from './ChallengeCloud.jsx'
import StructureReveal from './StructureReveal.jsx'
import ChallengeMatrix from './ChallengeMatrix.jsx'
import ServiceSection from './ServiceSection.jsx'
import EmbeddedExpertsSection from './EmbeddedExpertsSection.jsx'
import ClosingResolution from './ClosingResolution.jsx'

// Composes the page in narrative order (structure.displayOrder), reading ALL copy
// from roadmap-content.json. Phase 1: static, flat surfaces, no motion, no CTAs.
// The two radial scenes render as correctly-sized placeholders (Phase 2).
export default function RoadmapPage() {
  const { meta, challengeCloud, matrix, structure, structureReveal, offerings } = content

  useEffect(() => {
    document.title = meta.pageTitle
  }, [meta.pageTitle])

  const byId = Object.fromEntries(offerings.map((o) => [o.id, o]))

  return (
    <main className="ai-roadmap">
      <RoadmapHero eyebrow={meta.eyebrow} hero={meta.hero} />

      {/* Act 2 — chaos: radial challenge cloud */}
      <ChallengeCloud challengeCloud={challengeCloud} />

      {/* Act 2 → order: concentric structure reveal */}
      <StructureReveal
        structureReveal={structureReveal}
        structure={structure}
        offerings={offerings}
        cloudLabels={challengeCloud.labels}
      />

      {/* THE ANCHOR — off-white break */}
      <ChallengeMatrix matrix={matrix} offerings={offerings} displayOrder={structure.displayOrder} />

      {/* Service deep dives, in displayOrder. Embedded Experts uses the alongside variant. */}
      {structure.displayOrder.map((id, i) => {
        const offering = byId[id]
        if (!offering) return null
        const index = i + 1
        return offering.role === 'alongside' ? (
          <EmbeddedExpertsSection key={id} offering={offering} index={index} />
        ) : (
          <ServiceSection key={id} offering={offering} index={index} />
        )
      })}

      <ClosingResolution closing={meta.closing} />
    </main>
  )
}
