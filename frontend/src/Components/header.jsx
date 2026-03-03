import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'

function HeaderAction({ item, className }) {
  if (item.type === 'link') {
    return (
      <a className={className} href={item.href}>
        {item.label}
      </a>
    )
  }

  return (
    <button
      className={className}
      type="button"
      onClick={item.onClick}
      aria-current={item.active ? 'page' : undefined}
    >
      {item.label}
    </button>
  )
}

function Header({
  navItems = [],
  actionItems = [],
  onBrandClick,
  brandHref,
  brandAriaLabel = 'Stay and Go home',
  navAriaLabel = 'Primary navigation',
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const brandContent = (
    <span className="brand-logo-frame">
      <img className="brand-logo" src={logo} alt="Stay and Go" />
    </span>
  )

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 36)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <nav className="topbar-nav" aria-label={navAriaLabel}>
        {navItems.map((item) => (
          <HeaderAction
            key={item.key ?? item.label}
            item={item}
            className={`nav-link${item.active ? ' is-active' : ''}`}
          />
        ))}
      </nav>

      <header className={`topbar${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="topbar-inner">
          {onBrandClick ? (
            <button className="brand brand-button" type="button" onClick={onBrandClick} aria-label={brandAriaLabel}>
              {brandContent}
            </button>
          ) : (
            <a className="brand" href={brandHref ?? '#home'} aria-label={brandAriaLabel}>
              {brandContent}
            </a>
          )}

          <div className="topbar-actions">
            {actionItems.map((item) => (
              <HeaderAction
                key={item.key ?? item.label}
                item={item}
                className={`button ${item.variant ?? 'button-ghost'}`}
              />
            ))}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
