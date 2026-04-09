import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SetupPage from '../pages/SetupPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import RoomPreferencePage from '../pages/RoomPreferencePage';
import MatchSuggestionsPage from '../pages/MatchSuggestionsPage';
import MatchRequestsPage from '../pages/MatchRequestsPage';
import FinalResultPage from '../pages/FinalResultPage';
import IssuesPage from '../pages/IssuesPage';
import NotificationsPage from '../pages/NotificationsPage';
import RoomsAdminPage from '../pages/admin/RoomsAdminPage';
import IssuesAdminPage from '../pages/admin/IssuesAdminPage';

export default function AppRoutes() {
    return (
        <Routes>
                {/* Dev identity setup — landing page */}
                <Route path="/" element={<SetupPage />} />

                {/* Main app layout — requires a student ID */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/room-preference" element={<RoomPreferencePage />} />
                    <Route path="/matches" element={<MatchSuggestionsPage />} />
                    <Route path="/match-requests" element={<MatchRequestsPage />} />
                    <Route path="/final-result" element={<FinalResultPage />} />
                    <Route path="/issues" element={<IssuesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />

                    {/* Admin routes */}
                    <Route path="/admin/rooms" element={<RoomsAdminPage />} />
                    <Route path="/admin/issues" element={<IssuesAdminPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
    );
}
