import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import heroBg from '../assets/herobg.png'

// How much of the scroll speed the bg keeps as the user scrolls out of the
// hero (1 = moves with content at 1x/no parallax, 0 = fully pinned/static).
// Tunable.
const PARALLAX_FACTOR = 0.35

// MosaicField — the hero's backdrop (Figma node 3422:1386). Onyx ground + the
// real glow asset (src/assets/herobg.png, native 1920x1202), object-fit:cover
// / object-position:left top so it fills the full hero height (mosaic + blue
// field run to the bottom) while staying anchored to its upper-left corner.
// Nothing overlaid — no dot grid (that was scoped for a since-cancelled hover
// animation and was just reading as noise).
//
// position:absolute, top:0 — same rest position the old position:sticky bg
// held before any scroll happened, so the hero at rest is unchanged. As the
// user scrolls the hero out of view, a scroll-scrubbed transform nudges this
// layer down by (1 - PARALLAX_FACTOR) of the scroll delta, so its net upward
// travel is only PARALLAX_FACTOR x the content's 1x scroll — it lags behind
// and appears to drift away slower, reading as depth. Gated in
// gsap.matchMedia(no-preference); reduced-motion never runs this, so the bg
// scrolls at a plain 1x with everything else, same as the content.
export default function MosaicField() {
  const bgRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // trigger must be the literal ancestor node, not the '#hero' selector
      // string: useGSAP's `scope` (bgRef, below) restricts GSAP's own
      // selector-text resolution to within bgRef's subtree, and '#hero' is an
      // ancestor of bgRef, not a descendant — the scoped lookup silently
      // fails to find it and ScrollTrigger falls back to measuring against
      // the wrong box entirely (a bogus, oversized scroll range).
      ScrollTrigger.create({
        trigger: bgRef.current.closest('#hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(bgRef.current, { y: (1 - PARALLAX_FACTOR) * self.progress * window.innerHeight })
        },
      })
    })

    return () => mm.revert()
  }, { scope: bgRef })

  return (
    <div className="hero__bg" aria-hidden="true" ref={bgRef}>
      <img className="hero__bg-glow" src={heroBg} alt="" />
    </div>
  )
}
