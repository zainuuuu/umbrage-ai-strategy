import prequelGlyph from '../assets/prequel-glyph.svg'

// Section three — section-gap-2 (Figma node 5213:3383). "State 1" only: the
// light intro before an upcoming pixel-wipe transition (built later). A
// continuation of section-gap's Onyx-1 ground: three grid rules, a faint
// background glyph, two soft blur halos, and a centered headline + sub-line.
// Static — no motion here.
//
// Positions/sizes are Figma px on a 1920x1080 reference frame, converted to
// percentages so they scale proportionally with the section's actual
// rendered size — same per-instance approach as SectionGap.
const FRAME_W = 1920
const FRAME_H = 1080

const pct = (value, frame) => `${(value / frame) * 100}%`

export default function SectionGap2({ gapTwo }) {
  return (
    <section id="prequel-intro" className="section-gap-2" aria-label="AI Prequel introduction">
      <div
        className="section-gap-2__rule"
        style={{ left: pct(111, FRAME_W) }}
        aria-hidden="true"
      />
      <div
        className="section-gap-2__rule"
        style={{ left: pct(959.5, FRAME_W) }}
        aria-hidden="true"
      />
      <div
        className="section-gap-2__rule"
        style={{ left: pct(1808, FRAME_W) }}
        aria-hidden="true"
      />

      {/* Prequel four-point mark (node 5213:3858) — the export's own path
          already carries its intended faintness (opacity 0.02 baked in), so
          this renders at full container opacity rather than stacking another
          fade on top of it. */}
      <img
        className="section-gap-2__glyph"
        aria-hidden="true"
        src={prequelGlyph}
        alt=""
        style={{
          left: pct(628, FRAME_W),
          top: pct(208, FRAME_H),
          width: pct(664, FRAME_W),
          height: pct(664, FRAME_H),
        }}
      />

      {/* Two soft blur halos, exact Figma rects — horizontally centered,
          top-edge positioned (halo 1 bleeds off the section's top). */}
      <div
        className="section-gap-2__halo"
        aria-hidden="true"
        style={{
          left: pct(960, FRAME_W),
          top: pct(-93, FRAME_H),
          width: pct(2008, FRAME_W),
          height: pct(252, FRAME_H),
          filter: 'blur(75px)',
        }}
      />
      <div
        className="section-gap-2__halo"
        aria-hidden="true"
        style={{
          left: pct(960, FRAME_W),
          top: pct(370, FRAME_H),
          width: pct(1453, FRAME_W),
          height: pct(406, FRAME_H),
          filter: 'blur(50px)',
        }}
      />

      <h2
        className="section-gap-2__headline"
        style={{ left: pct(960, FRAME_W), top: pct(513, FRAME_H) }}
      >
        {gapTwo.headline}
        <span className="section-gap-2__headline-accent">{gapTwo.headlineAccent}</span>
      </h2>

      <p
        className="section-gap-2__subline"
        style={{ left: pct(960, FRAME_W), top: pct(626, FRAME_H) }}
      >
        {gapTwo.subline}
      </p>
    </section>
  )
}
