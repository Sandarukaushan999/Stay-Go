import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../contexts/DevIdentityContext';
import { getMyPair } from '../api/matchingApi';
import { getSentRequests, getReceivedRequests } from '../api/matchingApi';
import './Dashboard.css';

export default function Dashboard() {
    const { profile, isProfileComplete, isRoomPrefComplete, isLocked, loading } = useIdentity();
    const [pair, setPair] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLocked) {
            getMyPair().then((r) => setPair(r.data.data)).catch(() => { });
        }
        if (isRoomPrefComplete) {
            getReceivedRequests()
                .then((r) => {
                    const pending = (r.data.data || []).filter((req) => req.status === 'PENDING');
                    setPendingCount(pending.length);
                })
                .catch(() => { });
        }
    }, [isLocked, isRoomPrefComplete]);

    if (loading) return <div className="page-loading">Loading...</div>;
    if (!profile) return <div className="page-empty">No profile loaded. Check your Student ID.</div>;

    const getNextStep = () => {
        if (!isProfileComplete) return { label: 'Complete Profile', path: '/profile' };
        if (!isRoomPrefComplete) return { label: 'Set Room Preference', path: '/room-preference' };
        if (!isLocked) return { label: 'Find Matches', path: '/matches' };
        return null;
    };
    const nextStep = getNextStep();

    return (
        <div className="dashboard">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome, {profile.firstName}! Here's your progress.</p>

            <div className="dash-cards">
                <div className={`dash-card ${isProfileComplete ? 'complete' : 'incomplete'}`}>
                    <h3>Profile</h3>
                    <p>{isProfileComplete ? '✅ Completed' : '⏳ Incomplete'}</p>
                </div>
                <div className={`dash-card ${isRoomPrefComplete ? 'complete' : 'incomplete'}`}>
                    <h3>Room Preference</h3>
                    <p>{isRoomPrefComplete ? '✅ Completed' : '⏳ Incomplete'}</p>
                </div>
                <div className={`dash-card ${isLocked ? 'complete' : ''}`}>
                    <h3>Roommate</h3>
                    <p>{isLocked ? '🔒 Locked' : 'No pair yet'}</p>
                </div>
                <div className="dash-card">
                    <h3>Pending Requests</h3>
                    <p className="dash-big-number">{pendingCount}</p>
                </div>
            </div>

            {isLocked && pair && (
                <div className="dash-pair-summary">
                    <h3>Your Roommate</h3>
                    <p>
                        <strong>
                            {pair.studentA._id === profile._id
                                ? `${pair.studentB.firstName} ${pair.studentB.lastName}`
                                : `${pair.studentA.firstName} ${pair.studentA.lastName}`}
                        </strong>{' '}
                        — {pair.compatibilityScore}% match
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/final-result')}>
                        View Details
                    </button>
                </div>
            )}

            {nextStep && (
                <div className="dash-next-step">
                    <p>Your next step:</p>
                    <button className="btn btn-primary" onClick={() => navigate(nextStep.path)}>
                        {nextStep.label} →
                    </button>
                </div>
            )}
        </div>
    );
}
