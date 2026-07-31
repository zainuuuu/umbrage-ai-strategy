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

// Timeline below is built from each phase's own ABSOLUTE viewport-height
// length, not hand-picked fractions of some pre-decided total — the pin's
// total distance (COVER_DISTANCE) is simply their sum, and the FRACTIONS
// used elsewhere (HOLD_FRACTION, COVER_END_FRACTION) are derived from
// those absolute amounts. That keeps each phase's real scroll-pixel
// length independently tunable without ever needing to hand-rescale the
// others when one phase's length changes.
//
// Hold and cover keep their exact prior absolute lengths (unchanged
// pacing — not part of this timing pass), expressed here as fractions of
// the ORIGINAL 450%-viewport-height baseline they were tuned against.
const BASELINE_VH_PERCENT = 450
// Leading slice of the pinned range where ai-delivery doesn't move at all —
// gap-2 sits fully visible and still, a brief digest beat for "Before you
// build... get the questions right." before the cover starts rising. Short
// on purpose (a pause to register, not a dead stop).
const HOLD_VH_PERCENT = BASELINE_VH_PERCENT * 0.15
// How long the cover itself takes, once it starts rising.
const COVER_VH_PERCENT = BASELINE_VH_PERCENT * 0.35
// Brief pinned "read beat" AFTER the card has expanded — just long enough
// to sit with the finished card, not a long dead pin. Tunable — keep this
// short; it's not meant to absorb the expand animation itself (that's a
// fixed, self-playing 0.45s tween, decoupled from scroll — see expandTl
// below), just a pause before moving on. This is where the pin releases:
// the NEXT phase (a connector sequence, not built yet) starts right here.
const READ_HOLD_VH_PERCENT = 60

// How long (in viewport heights) gap-2 stays pinned in total — the sum of
// every phase above, and thus the exact point where the pin releases /
// the future connector phase begins.
const TOTAL_VH_PERCENT = HOLD_VH_PERCENT + COVER_VH_PERCENT + READ_HOLD_VH_PERCENT
const COVER_DISTANCE = `+=${TOTAL_VH_PERCENT}%`

// Fractions of OVERALL progress (self.progress, 0-1 across the whole pin
// above) — derived from the absolute amounts above, not hand-picked, so
// they stay correct if any of the VH_PERCENT constants change.
const HOLD_FRACTION = HOLD_VH_PERCENT / TOTAL_VH_PERCENT
// Overall progress at which the cover finishes (ai-delivery fully covers
// the viewport) — the remaining stretch (this -> 1.0) is the brief
// post-expansion read-hold above.
const COVER_END_FRACTION = (HOLD_VH_PERCENT + COVER_VH_PERCENT) / TOTAL_VH_PERCENT

// Fire the expand trigger while the cover is NEARLY (not fully) done, so
// the card starts opening as the cover finishes rather than after a
// pause — expressed as the COVER's OWN 0-1 progress (coverProgress, see
// the ScrollTrigger below), not overall pin progress, since that's the
// meaningful frame of reference for "how done is the cover." Tunable —
// spec calls for ~0.85-0.88.
const EXPAND_TRIGGER_COVER_PROGRESS = 0.86
// Remapped onto OVERALL progress for the actual comparison in the
// ScrollTrigger below. Crossing it fires a one-shot, self-playing expand
// tween (see expandTl below), not a scroll-scrubbed one; scrolling back
// past it fires the reverse (collapse).
const EXPAND_TRIGGER_PROGRESS = HOLD_FRACTION + EXPAND_TRIGGER_COVER_PROGRESS * (COVER_END_FRACTION - HOLD_FRACTION)

const vwStr = (px) => `${(px / FRAME_W) * 100}vw`

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
        const card = document.getElementById('ai-delivery-prequel-card')
        const header = card.querySelector('.ai-delivery-card__header')
        const icon = card.querySelector('.ai-delivery-card__icon')
        const title = card.querySelector('.ai-delivery-card__title')
        const tagline = card.querySelector('.ai-delivery-card__tagline')
        const capabilities = card.querySelector('.ai-delivery-card__capabilities')

        // The seam wall (TransitionWall, externally driven — see
        // SectionAiDelivery.jsx/TransitionWall.jsx) exposes its own paused
        // timeline as a plain property on its DOM node once its effect
        // runs; cache the ELEMENT now (it exists synchronously, from
        // React's render) and read the property fresh on every onUpdate
        // below, since sibling components' effects aren't guaranteed to
        // run before this one's.
        const wallEl = document.getElementById('ai-delivery-seam-wall')
        // The seam wall's CENTER column (index 3 of 7 — see
        // TransitionWall.jsx's COLUMN_HEIGHT_RATIOS) is the tallest, and
        // it's horizontally aligned with the icon box (both dead-centered
        // on the same X) — so ITS rising tip is the relevant "dark edge"
        // passing the icon's screen position for fix #1, below, not
        // ai-delivery's own flat top edge.
        const wallCenterFill = wallEl?.querySelector('.transition-wall__col:nth-child(4) .transition-wall__fill')

        // Icon box's collapsed position: centered on gap-2's own ghost
        // Prequel glyph (the faint background X — see gap-2's own glyph
        // render below), so once the dark cover finishes, the solid icon
        // sits exactly where the ghost glyph was. gap-2 itself uses
        // min-height:100vh (viewport-height-driven — see roadmap.css),
        // NOT the 1920-proportional vw() model ai-delivery's own
        // positions use, so the two sections' vertical coordinates don't
        // convert via a fixed formula. This measures the glyph's actual
        // rendered offset from gap-2's own top (immune to scroll
        // position, unlike a raw viewport rect) and re-expresses it as a
        // plain px figure at the CURRENT viewport width — the same
        // "measure a real, natural DOM value once, use it as a fixed
        // target" pattern used for expandedHeight/titleWidth below, just
        // for position instead of size. A single gsap.set() (not a
        // tween) — this must never move relative to ai-delivery; only
        // ai-delivery's own cover transform (Step A, below) carries it
        // into view.
        const glyph = sectionRef.current.querySelector('.section-gap-2__glyph')
        const gap2Rect = sectionRef.current.getBoundingClientRect()
        const glyphRect = glyph.getBoundingClientRect()
        const glyphLocalCenterY = glyphRect.top - gap2Rect.top + glyphRect.height / 2
        const collapsedBoxPx = (84 / FRAME_W) * window.innerWidth
        const iconTop = glyphLocalCenterY - collapsedBoxPx / 2
        gsap.set(card, { top: iconTop })

        // The card's CSS default (no explicit height set — see
        // roadmap.css) is "auto," which the browser sizes correctly for
        // any viewport width on its own. GSAP can't tween to/from "auto"
        // directly, so this measures that natural, un-touched height once
        // up front (before any tween ever runs) and uses it as the fixed
        // expand/collapse target — the standard workaround for animating
        // an element to its own natural size. Title/tagline/capabilities'
        // own natural max-width/max-height are measured the same way, for
        // the same reason (see the maxWidth/maxHeight tweens below).
        const expandedHeight = card.getBoundingClientRect().height
        const titleWidth = title.getBoundingClientRect().width
        const titleHeight = title.getBoundingClientRect().height
        const taglineHeight = tagline.getBoundingClientRect().height
        const capabilitiesHeight = capabilities.getBoundingClientRect().height
        // Fix #3 — the EXPANDED card centers in the viewport (not anchored
        // at the collapsed icon's spot, which read as sitting too low).
        // By the time the expansion plays, the cover has long finished
        // (ai-delivery's own render top is stably 0 — see the
        // ScrollTrigger below), so "viewport center" and "section center"
        // are the same point. Horizontal stays centered for free (the
        // card's left:50%/translate:-50% CSS already recenters on ANY
        // width, growing or not); only vertical needs an explicit target.
        const EXPANDED_TOP = window.innerHeight / 2 - expandedHeight / 2

        // Fix (fast-scroll-up visibility bug) — the dark-cover clip (see
        // the ScrollTrigger's onUpdate below) is scroll-scrubbed, but
        // expandTl/flickerTl's own collapse plays on an INDEPENDENT real-
        // time clock (GSAP's ticker), decoupled from scroll. A fast
        // scroll-up can jump self.progress (and thus the dark edge) far
        // in a single scrub tick while the card is still mid-collapse —
        // if the clip only got recomputed on THAT one scroll event, it'd
        // go stale the instant expandTl keeps shrinking/moving the card
        // afterward with no further scroll input, briefly leaving a sliver
        // of the (by-then-smaller) card peeking out past a clip computed
        // against its EARLIER, larger size (caught empirically: a few
        // stale px visible for ~200ms after an instant reverse-jump).
        // Sharing ONE clip function — called from the scrubbed onUpdate
        // AND from expandTl/flickerTl's own onUpdate — means the clip
        // gets refreshed on EVERY tick of whichever is actually changing
        // the card's rect at that moment, always against its live,
        // current getBoundingClientRect(), so it can never go stale.
        // latestDarkEdgeY is only ever written by the scrubbed
        // ScrollTrigger below (it depends on scroll-driven cover state,
        // not on the card's own animation), and read here on every tick
        // regardless of which clock is driving.
        let latestDarkEdgeY = window.innerHeight // initial: dark fully receded, matching the collapsed clipPath default below
        const updateCardClip = () => {
          const cardRect = card.getBoundingClientRect()
          const topInsetPx = Math.min(cardRect.height, Math.max(0, latestDarkEdgeY - cardRect.top))
          gsap.set(card, { clipPath: `inset(${topInsetPx}px 0 0 0)` })
        }

        // Icon box (Step B, static-riding-in-with-the-cover, hidden until
        // the dark reaches it — fix #1, in the ScrollTrigger below) -> full
        // Prequel card (Step C). The collapsed state below is the resting
        // state up to EXPAND_TRIGGER_PROGRESS; crossing that point plays
        // expandTl, a SEPARATE, SELF-PLAYING (not scroll-scrubbed) timeline
        // — see the ScrollTrigger's onUpdate for the trigger logic.
        //
        // Collapsed box: plain, immediate gsap.set() calls (not part of
        // any timeline — there's no scrubbed progress to render at
        // anymore) establishing the 84px, 10px-radius box / hidden
        // content, overriding the CSS default (the expanded look). gap:0
        // and title's maxWidth/maxHeight:0 (in addition to tagline/
        // capabilities' maxHeight:0) strip every bit of reserved layout
        // space from everything except the icon, so centering the card's
        // flex column (align/justify:center, also set here) lands the
        // 32px icon dead-center of the 84px box on both axes — see
        // roadmap.css's .ai-delivery-card block comment for why stretch
        // (not flex-start) is the CSS resting default this reverts to.
        // card's own clip-path (fully clipped away, inset(100% ...)) is
        // fix #1's starting point — the ScrollTrigger below owns it from
        // here, continuously recomputed against the dark edge's rising
        // position, not this component's mount-time default. A clip
        // (not opacity) is what makes the icon read as content INSIDE
        // the rising dark layer, spatially uncovered from the bottom up,
        // rather than a binary pop.
        gsap.set(card, { width: vwStr(84), height: vwStr(84), padding: vwStr(26), borderRadius: 10, alignItems: 'center', justifyContent: 'center', clipPath: 'inset(100% 0 0 0)' })
        gsap.set(header, { gap: 0 })
        gsap.set(icon, { width: vwStr(32), height: vwStr(32) })
        gsap.set(title, { opacity: 0, maxWidth: 0, maxHeight: 0 })
        // marginTop:0 alongside maxHeight:0 — a 0-height element's own
        // margin doesn't collapse away on its own inside a flex column
        // (flex items don't margin-collapse the way block siblings do),
        // so without also zeroing it out, tagline's/capabilities' CSS
        // margin-top (both 20px) still pushes real space into the
        // collapsed box, throwing off the icon's vertical centering (fix
        // #4 from an earlier round) even though both elements are
        // otherwise fully collapsed.
        gsap.set([tagline, capabilities], { opacity: 0, maxHeight: 0, marginTop: 0 })

        // Punchier expansion ease — a slight overshoot-and-settle. Now a
        // fixed real-time duration (not scroll-distance-scaled): the
        // expansion is TRIGGERED by scroll crossing EXPAND_TRIGGER_PROGRESS
        // but then plays at its own pace via expandTl.play()/.reverse() —
        // see the ScrollTrigger's onUpdate — completely independent of how
        // fast the user continues scrolling.
        const EXPANSION_EASE = 'back.out(1.4)'
        const EXPAND_DURATION = 0.45 // seconds — snappy, self-playing, not scrubbed

        const expandTl = gsap.timeline({ paused: true, onUpdate: updateCardClip })
        // Box + icon + gap + max-width/max-height all grow together over
        // the whole duration, landing exactly on the card's Figma
        // (CSS-default) values at expandTl's own end — including the
        // discrete alignment/gap flip back to the CSS resting state,
        // restoring the card's normal top-left layout the instant the
        // expansion starts (the box is still 84px at that instant, so
        // nothing visibly jumps). alignItems/justifyContent are folded
        // into this SAME .to() rather than a separate .set(): a .set()
        // ALWAYS immediate-renders at creation time regardless of its
        // timeline position, so a second .set() touching `card` again
        // would immediately clobber this one's already-rendered collapsed
        // width/height/padding the instant it's added (hit and fixed once
        // already). Non-tweenable string props simply snap to their end
        // value the instant a .to() tween starts, so folding them in here
        // reproduces the intended discrete flip with only one tween ever
        // touching `card`. Plain .to() calls (no explicit "from"): each
        // one's implicit "from" is captured as whatever the .set() above
        // already established, so there's no shared-target clobbering to
        // guard against otherwise — same reasoning as TransitionWall's
        // Phase 2 growth tween.
        // top is folded in here too (fix #3 — expand toward viewport
        // center, not just grow in place): same reasoning as
        // alignItems/justifyContent above applies to top as well — it's
        // a plain numeric property here (not a discrete snap), so it
        // tweens smoothly from the collapsed iconTop to EXPANDED_TOP in
        // lockstep with width/height, drifting the card toward center as
        // it grows rather than growing then jumping.
        expandTl.to(
          card,
          {
            top: EXPANDED_TOP,
            width: vwStr(726),
            height: expandedHeight,
            padding: vwStr(42),
            borderRadius: 16,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            duration: EXPAND_DURATION,
            ease: EXPANSION_EASE,
          },
          0,
        )
        expandTl.to(header, { gap: 20, duration: EXPAND_DURATION, ease: EXPANSION_EASE }, 0) // 20 = header's CSS resting gap (icon above title)
        expandTl.to(icon, { width: vwStr(40), height: vwStr(40), duration: EXPAND_DURATION, ease: EXPANSION_EASE }, 0)
        expandTl.to(title, { maxWidth: titleWidth, maxHeight: titleHeight, duration: EXPAND_DURATION, ease: EXPANSION_EASE }, 0)
        expandTl.to(tagline, { maxHeight: taglineHeight, marginTop: 20, duration: EXPAND_DURATION, ease: EXPANSION_EASE }, 0) // 20 = tagline's CSS margin-top
        expandTl.to(capabilities, { maxHeight: capabilitiesHeight, marginTop: 20, duration: EXPAND_DURATION, ease: EXPANSION_EASE }, 0) // 20 = capabilities' CSS margin-top
        // Content reveal, staggered, in the LAST part of the expansion —
        // by the time each one starts fading in, the box (and its
        // max-width/max-height ceilings, above) is already most of the
        // way to full size. Icon needs no opacity tween: it's visible
        // from the start (Step B — plain static content, no reveal
        // animation of its own beyond fix #1's dark-arrival toggle) and
        // stays visible throughout.
        expandTl.to(title, { opacity: 1, duration: EXPAND_DURATION * 0.1 }, EXPAND_DURATION * 0.7)
        expandTl.to(tagline, { opacity: 1, duration: EXPAND_DURATION * 0.1 }, EXPAND_DURATION * 0.78)
        expandTl.to(capabilities, { opacity: 1, duration: EXPAND_DURATION * 0.15 }, EXPAND_DURATION * 0.85)

        // Fix #2 — a brief anticipation flicker on the collapsed icon
        // right before it expands: two rapid dips (1 -> 0.3 -> 1 -> 0.3
        // -> 1), ~200ms total, THEN expandTl plays on complete. Its own
        // tiny self-playing timeline (not scrubbed), chained ahead of
        // expandTl rather than folded into it, so collapsing (reverse)
        // never runs it backward — collapse goes straight to
        // expandTl.reverse(), no flicker, per the "reversible (no
        // flicker on collapse)" spec.
        const flickerTl = gsap.timeline({ paused: true, onUpdate: updateCardClip, onComplete: () => expandTl.play() })
        flickerTl.to(card, { opacity: 0.3, duration: 0.05 })
        flickerTl.to(card, { opacity: 1, duration: 0.05 })
        flickerTl.to(card, { opacity: 0.3, duration: 0.05 })
        flickerTl.to(card, { opacity: 1, duration: 0.05 })

        // Edge-triggered play/reverse: only flips when shouldExpand's
        // VALUE changes, not every onUpdate tick — this is what makes a
        // fast scroll-through (jumping straight past the threshold in one
        // scrub tick) still fire exactly once, and what lets GSAP's own
        // .play()/.reverse() cleanly redirect a still-mid-flight tween if
        // the user reverses direction before it finishes (no stuck
        // half-open state — GSAP handles reversing an active tween
        // natively, from wherever it currently is).
        let isExpanded = false

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
            // desired position doesn't move at all — see below), rescales
            // the middle stretch (HOLD_FRACTION -> COVER_END_FRACTION) to
            // 0-1 for the cover itself, then CLAMPS at 1 for everything
            // after — once the cover finishes, ai-delivery just stays put,
            // fully covering, while the beat/expansion (below) play out on
            // top of it.
            const coverProgress = Math.min(
              1,
              Math.max(0, (self.progress - HOLD_FRACTION) / (COVER_END_FRACTION - HOLD_FRACTION)),
            )
            // desired top (viewport-relative) = (1 - coverProgress) x vh —
            // held at one viewport below for the whole HOLD_FRACTION
            // (coverProgress stays 0), then eases to exactly 0 (covering)
            // by COVER_END_FRACTION, then stays at 0. Since naturalTop
            // keeps decreasing throughout (real scroll never stops),
            // holding desiredTop fixed during the hold (and again, at 0,
            // for the whole beat/expansion) means the corrective transform
            // below grows to exactly cancel that out — that's what makes
            // gap-2 read as genuinely still-uncovered during the hold, and
            // ai-delivery read as genuinely still-covering throughout the
            // beat/expansion, not just slowed down.
            const desiredTop = (1 - coverProgress) * vh
            gsap.set(aiDelivery, { y: desiredTop - naturalTop })

            // The icon box must hold a FIXED SCREEN position throughout
            // the cover — sitting on gap-2's ghost-glyph spot while the
            // dark section rises up behind/around it — not ride along
            // with ai-delivery's own slide (a plain child of ai-delivery
            // otherwise inherits that transform, which read as the box
            // scrolling up with the dark section). `card`'s local `top`
            // (set once, above) is already the glyph-matching offset
            // that lands correctly ONLY once ai-delivery's own translateY
            // reaches 0 (coverProgress 1) — for every OTHER value, this
            // counter-translates the card by the exact negative of
            // ai-delivery's own applied y (desiredTop - naturalTop's
            // naturalTop term cancels out identically for both, leaving
            // -desiredTop), so the two combine to a constant net screen
            // position (= card's local top) for as long as ai-delivery
            // has any y-transform applied at all. Once coverProgress hits
            // 1, desiredTop is 0, so this naturally becomes a no-op —
            // Step C's expansion then proceeds from that same fixed spot
            // with no special-casing needed.
            gsap.set(card, { y: -desiredTop })

            // Dark Onyx-5 seam wall (TransitionWall, externally driven —
            // see SectionAiDelivery.jsx) rises in lockstep with the cover
            // itself: same coverProgress driving both, so the wall's ∧
            // finishes climbing exactly as ai-delivery finishes covering
            // gap-2, mirroring how the hero's own wall rises across its
            // own scroll-out.
            const wallTl = wallEl?.__transitionWallTimeline
            if (wallTl) wallTl.progress(coverProgress)

            // Fix #1 — the icon/card reads as content INSIDE the rising
            // dark layer, uncovered spatially from the bottom up as the
            // dark edge climbs past it — a clip, not an opacity pop. The
            // wall's CENTER column is what's rising directly behind the
            // (horizontally-aligned) icon/card, so ITS current tip
            // position is "the dark edge" at that X. The wall's own fill
            // is anchored with bottom:0 inside its zero-height, top:0
            // container (see TransitionWall.jsx), so a cell's rendered
            // viewport top = the wall container's own viewport top (==
            // ai-delivery's rendered top == desiredTop) minus its current
            // rendered height.
            //
            // Computed against updateCardClip's LIVE getBoundingClientRect
            // read (not the fixed collapsed iconTop/collapsedBoxPx), so
            // this gates whatever the card's CURRENT extent actually is —
            // 84px collapsed, mid-expansion, or the full ~726px card.
            // darkEdgeY at or above the card's current top -> fully
            // visible. At or below the card's current bottom -> fully
            // clipped/invisible. In between, a continuous slice, not a
            // threshold. Only darkEdgeY is computed here (it depends on
            // scroll-driven cover state); latestDarkEdgeY + updateCardClip
            // (declared above, alongside expandTl/flickerTl) are what
            // actually apply the clip, shared with expandTl/flickerTl's
            // own onUpdate so the card's independent, self-playing size
            // changes can never leave a stale clip during a fast
            // scroll-up (see that declaration for the full reasoning).
            const centerFillHeight = wallCenterFill ? wallCenterFill.getBoundingClientRect().height : 0
            latestDarkEdgeY = desiredTop - centerFillHeight
            updateCardClip()

            // Fix #3 — the expansion is TRIGGERED by scroll crossing
            // EXPAND_TRIGGER_PROGRESS, then plays on expandTl's OWN clock
            // (play()/reverse()), not scrubbed to self.progress. Edge-
            // triggered on isExpanded's CHANGE, not every tick — see
            // expandTl's own comment above for why this is what makes a
            // fast scroll-through fire cleanly once, and why reversing
            // mid-flight can't get stuck half-open. Forward fires the
            // flicker (fix #2) first, which then plays expandTl on its
            // own completion; reverse skips the flicker entirely (no
            // flicker on collapse, per spec) and goes straight to
            // expandTl.reverse() — restarting from a clean opacity:1 in
            // case a reverse interrupts the flicker mid-blip, so it can
            // never leave the box stuck at a dimmed opacity.
            const shouldExpand = self.progress >= EXPAND_TRIGGER_PROGRESS
            if (shouldExpand && !isExpanded) {
              isExpanded = true
              flickerTl.restart()
            } else if (!shouldExpand && isExpanded) {
              isExpanded = false
              flickerTl.pause(0)
              gsap.set(card, { opacity: 1 })
              expandTl.reverse()
            }
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
