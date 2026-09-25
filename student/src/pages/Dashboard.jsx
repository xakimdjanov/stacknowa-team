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
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

/* ─── Mini Bar Chart Component ───────────────────────── */
const MiniBar = ({ values = [3, 5, 4, 7, 6, 8, 10], color = '#a7f3d0' }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-8 sm:h-9">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 sm:w-2 rounded-t-sm transition-all duration-500"
          style={{
            height: `${Math.max(12, Math.round((v / max) * 100))}%`,
            backgroundColor: color,
            opacity: 0.35 + (i / values.length) * 0.65,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Stat Card Component (Teacher Design) ──────────── */
const StatCard = ({
  label,
  value,
  sublabel,
  icon: Icon,
  gradient,
  bars,
  barColor,
  trend = false,
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    style={{
      background: gradient,
      boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
      minHeight: '140px',
    }}
  >
    {/* Top row */}
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
          {label}
        </p>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
          {value}
        </h3>
      </div>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>

    {/* Bottom row */}
    <div className="flex items-end justify-between mt-4">
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white/95">
        {trend && <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />}
        <span>{sublabel}</span>
      </div>
      <MiniBar values={bars} color={barColor} />
    </div>

    {/* Subtle decorative glow */}
    <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
  </div>
);

const getDeadlineInfo = (deadline) => {
  const now = new Date();
  const d = new Date(deadline);
  const diff = Math.ceil((d - now) / 86400000);
  const hours = Math.round((d - now) / 3600000);
  if (d < now)
    return {
      label: "Muddati o'tgan",
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      dot: 'bg-rose-500',
    };
  if (hours <= 24)
    return {
      label: `${hours}s qoldi`,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      dot: 'bg-amber-500',
    };
  return {
    label: `${diff} kun qoldi`,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  };
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
          grpAssignments.forEach((a) =>
            allAssignments.push({ ...a, group_name: grp.name, subject: grp.subject })
          );
        } catch (e) {
          console.error(e);
        }
      }
      setAssignments(allAssignments);
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
        fetchDashboardData();
      }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) setRequiresAccessCode(true);
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally {
      setJoining(false);
    }
  };

  const submitted = assignments.filter((a) => a.submissions?.length > 0).length;
  const pending = assignments.length - submitted;
  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Xayrli tong' : greetingHour < 18 ? 'Xayrli kun' : 'Xayrli kech';
  const completionRate = assignments.length
    ? Math.round((submitted / assignments.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">Boshqaruv paneli yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      {/* ══════════════════════════════════════════════
          HERO HEADER SECTION
      ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 sm:pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'Talaba'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Bugungi topshiriqlarni bajaring va AI dan lahzada xolis baho oling.
            </p>
          </div>

          {/* Progress bar (if has assignments) */}
          {assignments.length > 0 && (
            <div className="mt-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Umumiy bajarilish darajasi
                </span>
                <span className="text-xs font-black text-emerald-700">{completionRate}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%`, background: EMERALD_GRADIENT }}
                />
              </div>
              <div className="flex items-center gap-5 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {submitted} topshirildi
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                  {pending} kutilmoqda
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                  {groups.length} ta guruh
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* ── 4 KPI STATS CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="A'zo Guruhlar"
            value={groups.length}
            sublabel="O'quv guruhlaringiz"
            icon={Layers}
            gradient={EMERALD_GRADIENT}
            barColor="#a7f3d0"
            bars={[1, 2, 3, 2, 4, 3, Math.max(groups.length, 1)]}
            trend={true}
          />
          <StatCard
            label="Topshiriqlar"
            value={assignments.length}
            sublabel="Jami amaliy ishlar"
            icon={BookOpen}
            gradient="linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
            barColor="#bae6fd"
            bars={[2, 3, 5, 4, 6, 5, Math.max(assignments.length, 2)]}
            trend={true}
          />
          <StatCard
            label="Topshirildi"
            value={submitted}
            sublabel="Muvaffaqiyatli topshirilgan"
            icon={CheckCircle2}
            gradient="linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"
            barColor="#99f6e4"
            bars={[1, 2, 3, 4, 3, 5, Math.max(submitted, 1)]}
            trend={true}
          />
          <StatCard
            label="Kutilmoqda"
            value={pending}
            sublabel="Muddati yaqin vazifalar"
            icon={Clock}
            gradient="linear-gradient(135deg, #d97706 0%, #b45309 100%)"
            barColor="#fde68a"
            bars={[3, 4, 2, 3, 4, 2, Math.max(pending, 1)]}
            trend={false}
          />
        </div>

        {/* ══ AI Baholash Banner ══ */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 border border-emerald-200/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-emerald-700/20"
              style={{ background: EMERALD_GRADIENT }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-black text-slate-900">
                  Google Gemini AI Baholash — Faol
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300/60 text-emerald-800 text-[10px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                8 betlik hisobotingizni yozing — sun'iy intellekt sekundlar ichida tahlil qilib baholaydi.
              </p>
            </div>
          </div>
          <Link
            to="/assignments"
            className="inline-flex items-center gap-2 bg-white border border-emerald-300/80 hover:border-emerald-500 text-emerald-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex-shrink-0 shadow-xs active:scale-95"
          >
            Topshiriqlarga o'tish <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT: Assignments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Kutilayotgan Topshiriqlar</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Muddati yaqinlashayotgan amaliy ishlar
                </p>
              </div>
              <Link
                to="/assignments"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors border border-emerald-200/60"
              >
                Barchasi <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-slate-800 mb-1">Topshiriqlar yo'q</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 font-medium">
                  O'qituvchingiz bergan taklif kodi orqali guruhga qo'shiling va yangi amaliy ishlarni kuting.
                </p>
                <button
                  onClick={() => setShowJoinModal(true)}
                  style={{ background: EMERALD_GRADIENT }}
                  className="inline-flex items-center gap-2 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Guruhga qo'shilish
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((a) => {
                  const dl = getDeadlineInfo(a.deadline);
                  const isOverdue = new Date(a.deadline) < new Date();
                  return (
                    <div
                      key={a.id}
                      className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div
                        className="h-1 w-full"
                        style={{
                          background: isOverdue
                            ? '#f43f5e'
                            : EMERALD_GRADIENT,
                        }}
                      />
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                              {a.group_name} · {a.subject}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${dl.bg} ${dl.color} border ${dl.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dl.dot}`} />
                              {dl.label}
                            </span>
                            {a.template_file_url && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60">
                                Shablon bor
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">
                            {a.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(a.deadline).toLocaleDateString('uz-UZ', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-slate-400" />
                              {a.max_score} ball
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/whitepaper/${a.id}`}
                          style={{ background: EMERALD_GRADIENT }}
                          className="inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-700/20 text-xs transition-all flex-shrink-0 active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Daftarcha</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Groups & Deadlines */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-slate-900">Mening Guruhlarim</h2>
                <Link
                  to="/groups"
                  className="text-xs font-bold text-emerald-700 hover:underline underline-offset-2"
                >
                  Barchasi
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {groups.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-600 mb-2">
                      Hech qaysi guruhga a'zo emassiz
                    </p>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Guruhga ulanish
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {groups.map((g, idx) => (
                      <div
                        key={g.id}
                        className="p-4 flex items-center gap-3 hover:bg-slate-50/80 transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-xs"
                          style={{ background: EMERALD_GRADIENT }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{g.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {g.subject} · {g.teacher?.name || "O'qituvchi"}
                          </p>
                        </div>
                        <Link
                          to={`/assignments?groupId=${g.id}`}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-500 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-emerald-50/50 transition-colors cursor-pointer text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        Yangi guruhga qo'shilish
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines Widget */}
            {assignments.filter((a) => new Date(a.deadline) > new Date()).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Yaqin muddatlar</h3>
                </div>
                <div className="space-y-3">
                  {assignments
                    .filter((a) => new Date(a.deadline) > new Date())
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .slice(0, 4)
                    .map((a) => {
                      const diff = Math.ceil((new Date(a.deadline) - new Date()) / 86400000);
                      const isUrgent = diff <= 1;
                      return (
                        <div key={a.id} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                              }`}
                            />
                            <span className="text-xs text-slate-600 font-medium truncate">
                              {a.title}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-black flex-shrink-0 px-2 py-0.5 rounded-lg ${
                              isUrgent
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            }`}
                          >
                            {diff <= 0 ? 'Bugun' : `${diff}k`}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {completionRate >= 50 && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/70 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-emerald-700/20"
                  style={{ background: EMERALD_GRADIENT }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950">A'lo natija! 🎉</h4>
                  <p className="text-xs text-emerald-800/80 mt-0.5 font-medium leading-relaxed">
                    Topshiriqlarning <strong>{completionRate}%</strong>ini muvaffaqiyatli
                    bajardingiz!
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
              O'qituvchingiz yuborgan taklif kodi yoki to'liq havolani kiriting.
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
    </div>
  );
};

export default Dashboard;
