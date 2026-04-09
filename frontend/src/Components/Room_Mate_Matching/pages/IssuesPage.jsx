import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createIssue, getMyIssues } from '../api/issueApi';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES } from '../constants/enums';

export default function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', category: '', priority: 'MEDIUM',
        roomNumber: '', additionalNotes: '',
    });
    const [file, setFile] = useState(null);

    const fetchIssues = async () => {
        try {
            const res = await getMyIssues();
            setIssues(res.data.data || []);
        } catch { toast.error('Failed to load issues'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchIssues(); }, []);

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title is required');
        if (!form.description.trim()) return toast.error('Description is required');
        if (!form.category) return toast.error('Category is required');

        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => { if (form[key]) formData.append(key, form[key]); });
            if (file) formData.append('attachmentImage', file);

            await createIssue(formData);
            toast.success('Issue reported!');
            setForm({ title: '', description: '', category: '', priority: 'MEDIUM', roomNumber: '', additionalNotes: '' });
            setFile(null);
            setShowForm(false);
            fetchIssues();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit issue');
        } finally { setSubmitting(false); }
    };

    const statusBadge = (status) => {
        const cls = status === 'RESOLVED' ? 'badge-success' : status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-info';
        return <span className={`badge ${cls}`}>{ISSUE_STATUSES[status] || status}</span>;
    };

    const priorityBadge = (priority) => {
        const cls = priority === 'EMERGENCY' ? 'badge-danger' : priority === 'HIGH' ? 'badge-warning' : 'badge-info';
        return <span className={`badge ${cls}`}>{priority}</span>;
    };

    return (
        <div className="page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Issue Reporting</h1>
                    <p className="page-subtitle">Report and track issues with your hostel facilities.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Issue'}
                </button>
            </div>

            {showForm && (
                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Title *</label>
                            <input value={form.title} onChange={set('title')} placeholder="Brief issue title" />
                        </div>
                        <div className="form-group full">
                            <label>Description *</label>
                            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Describe the issue in detail" />
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select value={form.category} onChange={set('category')}>
                                <option value="">Select</option>
                                {ISSUE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={form.priority} onChange={set('priority')}>
                                {ISSUE_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Room Number</label>
                            <input value={form.roomNumber} onChange={set('roomNumber')} placeholder="e.g. A-101" />
                        </div>
                        <div className="form-group">
                            <label>Attachment (image)</label>
                            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <div className="form-group full">
                            <label>Additional Notes</label>
                            <textarea value={form.additionalNotes} onChange={set('additionalNotes')} rows={2} placeholder="Any extra details" />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Issue'}
                        </button>
                    </div>
                </form>
            )}

            <h3 className="section-title">My Issues</h3>
            {loading && <div className="page-loading">Loading...</div>}
            {!loading && issues.length === 0 && (
                <div className="empty-state"><p>No issues reported yet.</p></div>
            )}
            <div className="issue-list">
                {issues.map((issue) => (
                    <div key={issue._id} className="issue-card">
                        <div className="issue-header">
                            <h4>{issue.title}</h4>
                            <div className="issue-badges">{statusBadge(issue.status)} {priorityBadge(issue.priority)}</div>
                        </div>
                        <p className="issue-desc">{issue.description}</p>
                        <div className="issue-meta">
                            <span>{ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label || issue.category}</span>
                            {issue.roomNumber && <span>Room: {issue.roomNumber}</span>}
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        {issue.adminComment && (
                            <div className="issue-admin-comment">
                                <strong>Admin:</strong> {issue.adminComment}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
