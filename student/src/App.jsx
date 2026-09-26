import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import api from './api/client';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Sahifalar
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Assignments from './pages/Assignments';
import WhitePaper from './pages/WhitePaper';
import EvaluationDetail from './pages/EvaluationDetail';
import LiveEvent from './pages/LiveEvent';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const [showGlobalJoinModal, setShowGlobalJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [requiresAccessCode, setRequiresAccessCode] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  const handleGlobalJoin = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    setJoining(true);

    try {
      let token = joinToken.trim();
      if (token.includes('/join/')) {
        token = token.split('/join/').pop();
      }

      const res = await api.post(`/groups/join/${token}`, {
        access_code: accessCode.trim(),
      });
      setJoinSuccess(res.data.message || "Guruhga muvaffaqiyatli qo'shildingiz!");
      setJoinToken('');
      setAccessCode('');
      setRequiresAccessCode(false);
      setTimeout(() => {
        setShowGlobalJoinModal(false);
        setJoinSuccess('');
        window.location.reload();
      }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) {
        setRequiresAccessCode(true);
      }
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-[58px] md:pt-0">
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Global Join Group Modal */}
      <Modal
        isOpen={showGlobalJoinModal}
        onClose={() => setShowGlobalJoinModal(false)}
        title="Guruhga Qo'shilish"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGlobalJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Guruh Taklif Kodi yoki Havolasi
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: abc123xy yoki taklif havolasi"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-emerald-600 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              O'qituvchingiz yuborgan taklif kodi yoki havolasini kiriting.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Guruh Paroli (Access Code)</span>
              <span className={`text-[11px] ${requiresAccessCode ? 'text-emerald-600 font-bold' : 'text-slate-400 font-normal'}`}>
                {requiresAccessCode ? "Parol kiritilishi shart" : "Ixtiyoriy"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Agar o'qituvchi parol o'rnatgan bo'lsa kiriting"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className={`w-full border rounded-2xl p-3 text-sm focus:outline-none transition-all font-medium ${
                requiresAccessCode 
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200' 
                  : 'border-slate-200 focus:border-emerald-600'
              }`}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Agar guruh parolsiz bo'lsa, ushbu maydonni bo'sh qoldiring.
            </p>
          </div>

          {joinError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{joinError}</span>
            </div>
          )}

          {joinSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{joinSuccess}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowGlobalJoinModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={joining || !joinToken.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50"
            >
              {joining ? "Ulanmoqda..." : "Guruhga a'zo bo'lish"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-event"
            element={
              <ProtectedRoute>
                <Layout>
                  <LiveEvent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Layout>
                  <Groups />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/whitepaper/:assignmentId"
            element={
              <ProtectedRoute>
                <WhitePaper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluation/:submissionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <EvaluationDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
