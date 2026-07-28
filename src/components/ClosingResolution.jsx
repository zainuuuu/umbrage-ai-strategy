import SectionShell from './SectionShell.jsx'

// Closing resolution — short declarative, no CTA (site chrome supplies CTAs post-merge).
// Copy comes from meta.closing (headline + subhead) in roadmap-content.json.
export default function ClosingResolution({ closing }) {
  return (
    <SectionShell surface="onyx" className="closing" ariaLabel="Closing">
      <p className="closing__headline">{closing.headline}</p>
      {closing.subhead ? <p className="closing__subhead">{closing.subhead}</p> : null}
    </SectionShell>
  )
}
