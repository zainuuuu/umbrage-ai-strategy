import Button from './Button.jsx'
import logo from '../assets/logo.svg'

// NavBar — reads meta.nav. Nav items render as plain-weight (type="primary")
// Buttons, centered; utility buttons take their type from JSON and sit
// right-aligned. No real destinations yet, so everything renders inert.
//
// TODO: mobile nav — revisit at site merge. Below 900px this collapses to
// logo + "Get AI Ready" only (nav items hidden) — no hamburger/menu yet.
export default function NavBar({ nav }) {
  return (
    <div className="navbar">
      <div className="navbar__logo">
        <img src={logo} width="216" height="56" alt="Umbrage" className="navbar__logo-mark" />
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
