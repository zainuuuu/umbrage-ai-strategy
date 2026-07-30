import { useEffect } from 'react'
import content from '../content.js'
import Hero from './Hero.jsx'
import SectionGap from './SectionGap.jsx'
import SectionGap2 from './SectionGap2.jsx'

// Ground-up rebuild: sections are added in order, matching meta.sectionOrder.
export default function RoadmapPage() {
  const { meta, gap, gapTwo } = content

  useEffect(() => {
    document.title = meta.pageTitle
  }, [meta.pageTitle])

  return (
    <main className="ai-strategy">
      <Hero nav={meta.nav} hero={meta.hero} />
      <SectionGap gap={gap} />
      <SectionGap2 gapTwo={gapTwo} />
    </main>
  )
}
