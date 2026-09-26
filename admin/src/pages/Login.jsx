import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Email yoki parol noto'g'ri!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Orqa fon orblari */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      {/* Login Card */}
      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-950/10">

          {/* Logo + Sarlavha */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/30 mb-5">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Administrator Portali
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              EduMind AI boshqaruv tizimiga kirish
            </p>
          </div>

          {/* Xato xabari */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600 font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* Forma */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-[0.1em] mb-2">
                Email Manzil
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.uz"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100/60 transition-all hover:border-slate-300"
                />
              </div>
            </div>

            {/* Parol */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-[0.1em] mb-2">
                Maxfiy Parol
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 pl-10 pr-12 text-slate-900 text-sm placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100/60 transition-all hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Eslab qol */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-2 border-slate-300 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-600">Meni eslab qol</span>
            </label>

            {/* Kirish tugmasi */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] group text-sm mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <span>Boshqaruvga kirish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Pastki xavfsizlik satri */}
          <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-semibold">256-bit SSL xavfsiz shifrlangan</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

