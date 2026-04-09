import { useState, useEffect, Fragment } from 'react';
import toast from 'react-hot-toast';
import { useIdentity } from '../contexts/DevIdentityContext';
import {
    getSentRequests, getReceivedRequests,
    acceptRequest, rejectRequest, cancelRequest,
} from '../api/matchingApi';

export default function MatchRequestsPage() {
    const { isRoomPrefComplete, refreshProfile } = useIdentity();
    const [tab, setTab] = useState('received');
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [recRes, sentRes] = await Promise.all([getReceivedRequests(), getSentRequests()]);
            setReceived(recRes.data.data || []);
            setSent(sentRes.data.data || []);
        } catch { toast.error('Failed to load requests'); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (isRoomPrefComplete) fetchRequests(); else setLoading(false); }, [isRoomPrefComplete]);

    const handleAction = async (action, requestId) => {
        setActing(requestId);
        try {
            if (action === 'accept') {
                await acceptRequest(requestId);
                toast.success('Request accepted! Roommate pair locked.');
                await refreshProfile();
            } else if (action === 'reject') {
                await rejectRequest(requestId);
                toast.success('Request rejected.');
            } else if (action === 'cancel') {
                await cancelRequest(requestId);
                toast.success('Request cancelled.');
            }
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally { setActing(null); }
    };

    const getSender = (req) => req.senderStudentId || {};
    const getReceiver = (req) => req.receiverStudentId || {};
    const statusBadgeClass = (status) => {
        if (status === 'PENDING') return 'badge badge-warning';
        if (status === 'ACCEPTED') return 'badge badge-success';
        if (status === 'REJECTED') return 'badge badge-danger';
        return 'badge';
    };

    if (!isRoomPrefComplete) {
        return (
            <div className="page">
                <h1 className="page-title">Match Requests</h1>
                <div className="alert alert-warning">Complete your profile and room preference first.</div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="page-title">Match Requests</h1>
            <div className="tabs">
                <button className={`tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
                    Received ({received.filter(r => r.status === 'PENDING').length})
                </button>
                <button className={`tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
                    Sent ({sent.length})
                </button>
            </div>

            {loading && <div className="page-loading">Loading requests...</div>}

            {!loading && tab === 'received' && (
                <div className="request-list">
                    {received.length === 0 ? (
                        <div className="empty-state"><p>No received requests yet.</p></div>
                    ) : received.map((req) => {
                        const sender = getSender(req);
                        return (
                            <div key={req._id} className="request-card">
                                <div className="request-info">
                                    <h4>{sender.firstName} {sender.lastName}</h4>
                                    <p>{sender.gender}, {sender.age} yrs — {req.compatibilityScore}% match</p>
                                </div>
                                <div className="request-actions">
                                    <span className={statusBadgeClass(req.status)}>{req.status}</span>
                                    {req.status === 'PENDING' && (
                                        <Fragment>
                                            <button className="btn btn-success btn-sm" disabled={acting === req._id}
                                                onClick={() => handleAction('accept', req._id)}>Accept</button>
                                            <button className="btn btn-danger btn-sm" disabled={acting === req._id}
                                                onClick={() => handleAction('reject', req._id)}>Reject</button>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && tab === 'sent' && (
                <div className="request-list">
                    {sent.length === 0 ? (
                        <div className="empty-state"><p>No sent requests yet.</p></div>
                    ) : sent.map((req) => {
                        const receiver = getReceiver(req);
                        return (
                            <div key={req._id} className="request-card">
                                <div className="request-info">
                                    <h4>{receiver.firstName} {receiver.lastName}</h4>
                                    <p>{receiver.gender}, {receiver.age} yrs — {req.compatibilityScore}% match</p>
                                </div>
                                <div className="request-actions">
                                    <span className={statusBadgeClass(req.status)}>{req.status}</span>
                                    {req.status === 'PENDING' && (
                                        <button className="btn btn-outline btn-sm" disabled={acting === req._id}
                                            onClick={() => handleAction('cancel', req._id)}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
