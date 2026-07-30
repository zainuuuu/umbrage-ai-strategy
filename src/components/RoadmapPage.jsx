import { useEffect } from 'react'
import content from '../content.js'
import Hero from './Hero.jsx'

// Ground-up rebuild, step 1: foundation + hero only. Sections are added in
// later steps, in meta.sectionOrder.
export default function RoadmapPage() {
  const { meta } = content

  useEffect(() => {
    document.title = meta.pageTitle
  }, [meta.pageTitle])

  return (
    <main className="ai-strategy">
      <Hero nav={meta.nav} hero={meta.hero} />
    </main>
  )
}
