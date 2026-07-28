import SectionShell from './SectionShell.jsx'
import SectionMarker from './SectionMarker.jsx'

// Correctly-sized EMPTY placeholder for the two geometry-heavy radial scenes
// (ChallengeCloud, StructureReveal). Built in Phase 2 with the supplied geometry
// math. Reserves realistic vertical space so page rhythm reads true now, and
// keeps the scene's copy present in the DOM for screen readers.
export default function ScenePlaceholder({ id, eyebrow, title, note, copy }) {
  return (
    <SectionShell id={id} surface="onyx" ariaLabel={title}>
      {eyebrow ? <SectionMarker>{eyebrow}</SectionMarker> : null}
      <div className="scene-placeholder" data-phase="2">
        <p className="scene-placeholder__tag">Placeholder — built in Phase 2</p>
        <p className="scene-placeholder__title">{title}</p>
        {note ? <p className="scene-placeholder__note">{note}</p> : null}
        {copy ? <p className="scene-placeholder__copy">{copy}</p> : null}
      </div>
    </SectionShell>
  )
}
