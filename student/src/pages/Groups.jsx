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
} from 'lucide-react';

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

  useEffect(() => { fetchGroups(); }, []);

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
    setJoinError(''); setJoinSuccess(''); setJoining(true);
    try {
      let token = joinToken.trim();
      if (token.includes('/join/')) token = token.split('/join/').pop();
      const res = await api.post(`/groups/join/${token}`, { access_code: accessCode.trim() });
      setJoinSuccess(res.data.message || "Guruhga muvaffaqiyatli qo'shildingiz!");
      setJoinToken(''); setAccessCode(''); setRequiresAccessCode(false);
      setTimeout(() => { setShowJoinModal(false); setJoinSuccess(''); fetchGroups(); }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) setRequiresAccessCode(true);
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally { setJoining(false); }
  };

  const handleQrScan = (text) => {
    // QR kodni tokenga parse qilamiz
    let token = text.trim();
    if (token.includes('/join/')) token = token.split('/join/').pop();
    setJoinToken(token);
    setShowQrScanner(false);
    setShowJoinModal(true);
  };

  const filtered = groups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.subject?.toLowerCase().includes(search.toLowerCase())
  );

  /* Subject → gradient */
  const subjectGradient = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('math') || s.includes('mat')) return 'from-blue-500 to-indigo-600';
    if (s.includes('phys') || s.includes('fiz')) return 'from-violet-500 to-purple-700';
    if (s.includes('chem') || s.includes('kim')) return 'from-emerald-500 to-teal-600';
    if (s.includes('prog') || s.includes('dastur')) return 'from-orange-500 to-amber-600';
    return 'from-indigo-500 to-violet-600';
  };

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 pt-6 pb-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mening Guruhlarim</h1>
            <p className="text-sm text-slate-500 mt-1">
              Siz a'zo bo'lgan barcha fan guruhlari va o'qituvchilar.
            </p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-500/20 text-sm transition-all self-start sm:self-auto flex-shrink-0 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            Guruhga Qo'shilish
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">

        {/* ── Search + count ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Guruh nomi yoki fan bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-shrink-0">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs">
              {filtered.length}
            </span>
            ta guruh
          </div>
        </div>

        {/* ── Groups Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-32 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded-lg w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-base font-black text-slate-700 mb-2">
              {search ? 'Guruh topilmadi' : 'Hech qaysi guruhga a\'zo emassiz'}
            </p>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              {search ? 'Boshqa kalit so\'z bilan qidirib ko\'ring' : 'O\'qituvchingiz bergan taklif kodi orqali guruhga qo\'shiling va topshiriqlarni boshlang.'}
            </p>
            {!search && (
              <button onClick={() => setShowJoinModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 px-6 rounded-2xl text-sm shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition-all">
                <Plus className="w-4 h-4" /> Guruhga Ulanish
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((g, idx) => (
              <div key={g.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">

                {/* Card top banner */}
                <div className={`h-2 w-full bg-gradient-to-r ${subjectGradient(g.subject)}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${subjectGradient(g.subject)} flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0`}>
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        {g.subject}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                        <Hash className="w-3 h-3" />{g.id}
                      </span>
                    </div>
                  </div>

                  {/* Name & desc */}
                  <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">{g.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                    {g.description || 'Guruh tavsifi kiritilmagan.'}
                  </p>

                  {/* Teacher info */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 mb-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-3.5 h-3.5 text-white" />
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
                  <Link to={`/assignments?groupId=${g.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${subjectGradient(g.subject)} hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Topshiriqlarni Ko'rish
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Add group card */}
            <button onClick={() => setShowJoinModal(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 text-center group min-h-[200px]">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 group-hover:border-indigo-400 group-hover:bg-indigo-100 flex items-center justify-center transition-all">
                <Plus className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 group-hover:rotate-90 transition-all duration-200" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-600 group-hover:text-indigo-700 transition-colors">Yangi guruhga qo'shilish</p>
                <p className="text-xs text-slate-400 mt-0.5">Taklif kodi yoki havola</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ══ JOIN MODAL ══ */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => { setShowJoinModal(false); setJoinError(''); setJoinSuccess(''); setJoinToken(''); setAccessCode(''); setRequiresAccessCode(false); }}
        title="Guruhga Qo'shilish"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2">
              Taklif Kodi yoki Havola
            </label>
            <input type="text" required placeholder="abc123xy yoki guruh havolasi"
              value={joinToken} onChange={(e) => setJoinToken(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition-all bg-slate-50/60 placeholder-slate-400" />
            <p className="text-[11px] text-slate-400 mt-1.5">O'qituvchingiz bergan taklif kodini yoki to'liq havolani kiriting.</p>
          </div>
          <div>
            <label className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2">
              <span>Guruh Paroli</span>
              <span className={`normal-case font-normal ${requiresAccessCode ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                {requiresAccessCode ? '⚠ Majburiy' : 'Ixtiyoriy'}
              </span>
            </label>
            <input type="text" placeholder="Agar guruh himoyalangan bo'lsa kiriting"
              value={accessCode} onChange={(e) => setAccessCode(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all bg-slate-50/60 placeholder-slate-400 ${requiresAccessCode ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60'}`} />
          </div>
          {joinError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{joinError}
            </div>
          )}
          {joinSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{joinSuccess}
            </div>
          )}

          {/* QR scanner shortcut */}
          <button
            type="button"
            onClick={() => { setShowJoinModal(false); setShowQrScanner(true); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Yoki QR Kodni Skanerlash
          </button>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowJoinModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors">
              Bekor qilish
            </button>
            <button type="submit" disabled={joining || !joinToken.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2">
              {joining && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
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

