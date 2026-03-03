import { useEffect, useState } from 'react'
import AuthPage from './Components/auth-page'
import Home from './Components/home'
import InfoPage from './Components/info-page'
import RideSharing from './Components/ride&sharing'

const hashToScreen = {
  '#home': 'home',
  '#ride-sharing': 'ride',
  '#privacy': 'privacy',
  '#terms': 'terms',
  '#support': 'support',
  '#contact': 'contact',
  '#login': 'login',
  '#register': 'register',
}

const screenToHash = {
  home: '#home',
  ride: '#ride-sharing',
  privacy: '#privacy',
  terms: '#terms',
  support: '#support',
  contact: '#contact',
  login: '#login',
  register: '#register',
}

const pageCatalog = {
  privacy: {
    id: 'privacy',
    eyebrow: 'Privacy',
    title: 'Your hostel and ride data stays protected by design.',
    intro:
      'STAY & GO collects only the information needed to support verified student access, matching accuracy, ride safety, and hostel operations.',
    highlights: [
      {
        label: 'Collected data',
        text: 'Student identity, profile preferences, ride activity, maintenance requests, and security logs.',
      },
      {
        label: 'How it is used',
        text: 'To match roommates, manage rides, monitor safety, resolve tickets, and improve service quality.',
      },
      {
        label: 'Access control',
        text: 'Role-based permissions ensure students, drivers, staff, and admins only see what they need.',
      },
    ],
    details: [
      'Personal data is limited to verified operational use cases inside the STAY & GO system.',
      'Ride and maintenance histories are retained to support accountability, dispute handling, and service monitoring.',
      'Sensitive operations such as password recovery, account verification, and safety escalation are logged securely.',
      'Students can request support when profile information needs correction or access needs review.',
    ],
    asideTitle: 'Privacy commitments',
    asideItems: [
      'Verified student-only access model',
      'Secure authentication and recovery flows',
      'Audit visibility for critical actions',
      'Minimal data exposure by user role',
    ],
  },
  terms: {
    id: 'terms',
    eyebrow: 'Terms',
    title: 'A clear operating agreement for every user role.',
    intro:
      'These terms define how students, drivers, hostel staff, and administrators use STAY & GO safely and responsibly.',
    highlights: [
      {
        label: 'Eligibility',
        text: 'Access is intended for verified university users and approved operational staff only.',
      },
      {
        label: 'User conduct',
        text: 'Users must provide accurate information, respect safety rules, and avoid misuse of ride or roommate tools.',
      },
      {
        label: 'Platform authority',
        text: 'Administrators may review reports, restrict accounts, and take action when policies are violated.',
      },
    ],
    details: [
      'Users are responsible for keeping credentials secure and reporting suspicious account activity immediately.',
      'Ride offers, ride requests, and maintenance tickets must reflect real operational needs and accurate details.',
      'Abuse, harassment, false reporting, or unsafe transport behavior may result in account suspension or removal.',
      'STAY & GO may evolve workflows and features to improve student safety, platform reliability, and hostel operations.',
    ],
    asideTitle: 'What users agree to',
    asideItems: [
      'Provide accurate profile and activity data',
      'Use the platform only for legitimate campus needs',
      'Follow safety and reporting procedures',
      'Accept admin moderation when policy issues occur',
    ],
  },
  support: {
    id: 'support',
    eyebrow: 'Support',
    title: 'Help channels designed for students, drivers, and staff.',
    intro:
      'Support should be fast, structured, and easy to reach. STAY & GO centralizes operational help so users know exactly where to go.',
    highlights: [
      {
        label: 'Account support',
        text: 'Verification issues, login recovery, role corrections, and profile access requests.',
      },
      {
        label: 'Ride support',
        text: 'Trip disputes, missed pickups, live ride concerns, and safety follow-up actions.',
      },
      {
        label: 'Hostel support',
        text: 'Ticket escalation, maintenance delays, technician coordination, and closure feedback.',
      },
    ],
    details: [
      'Primary support queue hours: Monday to Friday, 8:00 AM to 6:00 PM.',
      'Urgent ride safety matters should be escalated immediately through the in-app emergency workflow.',
      'General system issues can be reviewed through admin support and technical operations channels.',
      'Students should include route, request ID, or ticket ID when asking for faster resolution.',
    ],
    asideTitle: 'Recommended support flow',
    asideItems: [
      'Check your dashboard status first',
      'Submit a structured support request',
      'Escalate urgent safety issues immediately',
      'Track updates through the app history view',
    ],
  },
  contact: {
    id: 'contact',
    eyebrow: 'Contact',
    title: 'Reach the STAY & GO operations team through the right channel.',
    intro:
      'Different operational issues need different owners. Use the right contact point to reduce delays and keep responses structured.',
    highlights: [
      {
        label: 'General inquiries',
        text: 'support@stayandgo.edu for onboarding, product guidance, and standard user questions.',
      },
      {
        label: 'Safety desk',
        text: 'safety@stayandgo.edu for urgent ride-related concerns, reports, and follow-up actions.',
      },
      {
        label: 'Admin coordination',
        text: 'admin@stayandgo.edu for role management, reporting, and institutional coordination.',
      },
    ],
    details: [
      'Operational support line: +94 11 555 0148',
      'Campus transport desk: +94 11 555 0166',
      'Hostel maintenance coordination: +94 11 555 0184',
      'Office hours: Monday to Friday, 8:00 AM to 6:00 PM',
    ],
    asideTitle: 'Before you contact us',
    asideItems: [
      'Include your university email address',
      'Mention your user role and issue type',
      'Share ride IDs or ticket references when available',
      'Use the safety desk immediately for active emergencies',
    ],
  },
}

function getScreenFromHash(hash) {
  return hashToScreen[hash] ?? 'home'
}

function App() {
  const [screen, setScreen] = useState(() => getScreenFromHash(window.location.hash))

  useEffect(() => {
    function handleHashChange() {
      setScreen(getScreenFromHash(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  function navigateTo(nextScreen) {
    const nextHash = screenToHash[nextScreen] ?? '#home'

    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash
    }

    setScreen(nextScreen)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'ride') {
    return (
      <RideSharing
        onNavigateHome={() => navigateTo('home')}
        onNavigateToPage={navigateTo}
      />
    )
  }

  if (pageCatalog[screen]) {
    return (
      <InfoPage
        {...pageCatalog[screen]}
        onNavigateHome={() => navigateTo('home')}
        onNavigateToRide={() => navigateTo('ride')}
        onNavigateToPage={navigateTo}
      />
    )
  }

  if (screen === 'login' || screen === 'register') {
    return (
      <AuthPage
        mode={screen}
        onNavigateHome={() => navigateTo('home')}
        onNavigateToRide={() => navigateTo('ride')}
        onNavigateToPage={navigateTo}
        onNavigateToAuth={navigateTo}
      />
    )
  }

  return (
    <Home
      onNavigateToRide={() => navigateTo('ride')}
      onNavigateToPage={navigateTo}
      onNavigateToAuth={navigateTo}
    />
  )
}

export default App
