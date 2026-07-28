import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'
import MetricCallout from './MetricCallout.jsx'

// THE ANCHOR (slide 3). "What's your current challenge?"
// Six rows in structure.displayOrder:
//   Service (name + descriptor) | challenge.matrix | dotted connector | outcome
// Static dotted connector for Phase 1 (draws left-to-right in the motion layer).
// Rendered on the Onyx (dark) ground — white type, Savoy eyebrow — matching the
// reference slide and the surrounding sections (page is Onyx throughout Phase 1).
// Semantic <table> for md+; collapses to stacked, labeled rows on mobile.
export default function ChallengeMatrix({ matrix, offerings, displayOrder }) {
  const byId = Object.fromEntries(offerings.map((o) => [o.id, o]))
  const rows = displayOrder.map((id) => byId[id]).filter(Boolean)

  return (
    <SectionShell id="challenge-matrix" surface="onyx" ariaLabel={matrix.headline}>
      <SectionMarker>{matrix.eyebrow}</SectionMarker>
      <h2 className="matrix__headline">{matrix.headline}</h2>

      <table className="matrix">
        <thead>
          <tr>
            <th scope="col">{matrix.columns.left}</th>
            <th scope="col">{matrix.columns.middle}</th>
            <th scope="col" className="matrix__connector-col">
              <span className="sr-only">Leads to</span>
            </th>
            <th scope="col">{matrix.columns.right}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="matrix__row">
              <th scope="row" className="matrix__service" data-label={matrix.columns.left}>
                <span className="matrix__service-name">{o.name}</span>
                <span className="matrix__service-descriptor">{o.descriptor}</span>
              </th>
              <td className="matrix__when" data-label={matrix.columns.middle}>
                {o.challenge.matrix}
              </td>
              <td className="matrix__connector" aria-hidden="true">
                <span className="dotted-connector">
                  <span className="dotted-connector__dots" />
                  <span className="dotted-connector__arrow" />
                </span>
              </td>
              <td className="matrix__deliver" data-label={matrix.columns.right}>
                {o.outcomeStat ? (
                  <MetricCallout value={o.outcomeStat.value} label={o.outcomeStat.label} />
                ) : null}
                <span className="matrix__deliver-text">{o.outcome}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
