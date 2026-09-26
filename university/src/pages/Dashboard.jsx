import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  FileText,
  KeyRound,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  Activity,
  Check,
  UserCheck
} from 'lucide-react';

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

/* ─── Executive Stat Card Component ──────────────────── */
const ExecutiveStatCard = ({
  label,
  value,
  sublabel,
  icon: Icon,
  gradient,
  bars,
  barColor,
  trend = true,
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    style={{
      background: gradient,
      boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
      minHeight: '145px',
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

/* ─── Quick Info Metric Box ──────────────────────────── */
const QuickInfo = ({ icon: Icon, label, value, subtext, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:shadow-md transition-all">
    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 border border-slate-100`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      <p className="text-base sm:text-lg font-black text-slate-900 truncate leading-snug">{value}</p>
      {subtext && <p className="text-[11px] text-slate-500 font-medium truncate">{subtext}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalFaculties: 0,
    totalDepartments: 0,
    totalGroups: 0,
    activeEvents: 0,
    attendanceRate: 0,
    assignments: { submitted: 0, reviewing: 0, missing: 0 }
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  const formatUzbekDate = () => {
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];
    return `${now.getDate()}-${months[now.getMonth()]}, ${now.getFullYear()}-yil`;
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || 'all';
      const [statsRes, pendingRes] = await Promise.all([
        api.get(`/universities/${uniId}/stats`).catch(() => ({ data: null })),
        api.get(`/universities/${uniId}/pending-teachers`).catch(() => ({ data: { pendingTeachers: [] } }))
      ]);

      if (statsRes.data) {
        setStats(prev => ({ ...prev, ...statsRes.data }));
      }
      if (pendingRes.data?.pendingTeachers) {
        setPendingCount(pendingRes.data.pendingTeachers.length);
      }
    } catch (err) {
      console.log("Fetch stats error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const planRaw = user?.university_plan || user?.university?.plan_name || 'ENTERPRISE';
  const isStarter = String(planRaw).toUpperCase().includes('STARTER');
  const isStandart = String(planRaw).toUpperCase().includes('STANDART') || String(planRaw).toUpperCase().includes('STANDARD');
  
  const planTitle = isStarter ? "Starter Yillik B2B Tarif" : isStandart ? "Standart Yillik B2B Tarif" : "Enterprise Yillik B2B Tarif";
  const planBadge = isStarter ? "STARTER PLAN" : isStandart ? "STANDART PLAN" : "ENTERPRISE PLAN";
  const planPrice = isStarter ? "12 mln so‘m / yil" : isStandart ? "24 mln so‘m / yil" : "36 mln so‘m / yil";

  // Assignment calculations
  const totalSubmissions = (stats.assignments?.submitted || 0) + (stats.assignments?.reviewing || 0) + (stats.assignments?.missing || 0);
  const completionPercent = totalSubmissions > 0 
    ? Math.round(((stats.assignments?.submitted || 0) / totalSubmissions) * 100) 
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Greeting Header ── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {planBadge}
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              OTM Kodi: <strong className="text-slate-900">{user?.university_code || "NAMD-6185"}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {greeting}, {user?.university_name || user?.name || "NamDTU"}! 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
            Universitet faoliyati, fakultetlar va o‘quv jarayonlarining real-vaqt monitoringi va intellektual boshqaruv paneli
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs text-slate-700 text-xs font-bold">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{formatUzbekDate()}</span>
          </div>

          <Link
            to="/teacher-approvals"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all"
            style={{ background: EMERALD_GRADIENT }}
          >
            <UserCheck className="w-4 h-4" />
            <span>Arizalar</span>
            {pendingCount > 0 && (
              <span className="bg-white text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── 4 Executive Gradient Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <ExecutiveStatCard
          label="O‘qituvchilar Tarkibi"
          value={`${stats.totalTeachers} ta`}
          sublabel="Tasdiqlangan ustozlar"
          icon={GraduationCap}
          gradient={EMERALD_GRADIENT}
          barColor="#a7f3d0"
          bars={[3, 5, 4, 7, 6, 8, Math.max(stats.totalTeachers, 1)]}
        />

        <ExecutiveStatCard
          label="Jami Talabalar"
          value={`${stats.totalStudents} kishi`}
          sublabel="Tizimda faol talabalar"
          icon={Users}
          gradient="linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
          barColor="#bae6fd"
          bars={[12, 18, 15, 24, 20, 28, Math.max(stats.totalStudents, 1)]}
        />

        <ExecutiveStatCard
          label="Fakultet / Kafedra"
          value={`${stats.totalFaculties} / ${stats.totalDepartments}`}
          sublabel="Tashkiliy tuzilmalar soni"
          icon={Layers}
          gradient="linear-gradient(135deg, #6366f1 0%, #4338ca 100%)"
          barColor="#c7d2fe"
          bars={[1, 2, 2, 3, 3, 4, Math.max(stats.totalFaculties + stats.totalDepartments, 1)]}
        />

        <ExecutiveStatCard
          label="Akademik Guruhlar"
          value={`${stats.totalGroups} guruh`}
          sublabel="Barcha o‘quv guruhlari"
          icon={Building2}
          gradient="linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"
          barColor="#99f6e4"
          bars={[2, 4, 3, 5, 4, 6, Math.max(stats.totalGroups, 1)]}
        />
      </div>

      {/* ── 4 Quick Metric Indicators ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <QuickInfo
          icon={CheckCircle2}
          label="O‘rtacha Davomat"
          value={`${stats.attendanceRate}%`}
          subtext="Talabalar qatnashish darajasi"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <QuickInfo
          icon={Zap}
          label="Live Darslar Monitoringi"
          value={`${stats.activeEvents} ta dars faol`}
          subtext="Ayni vaqtdagi jonli sessiyalar"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

        <QuickInfo
          icon={Sparkles}
          label="AI Baholangan Ishlar"
          value={`${stats.assignments.submitted} ta amaliy ish`}
          subtext="Avtomatlashtirilgan tekshiruvlar"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <QuickInfo
          icon={ShieldCheck}
          label="Tizim Xavfsizligi"
          value="Faol va Barqaror"
          subtext="B2B shifrlangan ma'lumotlar"
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
        />
      </div>

      {/* ── Middle Two-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Assignments & AI Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topshiriqlar va AI Baholash Natijalari */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Topshiriqlar va AI Baholash Natijalari</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Universitet talabalari tomonidan topshirilgan barcha amaliy ishlar va AI nazorati
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                Real-vaqt tahlili
              </span>
            </div>

            {/* 3 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50/70 border border-emerald-100/90 p-5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Tekshirildi</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700">{stats.assignments.submitted}</div>
                <p className="text-[11px] font-bold text-emerald-900/80">AI Baholangan ishlar</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-100/90 p-5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">Ko‘rib chiqilmoqda</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-700">{stats.assignments.reviewing}</div>
                <p className="text-[11px] font-bold text-amber-900/80">Qayta tekshiruvda</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Qoralama / Kutmoqda</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-700">{stats.assignments.missing}</div>
                <p className="text-[11px] font-bold text-slate-500">Kutilayotgan topshiriqlar</p>
              </div>
            </div>

            {/* AI Progress bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">AI Tekshiruv samaradorligi darajasi:</span>
                <span className="font-black text-emerald-700">{completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(completionPercent, 4)}%`, background: EMERALD_GRADIENT }}
                />
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/teachers"
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  O‘qituvchilar Ro‘yxati
                </h4>
                <p className="text-xs text-slate-500">
                  Professor-ustozlar va ularning faoliyatini boshqarish
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
                <span>Ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/groups"
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-cyan-300 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm group-hover:text-cyan-700 transition-colors">
                  Guruhlar va Details
                </h4>
                <p className="text-xs text-slate-500">
                  Akademik guruhlar va ularning talabalari tarkibi
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-cyan-600 mt-4">
                <span>Ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/structure"
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                  Fakultet & Kafedralar
                </h4>
                <p className="text-xs text-slate-500">
                  Universitet tuzilmasi va bo‘linmalarni sozlash
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 mt-4">
                <span>Ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column (1 Col): Billing & OTM Info */}
        <div className="space-y-6">
          {/* Obuna & To'lov kartasi */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  FAOL (TO‘LANGAN)
                </span>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-lg">Obuna Ma‘lumotlari</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{planTitle}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Yillik to‘lov:</span>
                  <span className="font-black text-slate-900">{planPrice}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>Amal qilish muddati:</span>
                  <span className="font-bold text-emerald-700">2027-09-25 gacha</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span>To‘lov usuli:</span>
                  <span className="font-bold text-slate-900">InPay Shartnoma / Invoice</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium pt-1 border-t border-slate-200/60">
                  <span>Holati:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Tasdiqlangan
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/billing"
              style={{ background: EMERALD_GRADIENT }}
              className="w-full py-3 text-white font-bold text-xs rounded-xl text-center shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Tarif va To‘lovlar Tarixi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* OTM Administratori Kartasi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                {user?.university_name?.substring(0, 2)?.toUpperCase() || "NA"}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-900 text-sm truncate">
                  {user?.university_name || "NamDTU"}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {user?.email || "university@gmail.com"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Boshqaruv roli:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                OTM Administratori
              </span>
            </div>

            <Link
              to="/settings"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Universitet Sozlamalari</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
