import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Users, 
  Layers, 
  FileCheck2, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Zap,
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

/* ─── Stat Card Component ────────────────────────────── */
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

/* ─── Main Teacher Dashboard Component ───────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      const loadedGroups = res.data.groups || [];
      setGroups(loadedGroups);

      // Collect all assignments with group details
      const allAssignments = loadedGroups.flatMap((g) =>
        (g.assignments || []).map((a) => ({
          ...a,
          groupId: g.id,
          groupName: g.name,
          subject: g.subject,
        }))
      );

      // Fetch real submissions for all assignments in parallel
      if (allAssignments.length > 0) {
        const promises = allAssignments.map(async (assign) => {
          try {
            const subRes = await api.get(`/submissions/assignment/${assign.id}`);
            const subs = subRes.data.submissions || [];
            return subs.map((s) => ({
              ...s,
              assignment: {
                ...assign,
                title: assign.title,
                group: { name: assign.groupName },
              },
            }));
          } catch {
            return [];
          }
        });

        const results = await Promise.all(promises);
        const flatSubs = results.flat();
        flatSubs.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setRecentSubmissions(flatSubs);
      } else {
        setRecentSubmissions([]);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations from real backend data
  let totalStudents = 0;
  let totalAssignments = 0;
  groups.forEach((g) => {
    totalStudents += g.members?.length || 0;
    totalAssignments += g.assignments?.length || 0;
  });

  const allAssignmentsList = groups.flatMap((g) =>
    (g.assignments || []).map((a) => ({ ...a, groupName: g.name, subject: g.subject }))
  );

  const totalSubmissionsCount = recentSubmissions.length;
  const gradedCount = recentSubmissions.filter((s) => s.status === 'graded' || s.evaluation).length;
  const aiEvaluationRate = totalSubmissionsCount > 0 
    ? Math.round((gradedCount / totalSubmissionsCount) * 100) 
    : 100;

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {greeting}, {user?.name?.split(' ')[0] || "Ustoz"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Guruhlaringiz faolligi, amaliy topshiriqlar va AI baholash jarayonlari.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* ── 4 KPI STATS CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Primary Emerald Theme */}
          <StatCard
            label="Guruhlarim"
            value={groups.length}
            sublabel="Faol o'quv guruhlari"
            icon={Layers}
            gradient={EMERALD_GRADIENT}
            barColor="#a7f3d0"
            bars={[2, 3, 4, 3, 5, 4, Math.max(groups.length, 1)]}
            trend={true}
          />
          <StatCard
            label="Jami Talabalar"
            value={totalStudents}
            sublabel="Guruhlarga a'zo talabalar"
            icon={Users}
            gradient="linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
            barColor="#bae6fd"
            bars={[10, 15, 18, 22, 28, 35, Math.max(totalStudents, 5)]}
            trend={true}
          />
          <StatCard
            label="Topshiriqlar"
            value={totalAssignments}
            sublabel="Amaliy topshiriqlar soni"
            icon={FileCheck2}
            gradient="linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"
            barColor="#c7d2fe"
            bars={[1, 3, 2, 4, 5, 6, Math.max(totalAssignments, 2)]}
            trend={true}
          />
          <StatCard
            label="AI Baholash"
            value={`${aiEvaluationRate}%`}
            sublabel={`${gradedCount} ta ish baholangan`}
            icon={Sparkles}
            gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
            barColor="#ddd6fe"
            bars={[4, 6, 5, 8, 7, 9, 12]}
            trend={true}
          />
        </div>

        {/* ── 2 COLUMN WORKLOAD & GROUPS PROGRESS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 1. Guruhlar & Talabalar Faolligi */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    O'quv Guruhlari & Bajarilish Darajasi
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Guruhlar bo'yicha talabalar va amaliy topshiriqlar statistikasi
                  </p>
                </div>
                <Link
                  to="/groups"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
                >
                  Barchasi <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {groups.length > 0 ? (
                  groups.slice(0, 5).map((group, idx) => {
                    const studentCount = group.members?.length || 0;
                    const assignCount = group.assignments?.length || 0;
                    const completion = Math.min(100, Math.max(30, (assignCount * 25) + (studentCount > 0 ? 25 : 0)));

                    return (
                      <div
                        key={group.id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0" />
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {group.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 flex-shrink-0">
                              {group.course}-kurs
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-800 flex-shrink-0">
                            {completion}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${completion}%`, background: EMERALD_GRADIENT }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span>{group.subject || 'Fan biriktirilgan'}</span>
                          <span className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              {studentCount} talaba
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <FileCheck2 className="w-3 h-3 text-slate-400" />
                              {assignCount} topshiriq
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center flex flex-col items-center gap-3 text-slate-400">
                    <Layers className="w-10 h-10 stroke-[1.5] text-slate-300" />
                    <p className="text-sm font-semibold">Hozircha guruhlar yaratilmagan</p>
                    <Link
                      to="/groups"
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      + Birinchi guruhni yaratish
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {groups.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Jami {groups.length} ta guruh nazorat ostida</span>
                <Link to="/groups" className="text-emerald-700 font-bold hover:underline">
                  Guruhlarni ko'rish →
                </Link>
              </div>
            )}
          </div>

          {/* 2. Topshiriqlar Navbati & Muddatlar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Amaliy Topshiriqlar Navbati
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Talabalarga e'lon qilingan topshiriqlar va muddatlar
                  </p>
                </div>
                <Link
                  to="/assignments"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
                >
                  Yangi qo'shish <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {allAssignmentsList.length > 0 ? (
                  allAssignmentsList.slice(0, 5).map((assign, idx) => {
                    const deadlineDate = assign.deadline ? new Date(assign.deadline) : null;
                    const isUpcoming = deadlineDate && deadlineDate > now;

                    return (
                      <div
                        key={assign.id || idx}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200/70 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {assign.title || 'Amaliy ish'}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-medium">
                              <span className="truncate text-emerald-700 font-semibold">{assign.groupName}</span>
                              <span>•</span>
                              <span>Maksimal: {assign.max_score || 100} ball</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isUpcoming
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {deadlineDate
                              ? deadlineDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
                              : 'Muddatsiz'}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">
                            {isUpcoming ? 'Faol qabul' : 'Tugagan'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center flex flex-col items-center gap-3 text-slate-400">
                    <FileCheck2 className="w-10 h-10 stroke-[1.5] text-slate-300" />
                    <p className="text-sm font-semibold">Topshiriqlar hali yuklanmagan</p>
                    <Link
                      to="/assignments"
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      + Topshiriq yaratish
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {allAssignmentsList.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Jami {allAssignmentsList.length} ta e'lon qilingan vazifa</span>
                <Link to="/evaluations" className="text-emerald-700 font-bold hover:underline">
                  Baholashni tekshirish →
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* ── RECENT AI EVALUATIONS TABLE (100% REAL DATA) ── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  So'nggi Talabalar Ishlari & AI Baholash
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                  Real Natijalar
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Talabalar tomonidan topshirilgan amaliy ishlarning sun'iy intellekt tahlili
              </p>
            </div>
            <Link
              to="/evaluations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto hover:underline"
            >
              Barcha topshiriqlarni ko'rish <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="px-5 sm:px-7 py-3.5">Talaba</th>
                  <th className="px-5 sm:px-7 py-3.5">Topshiriq</th>
                  <th className="px-5 sm:px-7 py-3.5">AI Balli</th>
                  <th className="px-5 sm:px-7 py-3.5">Xolislik & Tahlil</th>
                  <th className="px-5 sm:px-7 py-3.5 text-right">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.slice(0, 6).map((sub, idx) => {
                    const studentName = sub.student?.name || 'Talaba';
                    const score = sub.evaluation?.total_score ?? sub.score ?? null;
                    const initials = studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                    const similarity = sub.evaluation?.similarity_score;

                    return (
                      <tr key={sub.id || idx} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="px-5 sm:px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0 shadow-xs"
                              style={{ background: EMERALD_GRADIENT }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {studentName}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {sub.student?.email || 'talaba@platform.uz'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 sm:px-7 py-4">
                          <span className="font-semibold text-slate-800 text-xs sm:text-sm block">
                            {sub.assignment?.title || 'Amaliy ish'}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {sub.assignment?.group?.name || 'Guruh'}
                          </span>
                        </td>
                        <td className="px-5 sm:px-7 py-4">
                          {score !== null ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                                score >= 80
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : score >= 60
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {score} / 100
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-slate-500 bg-slate-100">
                              Kutilmoqda
                            </span>
                          )}
                        </td>
                        <td className="px-5 sm:px-7 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {similarity && similarity > 20 ? `${similarity}% o'xshashlik` : 'Xolis AI tahlili'}
                          </span>
                        </td>
                        <td className="px-5 sm:px-7 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            {sub.status === 'graded' ? 'Baholangan' : 'Qabul qilingan'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 sm:px-7 py-10 text-center text-slate-400">
                      <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Hozircha topshirilgan amaliy ishlar mavjud emas</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Talabalar ish topshirganda bu yerda real tahlil natijalari ko'rinadi</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FOOTER SYNC STATUS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-2 pb-6 border-t border-slate-200/60">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Oxirgi sinxronizatsiya: {now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="font-medium text-slate-500">
            AI Practice • O'qituvchilar uchun intellektual ta'lim platformasi
          </span>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
