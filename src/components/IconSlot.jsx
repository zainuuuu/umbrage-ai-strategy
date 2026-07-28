// Neutral geometric placeholder for an offering's mark. NOT a brand glyph — the
// real Umbrage marks drop in later, keyed by `slot` (the offering's iconSlot).
// Decorative: the adjacent name text carries the meaning, so this is aria-hidden.
export default function IconSlot({ slot }) {
  return (
    <svg className="icon-slot" viewBox="0 0 28 28" aria-hidden="true" data-slot={slot}>
      <rect x="1.5" y="1.5" width="25" height="25" rx="6" className="icon-slot__frame" />
      <circle cx="14" cy="14" r="4.5" className="icon-slot__mark" />
    </svg>
  )
}
