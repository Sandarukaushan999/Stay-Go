import logo from '../../assets/logo.png'

const footerColumns = [
  {
    title: 'Modules',
    links: [
      { label: 'Roommate Matching', type: 'hash', value: '#roommates' },
      { label: 'Ride Sharing', type: 'hash', value: '#ride-sharing' },
      { label: 'Maintenance Tickets', type: 'hash', value: '#maintenance' },
      { label: 'Admin Dashboard', type: 'hash', value: '#dashboard' },
      { label: 'Live Analytics', type: 'hash', value: '#analytics' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Home', type: 'screen', value: 'home' },
      { label: 'Login', type: 'screen', value: 'login' },
      { label: 'Register', type: 'screen', value: 'register' },
      { label: 'Campus Safety', type: 'screen', value: 'support' },
      { label: 'Contact', type: 'screen', value: 'contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Privacy Policy', type: 'screen', value: 'privacy' },
      { label: 'Terms of Service', type: 'screen', value: 'terms' },
      { label: 'Support Center', type: 'screen', value: 'support' },
      { label: 'Ride Module', type: 'screen', value: 'ride' },
      { label: 'Help Desk', type: 'screen', value: 'contact' },
    ],
  },
]

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.3 7a2 2 0 0 0-.05-4ZM20.44 12.7c0-3.32-1.77-4.87-4.13-4.87a3.57 3.57 0 0 0-3.2 1.76V8.5H9.73c.04.72 0 11.5 0 11.5h3.38v-6.42c0-.34.03-.68.12-.92.27-.68.87-1.38 1.9-1.38 1.34 0 1.87 1.02 1.87 2.52V20H20.4v-7.3h.04Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.84-.25 7.16 5.46 7.16-5.46H4.84Zm14.66 11V8.47l-6.59 5.02a1.5 1.5 0 0 1-1.82 0L4.5 8.47v9.03h15Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.25 4.5 5.08v5.66c0 4.67 3.18 8.91 7.5 10.01 4.32-1.1 7.5-5.34 7.5-10V5.08L12 2.25Zm3.53 6.85-4.15 4.9a1 1 0 0 1-1.49.06l-1.94-1.94 1.06-1.06 1.17 1.17 3.32-3.93 2.03.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Footer({ onNavigateToPage }) {
  function handleClick(type, value) {
    if (type === 'hash') {
      window.location.hash = value
      return
    }

    onNavigateToPage(value)
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-surface">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <img className="brand-logo footer-logo" src={logo} alt="Stay and Go" />
            <p>
              STAY & GO is a secure student platform for roommate matching, ride sharing, hostel
              maintenance, and role-based campus operations.
            </p>
            <div className="site-footer-socials" aria-label="Community and support links">
              <button className="social-button" type="button" onClick={() => onNavigateToPage('contact')}>
                <LinkedInIcon />
              </button>
              <button className="social-button" type="button" onClick={() => onNavigateToPage('support')}>
                <ShieldIcon />
              </button>
              <button className="social-button" type="button" onClick={() => onNavigateToPage('contact')}>
                <MailIcon />
              </button>
            </div>
          </div>

          <div className="site-footer-columns">
            {footerColumns.map((column) => (
              <section className="site-footer-column" key={column.title}>
                <h3>{column.title}</h3>
                <div className="site-footer-links">
                  {column.links.map((link) => (
                    <button
                      key={link.label}
                      className="site-footer-link"
                      type="button"
                      onClick={() => handleClick(link.type, link.value)}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>&copy; 2026 STAY & GO. All rights reserved.</p>
          <p>Built for verified students, trusted mobility, and transparent hostel operations.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
