import Footer from './footer'
import Header from './header'
import { useNavigate } from 'react-router-dom';

function InfoPage() {
  const navigate = useNavigate();
  const handleNavigateHome = () => navigate('/');
  const handleNavigateToRide = () => navigate('/rider');
  const handleNavigateToPage = (page) => {
    if (page === 'privacy') navigate('/info');
    else if (page === 'home') navigate('/');
    else if (page === 'register') navigate('/register');
    else if (page === 'login') navigate('/login');
    else navigate('/');
  };
  // Example static content for demo; replace with real props/data as needed
  const eyebrow = 'Privacy Policy';
  const title = 'Our Commitment to Your Privacy';
  const intro = 'We value your privacy and are committed to protecting your personal information.';
  const asideTitle = 'Quick Reference';
  const asideItems = ['Data Protection', 'User Rights', 'Contact Support'];
  const headerNavItems = [];
  const actionItems = [
    { label: 'Back to Home', type: 'button', variant: 'button-ghost', onClick: handleNavigateHome },
    {
      label: 'Open Ride Module',
      type: 'button',
      variant: 'button-primary',
      onClick: handleNavigateToRide,
    },
  ];
  // Add static details for demo
  const details = [
    'Your data is stored securely and never shared without consent.',
    'You can request deletion of your account at any time.',
    'Contact support for any privacy concerns or questions.'
  ];

  return (
    <div className="info-page">
      <Header
        navItems={headerNavItems}
        actionItems={actionItems}
        onBrandClick={handleNavigateHome}
        navAriaLabel="Policy navigation"
      />

      <main className="info-shell">
        <section className="info-hero">
          <div className="info-hero-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>

            <div className="hero-actions">
              <button className="button button-dark" type="button" onClick={handleNavigateHome}>
                Return Home
              </button>
              <button className="button button-outline" type="button" onClick={handleNavigateToRide}>
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

        <section className="section info-detail-section">
          <div className="section-heading">
            <p className="eyebrow">Details</p>
            <h2>Operational guidance</h2>
            <p className="section-copy">
              Each point below is written to keep expectations clear for students, drivers, staff, and admins.
            </p>
          </div>

          <div className="info-detail-grid">
            {(typeof details !== 'undefined' ? details : []).map((item, index) => (
              <article className="info-detail-card" key={item}>
                <span className="timeline-step">{`0${index + 1}`}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer onNavigateToPage={handleNavigateToPage} />
    </div>
  )
}

export default InfoPage
