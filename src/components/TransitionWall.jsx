import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const COLS = 7
const CENTER = (COLS - 1) / 2 // index 3

// Center column's target height. Tunable.
const PEAK_VH = 22
// Per-column height, as a fraction of PEAK_VH, center-out (index order,
// left-to-right). Tunable — shape guide is the Figma ∧: center tallest,
// shoulders shorter, edges minimal.
const COLUMN_HEIGHT_RATIOS = [0.05, 0.35, 0.65, 1, 0.65, 0.35, 0.05]
// Per-column stagger, in 0-1 timeline units per distance-from-center step —
// the center starts first (distance 0), each step out starts later. Every
// column still finishes at progress 1 (duration shrinks as start grows), so
// the shoulders visibly "catch up" to the peak. Tunable.
const STAGGER_STEP = 0.15

// TransitionWall — Move 2 of the hero -> section-gap seam. A wall of Onyx-1
// cells rises from the hero/section-gap boundary (this component's bottom:0
// anchor, via .hero's own position:relative from .section-shell) up into the
// dark hero, peaked in the center (∧), reading as the light section climbing
// over the dark one. No pin: it's a plain absolutely-positioned overlay at
// the bottom of hero, scrolling normally with the page — only each column's
// own scaleY is scrubbed to scroll.
//
// Each column's CSS height IS its own peak target (ratio x PEAK_VH); GSAP
// only ever scales that fixed box 0->1 from a bottom transform-origin, so the
// falloff shape comes for free from each column's own static height — no
// per-column tween math needed beyond the shared 0->1 scale.
//
// Collapsed (scale 1 0) is the CSS-authored default, so reduced-motion (where
// the animation below never runs) always renders static-collapsed —
// invisible, never blocking content.
export default function TransitionWall() {
  const wallRef = useRef(null)
  const colRefs = useRef([])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ paused: true })

        colRefs.current.forEach((col, i) => {
          if (!col) return
          const start = Math.abs(i - CENTER) * STAGGER_STEP
          tl.fromTo(col, { scaleY: 0 }, { scaleY: 1, duration: 1 - start, ease: 'power2.out' }, start)
        })

        // Spans the WHOLE hero-exit scroll (hero's own top-to-bottom, in
        // document coords 0 -> hero's height) rather than just the last
        // stretch near the seam — hero's bottom coincides exactly with
        // section-gap's top (adjacent sections, no gap), so "top top" ->
        // "bottom top" on hero alone already lands end-of-timeline exactly
        // when section-gap's top hits the viewport top. progress 0 = hero at
        // rest (wall down), progress 1 = that handoff instant (wall fully
        // risen).
        //
        // .closest('#hero'), not a '#hero' selector string: useGSAP's `scope`
        // below restricts GSAP's own selector-text resolution to this
        // component's subtree, and '#hero' is an ancestor, not a descendant —
        // the scoped lookup would silently fail (see the identical bug + fix
        // in MosaicField.jsx's parallax trigger).
        ScrollTrigger.create({
          trigger: wallRef.current.closest('#hero'),
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => tl.progress(self.progress),
        })
      })

      return () => mm.revert()
    },
    { scope: wallRef },
  )

  return (
    <div className="transition-wall" aria-hidden="true" ref={wallRef}>
      {Array.from({ length: COLS }, (_, i) => (
        <div
          key={i}
          ref={(el) => (colRefs.current[i] = el)}
          className="transition-wall__col"
          style={{
            left: `${(i / COLS) * 100}%`,
            width: `${100 / COLS}%`,
            height: `${COLUMN_HEIGHT_RATIOS[i] * PEAK_VH}vh`,
          }}
        />
      ))}
    </div>
  )
}
