import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../contexts/DevIdentityContext';
import { getMyPair } from '../api/matchingApi';

export default function FinalResultPage() {
    const { profile, isLocked } = useIdentity();
    const [pair, setPair] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getMyPair()
            .then((res) => setPair(res.data.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page"><div className="page-loading">Loading...</div></div>;

    if (!pair) {
        return (
            <div className="page">
                <h1 className="page-title">Final Result</h1>
                <div className="empty-state">
                    <p>No locked roommate pair yet.</p>
                    <p className="text-muted">Complete the matching process to see your roommate here.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/matches')}>Find Matches</button>
                </div>
            </div>
        );
    }

    const isStudentA = pair.studentA?._id === profile?._id;
    const roommate = isStudentA ? pair.studentB : pair.studentA;

    return (
        <div className="page">
            <h1 className="page-title">Final Result</h1>
            <div className="result-card">
                <div className="result-badge">🔒 Roommate Locked</div>
                <h2>{roommate?.firstName} {roommate?.lastName}</h2>
                <p className="result-score">{pair.compatibilityScore}% Compatibility</p>

                <div className="result-details">
                    <div className="result-detail"><span>Gender</span><strong>{roommate?.gender}</strong></div>
                    <div className="result-detail"><span>Age</span><strong>{roommate?.age}</strong></div>
                    <div className="result-detail"><span>Sleep</span><strong>{roommate?.sleepSchedule === 'EARLY_BIRD' ? 'Early Bird' : 'Night Owl'}</strong></div>
                    <div className="result-detail"><span>Cleanliness</span><strong>{roommate?.cleanliness}/5</strong></div>
                    <div className="result-detail"><span>Social</span><strong>{roommate?.socialHabits}</strong></div>
                    <div className="result-detail"><span>Study</span><strong>{roommate?.studyHabits}</strong></div>
                </div>

                {/* WhatsApp revealed here — after lock */}
                <div className="result-whatsapp">
                    <h4>📱 WhatsApp Contact</h4>
                    <p className="whatsapp-number">{roommate?.whatsApp || 'Not available'}</p>
                </div>

                {pair.roomId && (
                    <div className="result-room">
                        <h4>🏠 Room Assignment</h4>
                        <p>Room: <strong>{pair.roomId.roomNumber}</strong></p>
                        <p>Block {pair.roomId.block}, Floor {pair.roomId.floor}</p>
                    </div>
                )}

                <div className="result-note">
                    <p><strong>Note:</strong> Roommate changes are not allowed directly after locking.
                        If you need to request a change, please submit an <a href="/issues">issue report</a>.</p>
                </div>
            </div>
        </div>
    );
}
