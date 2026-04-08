import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './Components/userMngmnt&AdminDshbrd/auth-page';
import StudentDashboard from './Components/userMngmnt&AdminDshbrd/StudentDashboard';
import TechnicianDashboard from './Components/userMngmnt&AdminDshbrd/TechnicianDashboard';
import RiderDashboard from './Components/userMngmnt&AdminDshbrd/RiderDashboard';
import AdminDashboard from './Components/userMngmnt&AdminDshbrd/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import MainLayout from './layouts/MainLayout';
import Home from './Components/userMngmnt&AdminDshbrd/home';
import InfoPage from './Components/userMngmnt&AdminDshbrd/info-page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home headerNavItems={[]} />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/technitian" element={<TechnicianDashboard />} />
      <Route path="/rider" element={<RiderDashboard />} />
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="/info" element={<InfoPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
