import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMyProfile } from '../api/studentApi';
import { getMyPreference } from '../api/roomPreferenceApi';

const DevIdentityContext = createContext(null);

export function DevIdentityProvider({ children }) {
    const [studentId, setStudentId] = useState(() => localStorage.getItem('dev_student_id') || '');
    const [role, setRole] = useState(() => localStorage.getItem('dev_role') || 'student');
    const [profile, setProfile] = useState(null);
    const [roomPref, setRoomPref] = useState(null);
    const [loading, setLoading] = useState(false);

    // Persist to localStorage
    useEffect(() => {
        if (studentId) localStorage.setItem('dev_student_id', studentId);
        else localStorage.removeItem('dev_student_id');
        localStorage.setItem('dev_role', role);
    }, [studentId, role]);

    // Load profile + room preference whenever studentId changes
    const refreshProfile = useCallback(async () => {
        if (!studentId) { setProfile(null); setRoomPref(null); return; }
        setLoading(true);
        try {
            const res = await getMyProfile();
            setProfile(res.data.data);
        } catch { setProfile(null); }
        try {
            const res = await getMyPreference();
            setRoomPref(res.data.data);
        } catch { setRoomPref(null); }
        setLoading(false);
    }, [studentId]);

    useEffect(() => { refreshProfile(); }, [refreshProfile]);

    const switchIdentity = (id, newRole = 'student') => {
        setStudentId(id);
        setRole(newRole);
        setProfile(null);
        setRoomPref(null);
    };

    const isProfileComplete = profile?.profileCompleted === true;
    const isRoomPrefComplete = profile?.roomPreferenceCompleted === true;
    const isLocked = profile?.finalLockCompleted === true;
    const isAdmin = role === 'admin';

    return (
        <DevIdentityContext.Provider value={{
            studentId, role, profile, roomPref, loading,
            isProfileComplete, isRoomPrefComplete, isLocked, isAdmin,
            switchIdentity, refreshProfile, setProfile, setRoomPref,
        }}>
            {children}
        </DevIdentityContext.Provider>
    );
}

export const useIdentity = () => useContext(DevIdentityContext);
