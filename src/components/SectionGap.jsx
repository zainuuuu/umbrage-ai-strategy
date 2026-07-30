import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Section two — section-gap (Figma node 3422:2351). The tonal break after the
// dark hero: a light (Onyx-1) full-viewport section. Scattered challenge
// labels sit low-opacity across the frame; a heavily-blurred Onyx-1 rectangle
// sits above them (clearing the center so the question reads clean) but below
// the question itself.
//
// Positions are stored in roadmap-content.json as Figma px on a 1920x1080
// reference frame; converted here to percentages so they scale proportionally
// with the section's actual rendered size (per-instance, so this stays data,
// not a CSS rule — same approach the earlier radial scenes used).
const FRAME_W = 1920
const FRAME_H = 1080
const CENTER_X = 960
const CENTER_Y = 540

const pct = (value, frame) => `${(value / frame) * 100}%`
const distanceFromCenter = ({ x, y }) => Math.hypot(x - CENTER_X, y - CENTER_Y)

// Label color settle — matches tokens.css --onyx-5 / --onyx exactly (hardcoded
// since GSAP tweens the raw color value, not the custom property reference).
const ONYX_5 = '#40424b' // enter color
const ONYX = '#030511' // settle target — the committed static color

// How much of the master 0-1 build plays out during the unpinned lead-in
// (section's top going from viewport-center to viewport-top). Tunable.
const LEADIN_FRACTION = 0.25

// ============================================================================
// QUESTION_REVEAL — four entrance variants for the center question, kept
// side by side behind one flag so they're easy to compare. Each function adds
// its own tween(s) to the shared timeline at `pos`, spanning `duration`.
// ============================================================================
const QUESTION_REVEAL = 'blur' // 'fade' | 'blur' | 'words' | 'mask'

function questionFadeScale(tl, pos, duration, { questionRef }) {
  tl.fromTo(
    questionRef.current,
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration, ease: 'power2.out' },
    pos,
  )
}

function questionBlurIn(tl, pos, duration, { questionRef }) {
  // Clarity emerging — the intended feel.
  tl.fromTo(
    questionRef.current,
    { opacity: 0, filter: 'blur(24px)' },
    { opacity: 1, filter: 'blur(0px)', duration, ease: 'power2.out' },
    pos,
  )
}

function questionWordStagger(tl, pos, duration, { questionRef }) {
  const words = questionRef.current.querySelectorAll('.section-gap__question-word')
  tl.fromTo(
    words,
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: duration * 0.6,
      stagger: (duration * 0.4) / Math.max(words.length - 1, 1),
      ease: 'power2.out',
    },
    pos,
  )
}

function questionMaskWipe(tl, pos, duration, { questionRef }) {
  tl.fromTo(
    questionRef.current,
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration, ease: 'power2.inOut' },
    pos,
  )
}

const QUESTION_REVEALS = {
  fade: questionFadeScale,
  blur: questionBlurIn,
  words: questionWordStagger,
  mask: questionMaskWipe,
}

export default function SectionGap({ gap }) {
  const sectionRef = useRef(null)
  const labelRefs = useRef([])
  const blurRef = useRef(null)
  const questionRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Reduced motion (and JS failure): no pin/scrub at all. The CSS defaults
      // ARE the static final state (labels @ 0.4 Onyx, blur present, question @ 1)
      // — nothing here ever runs, so nothing needs to be undone.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const order = gap.labels
          .map((label, i) => ({ i, d: distanceFromCenter(label) }))
          .sort((a, b) => b.d - a.d) // farthest first
          .map((entry) => entry.i)
        const outerToInner = order.map((i) => labelRefs.current[i]).filter(Boolean)
        const innerToOuter = [...outerToInner].reverse()

        // Master timeline, progress 0-1. NOT auto-attached to a scrollTrigger —
        // two separate ScrollTriggers below each drive a different slice of its
        // progress (see the split further down), so it can't self-manage one.
        const tl = gsap.timeline({ paused: true })

        // 1. LABEL FILL (ENTERED) — progress 0 -> 0.65, outer-rim -> inward, no
        // drift (translate handles centering as a separate CSS property). Labels
        // arrive at FULL opacity in Onyx-5 — a genuinely dark, solid word, not a
        // faint gray one (opacity and color must NOT both be low at once, or the
        // dark color never actually reads). The settle to the calmer @0.4 gray
        // look happens later, decoupled, in phase 3. This is the FIRST tween
        // added (position 0, matching the paused timeline's initial playhead),
        // so its default immediateRender is correct — the DOM should reflect
        // its "from" state right away.
        tl.fromTo(
          outerToInner,
          { opacity: 0, scale: 0.92, color: ONYX_5 },
          {
            opacity: 1,
            scale: 1,
            color: ONYX_5,
            duration: 0.15,
            stagger: 0.5 / (outerToInner.length - 1),
            ease: 'power1.out',
          },
          0,
        )

        // 2. HOLD — 0.65 -> 0.78. Deliberately no tweens in this window: the
        // timeline just sits at the phase-1 end values (the overwhelm beat —
        // full-opacity, dark Onyx-5 labels crowding the whole frame).

        // 3. QUESTION AS ERASER + SETTLE — 0.78 -> 1.0. The blur clear-zone
        // scales/fades up from center, question reveals on top, AND —
        // overlapping, intentionally — the labels SETTLE: opacity 1 -> 0.4 AND
        // color Onyx-5 -> Onyx together (the real dark-solid -> calm-gray
        // change), inner-first (opposite direction to the fill), so the center
        // visibly calms right as the blur/question sweep over it.
        //
        // The blur and question elements are each touched by exactly ONE tween
        // (no other tween shares their target), so their default immediateRender
        // (true) is correct and necessary here: it paints their "from" values
        // {opacity:0, ...} onto the DOM the instant the timeline is built,
        // overriding the CSS static-fallback look (opacity:1, always-blurred)
        // BEFORE the timeline ever advances. Without it, these elements would
        // sit at their visible CSS default for the whole 0-0.78 span (since
        // nothing else ever renders them until their own tween activates),
        // washing out the labels underneath the blur rectangle prematurely.
        //
        // The label settle tween below is different: it SHARES targets with
        // phase 1's fill tween (same labelRefs), so it needs immediateRender:
        // false — phase 1's own active tween already renders the correct
        // opacity/color for labels throughout 0-0.78, and without the flag,
        // this tween's creation-time paint would instantly clobber phase 1's
        // just-rendered {opacity:0} with its own "from" {opacity:1} at t=0.
        tl.fromTo(
          blurRef.current,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' },
          0.78,
        )
        QUESTION_REVEALS[QUESTION_REVEAL](tl, 0.78, 0.22, { questionRef })
        tl.fromTo(
          innerToOuter,
          { opacity: 1, color: ONYX_5 },
          {
            opacity: 0.4,
            color: ONYX,
            duration: 0.1,
            stagger: 0.12 / (innerToOuter.length - 1),
            ease: 'power1.inOut',
            immediateRender: false,
          },
          0.78,
        )

        // SCROLL LINKAGE — split across two ScrollTriggers sharing this one
        // timeline: an unpinned lead-in (section's top going from viewport
        // center to viewport top — i.e. "halfway into view" to "fully in view")
        // drives progress 0 -> LEADIN_FRACTION, so the outer labels are already
        // fading in before the section is even fully on screen. Once fully in
        // view, the long pin (~2.5 viewports, unchanged) takes over and drives
        // LEADIN_FRACTION -> 1. Both are scrub:true (1:1, reversible); the
        // handoff at LEADIN_FRACTION is exact, so there's no jump.
        //
        // GUARDED: ScrollTrigger's `progress` clamps to 0 before a trigger's
        // own start and to 1 after its own end — it does NOT mean "inactive."
        // Without the scroll-position guards below, each trigger's onUpdate
        // still fires on every scroll event regardless of whether ITS range is
        // the relevant one, and the two formulas fight over tl.progress().
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top center',
          end: 'top top',
          scrub: true,
          onUpdate: (self) => {
            if (self.scroll() > self.end) return // past this segment — defer to the pinned one
            tl.progress(self.progress * LEADIN_FRACTION)
          },
        })
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%', // ~2.5 viewports — long pin, overwhelm builds slowly
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            if (self.scroll() < self.start) return // not reached yet — defer to the lead-in one
            tl.progress(LEADIN_FRACTION + self.progress * (1 - LEADIN_FRACTION))
          },
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [gap] },
  )

  return (
    <section
      id="gap-where-are-you"
      className="section-gap"
      aria-labelledby="gap-question"
      ref={sectionRef}
    >
      <div className="section-gap__labels" aria-hidden="true">
        {gap.labels.map((label, i) => (
          <span
            key={i}
            ref={(el) => (labelRefs.current[i] = el)}
            className="section-gap__label"
            style={{ left: pct(label.x, FRAME_W), top: pct(label.y, FRAME_H) }}
          >
            {label.text}
          </span>
        ))}
      </div>

      <div
        ref={blurRef}
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
        ref={questionRef}
        className="section-gap__question"
        style={{ left: pct(960, FRAME_W), top: pct(502, FRAME_H) }}
      >
        {gap.question.split(' ').map((word, i, arr) => (
          <span className="section-gap__question-word" key={i}>
            {word}
            {i < arr.length - 1 ? ' ' : ''}
          </span>
        ))}
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
