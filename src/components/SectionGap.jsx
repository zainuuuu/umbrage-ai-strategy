// Section two — section-gap (Figma node 3422:2351). The tonal break after the
// dark hero: a light (Onyx-1) full-viewport section. Scattered challenge
// labels sit low-opacity across the frame; a heavily-blurred Onyx-1 rectangle
// sits above them (clearing the center so the question reads clean) but below
// the question itself. Static final state only — no motion yet.
//
// Positions are stored in roadmap-content.json as Figma px on a 1920x1080
// reference frame; converted here to percentages so they scale proportionally
// with the section's actual rendered size (per-instance, so this stays data,
// not a CSS rule — same approach the earlier radial scenes used).
const FRAME_W = 1920
const FRAME_H = 1080

const pct = (value, frame) => `${(value / frame) * 100}%`

export default function SectionGap({ gap }) {
  return (
    <section id="gap-where-are-you" className="section-gap" aria-labelledby="gap-question">
      <div className="section-gap__labels" aria-hidden="true">
        {gap.labels.map((label, i) => (
          <span
            key={i}
            className="section-gap__label"
            style={{ left: pct(label.x, FRAME_W), top: pct(label.y, FRAME_H) }}
          >
            {label.text}
          </span>
        ))}
      </div>

      <div
        className="section-gap__blur"
        aria-hidden="true"
        style={{
          left: pct(122, FRAME_W),
          top: pct(256, FRAME_H),
          width: pct(1677, FRAME_W),
          height: pct(576, FRAME_H),
        }}
      />

      <h2
        id="gap-question"
        className="section-gap__question"
        style={{ left: pct(960, FRAME_W), top: pct(502, FRAME_H) }}
      >
        {gap.question}
      </h2>

      {/* Labels are decorative/scattered (aria-hidden) — give screen readers the
          list as actual content instead of loose absolutely-positioned nodes. */}
      <ul className="sr-only">
        {gap.labels.map((label, i) => (
          <li key={i}>{label.text}</li>
        ))}
      </ul>
    </section>
  )
}
