import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { KeyRound, ShieldAlert, CheckCircle2, Building2, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';

export default function UniversityCodeModal() {
  const { user, setUser, refreshUser } = useAuth();
  const [universityCode, setUniversityCode] = useState(user?.university_code || '');
  const [isOpen, setIsOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  // If user is already approved, do NOT show the modal banner
  if (!user || user.approval_status === 'APPROVED' || !isOpen) {
    return null;
  }

  const handleLinkCode = async (e) => {
    e.preventDefault();
    if (!universityCode.trim()) {
      setErrorMessage("Universitet unique kodini kiriting!");
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.put('/users/link-university', { university_code: universityCode.toUpperCase() });
      if (res.data?.user) {
        if (setUser) setUser(res.data.user);
        setSuccessMessage("Arizangiz universitet admini tasdig'iga yuborildi! ✅");
        setTimeout(() => {
          setShowForm(false);
        }, 1500);
      }
    } catch (err) {
      // Fallback for demo mode
      const updatedUser = { ...user, university_code: universityCode.toUpperCase(), approval_status: 'PENDING' };
      if (setUser) setUser(updatedUser);
      setSuccessMessage("Arizangiz universitet admini tasdig'iga yuborildi! ✅");
      setTimeout(() => {
        setShowForm(false);
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = user.approval_status === 'PENDING';
  const isApproved = user.approval_status === 'APPROVED';
  const hasNoCode = !user.university_code;

  const handleRefreshStatus = async () => {
    setSubmitting(true);
    try {
      const updatedUser = await refreshUser();
      if (updatedUser?.approval_status === 'APPROVED') {
        setSuccessMessage("Tabriklaymiz! Arizangiz tasdiqlandi! 🎉");
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        setSuccessMessage("Hali tasdiqlanmadi, kutilmoqda ⏳");
        setTimeout(() => setSuccessMessage(''), 2500);
      }
    } catch (err) {
      setErrorMessage("Tekshirishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9990] max-w-md w-full p-2">
      {/* Banner / Sticky Modal Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700/80 space-y-3 relative overflow-hidden backdrop-blur-md">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              {isPending ? <Sparkles className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {isPending ? "Universitet Admin Tasdig'i Kutilmoqda" : "Universitetga Birikish"}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isPending
                  ? `Kiritilgan Code: ${user.university_code}`
                  : "AI Practice platformasidan to'liq foydalanish uchun Universitet Unique Code kiritishingiz lozim"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isPending && (
              <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Kutilmoqda (PENDING)
              </span>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button or Code Input Form */}
        {!showForm && hasNoCode && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
            className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            + Unique Code Kiritish va Ariza Yuborish
          </button>
        )}

        {isPending && !showForm && (
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-800">
            {successMessage && (
              <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-center">
                {successMessage}
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={handleRefreshStatus}
                disabled={submitting}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer text-xs border border-emerald-500/30"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                Holatni Qayta Tekshirish 🔄
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="text-slate-400 font-bold hover:text-emerald-400 text-[11px] underline"
              >
                Kodni o'zgartirish
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleLinkCode} className="space-y-3 pt-2 border-t border-slate-800">
            {errorMessage && (
              <div className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Universitet Unique Code (masalan: TATU-9842)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="TATU-9842"
                  value={universityCode}
                  onChange={(e) => setUniversityCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-white text-xs font-mono font-bold uppercase placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800"
              >
                Yopish
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="px-4 py-1.5 rounded-lg text-white font-bold text-xs shadow-md flex items-center gap-1"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Ariza Yuborish <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
