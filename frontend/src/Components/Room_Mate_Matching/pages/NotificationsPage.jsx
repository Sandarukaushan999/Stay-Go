import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyNotifications, markAsRead, markAllAsRead } from '../api/notificationApi';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await getMyNotifications(1, 50);
            setNotifications(res.data.data?.notifications || res.data.data || []);
        } catch { toast.error('Failed to load notifications'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
        } catch { toast.error('Failed to mark as read'); }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch { toast.error('Failed to mark all as read'); }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-outline" onClick={handleMarkAllRead}>Mark All as Read</button>
                )}
            </div>

            {loading && <div className="page-loading">Loading...</div>}

            {!loading && notifications.length === 0 && (
                <div className="empty-state"><p>No notifications yet.</p></div>
            )}

            <div className="notification-list">
                {notifications.map((n) => (
                    <div key={n._id} className={`notification-card ${!n.isRead ? 'unread' : ''}`}
                        onClick={() => !n.isRead && handleMarkRead(n._id)}>
                        <div className="notification-header">
                            <h4>{n.title}</h4>
                            {!n.isRead && <span className="badge badge-info">New</span>}
                        </div>
                        <p>{n.message}</p>
                        <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
