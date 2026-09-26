import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Universities from './pages/Universities';
import TeacherApprovals from './pages/TeacherApprovals';
import Users from './pages/Users';
import Assignments from './pages/Assignments';
import Plans from './pages/Plans';
import Groups from './pages/Groups';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Login from './pages/Login';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Admin paneli yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'UNIVERSITY_ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[58px] md:pt-0 pb-20 md:pb-12 h-auto md:h-screen md:overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/teacher-approvals" element={<TeacherApprovals />} />
          <Route path="/users" element={<Users />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/transactions" element={<Transactions />} />
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
