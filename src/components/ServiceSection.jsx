import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'
import MetricCallout from './MetricCallout.jsx'

// Per-offering deep dive:
//   challenge.short (large statement) -> tagline -> valueStory -> outcome
//   + Aptos Serif metric callout where outcomeStat exists.
// NO CTA button (meta.renderCtas: false).
// `index` gives an editorial mono numeral (01..). `container` offering gets a
// modifier hook for its radial/concentric treatment (deferred to Phase 2 geometry).
export default function ServiceSection({ offering, index }) {
  const isContainer = offering.role === 'container'
  return (
    <SectionShell
      id={offering.id}
      surface="onyx"
      className={`service${isContainer ? ' service--container' : ''}`}
      ariaLabel={offering.name}
    >
      <div className="service__head">
        <span className="service__index" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <SectionMarker>{offering.name}</SectionMarker>
      </div>

      <h2 className="service__challenge">{offering.challenge.short}</h2>
      <p className="service__tagline">{offering.tagline}</p>
      <p className="service__value">{offering.valueStory}</p>

      <div className="service__outcome">
        {offering.outcomeStat ? (
          <MetricCallout value={offering.outcomeStat.value} label={offering.outcomeStat.label} />
        ) : null}
        <p className="service__outcome-text">{offering.outcome}</p>
      </div>

      {isContainer ? (
        <p className="service__note" data-phase="2">
          Radial / concentric treatment (system at core, three services as rings) —
          built in Phase 2.
        </p>
      ) : null}
    </SectionShell>
  )
}
