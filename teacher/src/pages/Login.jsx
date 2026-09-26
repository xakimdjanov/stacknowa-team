import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google orqali kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Tizimga kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* CHAP TOMON: EMERALD BRENDING VA RASMLI ILUSTRATSIYA */}
      <div 
        style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
        className="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden"
      >
        {/* Yuqori logotip */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wider uppercase">EduMind AI</span>
        </div>

        {/* Markaziy rasm va matn */}
        <div className="my-auto py-10 z-10 max-w-lg mx-auto text-center lg:text-left">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 mb-8 transform hover:scale-[1.01] transition-transform">
            <img 
              src="/assets/login-illustration.png" 
              alt="O'qituvchilar uchun AI vositalari" 
              className="w-full h-auto object-cover"
            />
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-4 text-white">
            O'qituvchilar uchun AI vositalari, dars rejalashtirish va tahliliy baholash
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Darslarni tezroq rejalashtiring, talabalar ishlarini ishonch bilan tekshiring va ta'lim jarayonini AI bilan avtomatlashtiring.
          </p>
        </div>

        {/* Pastki qism */}
        <div className="flex items-center justify-between text-xs text-emerald-200/80 pt-6 border-t border-emerald-400/20 z-10">
          <span>O'qituvchilar uchun xavfsiz raqamli muhit</span>
          <div className="flex items-center space-x-1 font-bold tracking-widest uppercase">
            <span>CCO</span>
          </div>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      </div>

      {/* O'NG TOMON: KIRISH FORMASI */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-white">
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Kichik brend sarlavhasi */}
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-8">
            <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-current text-emerald-700" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>EduMind AI</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Xush kelibsiz
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            O'qituvchi profiliga kirish uchun ma'lumotlaringizni kiriting
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Manzil
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="teacher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Parol */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Maxfiy Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-11 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Eslab qolish & Parolni unutdingizmi */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Meni eslab qol</span>
              </label>
              <a href="#" className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold">
                Parolni unutdingizmi?
              </a>
            </div>

            {/* Kirish tugmasi */}
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="w-full text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/25 flex items-center justify-center transition-all hover:opacity-95 disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Tizimga kirish'
              )}
            </button>
          </form>

          {/* Ijtimoiy tarmoq ajratuvchi */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              yoki Google orqali
            </span>
          </div>

          {/* Google orqali kirish */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2.5 transition-all text-sm disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google orqali kirish</span>
          </button>

          {/* Ro'yxatdan o'tishga o'tish */}
          <p className="mt-8 text-center text-xs text-slate-600">
            Yangi o'qituvchimisiz?{' '}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              O'qituvchi hisobini yaratish
            </Link>
          </p>
        </div>

        {/* Xavfsizlik kafolati */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-emerald-700 font-medium pt-4">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
          </div>
          <span>Sizning hisobingiz va dars ma'lumotlaringiz to'liq himoyalangan</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

