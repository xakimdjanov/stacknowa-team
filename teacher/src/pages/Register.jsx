import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Check, KeyRound } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    instructorName: '',
    universityCode: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
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
    setInfoMessage('');

    if (formData.password !== formData.confirmPassword) {
      return setError("Kiritilgan parollar bir xil emas!");
    }
    if (!agreeTerms) {
      return setError("Foydalanish shartlari va maxfiylik siyosatiga rozilik bildirishingiz lozim!");
    }

    setLoading(true);
    try {
      const res = await register({
        name: formData.instructorName || formData.name,
        email: formData.email,
        password: formData.password,
        role: 'TEACHER',
        university_code: formData.universityCode,
      });

      if (res?.user?.approval_status === 'PENDING') {
        setInfoMessage("Ro'yxatdan o'tildi! Arizangiz Universitet Admini tasdig'iga yuborildi.");
        setTimeout(() => navigate('/login'), 2500);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Ro'yxatdan o'tishda xatolik yuz berdi!");
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
              src="/assets/register-illustration.png" 
              alt="Tezkor AI baholash va guruhlar" 
              className="w-full h-auto object-cover"
            />
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-4 text-white">
            Tezkor AI baholash va tuzilmaviy dars guruhlari
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Topshiriqlar yaratish, talabalar ishlarini tekshirish va dars jarayonlarini qulay boshqarish uchun o'z ish maydoningizni sozlang.
          </p>
        </div>

        {/* Pastki qism */}
        <div className="flex items-center justify-between text-xs text-emerald-200/80 pt-6 border-t border-emerald-400/20 z-10">
          <span>O'qituvchilarga dars maydonini boshqarish uchun yaratilgan</span>
          <div className="flex items-center space-x-1 font-bold tracking-widest uppercase">
            <span>EduMind AI</span>
          </div>
        </div>
      </div>

      {/* O'NG TOMON: RO'YXATDAN O'TISH FORMASI */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-14 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Kichik brend sarlavhasi */}
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-current text-emerald-700" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>EduMind AI</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              O'qituvchi hisobini yaratish
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Platformadan ro'yxatdan o'tish uchun ma'lumotlarni kiriting
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ism familiya */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                F.I.SH. (Ism va Familiyangiz)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Alisher Valiyev"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Manzil
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nom@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Universitet Unique Code Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Universitet Unique Code (masalan: TATU-9842)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="TATU-9842 (Ixtiyoriy)"
                  value={formData.universityCode}
                  onChange={(e) => setFormData({ ...formData, universityCode: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm font-mono font-bold uppercase placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Universitetingiz bergan unique kodni kiritsangiz, arizangiz admin tasdig'iga yuboriladi.</p>
            </div>

            {/* Parollar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parol</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Kamida 6 belgi"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parolni tasdiqlang</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Parolni takrorlang"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* O'qituvchining talabalarga ko'rinadigan nomi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Talabalarga ko'rinadigan o'qituvchi nomi
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ixtiyoriy (masalan: Dotsent Valiyev A.)"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Shartlarga rozilik */}
            <div className="flex items-center space-x-2 pt-1 text-xs">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-slate-600 cursor-pointer">
                Men foydalanish shartlariga rozi bo'laman
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="w-full text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/25 flex items-center justify-center transition-all hover:opacity-95 disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? "Ro'yxatdan o'tilmoqda..." : "O'qituvchi Hisobini Yaratish"}
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

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Kirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

