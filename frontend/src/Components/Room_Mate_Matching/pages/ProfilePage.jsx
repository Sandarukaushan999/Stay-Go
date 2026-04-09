import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useIdentity } from '../contexts/DevIdentityContext';
import { createProfile, getMyProfile, updateMyProfile } from '../api/studentApi';
import { SLEEP_SCHEDULE, SOCIAL_HABITS, STUDY_HABITS, GENDER_OPTIONS } from '../constants/enums';

export default function ProfilePage() {
    const { profile, isProfileComplete, isLocked, refreshProfile } = useIdentity();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        firstName: '', lastName: '', address: '', email: '', whatsApp: '',
        gender: '', age: '', sleepSchedule: '', cleanliness: 3,
        socialHabits: '', studyHabits: '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                address: profile.address || '',
                email: profile.email || '',
                whatsApp: profile.whatsApp || '',
                gender: profile.gender || '',
                age: profile.age || '',
                sleepSchedule: profile.sleepSchedule || '',
                cleanliness: profile.cleanliness || 3,
                socialHabits: profile.socialHabits || '',
                studyHabits: profile.studyHabits || '',
            });
            setIsEdit(true);
        }
    }, [profile]);

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const validate = () => {
        if (!form.firstName.trim()) return 'First name is required';
        if (!form.lastName.trim()) return 'Last name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
        if (!form.whatsApp.trim()) return 'WhatsApp number is required';
        if (!form.gender) return 'Gender is required';
        if (!form.age || Number(form.age) < 1) return 'Valid age is required';
        if (!form.sleepSchedule) return 'Sleep schedule is required';
        if (!form.socialHabits) return 'Social habits is required';
        if (!form.studyHabits) return 'Study habits is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return toast.error(err);

        setLoading(true);
        try {
            const payload = { ...form, age: Number(form.age), cleanliness: Number(form.cleanliness) };
            if (isEdit) {
                await updateMyProfile(payload);
                toast.success('Profile updated!');
            } else {
                await createProfile(payload);
                toast.success('Profile created!');
            }
            await refreshProfile();
            navigate('/room-preference');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to save profile';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="page">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Fill in your personal details and lifestyle preferences.</p>
            {isLocked && (
                <div className="alert alert-warning">Your profile is locked after roommate pairing. Only limited edits allowed.</div>
            )}

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name *</label>
                        <input value={form.firstName} onChange={set('firstName')} placeholder="First name" />
                    </div>
                    <div className="form-group">
                        <label>Last Name *</label>
                        <input value={form.lastName} onChange={set('lastName')} placeholder="Last name" />
                    </div>
                    <div className="form-group full">
                        <label>Address *</label>
                        <textarea value={form.address} onChange={set('address')} placeholder="Full address" rows={2} />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="email@university.lk" />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp *</label>
                        <input value={form.whatsApp} onChange={set('whatsApp')} placeholder="+94771234567" />
                    </div>
                    <div className="form-group">
                        <label>Gender *</label>
                        <select value={form.gender} onChange={set('gender')}>
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Age *</label>
                        <input type="number" min="1" value={form.age} onChange={set('age')} placeholder="21" />
                    </div>
                </div>

                <h3 className="form-section-title">Lifestyle Preferences</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Sleep Schedule *</label>
                        <select value={form.sleepSchedule} onChange={set('sleepSchedule')}>
                            <option value="">Select</option>
                            {SLEEP_SCHEDULE.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Cleanliness (1-5) *</label>
                        <div className="range-group">
                            <input type="range" min="1" max="5" value={form.cleanliness}
                                onChange={(e) => setForm({ ...form, cleanliness: e.target.value })} />
                            <span className="range-value">{form.cleanliness}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Social Habits *</label>
                        <select value={form.socialHabits} onChange={set('socialHabits')}>
                            <option value="">Select</option>
                            {SOCIAL_HABITS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Study Habits *</label>
                        <select value={form.studyHabits} onChange={set('studyHabits')}>
                            <option value="">Select</option>
                            {STUDY_HABITS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Update & Continue' : 'Save & Continue'}
                    </button>
                </div>
            </form>
        </div>
    );
}
