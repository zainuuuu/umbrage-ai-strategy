// Large metric number in Aptos Serif (editorial face, used sparingly) + its label.
// Static for Phase 1 — the count-up animation arrives in the motion layer (Phase 3).
export default function MetricCallout({ value, label }) {
  return (
    <div className="metric-callout">
      <span className="metric-callout__value">{value}</span>
      {label ? <span className="metric-callout__label">{label}</span> : null}
    </div>
  )
}
