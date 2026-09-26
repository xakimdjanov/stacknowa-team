import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Groups from './pages/Groups';
import TeacherApprovals from './pages/TeacherApprovals';
import Structure from './pages/Structure';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Login from './pages/Login';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 font-semibold">
        Yuklanmoqda...
      </div>
    );
  }

  if (!user || (user.role !== 'UNIVERSITY_ADMIN' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[58px] md:pt-0 pb-20 md:pb-12 h-auto md:h-screen md:overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teacher-approvals" element={<TeacherApprovals />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/structure" element={<Structure />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
