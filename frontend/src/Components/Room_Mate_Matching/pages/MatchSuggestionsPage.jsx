import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useIdentity } from '../contexts/DevIdentityContext';
import { getSuggestions, sendRequest } from '../api/matchingApi';

export default function MatchSuggestionsPage() {
    const { isProfileComplete, isRoomPrefComplete, isLocked } = useIdentity();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(null);

    useEffect(() => {
        if (!isProfileComplete || !isRoomPrefComplete) { setLoading(false); return; }
        fetchSuggestions();
    }, [isProfileComplete, isRoomPrefComplete]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const res = await getSuggestions();
            setSuggestions(res.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load suggestions');
        } finally { setLoading(false); }
    };

    const handleSend = async (studentId) => {
        setSending(studentId);
        try {
            await sendRequest(studentId);
            toast.success('Match request sent!');
            // Remove from suggestions list
            setSuggestions((prev) => prev.filter((s) => s.studentId !== studentId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        } finally { setSending(null); }
    };

    if (!isProfileComplete) {
        return (
            <div className="page">
                <h1 className="page-title">Find Matches</h1>
                <div className="alert alert-warning">Complete your profile first to see match suggestions.</div>
            </div>
        );
    }
    if (!isRoomPrefComplete) {
        return (
            <div className="page">
                <h1 className="page-title">Find Matches</h1>
                <div className="alert alert-warning">Set your room preference first to see match suggestions.</div>
            </div>
        );
    }
    if (isLocked) {
        return (
            <div className="page">
                <h1 className="page-title">Find Matches</h1>
                <div className="alert alert-info">You already have a locked roommate. Check the Final Result page.</div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="page-title">Find Matches</h1>
            <p className="page-subtitle">Compatible roommate suggestions based on your profile and preferences.</p>

            {loading && <div className="page-loading">Loading suggestions...</div>}

            {!loading && suggestions.length === 0 && (
                <div className="empty-state">
                    <p>No compatible matches found at the moment.</p>
                    <p className="text-muted">Check back later as more students set their preferences.</p>
                </div>
            )}

            <div className="match-cards">
                {suggestions.map((s) => (
                    <div key={s.studentId} className="match-card">
                        <div className="match-card-header">
                            <h3>{s.fullName}</h3>
                            <span className="match-score">{s.compatibilityScore}%</span>
                        </div>
                        <div className="match-card-body">
                            <div className="match-detail"><span>Gender</span><strong>{s.gender}</strong></div>
                            <div className="match-detail"><span>Age</span><strong>{s.age}</strong></div>
                            <div className="match-detail"><span>Sleep</span><strong>{s.sleepSchedule === 'EARLY_BIRD' ? 'Early Bird' : 'Night Owl'}</strong></div>
                            <div className="match-detail"><span>Cleanliness</span><strong>{s.cleanliness}/5</strong></div>
                            <div className="match-detail"><span>Social</span><strong>{s.socialHabits}</strong></div>
                            <div className="match-detail"><span>Study</span><strong>{s.studyHabits}</strong></div>
                            <div className="match-detail"><span>AC</span><strong>{s.roomPreference?.acType}</strong></div>
                            <div className="match-detail"><span>Position</span><strong>{s.roomPreference?.roomPosition}</strong></div>
                        </div>
                        <div className="match-card-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSend(s.studentId)}
                                disabled={sending === s.studentId}
                            >
                                {sending === s.studentId ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
