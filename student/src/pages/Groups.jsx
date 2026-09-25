import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import QrScannerModal from '../components/QrScannerModal';
import {
  Users,
  Plus,
  BookOpen,
  ArrowRight,
  Mail,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Search,
  Hash,
  QrCode,
  Layers,
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [requiresAccessCode, setRequiresAccessCode] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/student');
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    setJoining(true);
    try {
      let token = joinToken.trim();
      if (token.includes('/join/')) token = token.split('/join/').pop();
      const res = await api.post(`/groups/join/${token}`, { access_code: accessCode.trim() });
      setJoinSuccess(res.data.message || "Guruhga muvaffaqiyatli qo'shildingiz!");
      setJoinToken('');
      setAccessCode('');
      setRequiresAccessCode(false);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess('');
        fetchGroups();
      }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) setRequiresAccessCode(true);
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally {
      setJoining(false);
    }
  };

  const handleQrScan = (text) => {
    let token = text.trim();
    if (token.includes('/join/')) token = token.split('/join/').pop();
    setJoinToken(token);
    setShowQrScanner(false);
    setShowJoinModal(true);
  };

  const filtered = groups.filter(
    (g) =>
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-slate-50">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 sm:pt-8 pb-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              O'quv guruhlari
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mening Guruhlarim
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Siz a'zo bo'lgan barcha fan guruhlari, o'qituvchilar va amaliy topshiriqlar.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowQrScanner(true)}
              className="inline-flex items-center gap-2 bg-white border border-slate-200/90 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>QR Skaner</span>
            </button>

            <button
              onClick={() => setShowJoinModal(true)}
              style={{ background: EMERALD_GRADIENT }}
              className="inline-flex items-center gap-2 text-white font-bold py-2.5 px-4 sm:px-5 rounded-xl shadow-md shadow-emerald-700/20 text-xs sm:text-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Guruhga Qo'shilish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* ── Search + count bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Guruh nomi yoki fan bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all placeholder-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 flex-shrink-0">
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs">
              {filtered.length}
            </span>
            <span>ta guruh</span>
          </div>
        </div>

        {/* ── Groups Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse"
              >
                <div className="h-28 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded-lg w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">
              {search ? 'Guruh topilmadi' : "Hech qaysi guruhga a'zo emassiz"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 font-medium">
              {search
                ? "Boshqa so'z bilan qidirib ko'ring"
                : "O'qituvchingiz bergan taklif kodi orqali guruhga qo'shiling va topshiriqlarni boshlang."}
            </p>
            {!search && (
              <button
                onClick={() => setShowJoinModal(true)}
                style={{ background: EMERALD_GRADIENT }}
                className="inline-flex items-center gap-2 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Guruhga Ulanish
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((g, idx) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Top accent bar */}
                <div className="h-1.5 w-full" style={{ background: EMERALD_GRADIENT }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-700/20 flex-shrink-0"
                      style={{ background: EMERALD_GRADIENT }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 uppercase tracking-wider">
                        {g.subject}
                      </span>
                    </div>
                  </div>

                  {/* Name & desc */}
                  <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">
                    {g.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1 font-medium">
                    {g.description || 'Ushbu guruh bo’yicha amaliy va laboratoriya mashg’ulotlari.'}
                  </p>

                  {/* Teacher info card */}
                  <div className="bg-slate-50/80 rounded-xl p-3 space-y-2 mb-4 border border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs text-slate-800">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                        style={{ background: EMERALD_GRADIENT }}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold">{g.teacher?.name || "O'qituvchi"}</span>
                    </div>
                    {g.teacher?.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-3 h-3 text-slate-400" />
                        </div>
                        <span className="truncate">{g.teacher.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Link
                    to={`/assignments?groupId=${g.id}`}
                    style={{ background: EMERALD_GRADIENT }}
                    className="w-full inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Topshiriqlarni Ko'rish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Add group card */}
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 text-center group min-h-[220px] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300 group-hover:border-emerald-500 group-hover:bg-emerald-100 flex items-center justify-center transition-all">
                <Plus className="w-6 h-6 text-emerald-600 group-hover:rotate-90 transition-all duration-200" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700 group-hover:text-emerald-800 transition-colors">
                  Yangi guruhga qo'shilish
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Taklif kodi yoki havola orqali</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ══ JOIN MODAL ══ */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setJoinError('');
          setJoinSuccess('');
          setJoinToken('');
          setAccessCode('');
          setRequiresAccessCode(false);
        }}
        title="Guruhga Qo'shilish"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2">
              Taklif Kodi yoki Havola
            </label>
            <input
              type="text"
              required
              placeholder="abc123xy yoki guruh havolasi"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/60 transition-all bg-slate-50/60 placeholder-slate-400 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
              O'qituvchingiz bergan taklif kodini yoki to'liq havolani kiriting.
            </p>
          </div>

          <div>
            <label className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2">
              <span>Guruh Paroli</span>
              <span
                className={`normal-case font-semibold text-[11px] ${
                  requiresAccessCode ? 'text-emerald-700 font-black' : 'text-slate-400'
                }`}
              >
                {requiresAccessCode ? '⚠ Majburiy' : 'Ixtiyoriy'}
              </span>
            </label>
            <input
              type="text"
              placeholder="Agar guruh himoyalangan bo'lsa kiriting"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all bg-slate-50/60 placeholder-slate-400 font-medium ${
                requiresAccessCode
                  ? 'border-emerald-500 ring-2 ring-emerald-200'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/60'
              }`}
            />
          </div>

          {joinError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {joinError}
            </div>
          )}
          {joinSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {joinSuccess}
            </div>
          )}

          {/* QR scanner shortcut */}
          <button
            type="button"
            onClick={() => {
              setShowJoinModal(false);
              setShowQrScanner(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            Yoki QR Kodni Skanerlash
          </button>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={joining || !joinToken.trim()}
              style={{ background: EMERALD_GRADIENT }}
              className="px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md shadow-emerald-700/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {joining && (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {joining ? 'Ulanmoqda...' : "Guruhga a'zo bo'lish"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ QR SCANNER MODAL ══ */}
      <QrScannerModal
        isOpen={showQrScanner}
        onClose={() => setShowQrScanner(false)}
        onScan={handleQrScan}
      />
    </div>
  );
};

export default Groups;
