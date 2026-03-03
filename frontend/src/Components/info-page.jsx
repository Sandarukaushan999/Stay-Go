import Footer from './footer'
import Header from './header'

const pageLinks = [
  { label: 'Privacy', screen: 'privacy' },
  { label: 'Terms', screen: 'terms' },
  { label: 'Support', screen: 'support' },
  { label: 'Contact', screen: 'contact' },
]

function InfoPage({
  id,
  eyebrow,
  title,
  intro,
  highlights,
  details,
  asideTitle,
  asideItems,
  onNavigateHome,
  onNavigateToRide,
  onNavigateToPage,
}) {
  const navItems = [
    { label: 'Home', type: 'button', onClick: onNavigateHome },
    { label: 'Rides', type: 'button', onClick: onNavigateToRide },
    ...pageLinks.map((link) => ({
      label: link.label,
      type: 'button',
      active: link.screen === id,
      onClick: () => onNavigateToPage(link.screen),
    })),
  ]

  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: onNavigateHome },
    {
      label: 'Open Ride Module',
      type: 'button',
      variant: 'button-primary',
      onClick: onNavigateToRide,
    },
  ]

  return (
    <div className="info-page">
      <Header
        navItems={navItems}
        actionItems={actionItems}
        onBrandClick={onNavigateHome}
        navAriaLabel="Policy navigation"
      />

      <main className="info-shell">
        <section className="info-hero">
          <div className="info-hero-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>

            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={onNavigateHome}>
                Return Home
              </button>
              <button className="button button-outline" type="button" onClick={onNavigateToRide}>
                Go to Rides
              </button>
            </div>
          </div>

          <aside className="info-hero-panel">
            <p className="panel-label">Quick reference</p>
            <h2>{asideTitle}</h2>
            <div className="info-hero-stack">
              {asideItems.map((item) => (
                <div className="info-pill-card" key={item}>
                  <span className="security-icon">+</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Overview</p>
            <h2>Core points for this page</h2>
            <p className="section-copy">
              These summary blocks keep the most important details clear before you move to operational guidance.
            </p>
          </div>

          <div className="card-grid three-up">
            {highlights.map((item) => (
              <article className="feature-card" key={item.label}>
                <span className="feature-code">SG</span>
                <h3>{item.label}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section info-detail-section">
          <div className="section-heading">
            <p className="eyebrow">Details</p>
            <h2>Operational guidance</h2>
            <p className="section-copy">
              Each point below is written to keep expectations clear for students, drivers, staff, and admins.
            </p>
          </div>

          <div className="info-detail-grid">
            {details.map((item, index) => (
              <article className="info-detail-card" key={item}>
                <span className="timeline-step">{`0${index + 1}`}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default InfoPage
