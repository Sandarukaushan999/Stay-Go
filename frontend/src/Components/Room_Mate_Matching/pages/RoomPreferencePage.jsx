import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useIdentity } from '../contexts/DevIdentityContext';
import { createOrUpdatePreference, getMyPreference, updateMyPreference } from '../api/roomPreferenceApi';
import { AC_TYPE, ROOM_POSITION, CAPACITY_OPTIONS, BLOCK_OPTIONS, FLOOR_OPTIONS } from '../constants/enums';

export default function RoomPreferencePage() {
    const { isProfileComplete, roomPref, refreshProfile } = useIdentity();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        block: '', floor: '', acType: '', roomPosition: '', capacity: '',
    });

    useEffect(() => {
        if (roomPref) {
            setForm({
                block: roomPref.block || '',
                floor: roomPref.floor || '',
                acType: roomPref.acType || '',
                roomPosition: roomPref.roomPosition || '',
                capacity: roomPref.capacity || '',
            });
            setIsEdit(true);
        }
    }, [roomPref]);

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const validate = () => {
        if (!form.block) return 'Block is required';
        if (!form.floor) return 'Floor is required';
        if (!form.acType) return 'AC type is required';
        if (!form.roomPosition) return 'Room position is required';
        if (!form.capacity) return 'Capacity is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return toast.error(err);

        setLoading(true);
        try {
            const payload = { ...form, capacity: Number(form.capacity) };
            if (isEdit) {
                await updateMyPreference(payload);
                toast.success('Room preference updated!');
            } else {
                await createOrUpdatePreference(payload);
                toast.success('Room preference saved!');
            }
            await refreshProfile();
            navigate('/matches');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save preference');
        } finally { setLoading(false); }
    };

    if (!isProfileComplete) {
        return (
            <div className="page">
                <h1 className="page-title">Room Preference</h1>
                <div className="alert alert-warning">Complete your profile first before setting room preferences.</div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="page-title">Room Preference</h1>
            <p className="page-subtitle">Select your room preferences for the matching algorithm.</p>

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Block *</label>
                        <select value={form.block} onChange={set('block')}>
                            <option value="">Select block</option>
                            {BLOCK_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Floor *</label>
                        <select value={form.floor} onChange={set('floor')}>
                            <option value="">Select floor</option>
                            {FLOOR_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>AC Type *</label>
                        <select value={form.acType} onChange={set('acType')}>
                            <option value="">Select</option>
                            {AC_TYPE.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Room Position *</label>
                        <select value={form.roomPosition} onChange={set('roomPosition')}>
                            <option value="">Select</option>
                            {ROOM_POSITION.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Capacity *</label>
                        <select value={form.capacity} onChange={set('capacity')}>
                            <option value="">Select</option>
                            {CAPACITY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
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
