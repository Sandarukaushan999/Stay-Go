import Footer from '../../userMngmnt&AdminDshbrd/footer'
import Header from '../../userMngmnt&AdminDshbrd/header'

const rideStats = [
  { label: 'Active rides now', value: '64', note: 'Across verified student drivers' },
  { label: 'Avg pickup accuracy', value: '148m', note: 'Smart pickup point calculation' },
  { label: 'Safe arrival rate', value: '98.7%', note: 'Auto check-in monitored' },
]

const rideFeatures = [
  {
    title: 'Route-based matching',
    description: 'Passengers and drivers are matched by route overlap, timing, and seat capacity.',
  },
  {
    title: 'Live trip visibility',
    description: 'Track pickup progress, ETA updates, and ride status from a single screen.',
  },
  {
    title: 'Safety controls',
    description: 'Use verified accounts, check-ins, trip logs, and reporting tools for safer travel.',
  },
]

const upcomingRides = [
  { route: 'Hostel A to Campus Gate', time: '07:10 AM', seats: '3 seats left', status: 'On schedule' },
  { route: 'Campus Gate to Library Block', time: '01:15 PM', seats: '2 seats left', status: 'High demand' },
  { route: 'Engineering Faculty to Hostel C', time: '06:40 PM', seats: '4 seats left', status: 'Open for booking' },
]

function RideSharing({ headerNavItems, onNavigateHome, onNavigateToPage }) {
  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: onNavigateHome },
    { label: 'Offer Ride', type: 'button', variant: 'button-primary', onClick: () => {} },
  ]

  return (
    <div className="ride-page">
      <Header
        navItems={headerNavItems}
        actionItems={actionItems}
        onBrandClick={onNavigateHome}
        navAriaLabel="Ride navigation"
      />

      <main className="ride-shell">
        <section className="ride-hero" id="ride-overview">
          <div className="ride-hero-copy">
            <p className="eyebrow">Ride Sharing Workspace</p>
            <h1>Trusted campus rides with real-time visibility.</h1>
            <p>
              Manage student rides through a cleaner, safer workflow with route matching, live trip
              updates, smart pickup guidance, and verified-driver access.
            </p>

            <div className="hero-actions">
              <button className="button button-dark" type="button">
                Request a Ride
              </button>
              <button className="button button-outline" type="button">
                View Live Trips
              </button>
            </div>
          </div>

          <div className="ride-hero-panel">
            <div className="ride-map-card">
              <div className="ride-map-grid" aria-hidden="true" />
              <div className="ride-map-pin pin-start">Hostel</div>
              <div className="ride-map-pin pin-mid">Pickup</div>
              <div className="ride-map-pin pin-end">Campus</div>
              <svg viewBox="0 0 320 200" role="img" aria-label="Ride route preview">
                <path
                  d="M18 168 C52 140, 66 82, 120 90 S182 160, 238 118 S286 74, 304 36"
                  fill="none"
                  stroke="#BAF91A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="7 10"
                />
              </svg>
            </div>

            <div className="ride-status-card">
              {rideStats.map((item) => (
                <article className="ride-status-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.note}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section ride-feature-section">
          <div className="section-heading">
            <p className="eyebrow">Why this module works</p>
            <h2>Built for predictable, safe, student-friendly transport</h2>
            <p className="section-copy">
              The ride experience keeps requests fast for students while giving admins and drivers
              the visibility needed to operate reliably.
            </p>
          </div>

          <div className="card-grid three-up">
            {rideFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-code">RD</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section ride-board-section" id="ride-board">
          <div className="ride-board-header">
            <div className="section-heading">
              <p className="eyebrow">Ride board</p>
              <h2>Upcoming rides and booking visibility</h2>
              <p className="section-copy">
                A responsive board keeps route, time, seat availability, and demand status easy to scan.
              </p>
            </div>
            <button className="button button-outline" type="button">
              Filter Routes
            </button>
          </div>

          <div className="ride-board-grid">
            {upcomingRides.map((ride) => (
              <article className="ride-ticket" key={`${ride.route}-${ride.time}`}>
                <p className="panel-label">{ride.time}</p>
                <h3>{ride.route}</h3>
                <div className="ride-ticket-meta">
                  <span>{ride.seats}</span>
                  <strong>{ride.status}</strong>
                </div>
                <button className="button button-dark" type="button">
                  Join Ride
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section ride-help-section">
          <div className="section-heading">
            <p className="eyebrow">Need help?</p>
            <h2>Safety and support links stay one tap away.</h2>
            <p className="section-copy">
              Use the correct support channel for ride disputes, active trip concerns, or general help.
            </p>
          </div>

          <div className="hero-actions">
            <button className="button button-dark" type="button" onClick={() => onNavigateToPage('support')}>
              Open Support
            </button>
            <button className="button button-outline" type="button" onClick={() => onNavigateToPage('contact')}>
              Contact Operations
            </button>
          </div>
        </section>
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default RideSharing
