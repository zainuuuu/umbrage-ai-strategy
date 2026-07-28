import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'

// Act 1 — hero. Static for Phase 1 (headline draw-in comes in the motion layer).
export default function RoadmapHero({ eyebrow, hero }) {
  return (
    <SectionShell as="header" surface="onyx" className="hero" ariaLabel="Introduction">
      <SectionMarker>{eyebrow}</SectionMarker>
      <h1 className="hero__headline">{hero.headline}</h1>
      <p className="hero__subhead">{hero.subhead}</p>
      {hero.attribution ? (
        <p className="hero__attribution">{hero.attribution}</p>
      ) : null}
      <div className="hero__scroll-cue" aria-hidden="true">
        <span className="hero__scroll-cue-label">Scroll</span>
        <span className="hero__scroll-cue-line" />
      </div>
    </SectionShell>
  )
}
