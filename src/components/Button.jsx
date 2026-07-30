// Button — pill, 24px/16px padding, Aptos SemiBold 18px, Onyx-1 text.
//   type="secondary": 1px Savoy-base border, fills solid on hover.
//   type="primary" (default): no fill, no border — plain text-weight button.
// Rendered as a real <button> for now (no confirmed destinations yet); pass
// `as="a"` + `href` once real routes/anchors exist.
export default function Button({ label, type = 'primary', as: Tag = 'button', className = '', ...rest }) {
  return (
    <Tag type={Tag === 'button' ? 'button' : undefined} className={`button button--${type} ${className}`.trim()} {...rest}>
      {label}
    </Tag>
  )
}
