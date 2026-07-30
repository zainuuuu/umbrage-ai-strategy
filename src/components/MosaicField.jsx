// MosaicField — the dark hero backdrop. Onyx ground, a static flat-dot field
// (placeholder for the real animated repelling field that arrives in the
// motion pass), and one soft Savoy glow — the single gradient the brand system
// permits, used sparingly here. Every dot is a flat-filled shape (no color
// blending); only the glow itself is a gradient.
export default function MosaicField() {
  return (
    <div className="mosaic-field" aria-hidden="true">
      <div className="mosaic-field__glow" />
      <div className="mosaic-field__dots" />
    </div>
  )
}
