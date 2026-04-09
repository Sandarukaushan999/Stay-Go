import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../contexts/DevIdentityContext';
import './SetupPage.css';

export default function SetupPage() {
    const { switchIdentity } = useIdentity();
    const [idInput, setIdInput] = useState('');
    const [roleInput, setRoleInput] = useState('student');
    const navigate = useNavigate();

    const handleStart = () => {
        if (!idInput.trim()) return;
        switchIdentity(idInput.trim(), roleInput);
        navigate('/dashboard');
    };

    return (
        <div className="setup-page">
            <div className="setup-card">
                <h1 className="setup-title">Welcome to Stay & Go</h1>
                <p className="setup-subtitle">Hostel Roommate Matching System</p>
                <p className="setup-note">
                    Enter a student ID from the seeded database to get started.
                    <br />This dev identity switcher will be replaced with real login later.
                </p>

                <div className="setup-form">
                    <label className="setup-label">Student ID</label>
                    <input
                        className="setup-input"
                        value={idInput}
                        onChange={(e) => setIdInput(e.target.value)}
                        placeholder="Paste a seeded student _id"
                    />

                    <label className="setup-label">Role</label>
                    <select className="setup-input" value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button className="btn btn-primary setup-btn" onClick={handleStart} disabled={!idInput.trim()}>
                        Enter App
                    </button>
                </div>
            </div>
        </div>
    );
}
