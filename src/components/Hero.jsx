import MosaicField from './MosaicField.jsx'
import NavBar from './NavBar.jsx'
import Eyebrow from './Eyebrow.jsx'

// Act 1 — hero. Static (motion arrives per-section later). Unlike a plain
// SectionShell section, the hero needs full-bleed layers (mosaic backdrop, nav)
// alongside a centered 1590 content column — so it builds on the same
// section-shell classes directly rather than nesting the generic SectionShell
// component. NavBar sits at the top; the centered content block (eyebrow ->
// headline -> subhead) sits at the Figma frame's ~439/1202 vertical ratio.
// No TransitionPanel here — that's the hero -> section-two seam, rendered
// once section two exists (TransitionPanel component is kept for reuse then).
export default function Hero({ nav, hero }) {
  return (
    <header id="hero" aria-label="Introduction" className="section-shell hero">
      <MosaicField />
      <NavBar nav={nav} />

      <div className="section-shell__inner hero__inner">
        <div className="hero__content">
          <Eyebrow align="center">{hero.eyebrow}</Eyebrow>
          <h1 className="hero__headline">{hero.headline}</h1>
          <div className="hero__subhead">
            {hero.subhead.map((line, i) => (
              <p key={i} className="hero__subhead-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
