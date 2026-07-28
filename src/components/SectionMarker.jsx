// Uppercase Aptos Mono eyebrow over a hairline rule that runs 80px past the text.
// align="left"  -> overrun on the right only
// align="center"-> overrun on both sides
// tone controls the eyebrow + rule color (savoy default; blush / bain flag their own sections).
export default function SectionMarker({ children, align = 'left', tone = 'savoy' }) {
  return (
    <div className={`section-marker section-marker--${align} section-marker--${tone}`}>
      <span className="section-marker__label">{children}</span>
      <span className="section-marker__rule" aria-hidden="true" />
    </div>
  )
}
