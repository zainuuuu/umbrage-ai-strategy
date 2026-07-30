import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import prequelGlyph from '../assets/prequel-glyph.svg'

// Section three — section-gap-2 (Figma node 5213:3383). "State 1" only: the
// light intro before an upcoming pixel-wipe transition (built later). A
// continuation of section-gap's Onyx-1 ground: three grid rules, a faint
// background glyph, a top-edge blur band, and a centered headline + sub-line.
// Static content — no motion on gap-2's own elements — but see COVER_DISTANCE
// below for the gap-2 -> ai-delivery pin/cover transition.
//
// Positions/sizes are Figma px on a 1920x1080 reference frame, converted to
// percentages so they scale proportionally with the section's actual
// rendered size — same per-instance approach as SectionGap.
const FRAME_W = 1920
const FRAME_H = 1080

const pct = (value, frame) => `${(value / frame) * 100}%`

// How long (in viewport heights) gap-2 stays pinned while ai-delivery rises
// to cover it — a long, deliberate scroll, not rushed. Tunable.
const COVER_DISTANCE = '+=200%'
// Leading slice of the pinned range where ai-delivery doesn't move at all —
// gap-2 sits fully visible and still, a brief digest beat for "Before you
// build... get the questions right." before the cover starts rising. Short
// on purpose (a pause to register, not a dead stop). Tunable.
const HOLD_FRACTION = 0.15

export default function SectionGap2({ gapTwo }) {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Reduced motion (and JS failure): no pin at all — gap-2 and
      // ai-delivery just render as two normal stacked sections (light, then
      // dark), each already showing its own static end state.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // document.getElementById, not a React ref/prop: ai-delivery is a
        // sibling component, not a descendant, and useGSAP's `scope` below
        // restricts GSAP's own selector-text resolution to this
        // component's subtree — the same class of bug hit (as a scoped
        // selector STRING) and fixed in MosaicField.jsx's parallax trigger
        // and TransitionWall.jsx's ScrollTrigger. A literal element
        // reference sidesteps it entirely.
        const aiDelivery = document.getElementById('ai-delivery')

        // Pins gap-2 in place (perfectly still — position:fixed under the
        // hood, not an interpolated transform, so there's no drift) for
        // COVER_DISTANCE of additional scroll once gap-2 reaches full view.
        //
        // ai-delivery is a plain, untouched block sitting immediately after
        // gap-2 in the DOM — but its NATURAL (untransformed) position is
        // NOT simply "COVER_DISTANCE below the viewport at progress 0,
        // exactly at the top at progress 1": gap-2 keeps contributing its
        // own full height to normal document flow even while pinned (only
        // its PAINT position is frozen, not its flow height), so
        // ai-delivery's natural top sits a further one-gap-2-height below
        // that. Left alone, ai-delivery wouldn't even reach the viewport
        // top until a full extra viewport of scroll AFTER the pin already
        // released. The onUpdate below corrects for exactly that gap,
        // measuring gap-2's actual rendered height fresh on every update
        // (not a hardcoded 100vh assumption) so it keeps working if gap-2's
        // own height ever changes: it applies a translateY that makes
        // ai-delivery's ACTUAL top go from one viewport below (progress 0)
        // to exactly 0 (progress 1) — the standard "slide up to cover"
        // curve — regardless of how much extra document space gap-2's
        // pin-spacer plus its own height actually occupies.
        //
        // Since ai-delivery is the LATER sibling in the DOM (and paints
        // with a higher z-index — see roadmap.css), it naturally draws
        // over the still-pinned, motionless gap-2 wherever the two overlap
        // on screen — z-order needs nothing further.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: COVER_DISTANCE,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const vh = window.innerHeight
            const gap2Height = sectionRef.current.getBoundingClientRect().height
            const coverDistancePx = self.end - self.start
            // natural top (viewport-relative, ignoring any transform
            // already applied) = gap2Height + COVER_DISTANCE_px x
            // (1 - progress) — this tracks REAL scroll physics the whole
            // time, hold included, since ai-delivery keeps scrolling
            // normally with the page even while nothing appears to move.
            const naturalTop = gap2Height + coverDistancePx * (1 - self.progress)
            // coverProgress remaps the pin's own [0,1] progress so the
            // first HOLD_FRACTION of it stays pinned at 0 (ai-delivery's
            // desired position doesn't move at all — see below), then
            // rescales the remainder to still reach 1 by self.progress
            // 1 — same cover curve/pace as before, just compressed into
            // the post-hold stretch instead of the whole range.
            const coverProgress = Math.max(0, (self.progress - HOLD_FRACTION) / (1 - HOLD_FRACTION))
            // desired top (viewport-relative) = (1 - coverProgress) x vh —
            // held at one viewport below for the whole HOLD_FRACTION
            // (coverProgress stays 0), then eases to exactly 0 (covering)
            // by the end. Since naturalTop keeps decreasing throughout
            // (real scroll never stops), holding desiredTop fixed during
            // the hold means the corrective transform below grows to
            // exactly cancel that out — that's what makes gap-2 read as
            // genuinely still-uncovered, not just slowed down.
            const desiredTop = (1 - coverProgress) * vh
            gsap.set(aiDelivery, { y: desiredTop - naturalTop })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [gapTwo] },
  )

  return (
    <section
      id="prequel-intro"
      className="section-gap-2"
      aria-label="AI Prequel introduction"
      ref={sectionRef}
    >
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
