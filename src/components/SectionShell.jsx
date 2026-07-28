// Section wrapper that owns the surface (onyx ground by default, or the off-white
// break) and the max-width content column. Keeps every section's rhythm consistent.
export default function SectionShell({
  as: Tag = 'section',
  surface = 'onyx', // 'onyx' | 'break'
  id,
  className = '',
  ariaLabel,
  children,
}) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={`section-shell section-shell--${surface} ${className}`.trim()}
    >
      <div className="section-shell__inner">{children}</div>
    </Tag>
  )
}
