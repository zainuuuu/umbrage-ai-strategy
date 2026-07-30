// Container / SectionShell — centers the 1590 content column in the 1920 field,
// 165px side margins on desktop (mobile-first: margins shrink fluidly below that
// via clamp(), the desktop value is the ceiling, not a fixed breakpoint jump).
// Onyx ground by default; every section on the page sits inside one of these.
export default function SectionShell({
  as: Tag = 'section',
  id,
  className = '',
  ariaLabel,
  rootRef,
  children,
}) {
  return (
    <Tag ref={rootRef} id={id} aria-label={ariaLabel} className={`section-shell ${className}`.trim()}>
      <div className="section-shell__inner">{children}</div>
    </Tag>
  )
}
