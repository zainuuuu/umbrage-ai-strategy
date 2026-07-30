import Button from './Button.jsx'

// NavBar — reads meta.nav. Logo slot is a placeholder helmet+wordmark (NOT the
// real brand mark — that drops in later). Nav items render as plain-weight
// (type="primary") Buttons, centered; utility buttons take their type from JSON
// and sit right-aligned. No real destinations yet, so everything renders inert.
//
// TODO: mobile nav — revisit at site merge. Below 900px this collapses to
// logo + "Get AI Ready" only (nav items and the trailing utility button, e.g.
// "EN", are hidden via CSS) — no hamburger/menu yet.
export default function NavBar({ nav }) {
  return (
    <div className="navbar">
      <div className="navbar__logo" aria-label="Umbrage — placeholder mark">
        <svg className="navbar__logo-mark" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 2 L28 9 V18 C28 24 22 28 16 30 C10 28 4 24 4 18 V9 Z"
            className="navbar__logo-shape"
          />
        </svg>
        <span className="navbar__logo-word">Umbrage</span>
      </div>

      <nav className="navbar__items" aria-label="Primary">
        {nav.items.map((item) => (
          <Button key={item} label={item} type="primary" className="navbar__item" />
        ))}
      </nav>

      <div className="navbar__utility">
        {nav.utility.map((u) => (
          <Button key={u.label} label={u.label} type={u.type} className="navbar__utility-btn" />
        ))}
      </div>
    </div>
  )
}
