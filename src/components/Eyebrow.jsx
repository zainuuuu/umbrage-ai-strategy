// Eyebrow (formerly SectionMarker) — Aptos Mono Bold label over a full-width
// hairline rule; a short Savoy-10 segment highlights the rule's start. Takes
// the eyebrow text as children.
//   align="left"   — label inset 80px from the left; rule spans edge to edge.
//   align="center" — label inset 80px on both sides, centered.
export default function Eyebrow({ children, align = 'left' }) {
  return (
    <div className={`eyebrow eyebrow--${align}`}>
      <span className="eyebrow__label">{children}</span>
      <span className="eyebrow__rule" aria-hidden="true" />
    </div>
  )
}
