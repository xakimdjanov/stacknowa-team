import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  Calendar,
  ChevronRight,
  Award,
  Sparkles,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const getDeadlineInfo = (deadline) => {
  const now = new Date();
  const d = new Date(deadline);
  const diff = Math.ceil((d - now) / 86400000);
  const hours = Math.round((d - now) / 3600000);
  if (d < now) return { label: "Muddati o'tgan", color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500' };
  if (hours <= 24) return { label: `${hours}s qoldi`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' };
  return { label: `${diff} kun qoldi`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [requiresAccessCode, setRequiresAccessCode] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const grpRes = await api.get('/groups/student');
      const studentGroups = grpRes.data.groups || [];
      setGroups(studentGroups);
      const allAssignments = [];
      for (const grp of studentGroups) {
        try {
          const assignRes = await api.get(`/assignments/group/${grp.id}`);
          const grpAssignments = assignRes.data.assignments || [];
          grpAssignments.forEach(a => allAssignments.push({ ...a, group_name: grp.name, subject: grp.subject }));
        } catch (e) { console.error(e); }
      }
      setAssignments(allAssignments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
      setTimeout(() => { setShowJoinModal(false); setJoinSuccess(''); fetchDashboardData(); }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) setRequiresAccessCode(true);
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally { setJoining(false); }
  };

  const submitted = assignments.filter(a => a.submissions?.length > 0).length;
  const pending = assignments.length - submitted;
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Xayrli tong' : greetingHour < 18 ? 'Xayrli kun' : 'Xayrli kech';
  const completionRate = assignments.length ? Math.round(submitted / assignments.length * 100) : 0;

  return (
    <div className="min-h-full bg-slate-50">

      {/* ══════════ LIGHT HERO HEADER ══════════ */}
      <div className="bg-white border-b border-slate-100 px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Practice · Talaba Portali
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {greeting},{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  {user?.name?.split(' ')[0] || 'Talaba'}!
                </span>{' '}
                👋
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Bugungi topshiriqlarni bajaring va AI dan tezkor baho oling.
              </p>
            </div>

            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-2.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/20 text-sm transition-all self-start flex-shrink-0 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              Guruhga Qo'shilish
            </button>
          </div>

          {/* Progress bar (if has assignments) */}
          {assignments.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">Umumiy bajarilish darajasi</span>
                <span className="text-xs font-black text-indigo-700">{completionRate}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex items-center gap-5 mt-2 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />{submitted} topshirildi</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />{pending} kutilmoqda</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />{groups.length} guruh</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ STAT CARDS ══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {[
            { icon: Users,       label: "A'zo guruhlar",    value: groups.length,     from: '#6366f1', to: '#8b5cf6' },
            { icon: BookOpen,    label: 'Topshiriqlar',     value: assignments.length, from: '#0ea5e9', to: '#6366f1' },
            { icon: CheckCircle2,label: 'Topshirildi',      value: submitted,          from: '#10b981', to: '#0d9488' },
            { icon: TrendingUp,  label: 'Kutilmoqda',       value: pending,            from: '#f59e0b', to: '#f97316' },
          ].map(({ icon: Icon, label, value, from, to }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex items-center gap-4 group">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                style={{ background: `linear-gradient(135deg,${from},${to})`, boxShadow: `0 4px 14px ${from}30` }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ══ AI Banner ══ */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-300/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-black text-slate-900">AI Baholash — Avtomatik Faol</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online
                </span>
              </div>
              <p className="text-xs text-slate-500">Topshirig'ingizni yuboring — sun'iy intellekt sekundlar ichida baho beradi.</p>
            </div>
          </div>
          <Link to="/assignments"
            className="inline-flex items-center gap-2 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex-shrink-0 shadow-sm">
            Topshiriqlar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* LEFT: Assignments */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Kutilayotgan Topshiriqlar</h2>
                <p className="text-xs text-slate-400 mt-0.5">Muddati yaqinlashayotgan amaliy ishlar</p>
              </div>
              <Link to="/assignments"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors border border-indigo-100">
                Barchasi <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                    <div className="h-3 bg-slate-100 rounded-full w-1/3 mb-3" />
                    <div className="h-5 bg-slate-100 rounded-lg w-2/3 mb-2" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  </div>
                ))}
              </div>
            ) : assignments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-9 h-9 text-slate-300" />
                </div>
                <p className="text-base font-black text-slate-700 mb-1">Topshiriqlar yo'q</p>
                <p className="text-sm text-slate-400 mb-5">O'qituvchi guruhiga qo'shiling va yangi vazifalarni kuting</p>
                <button onClick={() => setShowJoinModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition-all">
                  <Plus className="w-4 h-4" /> Guruhga qo'shilish
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map(a => {
                  const dl = getDeadlineInfo(a.deadline);
                  const isOverdue = new Date(a.deadline) < new Date();
                  return (
                    <div key={a.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${dl.border}`}>
                      <div className={`h-0.5 w-full ${isOverdue ? 'bg-rose-400' : 'bg-gradient-to-r from-indigo-400 to-violet-400'}`} />
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {a.group_name} · {a.subject}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${dl.bg} ${dl.color} border ${dl.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dl.dot}`} />
                              {dl.label}
                            </span>
                            {a.template_file_url && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Shablon bor</span>
                            )}
                          </div>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">{a.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(a.deadline).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })} — {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-slate-400" />
                              {a.max_score} ball
                            </span>
                          </div>
                        </div>
                        <Link to={`/whitepaper/${a.id}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-indigo-400/20 text-xs transition-all flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" /> Ochish <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Groups + Deadlines */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-slate-900">Mening Guruhlarim</h2>
                <Link to="/groups" className="text-xs font-bold text-indigo-600 hover:underline underline-offset-2">Barchasi</Link>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-5 space-y-3">
                    {[1,2].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : groups.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-3">Hech qaysi guruhga a'zo emassiz</p>
                    <button onClick={() => setShowJoinModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      <Plus className="w-3.5 h-3.5" /> Guruhga ulanish
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {groups.map((g, idx) => (
                      <div key={g.id} className="p-4 flex items-center gap-3 hover:bg-slate-50/80 transition-colors">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{g.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{g.subject} · {g.teacher?.name || "O'qituvchi"}</p>
                        </div>
                        <Link to={`/assignments?groupId=${g.id}`}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-500 hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                    <button onClick={() => setShowJoinModal(true)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-indigo-50/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="text-xs font-semibold text-indigo-600">Yangi guruhga qo'shilish</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {assignments.filter(a => new Date(a.deadline) > new Date()).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800">Yaqin muddatlar</h3>
                </div>
                <div className="space-y-3">
                  {assignments
                    .filter(a => new Date(a.deadline) > new Date())
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .slice(0, 4)
                    .map(a => {
                      const diff = Math.ceil((new Date(a.deadline) - new Date()) / 86400000);
                      const isUrgent = diff <= 1;
                      return (
                        <div key={a.id} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
                            <span className="text-xs text-slate-600 font-medium truncate">{a.title}</span>
                          </div>
                          <span className={`text-[11px] font-black flex-shrink-0 px-2 py-0.5 rounded-lg ${isUrgent ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                            {diff <= 0 ? 'Bugun' : `${diff}k`}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {completionRate >= 50 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200/50">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-900">Zo'r natija! 🎉</h4>
                  <p className="text-xs text-amber-700/80 mt-0.5">
                    Topshiriqlarning <strong>{completionRate}%</strong>ini bajardingiz!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JOIN MODAL */}
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
            <p className="text-[11px] text-slate-400 mt-1.5">O'qituvchingiz yuborgan taklif kodi yoki to'liq havolani kiriting.</p>
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
    </div>
  );
};

export default Dashboard;
