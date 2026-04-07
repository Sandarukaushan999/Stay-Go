import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';
import CampusMap from '../components/maps/CampusMap';
import useAuth from '../hooks/useAuth';
import { CAMPUSES, LIVE_MAP_UNIVERSITIES } from '../utils/constants';
import { loginSchema } from '../utils/validators';
import bikeIconImage from '../../../assets/bike.png';
import locationIconImage from '../../../assets/location.png';
import { listSafetyAlerts, subscribeSafetyAlerts } from '../services/safetyAlertService';
import { getMyNotifications } from '../services/notificationService';
import { onNewNotification } from '../services/trackingService';

const overviewMetrics = [
  { label: 'Active Riders', value: '1,284', delta: '+14.6%' },
  { label: 'Total Passengers', value: '8,942', delta: '+8.2%' },
  { label: 'Active Sessions', value: '156', delta: '+4.1%' },
  { label: 'Pending Incidents', value: '23', delta: '-2.6%' },
];

const initialDailyRideActivity = [
  { label: 'Mon', rides: 120, passengers: 340 },
  { label: 'Tue', rides: 145, passengers: 410 },
  { label: 'Wed', rides: 138, passengers: 385 },
  { label: 'Thu', rides: 168, passengers: 490 },
  { label: 'Fri', rides: 195, passengers: 560 },
  { label: 'Sat', rides: 92, passengers: 250 },
  { label: 'Sun', rides: 68, passengers: 190 },
];

function clampDailyValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomDelta(range) {
  return (Math.random() * 2 - 1) * range;
}

function buildDummyDailyActivity(previous = initialDailyRideActivity) {
  return initialDailyRideActivity.map((seed, index) => {
    const previousEntry = previous[index] || seed;

    return {
      label: seed.label,
      rides: clampDailyValue(Math.round(Number(previousEntry.rides || seed.rides) + randomDelta(26)), 60, 230),
      passengers: clampDailyValue(
        Math.round(Number(previousEntry.passengers || seed.passengers) + randomDelta(68)),
        170,
        590
      ),
    };
  });
}


const peakHoursActivity = [
  { label: '06:00', value: 28 },
  { label: '08:00', value: 46 },
  { label: '10:00', value: 58 },
  { label: '12:00', value: 51 },
  { label: '14:00', value: 66 },
  { label: '16:00', value: 39 },
  { label: '18:00', value: 24 },
  { label: '20:00', value: 18 },
  { label: '22:00', value: 12 },
];

const tripStatusDistribution = [
  { label: 'Completed', value: '57%', tone: 'stable' },
  { label: 'In Progress', value: '21%', tone: 'active' },
  { label: 'Pending', value: '14%', tone: 'pending' },
  { label: 'Late / Alerts', value: '8%', tone: 'warning' },
];

const emergencyAlerts = [
  { title: 'SOS Triggered', location: 'Main Gate Exit', level: 'critical', time: '3 min ago' },
  { title: 'Unresponsive Rider', location: 'Lake City Road', level: 'high', time: '12 min ago' },
  { title: 'Route Deviation', location: 'Engineering Block', level: 'medium', time: '18 min ago' },
];

const activeTrips = [
  {
    tripId: 'TR-0284',
    rider: 'James Akbar',
    passenger: 'Amelia Silva',
    route: 'Main Gate -> Science Block',
    eta: '8 min',
    status: 'started',
    alert: '-',
  },
  {
    tripId: 'TR-0276',
    rider: 'Chris Niro',
    passenger: 'Fatima Nauf',
    route: 'Hostel A -> Library',
    eta: '7 min',
    status: 'started',
    alert: 'Monitor',
  },
  {
    tripId: 'TR-0265',
    rider: 'Emadzie Tia',
    passenger: 'Grace Jayden',
    route: 'Admin -> Sports Complex',
    eta: '13 min',
    status: 'overdue',
    alert: 'Delay',
  },
  {
    tripId: 'TR-0262',
    rider: 'Tushka Ishara',
    passenger: 'Blessing Obi',
    route: 'Residential -> Hostel C',
    eta: '4 min',
    status: 'completed',
    alert: '-',
  },
  {
    tripId: 'TR-0258',
    rider: 'Kobe Anslay',
    passenger: 'Nigel Lin',
    route: 'Engineering -> Main Gate',
    eta: '9 min',
    status: 'accepted',
    alert: 'Watch',
  },
  {
    tripId: 'TR-0251',
    rider: 'Eroni Rush',
    passenger: 'Halina Musa',
    route: 'Depot -> Medical Center',
    eta: '6 min',
    status: 'started',
    alert: '-',
  },
];

const incidentReports = [
  { title: 'Minor Collision', detail: 'Engineering Road', severity: 'high', time: '10 min ago' },
  { title: 'Near Miss', detail: 'Main Avenue', severity: 'medium', time: '25 min ago' },
  { title: 'Brake Failure Report', detail: 'Hostel A Zone', severity: 'critical', time: '1 hr ago' },
  { title: 'Overspeeding Alert', detail: 'Lake Route', severity: 'medium', time: '2 hrs ago' },
];

const activityTimeline = [
  { event: 'Crash report filed', actor: 'Rider #34', time: 'Now' },
  { event: 'Rider approved', actor: 'Admin #12', time: '12 min ago' },
  { event: 'Trip started', actor: 'Rider #08', time: '22 min ago' },
  { event: 'Safety check completed', actor: 'Zone B', time: '38 min ago' },
  { event: 'User suspended', actor: 'Policy Validation', time: '1 hr ago' },
  { event: 'Route alert acknowledged', actor: 'Zone C', time: '2 hrs ago' },
];

const sidebarSections = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', icon: 'dashboard', type: 'section', value: 'dashboard-overview' }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Rider Management', icon: 'rider', type: 'route', value: '/admin/riders' },
      { label: 'Passenger Management', icon: 'passenger', type: 'route', value: '/admin/passengers' },
      { label: 'Trip Monitoring', icon: 'trip', type: 'section', value: 'trip-monitoring' },
    ],
  },
  {
    title: 'Safety',
    items: [
      { label: 'Incidents & Crashes', icon: 'incident', type: 'section', value: 'incidents-crashes' },
      { label: 'Route Monitoring', icon: 'route', type: 'section', value: 'route-monitoring' },
      { label: 'Safety Alerts', icon: 'shield', type: 'section', value: 'safety-alerts' },
    ],
  },
  {
    title: 'Analytics',
    items: [{ label: 'System Analytics', icon: 'analytics', type: 'section', value: 'system-analytics' }],
  },
  {
    title: 'System',
    items: [{ label: 'Settings & Access', icon: 'settings', type: 'route', value: '/admin/users' }],
  },
];

const dailyAxisValues = [600, 450, 300, 150, 0];
const DAILY_CHART = {
  width: 760,
  height: 280,
  yMax: 600,
  padding: { top: 24, right: 18, bottom: 34, left: 14 },
};

function indexToX(index, total, chart) {
  const plotWidth = chart.width - chart.padding.left - chart.padding.right;

  if (total <= 1) {
    return chart.padding.left;
  }

  return chart.padding.left + (index * plotWidth) / (total - 1);
}

function valueToY(value, chart) {
  const plotHeight = chart.height - chart.padding.top - chart.padding.bottom;
  const clamped = Math.min(Math.max(value, 0), chart.yMax);
  const ratio = clamped / chart.yMax;
  return chart.padding.top + (1 - ratio) * plotHeight;
}

function buildSmoothPath(points) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const controlX = previous.x + (point.x - previous.x) / 2;

    path += ` C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }

  return path;
}

function buildAreaPath(points, baselineY) {
  if (points.length === 0) {
    return '';
  }

  const curvePath = buildSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];

  return `${curvePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

function formatAlertRelativeTime(timestamp) {
  const parsed = Date.parse(timestamp || '');

  if (!Number.isFinite(parsed)) {
    return 'Now';
  }

  const diffMs = Math.max(0, Date.now() - parsed);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'Now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function alertLevelFromNotification(notification) {
  const payload = notification?.payload || {};
  const payloadLevel = String(payload.level || '').toLowerCase();

  if (['critical', 'high', 'medium', 'low'].includes(payloadLevel)) {
    return payloadLevel;
  }

  const type = String(notification?.type || '').toLowerCase();

  if (type.includes('sos')) {
    return 'critical';
  }

  if (type.includes('incident')) {
    return 'high';
  }

  return 'medium';
}

function mapNotificationToEmergencyAlert(notification) {
  if (!notification) {
    return null;
  }

  const payload = notification?.payload || {};
  const tripId = payload.tripId ? String(payload.tripId).slice(-8) : '';
  const rideId = payload.rideId ? String(payload.rideId).slice(-8) : '';
  const fallbackLocation =
    payload.location ||
    (tripId ? `Trip #${tripId}` : rideId ? `Ride #${rideId}` : 'Campus route');

  return {
    id: notification._id || notification.id || `alert-${tripId || rideId || Date.now()}`,
    title: notification.title || 'Emergency Alert',
    location: fallbackLocation,
    level: alertLevelFromNotification(notification),
    time: formatAlertRelativeTime(notification.createdAt),
    message: String(payload.sosMessage || notification.message || '').trim(),
    passengerName: payload.passengerName || '',
    createdAt: notification.createdAt || new Date().toISOString(),
  };
}

function SidebarIcon({ name }) {
  const iconMap = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.4" />
        <rect x="14" y="3" width="7" height="7" rx="1.4" />
        <rect x="3" y="14" width="7" height="7" rx="1.4" />
        <rect x="14" y="14" width="7" height="7" rx="1.4" />
      </>
    ),
    rider: (
      <>
        <circle cx="6" cy="17" r="2.4" />
        <circle cx="18" cy="17" r="2.4" />
        <path d="M8.5 17h5l2.5-6H11l-1.3-3H7" />
        <circle cx="14.8" cy="6" r="2" />
      </>
    ),
    passenger: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3.5 18.5c0-2.9 2.1-4.7 4.5-4.7s4.5 1.8 4.5 4.7" />
        <path d="M13.2 18.5c0-2.4 1.7-3.8 3.8-3.8s3.8 1.4 3.8 3.8" />
      </>
    ),
    trip: (
      <>
        <path d="M4 12.5 20 4l-3.3 16-3.9-5.3L8 16z" />
      </>
    ),
    incident: (
      <>
        <path d="M12 3.5 21 20H3z" />
        <path d="M12 9v5" />
        <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    route: (
      <>
        <path d="M6 5a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 6 5z" />
        <path d="M18 13.8a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z" />
        <path d="M7.8 8.7h4.3a3.8 3.8 0 0 1 0 7.6h-2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.6 19.5 6v5.7c0 4.3-2.7 7.7-7.5 8.8-4.8-1.1-7.5-4.5-7.5-8.8V6z" />
        <path d="M12 8.5v6" />
      </>
    ),
    analytics: (
      <>
        <path d="M4 20V9" />
        <path d="M10 20V5" />
        <path d="M16 20v-8" />
        <path d="M22 20v-4" />
        <path d="M3 20h20" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="2.8" />
        <path d="M12 3.7v2.2M12 18.1v2.2M20.3 12h-2.2M5.9 12H3.7M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
      </>
    ),
  };

  return (
    <span className="workspace-sidebar-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation">
        {iconMap[name]}
      </svg>
    </span>
  );
}

const RideSharingHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, error, isLoading } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] = React.useState('Dashboard');
  const [sidebarMode, setSidebarMode] = React.useState('full');
  const ridePageRef = React.useRef(null);
  const sidebarRef = React.useRef(null);
  const [journeyProgress, setJourneyProgress] = React.useState(0);
  const [journeyOverlayFrame, setJourneyOverlayFrame] = React.useState({ left: 12, width: 300 });
  const [liveEmergencyAlerts, setLiveEmergencyAlerts] = React.useState(() => listSafetyAlerts());
  const [serverEmergencyAlerts, setServerEmergencyAlerts] = React.useState([]);
  const [dailyRideActivity, setDailyRideActivity] = React.useState(() => initialDailyRideActivity);
  const routeAuthMessage = location?.state?.authMessage || '';

  const goToDashboardByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    if (role === 'rider') navigate('/rider/dashboard');
    if (role === 'passenger') navigate('/passenger/dashboard');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const loggedInUser = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (loggedInUser?.role) {
        goToDashboardByRole(loggedInUser.role);
      }
    } catch {
      // Error message is displayed from auth store.
    }
  };

  const handleSidebarAction = (item) => {
    setActiveSidebarItem(item.label);

    if (item.type === 'route') {
      navigate(item.value);
      return;
    }

    const target = document.getElementById(item.value);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToHome = () => {
    if (window.location.hash !== '#home') {
      window.location.hash = '#home';
      return;
    }

    const homeTarget = document.getElementById('home');

    if (homeTarget) {
      homeTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const clampProgress = (value) => Math.min(1, Math.max(0, value));
    let ticking = false;

    const updateProgress = () => {
      const pageNode = ridePageRef.current;

      if (!pageNode) {
        return;
      }

      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const sectionTop = pageNode.offsetTop;
      const sectionHeight = pageNode.offsetHeight;
      const animationStart = Math.max(0, sectionTop - viewportHeight * 0.2);
      const animationDistance = Math.max(620, sectionHeight * 0.9);
      const rawProgress = (scrollTop - animationStart) / animationDistance;
      const nextProgress = clampProgress(rawProgress);

      setJourneyProgress((previous) => {
        if (Math.abs(previous - nextProgress) < 0.005) {
          return previous;
        }

        return nextProgress;
      });
    };

    const onScrollOrResize = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);
  React.useEffect(() => {
    const getFallbackWidth = () => (sidebarMode === 'icon' ? 220 : 300);

    const updateOverlayFrame = () => {
      const sidebarNode = sidebarRef.current;

      if (!sidebarNode) {
        const fallbackWidth = getFallbackWidth();
        setJourneyOverlayFrame((previous) => {
          if (Math.abs(previous.left - 12) < 0.5 && Math.abs(previous.width - fallbackWidth) < 0.5) {
            return previous;
          }

          return { left: 12, width: fallbackWidth };
        });
        return;
      }

      const rect = sidebarNode.getBoundingClientRect();
      const nextLeft = Math.max(8, rect.left);
      const nextWidth = Math.max(getFallbackWidth(), rect.width);

      setJourneyOverlayFrame((previous) => {
        if (Math.abs(previous.left - nextLeft) < 0.5 && Math.abs(previous.width - nextWidth) < 0.5) {
          return previous;
        }

        return { left: nextLeft, width: nextWidth };
      });
    };

    updateOverlayFrame();

    const onResize = () => {
      window.requestAnimationFrame(updateOverlayFrame);
    };

    window.addEventListener('resize', onResize);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && sidebarRef.current) {
      resizeObserver = new ResizeObserver(() => updateOverlayFrame());
      resizeObserver.observe(sidebarRef.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [sidebarMode]);

  React.useEffect(() => {
    setLiveEmergencyAlerts(listSafetyAlerts());

    const unsubscribe = subscribeSafetyAlerts((alert) => {
      if (!alert) {
        return;
      }

      setLiveEmergencyAlerts((previous) => [alert, ...previous.filter((item) => item.id !== alert.id)].slice(0, 8));
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      setServerEmergencyAlerts([]);
      return undefined;
    }

    let active = true;

    const loadAdminEmergencyAlerts = async () => {
      try {
        const notifications = await getMyNotifications();

        if (!active) {
          return;
        }

        const mapped = notifications
          .filter((notification) => {
            const type = String(notification?.type || '').toLowerCase();
            return type.includes('safety') || type.includes('incident') || type.includes('admin');
          })
          .map((notification) => mapNotificationToEmergencyAlert(notification))
          .filter(Boolean);

        setServerEmergencyAlerts(mapped.slice(0, 20));
      } catch {
        if (active) {
          setServerEmergencyAlerts([]);
        }
      }
    };

    loadAdminEmergencyAlerts();

    const unsubscribe = onNewNotification((notification) => {
      if (!notification) {
        return;
      }

      const mapped = mapNotificationToEmergencyAlert(notification);

      if (!mapped) {
        return;
      }

      setServerEmergencyAlerts((previous) =>
        [mapped, ...previous.filter((item) => item.id !== mapped.id)].slice(0, 20)
      );
    });

    const refreshTimer = window.setInterval(loadAdminEmergencyAlerts, 30000);

    return () => {
      active = false;
      unsubscribe?.();
      window.clearInterval(refreshTimer);
    };
  }, [user?.id, user?.role]);
  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setDailyRideActivity((previous) => buildDummyDailyActivity(previous));
    }, 10000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const dailyLabels = dailyRideActivity.map((item) => item.label);
  const totalPoints = dailyRideActivity.length;
  const chartBaseline = valueToY(0, DAILY_CHART);

  const ridesPoints = dailyRideActivity.map((item, index) => ({
    x: indexToX(index, totalPoints, DAILY_CHART),
    y: valueToY(item.rides, DAILY_CHART),
  }));

  const passengerPoints = dailyRideActivity.map((item, index) => ({
    x: indexToX(index, totalPoints, DAILY_CHART),
    y: valueToY(item.passengers, DAILY_CHART),
  }));

  const journeyBikePosition = 6 + journeyProgress * 88;
  const journeyBikeLift = Math.sin(journeyProgress * Math.PI * 2.5) * -2.5;
  const journeyLineProgress = Math.min(1, Math.max(0, journeyProgress));
  const mergedEmergencyAlerts = React.useMemo(() => {
    const seen = new Set();
    const combined = [...serverEmergencyAlerts, ...liveEmergencyAlerts, ...emergencyAlerts];

    return combined
      .filter((alert) => {
        const key = alert.id || `${alert.title}-${alert.location}-${alert.time}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }, [serverEmergencyAlerts, liveEmergencyAlerts]);

  return (
    <div className="ride-page" ref={ridePageRef}>
      <div
        className="workspace-scroll-journey-background"
        aria-hidden="true"
        style={{
          left: `${journeyOverlayFrame.left}px`,
          width: `${journeyOverlayFrame.width}px`,
        }}
      >
        <div
          className="workspace-scroll-journey"
          style={{
            '--journey-bike-position': `${journeyBikePosition}%`,
            '--journey-bike-lift': `${journeyBikeLift}px`,
            '--journey-line-progress': journeyLineProgress.toFixed(3),
          }}
        >
          <span className="workspace-journey-line workspace-journey-line-base" />

          <img className="workspace-journey-bike" src={bikeIconImage} alt="" />
          <img className="workspace-journey-target" src={locationIconImage} alt="" />
        </div>
      </div>

      <main className="page-shell workspace-page-shell">
        <div className={`workspace-layout ${sidebarMode === 'icon' ? 'is-icon-only' : 'is-expanded'}`}>
          <aside className="panel workspace-sidebar" aria-label="Workspace navigation" ref={sidebarRef}>
            <div className="workspace-sidebar-toolbar">
              <p className="workspace-sidebar-mode-label">Navigation</p>
              <div className="workspace-sidebar-toggle-group" role="group" aria-label="Sidebar display mode">
                <button
                  className={`workspace-sidebar-toggle${sidebarMode === 'full' ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setSidebarMode('full')}
                  title="Icon + Text mode"
                  aria-label="Use icon and text sidebar"
                >
                  Both
                </button>
                <button
                  className={`workspace-sidebar-toggle${sidebarMode === 'icon' ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setSidebarMode('icon')}
                  title="Icons only mode"
                  aria-label="Use icons only sidebar"
                >
                  Icons
                </button>
              </div>
            </div>

            <div className="workspace-sidebar-body">
              {sidebarSections.map((section) => (
                <section className="workspace-sidebar-group" key={section.title}>
                  <p className="workspace-sidebar-title">{section.title}</p>

                  <div className="workspace-sidebar-links">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        className={`workspace-sidebar-link${activeSidebarItem === item.label ? ' is-active' : ''}`}
                        type="button"
                        onClick={() => handleSidebarAction(item)}
                        title={item.label}
                        aria-label={item.label}
                      >
                        <SidebarIcon name={item.icon} />
                        <span className="workspace-sidebar-text">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </aside>

          <div className="workspace-main-stack">
            <section className="hero-panel workspace-hero-panel" id="dashboard-overview">
              <div>
                <p className="eyebrow">Ride Sharing Workspace</p>
                <h1>Stay-Go Ride Sharing</h1>
                <p>OpenStreetMap + OSRM campus ride management with rider, passenger, and admin roles.</p>
              </div>

              <div className="workspace-hero-tags">
                <span className="workspace-tag">OpenStreetMap</span>
                <span className="workspace-tag">OSRM Routing</span>
                <span className="workspace-tag">Campus Safety</span>
                <span className={`workspace-tag ${user ? 'is-active' : ''}`}>
                  {user ? `Signed in: ${user.role}` : 'Guest mode'}
                </span>
              </div>
              <button
                className="workspace-back-home-button"
                type="button"
                onClick={handleBackToHome}
                title="Back to Home"
                aria-label="Back to Home"
              >
                <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                  <path d="M14.5 6.5 9 12l5.5 5.5" />
                </svg>
              </button>
            </section>

            <section className="workspace-metric-grid">
              {overviewMetrics.map((metric) => (
                <article className="panel workspace-metric-card" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small className={metric.delta.startsWith('-') ? 'is-negative' : 'is-positive'}>{metric.delta}</small>
                </article>
              ))}
            </section>

            <section className="workspace-core-grid">
              <div className="workspace-auth-stack">
                <section className="panel workspace-login-panel">
                  <h2>Login</h2>
                  <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
                    <AppInput label="Email" error={errors.email?.message} {...register('email')} />
                    <AppInput
                      label="Password"
                      type="password"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    {routeAuthMessage ? <p className="app-error">{routeAuthMessage}</p> : null}
                    {error ? <p className="app-error">{error}</p> : null}
                    <AppButton type="submit" disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </AppButton>
                  </form>
                </section>

                <section className="panel workspace-quick-panel">
                  <h3>Quick Navigation</h3>
                  <div className="button-row">
                    <AppButton onClick={() => navigate('/rider/register')}>Rider Register</AppButton>
                    <AppButton variant="secondary" onClick={() => navigate('/passenger/register')}>
                      Passenger Register
                    </AppButton>
                    <AppButton variant="ghost" onClick={() => navigate('/trip/history')}>
                      Trip History
                    </AppButton>
                    {user ? (
                      <AppButton variant="success" onClick={() => goToDashboardByRole(user.role)}>
                        Go To {user.role} Dashboard
                      </AppButton>
                    ) : null}
                  </div>
                </section>

                <section className="panel credentials-panel workspace-credentials-panel">
                  <h3>Seed Credentials</h3>
                  <p>Admin (from backend .env): admin@gmail.com / admin123</p>
                  <p>Rider: rider@staygo.local / Rider@12345</p>
                  <p>Passenger: passenger@staygo.local / Passenger@12345</p>
                  <p>Use your backend .env values if admin credentials were changed.</p>
                </section>
              </div>

              <div className="workspace-monitor-stack">
                <section className="panel workspace-chart-panel" id="system-analytics">
                  <div className="panel-head workspace-chart-head">
                    <div>
                      <h3>Daily Ride Activity</h3>
                      <p>Rides & passengers this week</p>
                    </div>

                    <div className="workspace-chart-mode-tabs" aria-label="Ride chart interval">
                      <button className="workspace-mode-pill is-active" type="button">
                        Week
                      </button>
                      <button className="workspace-mode-pill" type="button">
                        Month
                      </button>
                      <button className="workspace-mode-pill" type="button">
                        Year
                      </button>
                    </div>
                  </div>

                  <div
                    className="workspace-line-chart-layout"
                    role="img"
                    aria-label="Weekly ride and passenger activity line chart"
                  >
                    <div className="workspace-chart-y-axis" aria-hidden="true">
                      {dailyAxisValues.map((value) => (
                        <span key={value}>{value}</span>
                      ))}
                    </div>

                    <div className="workspace-line-chart-canvas">
                      <svg
                        className="workspace-line-chart-svg"
                        viewBox={`0 0 ${DAILY_CHART.width} ${DAILY_CHART.height}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="workspacePassengersFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(134, 92, 255, 0.25)" />
                            <stop offset="100%" stopColor="rgba(134, 92, 255, 0)" />
                          </linearGradient>
                          <linearGradient id="workspaceRidesFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(22, 160, 255, 0.24)" />
                            <stop offset="100%" stopColor="rgba(22, 160, 255, 0)" />
                          </linearGradient>
                        </defs>

                        {dailyAxisValues.map((value) => {
                          const y = valueToY(value, DAILY_CHART);

                          return (
                            <line
                              key={`grid-y-${value}`}
                              x1={DAILY_CHART.padding.left}
                              y1={y}
                              x2={DAILY_CHART.width - DAILY_CHART.padding.right}
                              y2={y}
                              className="workspace-grid-line"
                            />
                          );
                        })}

                        {dailyRideActivity.map((item, index) => {
                          const x = indexToX(index, totalPoints, DAILY_CHART);

                          return (
                            <line
                              key={`grid-x-${item.label}`}
                              x1={x}
                              y1={DAILY_CHART.padding.top}
                              x2={x}
                              y2={chartBaseline}
                              className="workspace-grid-line vertical"
                            />
                          );
                        })}

                        <path d={buildAreaPath(passengerPoints, chartBaseline)} fill="url(#workspacePassengersFill)" />
                        <path d={buildAreaPath(ridesPoints, chartBaseline)} fill="url(#workspaceRidesFill)" />

                        <path d={buildSmoothPath(passengerPoints)} className="workspace-passenger-line" />
                        <path d={buildSmoothPath(ridesPoints)} className="workspace-rides-line" />


                      </svg>
                      <div className="workspace-chart-x-axis" aria-hidden="true">
                        {dailyLabels.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="workspace-monitor-row">
                  <article className="panel workspace-peak-panel" id="peak-hours-analysis">
                    <div className="panel-head">
                      <div>
                        <h3>Peak Hours Analysis</h3>
                        <p>Live</p>
                      </div>
                    </div>

                    <div className="workspace-pill-chart" role="img" aria-label="Peak hours bar chart from 06:00 to 22:00">
                      {peakHoursActivity.map((item) => (
                        <div className="workspace-pill-column" key={item.label}>
                          <div className="workspace-pill-track">
                            <span style={{ height: `${item.value}%` }} />
                          </div>
                          <small>{item.label}</small>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="panel workspace-status-panel">
                    <h3>Trip Status</h3>
                    <p>Current Distribution</p>
                    <div className="workspace-status-list">
                      {tripStatusDistribution.map((item) => (
                        <div className="workspace-status-row" key={item.label}>
                          <span>{item.label}</span>
                          <strong className={`tone-${item.tone}`}>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </div>
            </section>

            <section className="workspace-map-alert-grid">
              <article className="panel workspace-map-panel" id="route-monitoring">
                <div className="panel-head">
                  <h3>Live Ride Map</h3>
                  <div className="workspace-chip-row">
                    <span className="workspace-chip">Active</span>
                    <span className="workspace-chip">Delayed</span>
                  </div>
                </div>
                <CampusMap campuses={LIVE_MAP_UNIVERSITIES} center={[7.8731, 80.7718]} zoom={7} />
              </article>

              <article className="panel workspace-alerts-panel" id="safety-alerts">
                <div className="panel-head">
                  <h3>Emergency Alerts</h3>
                  <span className="workspace-alert-count">{mergedEmergencyAlerts.length}</span>
                </div>
                <div className="workspace-alert-list">
                  {mergedEmergencyAlerts.map((alert) => (
                    <article className="workspace-alert-item" key={alert.id || `${alert.title}-${alert.location}-${alert.time}`}>
                      <div>
                        <strong>{alert.title}</strong>
                        <p>{alert.location}</p>
                        {alert.passengerName ? <small>Passenger: {alert.passengerName}</small> : null}
                        {alert.message ? <small>Note: {alert.message}</small> : null}
                      </div>
                      <div>
                        <span className={`workspace-severity severity-${alert.level}`}>{alert.level}</span>
                        <small>{alert.time}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </section>

            <section className="panel workspace-monitor-table-panel" id="trip-monitoring">
              <div className="panel-head">
                <h3>Active Trip Monitoring</h3>
                <div className="workspace-chip-row">
                  <span className="workspace-chip">All</span>
                  <span className="workspace-chip">Active</span>
                  <span className="workspace-chip">Delayed</span>
                </div>
              </div>

              <div className="table-wrap workspace-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Rider</th>
                      <th>Passenger</th>
                      <th>Route</th>
                      <th>ETA</th>
                      <th>Status</th>
                      <th>Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTrips.map((trip) => (
                      <tr key={trip.tripId}>
                        <td>{trip.tripId}</td>
                        <td>{trip.rider}</td>
                        <td>{trip.passenger}</td>
                        <td>{trip.route}</td>
                        <td>{trip.eta}</td>
                        <td>
                          <span className={`status-badge status-${trip.status}`}>{trip.status}</span>
                        </td>
                        <td>{trip.alert}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="workspace-bottom-grid">
              <article className="panel workspace-incident-panel" id="incidents-crashes">
                <div className="panel-head">
                  <h3>Incident Reports</h3>
                  <span className="workspace-alert-count">{incidentReports.length}</span>
                </div>
                <div className="workspace-feed-list">
                  {incidentReports.map((report) => (
                    <article className="workspace-feed-item" key={`${report.title}-${report.time}`}>
                      <div>
                        <strong>{report.title}</strong>
                        <p>{report.detail}</p>
                      </div>
                      <div>
                        <span className={`workspace-severity severity-${report.severity}`}>{report.severity}</span>
                        <small>{report.time}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </article>

              <article className="panel workspace-timeline-panel">
                <h3>Activity Timeline</h3>
                <div className="workspace-timeline-list">
                  {activityTimeline.map((item) => (
                    <article className="workspace-timeline-item" key={`${item.event}-${item.time}`}>
                      <p>{item.event}</p>
                      <small>
                        {item.actor} - {item.time}
                      </small>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RideSharingHomePage;

