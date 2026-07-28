import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'
import MetricCallout from './MetricCallout.jsx'

// Embedded Experts — the "alongside" offering. Offset/indented two-column
// treatment so it reads as cross-cutting, not as one more sequential service.
// Same content fields as a ServiceSection; NO CTA.
export default function EmbeddedExpertsSection({ offering, index }) {
  return (
    <SectionShell
      id={offering.id}
      surface="onyx"
      className="service service--alongside"
      ariaLabel={offering.name}
    >
      <div className="alongside__grid">
        <div className="alongside__aside">
          <div className="service__head">
            <span className="service__index" aria-hidden="true">
              {String(index).padStart(2, '0')}
            </span>
            <SectionMarker tone="blush">{offering.name}</SectionMarker>
          </div>
          <p className="alongside__descriptor">{offering.descriptor}</p>
          {offering.outcomeStat ? (
            <MetricCallout value={offering.outcomeStat.value} label={offering.outcomeStat.label} />
          ) : null}
        </div>

        <div className="alongside__body">
          <h2 className="service__challenge">{offering.challenge.short}</h2>
          <p className="service__tagline">{offering.tagline}</p>
          <p className="service__value">{offering.valueStory}</p>
          <p className="service__outcome-text">{offering.outcome}</p>
        </div>
      </div>
    </SectionShell>
  )
}
