# AI Roadmap Page — Implementation Spec

A standalone, scroll-driven React page that restyles Umbrage's AI strategy roadmap to the
2026 brand identity. Built to run on its own first, then merge into the main website repo
as the route `/services/ai-roadmap`.

All copy, structure, and brand tokens live in `roadmap-content.json` — the single source of
truth. Do not hardcode copy; read it from the data file. Brand tokens are now CONFIRMED from
the 2026 Visual Style Guide (only font-loading method and deploy host remain open — see below).

---

## Open items (do not block the standalone build)

- **Font loading**: the type families are confirmed (Aptos / Aptos Serif / Aptos Mono) but the
  web `@font-face` / file source is not. For standalone dev, self-host Aptos or use a close
  fallback; confirm the real loading method from the site repo at merge.
- **Deploy host**: spec assumed Cloudflare Pages, but the live site responds as `server:
  CloudFront` (AWS). Resolve before merge; irrelevant to the standalone build.
- **CTAs**: intentionally NOT rendered on this page (`meta.renderCtas: false`). The wider site
  supplies header/footer/CTA chrome post-merge. Keep CTA labels in the data, render nothing.
- **Proof cards / client naming**: every `proof` defaults to `clientCleared: false` — render
  metric + sector + description only, NO client names or logos, until each client is confirmed
  cleared for public use. The Delivery System proof art is WIP (`proof.artStatus`).

## Stack

- **Vite + React (JS)**, standalone. Merge-ready: styles scoped to the page, no app globals,
  assets self-contained.
- **Motion: GSAP + ScrollTrigger** (React refs / `useGSAP`) for pinned/scrubbed scenes.
- **Styling:** CSS custom properties generated from `meta.brand`. Mobile-first.

---

## Brand identity (CONFIRMED — 2026 Visual Style Guide)

**Palette** — Savoy / Blush / Onyx, plus Bain Red for partnership only. Full ramps in
`meta.brand.color`. Roles: ground = Onyx `#030511`; off-white break = Onyx-1 `#F7F7F7`;
primary accent = Savoy-Base `#1E4FE0`; secondary accent = Blush-Base `#FF3677`; white type on
Onyx, charcoal `#23252E` on off-white. Bain Red only if a partnership section is added.

**Type** — **Aptos** for display + body; **Aptos Serif** *sparingly*, for accents and large
metric callouts (use it for `outcomeStat` numbers); **Aptos Mono** for eyebrows/labels
(uppercase, wide tracking). Display scale: 120 / 88 / 56 / 44 / 32 / 18 / 16 px. Body 16–22px
regular; bold only for headings and lead-ins. Casing: eyebrows MONO-CAPS, headings Title Case,
labels sentence case — but keep headline COPY verbatim from the JSON.

**Signature components / rules:**
- **Section marker**: uppercase Aptos Mono eyebrow over a hairline rule; the rule runs 80px
  past the text (right side when left-justified; both sides when centered). Savoy default.
- **Cards**: 16px radius, ≥16px gap, 1px Savoy-tinted border on Onyx, hairline divider above
  any footer row.
- **Flat color everywhere.** The only gradient in the system is the Praxis® wordmark — not used
  here. NO gradient backgrounds, card fills, or glows in the motion layer.
- **Mosaic grid** background motif (≥8 equal columns; Savoy + Blush glow through Onyx; tiles
  continuously) — candidate texture for the hero and challenge-cloud grounds.
- **Voice**: direct, confident, no hype; lead with the outcome and the number.

Surfaces: Onyx throughout for now — the matrix stays on Onyx to match slide 3. The off-white
break token is defined but intentionally UNUSED until a future section (e.g. an About/proof
band) warrants it. Bain-Red-on-Onyx close remains optional/future.

---

## Scroll narrative (three acts + resolution)

Motion is the message: a thin connector line ("the roadmap") draws down the page and completes
at the closing resolution. Order follows the deck (`structure.displayOrder`), NOT build-sequence
— the framing is "meet you where you are," organized by entry-point.

1. **Opening** — hero headline draws in; subhead; scroll cue.
2. **Challenge cloud** (slide 1) — radial burst of the 36 `challengeCloud.labels` around the
   center prompt. Labels fan/fade in on scroll. Establishes the problem space (chaos).
3. **Structure emerges** (slide 2) — the cloud recedes/blurs to background; concentric rings
   assemble (Delivery System at core, three services as rings) beside the clean six-item list;
   AI Prequel entry callout appears. Chaos → order.
4. **Challenge matrix** (slide 3) — **the anchor.** "What's your current challenge?" Six rows:
   `Service | When you… | ·····▸ | We deliver…`. Rows stagger in; the dotted connector draws
   left-to-right per row; `outcomeStat` numbers count up (Aptos Serif).
5. **Service deep dives** — one section per offering in `structure.displayOrder`, following the
   six detail slides' three-column layout. Left: `iconSlot` + `name` + `sectionSubtitle` (accent
   "When you…"). Center: `valueHeader` (bold lead) → `body` → `capabilities` list (six `term —
   desc` rows) → closing `outcome`. Right: a **proof card** (`proof`): rounded image slot (20px,
   cool grade, AA scrim), big `metric` in Aptos Serif, `metricLabel`, `description`, hairline
   divider. **No CTA button.** Proof cards render ANONYMIZED unless `proof.clientCleared` is true
   (no client names or logos by default). The Delivery System section uses the radial/concentric
   treatment from slide 2, and its `proof.artStatus` is WIP — placeholder art only.
6. **Embedded Experts** — offset/alongside treatment (cross-cutting, not sequential).
7. **Closing resolution** — the connector line completes into a final short declarative
   ("Built to ship."-style). No CTA; brand/helmet chrome comes from the site post-merge.

(See the storyboard shared in chat for the visual sequence.)

---

## Components

- `RoadmapPage` — composes sections; owns the `ScrollPath` progress.
- `SectionMarker` — mono eyebrow + 80px hairline rule (used by every section).
- `MosaicGrid` — signature grid-glow background (flat, no gradient fills beyond the grid motif).
- `RoadmapHero` — act 1.
- `ChallengeCloud` — radial label burst (SVG) from `challengeCloud.labels`. **Geometry-heavy —
  will get its own spec + prompt.**
- `StructureReveal` — concentric rings + six-item list + Prequel callout. **Also geometry-heavy.**
- `ChallengeMatrix` — the anchor; rows from `offerings` (`challenge.matrix` + `outcome`).
- `ServiceSection` — per-offering deep dive, three-column slide layout (no CTA). Composes
  `CapabilityList` + `ProofCard`.
- `CapabilityList` — six `term — desc` rows from `offering.capabilities`.
- `ProofCard` — image slot (20px radius, cool grade, AA scrim) + Aptos-Serif `metric` +
  `metricLabel` + `description`. Renders `client` only when `proof.clientCleared` is true; never
  renders client logos. Honors `proof.artStatus` (WIP → placeholder art).
- `DeliverySystemSection` — ServiceSection variant with the radial treatment.
- `EmbeddedExpertsSection` — alongside variant.
- `ScrollPath` — the drawing connector line (SVG `stroke-dashoffset` tied to scroll).
- `MetricCallout` / `CountUpStat` — Aptos Serif number that counts up on entry.
- `Eyebrow`, `SectionShell` — primitives.

---

## Motion rules

- Scrubbed scenes via `ScrollTrigger` with `scrub`; pin the cloud → structure transition so
  chaos resolves into order within one sticky viewport.
- Matrix: per-row trigger; connector draws via `stroke-dashoffset`; then count-up.
- **`prefers-reduced-motion`: mandatory.** Degrade to static reveals — no scrub, no pin, no
  count-up, no draw. Everything fully readable and complete without motion.
- Animate only `transform` / `opacity`. No gradients, glows, or layout-thrashing properties.

---

## Accessibility & quality

- Semantic landmarks, logical heading order, SVG `title`/`desc`, visible focus states.
- WCAG AA per the style guide (white-on-Onyx ≈19:1; Savoy-Base-on-white ≈7:1; charcoal-on-
  off-white ≈13:1). Verify any Savoy/Blush text pairings.
- Content present in the DOM regardless of scroll state (screen readers, no-JS).
- Lighthouse pass (perf + a11y); test mobile (portrait source suits vertical scroll).

## Build phases (each phase is reviewed and approved before the next)

1. **Static — flat sections**: scaffold + tokens/type as CSS vars + `SectionMarker` + hero,
   matrix, six service sections, embedded experts, closing. Placeholders (correctly sized empty
   containers) for the two radial scenes. Responsive, no motion, no CTAs.
2. **Static — radial scenes**: `ChallengeCloud` + `StructureReveal` with supplied geometry math.
2.6. **Static — service enrichment**: rebuild `ServiceSection` to the three-column slide layout
   (subtitle, value header, body, capabilities, proof card); proof cards anonymized by default.
3. **Motion layer (core)**: reduced-motion harness FIRST, then ScrollPath draw, per-scene enter
   reveals, matrix connector draws, count-ups. The static baseline must stay fully intact under
   `prefers-reduced-motion` and with JS disabled — animate `from` a visible default, never leave
   content stuck hidden.
3.5. **Motion enhancement**: the cloud→structure pin (chaos resolves into the rings). Isolated so
   it can't compromise the core motion or the static baseline.
4. **Polish & QA**: cross-browser, mobile, Lighthouse, side-by-side vs the deck slides.
5. **Package for merge**: scoped styles, documented, ready as `/services/ai-roadmap`.

## Don't

- Don't hardcode copy — read `roadmap-content.json`.
- Don't render CTA buttons (`meta.renderCtas: false`).
- Don't use gradients (flat color; Praxis is the sole exception and isn't on this page).
- Don't impose foundation-up ordering; use `structure.displayOrder`.
- Don't ship Digital Factory (excluded).
- Don't add attribution/"generated by" footers.