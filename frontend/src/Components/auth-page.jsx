import Footer from './footer'
import Header from './header'

const authContent = {
  login: {
    eyebrow: 'Secure access',
    title: 'Return to your student operations workspace.',
    copy:
      'Log in to continue with roommate requests, active rides, maintenance tickets, and your personalized dashboard.',
    primaryLabel: 'Login',
    secondaryText: "Don't have an account yet?",
    secondaryAction: 'register',
    secondaryLabel: 'Create one',
  },
  register: {
    eyebrow: 'Verified onboarding',
    title: 'Create your STAY & GO account in a trusted flow.',
    copy:
      'Register as a verified student or approved staff member to access matching, ride safety tools, ticket workflows, and operational analytics.',
    primaryLabel: 'Register',
    secondaryText: 'Already have an account?',
    secondaryAction: 'login',
    secondaryLabel: 'Sign in',
  },
}

const authSignals = [
  'Verified student-only access model',
  'Protected account recovery and 2FA-ready flows',
  'Unified access for rides, matching, and maintenance',
]

function AuthPage({ mode, headerNavItems, onNavigateHome, onNavigateToRide, onNavigateToPage, onNavigateToAuth }) {
  const content = authContent[mode]

  const actionItems = [
    { label: 'Need Help', type: 'button', variant: 'button-ghost', onClick: () => onNavigateToPage('support') },
    {
      label: 'Open Ride Module',
      type: 'button',
      variant: 'button-primary',
      onClick: onNavigateToRide,
    },
  ]

  return (
    <div className="auth-page">
      <Header
        navItems={headerNavItems}
        actionItems={actionItems}
        onBrandClick={onNavigateHome}
        navAriaLabel="Authentication navigation"
      />

      <main className="auth-shell">
        <section className="auth-layout">
          <div className="auth-intro-card">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.copy}</p>

            <div className="auth-signal-list">
              {authSignals.map((item) => (
                <div className="auth-signal-row" key={item}>
                  <span className="security-icon">+</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="auth-form-card">
            <div className="auth-form-header">
              <p className="panel-label">{content.primaryLabel}</p>
              <h2>{content.primaryLabel} to STAY & GO</h2>
              <p>
                {mode === 'login'
                  ? 'Use your verified campus account to continue.'
                  : 'Start with the details needed for verification and secure onboarding.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
              {mode === 'register' ? (
                <>
                  <label className="auth-field">
                    <span>Full name</span>
                    <input type="text" placeholder="Enter your full name" />
                  </label>
                  <label className="auth-field">
                    <span>University email</span>
                    <input type="email" placeholder="name@university.edu" />
                  </label>
                </>
              ) : null}

              <label className="auth-field">
                <span>{mode === 'login' ? 'University email' : 'Username'}</span>
                <input
                  type={mode === 'login' ? 'email' : 'text'}
                  placeholder={mode === 'login' ? 'name@university.edu' : 'Choose a username'}
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input type="password" placeholder="Enter your password" />
              </label>

              {mode === 'register' ? (
                <label className="auth-field">
                  <span>Role</span>
                  <select defaultValue="student">
                    <option value="student">Student</option>
                    <option value="driver">Driver</option>
                    <option value="staff">Technician / Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              ) : null}

              <div className="auth-form-actions">
                <button className="button button-dark" type="submit">
                  {content.primaryLabel}
                </button>
                <button className="button button-outline" type="button" onClick={() => onNavigateToPage('privacy')}>
                  Review privacy
                </button>
              </div>
            </form>

            <div className="auth-switch-row">
              <p>{content.secondaryText}</p>
              <button
                className="feature-action"
                type="button"
                onClick={() => onNavigateToAuth(content.secondaryAction)}
              >
                {content.secondaryLabel}
              </button>
            </div>
          </section>
        </section>
      </main>

      <Footer onNavigateToPage={onNavigateToPage} />
    </div>
  )
}

export default AuthPage
