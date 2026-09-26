import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import UniversityCodeModal from './components/UniversityCodeModal';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Assignments from './pages/Assignments';
import Evaluations from './pages/Evaluations';
import LiveEvents from './pages/LiveEvents';
import Login from './pages/Login';
import Register from './pages/Register';

import Materials from './pages/Materials';
import StudentDetail from './pages/StudentDetail';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-semibold">
        Yuklanmoqda...
      </div>
    );
  }

  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[58px] md:pt-0 pb-20 md:pb-12 relative">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/live-events" element={<LiveEvents />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/students" element={<StudentDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <UniversityCodeModal />
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
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
