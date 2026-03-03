import Footer from './footer'
import Header from './header'

const heroStats = [
  { label: 'Active Students', value: '12.8K', note: '+14% this month' },
  { label: 'Successful Matches', value: '3,240', note: 'Double opt-in verified' },
  { label: 'Rides Completed', value: '8,960', note: 'Live route tracking' },
  { label: 'Tickets Resolved', value: '1,482', note: 'SLA monitored' },
]

const valueSignals = [
  {
    title: 'Compatibility-first matching',
    description: 'Lifestyle, routine, and preference scoring before roommate decisions are made.',
  },
  {
    title: 'Safer student rides',
    description: 'Verified drivers, live route visibility, and structured pickup control in one flow.',
  },
  {
    title: 'Transparent hostel support',
    description: 'Maintenance tickets stay visible from reporting to final closure and rating.',
  },
  {
    title: 'Role-based analytics',
    description: 'Admins monitor demand, ticket pressure, and safety activity across the platform.',
  },
]

const valueCards = [
  {
    code: 'RM',
    title: 'Roommate Matching',
    description:
      'Find compatible roommates through lifestyle scoring, preference filters, and safe double opt-in approvals.',
  },
  {
    code: 'RS',
    title: 'Ride Sharing + Live Tracking',
    description:
      'Coordinate campus rides with route-based suggestions, pickup logic, seat control, and real-time tracking.',
  },
  {
    code: 'MT',
    title: 'Maintenance Tickets',
    description:
      'Submit issues digitally, follow every stage of the workflow, and rate service quality after resolution.',
  },
]

const problemPoints = [
  'Random roommate allocation without compatibility signals',
  'No trusted campus ride-sharing system for students',
  'Maintenance requests still handled manually or informally',
  'No visibility into assignment status, delays, or closures',
  'Weak role-based access and limited operational control',
  'Fragmented tools that create duplicate work for admins',
]

const solutionFeatures = [
  {
    title: 'Smart compatibility scoring',
    description: 'Rank profiles by routines, habits, and expectations before a match request is sent.',
  },
  {
    title: 'Route and time recommendations',
    description: 'Suggest rides using location, travel windows, seat availability, and pickup distance.',
  },
  {
    title: 'Real-time GPS tracking',
    description: 'Keep passengers informed with live status, safe arrival check-ins, and route visibility.',
  },
  {
    title: 'Ticket workflow engine',
    description: 'Move issues from Submitted to Closed with assignment, escalation, and full audit history.',
  },
  {
    title: 'Payment and transaction records',
    description: 'Track ride-related payments and operational histories inside a single system view.',
  },
  {
    title: 'Admin insights and analytics',
    description: 'Monitor usage, resolve bottlenecks, and manage announcements from one dashboard.',
  },
]

const workflowSteps = [
  {
    step: '01',
    title: 'Register as a verified student',
    description: 'Create a trusted identity with institution-backed verification and secure onboarding.',
  },
  {
    step: '02',
    title: 'Set your preferences and profile',
    description: 'Define living habits, travel patterns, hostel details, and service preferences.',
  },
  {
    step: '03',
    title: 'Use the modules you need',
    description: 'Start matching, join or offer rides, and submit maintenance tickets from one interface.',
  },
  {
    step: '04',
    title: 'Track everything in your dashboard',
    description: 'Review requests, notifications, history, safety updates, and operational insights.',
  },
]

const roleCards = [
  {
    role: 'Student',
    summary: 'Find roommates, join rides, report issues, and manage personal activity from a single dashboard.',
  },
  {
    role: 'Driver',
    summary: 'Offer rides, manage seat inventory, monitor requests, and track earnings cleanly.',
  },
  {
    role: 'Technician / Staff',
    summary: 'Receive assigned tasks, update ticket stages, and keep service performance transparent.',
  },
  {
    role: 'Admin',
    summary: 'Control users, view analytics, publish updates, and enforce platform-wide rules.',
  },
]

const safetyHighlights = [
  'JWT authentication with secure session management',
  'Two-factor authentication and protected password recovery',
  'Ride safety check-ins when expected arrival windows are exceeded',
  'Reporting and blocking workflows for misuse or unsafe behavior',
  'Verified student-only access for a trusted community model',
]

const analyticsCards = [
  { label: 'Verified Users', value: '9,812', trend: '+8.4%' },
  { label: 'Open Tickets', value: '148', trend: '-12.1%' },
  { label: 'Active Rides Now', value: '64', trend: '+5.8%' },
]

const rideBars = [
  { label: '06:00', value: '34%' },
  { label: '09:00', value: '52%' },
  { label: '13:00', value: '68%' },
  { label: '18:00', value: '88%' },
  { label: '22:00', value: '41%' },
]

const priorityBreakdown = [
  { label: 'Low', value: '42%' },
  { label: 'Medium', value: '33%' },
  { label: 'High', value: '17%' },
  { label: 'Critical', value: '8%' },
]

function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <div className={`section-heading${center ? ' is-centered' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-copy">{description}</p>
    </div>
  )
}

function Home({ onNavigateToRide, onNavigateToPage, onNavigateToAuth }) {
  const navItems = [
    { label: 'Home', type: 'link', href: '#home' },
    { label: 'Roommates', type: 'link', href: '#roommates' },
    { label: 'Rides', type: 'button', onClick: onNavigateToRide },
    { label: 'Maintenance', type: 'link', href: '#maintenance' },
    { label: 'Dashboard', type: 'link', href: '#dashboard' },
  ]

  const actionItems = [
    { label: 'Login', type: 'button', variant: 'button-ghost', onClick: () => onNavigateToAuth('login') },
    {
      label: 'Register',
      type: 'button',
      variant: 'button-primary',
      onClick: () => onNavigateToAuth('register'),
    },
  ]

  return (
    <div className="home-page">
      <Header navItems={navItems} actionItems={actionItems} />

      <main className="home-shell">
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Smart Hostel Sharing & Ride Sharing System</p>
            <h1>
              Match smarter.
              <br />
              Ride safer.
              <br />
              Fix faster.
            </h1>
            <p className="hero-description">
              STAY & GO gives verified university students one secure place to match roommates,
              coordinate rides with live tracking, and manage hostel maintenance with full visibility.
            </p>

            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={() => onNavigateToAuth('register')}>
                Get Started
              </button>
              <button className="button button-outline" type="button" onClick={onNavigateToRide}>
                Open Ride Module
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-label">Vision</span>
                <strong>Create a safer, smarter student community.</strong>
              </div>
              <div className="trust-item">
                <span className="trust-label">Core Flow</span>
                <strong>Roommates, rides, maintenance, and admin insights in one system.</strong>
              </div>
            </div>
          </div>

          <aside className="hero-preview">
            <div className="preview-card preview-card-main">
              <div className="preview-header">
                <div>
                  <p className="panel-label">Live system snapshot</p>
                  <h3>Operational command view</h3>
                </div>
                <span className="status-pill">Online</span>
              </div>

              <div className="metric-grid">
                {heroStats.map((item) => (
                  <article className="metric-tile" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.note}</small>
                  </article>
                ))}
              </div>

              <div className="preview-footer">
                <div className="ring-widget" aria-hidden="true">
                  <div className="ring-widget-core">
                    <strong>94%</strong>
                    <span>safe trip confidence</span>
                  </div>
                </div>
                <div className="preview-list">
                  <div>
                    <span>Matching engine</span>
                    <strong>High compatibility in 2.6 min avg.</strong>
                  </div>
                  <div>
                    <span>Maintenance SLA</span>
                    <strong>82% resolved within target window.</strong>
                  </div>
                  <div>
                    <span>Campus rides</span>
                    <strong>Pickup precision maintained under 150m.</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-card preview-card-accent">
              <p className="panel-label">Security layer</p>
              <h3>Verified students only</h3>
              <p>
                Identity checks, role permissions, reporting tools, and automated ride safety
                prompts keep the network trusted.
              </p>
            </div>
          </aside>
        </section>

        <section className="value-line">
          {valueSignals.map((signal) => (
            <article className="signal-card" key={signal.title}>
              <strong>{signal.title}</strong>
              <p>{signal.description}</p>
            </article>
          ))}
        </section>

        <section className="section" aria-labelledby="value-heading">
          <SectionHeading
            eyebrow="Everything students need for hostel life"
            title="A modern platform built around the real campus experience"
            description="The system combines the three operational flows that matter most, without forcing students or staff to jump between disconnected tools."
          />

          <div className="card-grid three-up">
            {valueCards.map((card) => (
              <article className="feature-card" key={card.title}>
                <span className="feature-code">{card.code}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.code === 'RS' ? (
                  <button
                    className="feature-action"
                    type="button"
                    onClick={onNavigateToRide}
                  >
                    Go to ride screen
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="roommates">
          <div className="split-panel split-panel-light">
            <SectionHeading
              eyebrow="Why STAY & GO is needed"
              title="Traditional hostel systems leave students with friction and uncertainty"
              description="Daily operations slow down when roommate selection, transport, and maintenance depend on manual coordination."
            />

            <div className="problem-list">
              {problemPoints.map((point) => (
                <div className="problem-item" key={point}>
                  <span className="problem-dot" />
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="split-panel split-panel-dark" id="rides">
            <SectionHeading
              eyebrow="One centralized system"
              title="The solution connects matching, movement, and maintenance"
              description="Every module is designed to share identity, status, notifications, and analytics so the product feels unified."
            />

            <div className="solution-grid">
              {solutionFeatures.map((feature) => (
                <article className="solution-card" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section timeline-section" id="maintenance">
          <SectionHeading
            eyebrow="Simple workflow"
            title="From registration to daily use, every step stays clear"
            description="A structured onboarding and tracking flow keeps both students and staff aligned on the same system state."
            center
          />

          <div className="timeline-grid">
            {workflowSteps.map((item) => (
              <article className="timeline-card" key={item.step}>
                <span className="timeline-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Built for every role"
            title="Role-based access that matches how the campus actually operates"
            description="The interface keeps permissions clear while giving each role the exact actions and insights it needs."
          />

          <div className="card-grid four-up">
            {roleCards.map((card) => (
              <article className="role-card" key={card.role}>
                <p className="role-tag">{card.role}</p>
                <h3>{card.role}</h3>
                <p>{card.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section security-section">
          <div className="security-copy">
            <SectionHeading
              eyebrow="Safety first, always"
              title="Security is designed into the product, not added afterwards"
              description="Trust matters more in shared housing and shared travel. The platform uses layered controls to protect students and staff."
            />
          </div>

          <div className="security-grid">
            {safetyHighlights.map((item) => (
              <article className="security-card" key={item}>
                <span className="security-icon">+</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section analytics-section" id="dashboard">
          <SectionHeading
            eyebrow="Admin dashboard insights"
            title="Analytics that surface system health at a glance"
            description="A clean command layer helps admins understand demand, prioritize issues, and keep response times under control."
          />

          <div className="analytics-kpis">
            {analyticsCards.map((item) => (
              <article className="kpi-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.trend} vs last period</small>
              </article>
            ))}
          </div>

          <div className="analytics-grid" id="analytics">
            <article className="analytics-card">
              <div className="analytics-head">
                <div>
                  <p className="panel-label">Ticket priority breakdown</p>
                  <h3>Service queue balance</h3>
                </div>
                <span className="chart-badge">Donut</span>
              </div>

              <div className="donut-layout">
                <div className="donut-chart" aria-hidden="true">
                  <div className="donut-center">
                    <strong>148</strong>
                    <span>open tickets</span>
                  </div>
                </div>
                <div className="donut-legend">
                  {priorityBreakdown.map((item) => (
                    <div className="legend-row" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="analytics-card">
              <div className="analytics-head">
                <div>
                  <p className="panel-label">Rides by time</p>
                  <h3>Daily transport demand</h3>
                </div>
                <span className="chart-badge">Bar</span>
              </div>

              <div className="bar-chart">
                {rideBars.map((bar) => (
                  <div className="bar-column" key={bar.label}>
                    <div className="bar-track">
                      <span style={{ height: bar.value }} />
                    </div>
                    <small>{bar.label}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="analytics-card analytics-card-wide">
              <div className="analytics-head">
                <div>
                  <p className="panel-label">Matching success rate</p>
                  <h3>Compatibility outcomes over time</h3>
                </div>
                <span className="chart-badge">Line</span>
              </div>

              <div className="line-chart" aria-hidden="true">
                <div className="line-grid" />
                <svg viewBox="0 0 420 180" role="img" aria-label="Matching success trend">
                  <defs>
                    <linearGradient id="lineFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(186, 249, 26, 0.38)" />
                      <stop offset="100%" stopColor="rgba(186, 249, 26, 0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 138 C40 130, 60 118, 95 108 S160 72, 210 86 S300 48, 340 58 S390 36, 420 28"
                    fill="none"
                    stroke="#BAF91A"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 180 L0 138 C40 130, 60 118, 95 108 S160 72, 210 86 S300 48, 340 58 S390 36, 420 28 L420 180 Z"
                    fill="url(#lineFill)"
                  />
                </svg>
              </div>
            </article>
          </div>
        </section>

        <section className="section cta-section" id="cta">
          <div className="cta-card">
            <p className="eyebrow">Ready to upgrade hostel life?</p>
            <h2>Join a safer, smarter student community.</h2>
            <p>
              Launch with a modern platform where verified students can live better, move safer,
              and resolve issues faster.
            </p>
            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={() => onNavigateToAuth('register')}>
                Create Account
              </button>
              <button className="button button-outline" type="button" onClick={() => onNavigateToAuth('login')}>
                Login
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default Home
