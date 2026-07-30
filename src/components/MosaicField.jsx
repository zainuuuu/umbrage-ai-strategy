import heroBg from '../assets/herobg.png'

// MosaicField — the hero's sticky pinned backdrop (Figma node 3422:1386).
// Onyx ground + the real glow asset (src/assets/herobg.png, native 1920x1202),
// object-fit:cover / object-position:left top so it fills the full hero
// height (mosaic + blue field run to the bottom) while staying pinned to its
// upper-left corner (see CSS). Nothing overlaid — no dot grid (that was
// scoped for a since-cancelled hover animation and was just reading as
// noise).
//
// `position: sticky` pins this to the top of the hero while content scrolls
// over it. With only the hero section built so far there's no extra track
// height yet for it to visibly release — that arrives once later sections
// (meta.sectionOrder) push the page taller than one viewport.
export default function MosaicField() {
  return (
    <div className="hero__bg" aria-hidden="true">
      <img className="hero__bg-glow" src={heroBg} alt="" />
    </div>
  )
}
