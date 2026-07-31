import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const COLS = 7
const CENTER = (COLS - 1) / 2 // index 3

// Center column's target height at the Phase 1 peak (progress RISE_END).
// Tunable.
const PEAK_VH = 12
// Center column's target height at progress 1.0 — Phase 2 keeps growing
// past the Phase 1 peak instead of holding, so the wall never freezes;
// still climbing, gradually, right up until it scrolls out with hero.
// Tunable.
const GROWTH_PEAK_VH = 26
// Per-column height, as a fraction of PEAK_VH, center-out (index order,
// left-to-right) — center (index 3) is the TALLEST, stepping DOWN to zero
// at the edges. This is the ∧: verify col index 3 has the max ratio (1) and
// index 0/6 are 0, not the reverse. Tunable. Phase 2 scales every active
// column by the SAME factor (GROWTH_PEAK_VH / PEAK_VH), so these ratios —
// and the ∧ silhouette they produce — hold throughout, just taller.
const COLUMN_HEIGHT_RATIOS = [0, 0.33, 0.66, 1, 0.66, 0.33, 0]
// Each column's CSS height is fixed at ratio x PEAK_VH; scaleY carries it
// from 0 (flat) to 1 (the Phase 1 peak) in Phase 1, then on to this ratio
// (the Phase 2 ceiling, relative to that SAME fixed height) by progress 1.
const GROWTH_END_SCALE = GROWTH_PEAK_VH / PEAK_VH

// PHASE 1 (0 -> RISE_END) — rise into the 12vh ∧. Every column finishes
// rising by RISE_END, a shared "peak instant". Tunable.
const RISE_END = 0.55
// Per-distance-from-center stagger for a COLUMN's rise start — center
// leads (distance 0 starts first). Tunable.
const RISE_STAGGER_STEP = 0.06
// One eased curve per distance-from-center class (0 = center, 1, 2 — the
// two edge columns, distance 3, have ratio 0 and never animate). Different
// families (not just different durations) so each column's motion reads as
// its own rate — organic, not mechanical. Tunable.
const RISE_EASES = ['power3.out', 'power2.out', 'sine.out']

// PHASE 2 (RISE_END -> 1.0) — continued growth, not a hold. Every active
// column reaches its own Phase 1 peak at exactly RISE_END (by construction,
// see below), so Phase 2 starts synchronized for all of them and scales
// them up TOGETHER (one shared ease, no per-column stagger) — the ∧
// silhouette just grows taller as a whole, rather than reshaping. A single
// gentle ease reads as continuous climbing, not a second distinct motion.
// Tunable.
const GROWTH_EASE = 'sine.inOut'

// TransitionWall — a reusable rising-∧-wall seam, used at TWO section
// boundaries on this page:
//   - hero -> section-gap (self-driving: default props, unpositioned
//     `id`/`externallyDriven`, anchored at the BOTTOM of its parent — see
//     Hero.jsx)
//   - section-gap-2 -> section-ai-delivery (externally driven, Onyx-5,
//     anchored at the TOP of its parent — see SectionAiDelivery.jsx /
//     SectionGap2.jsx)
// Parameterized (color/edge/driving mode), not forked, so both stay one
// component/one set of bug fixes.
//
// A wall of solid columns rises from its anchor edge, peaked in the center
// (∧) — then keeps gradually climbing, taller still, all the way to
// progress 1. No pin: it's a plain absolutely-positioned overlay, height:0
// itself (adds no layout space) — only each column's own scaleY is
// scrubbed, never frozen at any point along the way.
//
// Each column is ONE clean, solid fill (.transition-wall__fill) — no
// internal seams/cells, no settle tween. Collapsed (scale 1 0) is the
// CSS-authored default, so reduced-motion (where the animation below never
// runs) always renders static-collapsed — invisible, never blocking
// content.
export default function TransitionWall({
  id,
  color = 'var(--onyx-1)',
  edge = 'bottom',
  externallyDriven = false,
}) {
  const wallRef = useRef(null)
  const fillRefs = useRef([])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ paused: true })

        for (let col = 0; col < COLS; col++) {
          if (COLUMN_HEIGHT_RATIOS[col] === 0) continue // edge columns — never animate, stay collapsed
          const fill = fillRefs.current[col]
          if (!fill) continue

          const distance = Math.abs(col - CENTER)
          const riseStart = distance * RISE_STAGGER_STEP

          // Phase 1 — the first tween touching this column, so its default
          // immediateRender is correct: it paints the DOM's "from" state
          // (scaleY:0, matching the CSS default) right away, before the
          // timeline ever scrubs.
          tl.fromTo(
            fill,
            { scaleY: 0 },
            { scaleY: 1, duration: RISE_END - riseStart, ease: RISE_EASES[distance] },
            riseStart,
          )
          // Phase 2 — continues from wherever Phase 1 left this column
          // (scaleY:1, its own peak) up to GROWTH_END_SCALE, synchronized
          // across all active columns (same start, same duration, same
          // ease — see the constant above). No explicit "from": a plain
          // .to() only renders itself at its own creation-time value if
          // that value doesn't already match the DOM, and since Phase 1's
          // own immediateRender already correctly painted scaleY:0 here,
          // there's nothing for this tween to clobber — immediateRender:
          // false is added anyway as a defensive no-op, consistent with
          // how every other shared-target tween in this codebase is
          // written.
          tl.to(
            fill,
            { scaleY: GROWTH_END_SCALE, duration: 1 - RISE_END, ease: GROWTH_EASE, immediateRender: false },
            RISE_END,
          )
        }

        if (externallyDriven) {
          // Driven by a parent's own scroll-linked progress (e.g. the
          // gap-2 -> ai-delivery cover in SectionGap2.jsx), not a
          // ScrollTrigger owned by this component. Expose the built
          // timeline on the wall's own DOM node so the parent can drive it
          // via a plain DOM query — the same "document.getElementById +
          // direct GSAP control" pattern already used for every other
          // cross-component motion link on this page (ai-delivery's cover
          // transform, the Prequel card), rather than introducing a new
          // ref/imperative-handle pattern.
          wallRef.current.__transitionWallTimeline = tl
        } else {
          // Spans the WHOLE hero-exit scroll (hero's own top-to-bottom, in
          // document coords 0 -> hero's height) — hero's bottom coincides
          // exactly with section-gap's top (adjacent sections, no gap).
          // progress 0 = hero at rest (wall down); Phase 1 completes the
          // 12vh ∧ by RISE_END (0.55), and Phase 2 keeps it growing
          // smoothly the rest of the way, reaching GROWTH_PEAK_VH exactly
          // at progress 1 — every active column's own tweens now span all
          // the way to time 1, so the timeline's auto-computed duration is
          // naturally 1 and self.progress maps to it 1:1 (no
          // duration-anchor workaround needed).
          //
          // .closest('#hero'), not a '#hero' selector string: useGSAP's
          // `scope` below restricts GSAP's own selector-text resolution to
          // this component's subtree, and '#hero' is an ancestor, not a
          // descendant — the scoped lookup would silently fail (see the
          // identical bug + fix in MosaicField.jsx's parallax trigger).
          ScrollTrigger.create({
            trigger: wallRef.current.closest('#hero'),
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => tl.progress(self.progress),
          })
        }
      })

      return () => mm.revert()
    },
    { scope: wallRef },
  )

  return (
    <div
      id={id}
      className={edge === 'top' ? 'transition-wall transition-wall--top' : 'transition-wall'}
      aria-hidden="true"
      ref={wallRef}
    >
      {Array.from({ length: COLS }, (_, col) => (
        <div
          key={col}
          className="transition-wall__col"
          style={{ left: `${(col / COLS) * 100}%`, width: `${100 / COLS}%` }}
        >
          <div
            ref={(el) => (fillRefs.current[col] = el)}
            className="transition-wall__fill"
            style={{ height: `${COLUMN_HEIGHT_RATIOS[col] * PEAK_VH}vh`, background: color }}
          />
        </div>
      ))}
    </div>
  )
}
