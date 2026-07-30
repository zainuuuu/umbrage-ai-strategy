import prequelGlyph from '../assets/prequel-glyph.svg'

// Section three — section-gap-2 (Figma node 5213:3383). "State 1" only: the
// light intro before an upcoming pixel-wipe transition (built later). A
// continuation of section-gap's Onyx-1 ground: three grid rules, a faint
// background glyph, a top-edge blur band, and a centered headline + sub-line.
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
          fade on top of it. top uses the headline's own anchor point (513,
          itself a center reference via .headline's translate:-50%-50%) so
          the glyph's vertical center lands exactly on the headline's —
          .section-gap-2__glyph's translate:0,-50% does the centering; left
          stays a literal left edge (628, unchanged, per Figma). */}
      <img
        className="section-gap-2__glyph"
        aria-hidden="true"
        src={prequelGlyph}
        alt=""
        style={{
          left: pct(628, FRAME_W),
          top: pct(513, FRAME_H),
          width: pct(664, FRAME_W),
          height: pct(664, FRAME_H),
        }}
      />

      {/* Top-edge atmospheric band ONLY — softens the section's top seam for
          the incoming transition, bleeding off the top edge. NOT a text
          backdrop: it sits well above the headline/subline, which stay on
          clean Onyx-1 ground (no haze). */}
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
