# AI Roadmap Page — Implementation Spec

A standalone, scroll-driven React page that restyles Umbrage's AI strategy roadmap to
the 2026 brand identity. Built to run on its own first, then merge into the main website
repo (Cloudflare Pages) as the route `/services/ai-roadmap`.

All copy, structure, and brand tokens live in `roadmap-content.json` — the single source
of truth. Do not hardcode copy in components; read it from the data file.

---

## Step 0 — Recon (do this before writing any component)

1. Pull the **exact web tokens** from the style guide
   (`https://umbrage-website-2026.pages.umbrage.com/2026-u-styleguide/`) and the live site
   (`.../home/`). Both are behind auth — use the repo's credentials. Confirm/replace the
   values in `roadmap-content.json > meta.brand`, especially the **web font** (the deck uses
   Aptos/Aptos Black; Cera Pro is the licensed brand face — use whatever the style guide
   names for web).
2. Note the site's framework conventions so the later merge is clean, but build standalone
   for now (Vite + React).

## Stack

- **Vite + React (JS)**, standalone. Keep it merge-ready: no app-specific globals, styles
  scoped to the page, assets self-contained.
- **Motion: GSAP + ScrollTrigger.** The pinned/scrubbed scenes (challenge cloud, structure
  reveal, matrix connectors) can't be faked cleanly in CSS. Use React refs + `useGSAP`.
- **Styling:** CSS variables from the confirmed brand tokens. Mobile-first.

---

## Brand identity (working values — confirm in Step 0)

- Backgrounds: ink `#030511` (dominant), off-white `#F7F7F7` sections
- Primary accent: electric blue `#1E4FE0` (+ tints `#4B72E6`, `#8EA7EF`, `#BBCAF6`)
- Secondary: soft pink `#FFEBF1`; navy `#0C1546`
- Type: oversized bold display (Aptos Black), light body; big editorial statements,
  generous margins, full-bleed color blocks, minimal ornament, the Umbrage helmet mark
- Reference slides: the three provided (challenge cloud, "wherever you are", and the
  "What's your current challenge?" matrix — **image 3 is the anchor pattern**)

---

## Scroll narrative (three acts + resolution)

The motion is the message: a thin connector line ("the roadmap") draws down the page as
you scroll and completes at the closing CTA. Order follows the deck, NOT build-sequence —
the framing is "meet you where you are," organized by entry-point.

1. **Opening** — hero headline draws in; subhead; scroll cue.
2. **Challenge cloud** (slide 1) — radial burst of ~36 challenge labels around the center
   prompt "Where are you on your AI Transformation Journey?" Labels fan/fade in on scroll.
   Establishes the problem space (chaos).
3. **Structure emerges** (slide 2) — the cloud recedes/blurs to background; the concentric
   rings assemble (AI Product Delivery System at core, three services as rings) alongside
   the clean six-item list; AI Prequel entry callout appears. Chaos → order.
4. **Challenge matrix** (slide 3) — **the anchor.** "What's your current challenge?" Six
   rows: `Service | When you… | ·····▸ | We deliver…`. Rows stagger in; the **dotted
   connector draws left-to-right** per row on scroll; outcome numbers count up where present.
5. **Service deep dives** — one section per offering, in `structure.displayOrder`. Each:
   challenge statement (large) → tagline → value story → outcome (count-up if `outcomeStat`)
   → CTA button. The Delivery System section uses the **radial/concentric** treatment from
   slide 2, not a stacked box.
6. **Embedded Experts** — offset/alongside treatment so it reads as cross-cutting, not
   sequential.
7. **Closing CTA** — the connector line completes; primary CTA; Umbrage helmet mark.

(See the storyboard diagram shared in chat for the visual sequence.)

---

## Components

- `RoadmapPage` — composes sections, owns the `ScrollPath` progress.
- `RoadmapHero` — act 1.
- `ChallengeCloud` — radial label burst (SVG); labels from `challengeCloud.labels`.
- `StructureReveal` — concentric rings + six-item list + Prequel callout.
- `ChallengeMatrix` — the anchor; rows from `offerings` (uses `challenge.matrix` + `outcome`).
- `ServiceSection` — per-offering deep dive (challenge/tagline/valueStory/outcome/cta).
- `DeliverySystemSection` — variant of ServiceSection with the radial treatment.
- `EmbeddedExpertsSection` — alongside variant.
- `ScrollPath` — the drawing connector line (SVG `stroke-dashoffset` tied to scroll).
- `CountUpStat` — animates `outcomeStat.value` into view.
- `CtaButton`, `Eyebrow`, `SectionShell` — primitives.

---

## Motion rules

- Tie scrubbed scenes to `ScrollTrigger` with `scrub`; pin the challenge cloud → structure
  transition so chaos resolves into order within one sticky viewport.
- Matrix: per-row `ScrollTrigger`, connector draws via `stroke-dashoffset`, then `CountUpStat`.
- **`prefers-reduced-motion`: mandatory.** Degrade to static reveals — no scrub, no pin, no
  count-up, no draw. Everything must be fully readable and complete without motion.
- Don't animate layout-affecting properties; stick to `transform`/`opacity`. Watch scroll-jank.

---

## Accessibility & quality

- Semantic landmarks, logical heading order, focus states on CTAs, SVG `title`/`desc`.
- Color contrast per the brand system's a11y rules (verify accent-on-ink and text-on-tint).
- Content must be present in DOM for screen readers regardless of scroll state.
- Lighthouse pass (perf + a11y); test mobile (portrait source already suits vertical scroll).

## Build phases

1. Static build — all sections + copy from JSON, responsive, accessible. No motion.
2. Motion layer — ScrollPath, cloud→structure pin, matrix connectors, count-ups, reduced-motion.
3. Polish & QA — cross-browser, mobile, Lighthouse, side-by-side vs the deck slides.
4. Package for merge — scoped styles, documented, ready to drop in as `/services/ai-roadmap`.

## Don't

- Don't hardcode copy — read `roadmap-content.json`.
- Don't add attribution/"generated by" footers.
- Don't impose foundation-up ordering; use `structure.displayOrder`.
- Don't ship the Digital Factory (excluded — future-state only).
