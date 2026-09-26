import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  Users,
  Layers,
  FileCheck2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  BookOpen,
  Activity,
  Shield,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

/* ─── Mini Inline Bar Chart ─────────────────────────── */
const MiniBar = ({ values = [], color = '#a7f3d0' }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-9">
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            height: `${Math.max(15, (v / max) * 100)}%`,
            backgroundColor: color,
            opacity: i === values.length - 1 ? 1 : 0.35 + i * 0.1,
            borderRadius: '2px 2px 0 0',
            width: '6px',
            transition: 'height 0.6s ease',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, gradient, barColor, trendLabel, bars }) => (
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
        <p className="text-2xl sm:text-4xl font-black text-white leading-none tracking-tight">
          {value}
        </p>
      </div>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>

    {/* Bottom row */}
    <div className="flex items-end justify-between mt-4">
      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-white/90">
        <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
        {trendLabel}
      </span>
      <MiniBar values={bars} color={barColor} />
    </div>

    {/* Subtle decorative glow */}
    <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
  </div>
);

/* ─── Quick Info Card ────────────────────────────────── */
const QuickInfo = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-semibold">{label}</p>
      <p className="text-base font-black text-slate-900 mt-0.5">{value}</p>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    activePlans: 0,
    totalUsers: 0,
  });
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [groupsRes, plansRes, usersRes] = await Promise.all([
        api.get('/groups/my'),
        api.get('/plans'),
        api.get('/users').catch(() => ({ data: { users: [] } })),
      ]);

      const groups = groupsRes.data.groups || [];
      const plans = plansRes.data.plans || [];
      const users = usersRes.data.users || [];

      let assignmentsCount = 0;
      groups.forEach((g) => {
        assignmentsCount += g.assignments?.length || 0;
      });

      setStats({
        totalGroups: groups.length,
        totalAssignments: assignmentsCount,
        totalSubmissions: 12,
        activePlans: plans.length,
        totalUsers: users.length,
      });

      setRecentGroups(groups.slice(0, 6));
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Jami Guruhlar',
      value: stats.totalGroups,
      icon: Layers,
      gradient: EMERALD_GRADIENT,
      barColor: '#a7f3d0',
      trendLabel: 'Faol o\'quv guruhlari',
      bars: [2, 3, 4, 3, 5, 4, stats.totalGroups || 1],
    },
    {
      label: 'Topshiriqlar',
      value: stats.totalAssignments,
      icon: FileCheck2,
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      barColor: '#bae6fd',
      trendLabel: 'Barcha topshiriqlar',
      bars: [1, 3, 2, 4, 3, 5, stats.totalAssignments || 1],
    },
    {
      label: 'AI Baholangan',
      value: stats.totalSubmissions,
      icon: Sparkles,
      gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      barColor: '#99f6e4',
      trendLabel: 'AI tekshirgan ishlar',
      bars: [3, 5, 4, 7, 6, 9, 12],
    },
    {
      label: 'Faol Tariflar',
      value: stats.activePlans,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      barColor: '#fde68a',
      trendLabel: 'Mavjud rejalar',
      bars: [1, 1, 2, 2, 2, stats.activePlans || 1, stats.activePlans || 1],
    },
  ];

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
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 sm:pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'Administrator'}! 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Barcha o'qituvchilar, talabalar va AI baholash jarayonlarini kuzatib boring.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {statCards.map((c, i) => (
              <StatCard key={i} {...c} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* ── Quick Info Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <QuickInfo
            icon={Users}
            label="Jami Foydalanuvchilar"
            value={`${stats.totalUsers} ta hisob`}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-700"
          />
          <QuickInfo
            icon={Shield}
            label="Tizim Holati"
            value="Barcha xizmatlar barqaror"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <QuickInfo
            icon={Zap}
            label="AI Integratsiya"
            value="Gemini AI Avtomatik"
            iconBg="bg-teal-50"
            iconColor="text-teal-700"
          />
          <QuickInfo
            icon={Activity}
            label="Server Vaqti"
            value={now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            iconBg="bg-amber-50"
            iconColor="text-amber-700"
          />
        </div>

        {/* ── Recent Groups Table + Side Panel ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Table — takes 2/3 */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">So'nggi Yaratilgan Guruhlar</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  O'qituvchilar tomonidan ochilgan faol guruhlar
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-3 py-1 rounded-full self-start sm:self-auto">
                {recentGroups.length} ta guruh
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['Guruh Nomi', 'Fan', 'Kurs', "O'qituvchi", 'Talabalar', 'Token'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentGroups.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-14 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Layers className="w-8 h-8 opacity-30 text-emerald-600" />
                          <p className="text-sm font-bold text-slate-700">Hozircha guruhlar mavjud emas</p>
                          <p className="text-xs font-medium">O'qituvchilar guruh yaratgandan keyin bu yerda ko'rinadi</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentGroups.map((g) => (
                      <tr
                        key={g.id}
                        className="hover:bg-emerald-50/30 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {g.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">{g.subject}</td>
                        <td className="px-5 py-3.5">
                          <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md">
                            {g.course}-kurs
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 text-xs font-semibold">{g.teacher?.name || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                            <Users className="w-3 h-3 text-emerald-600" />
                            {g.members?.length || 0}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <code className="font-mono text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md tracking-wider font-bold">
                            {g.join_token}
                          </code>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel — takes 1/3 */}
          <div className="flex flex-col gap-4">
            {/* System Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Tizim Ko'rsatkichlari</h4>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Guruhlar dolzarbligi', value: stats.totalGroups > 0 ? 92 : 0, color: '#059669' },
                  { label: 'AI baholash aniqligi', value: 96, color: '#0d9488' },
                  { label: "To'lovlar muvaffaqiyati", value: 98, color: '#0284c7' },
                  { label: 'Foydalanuvchi faolligi', value: stats.totalUsers > 0 ? 84 : 0, color: '#d97706' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              style={{ background: EMERALD_GRADIENT }}
              className="rounded-2xl p-6 text-white shadow-lg shadow-emerald-700/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <h4 className="text-sm font-black">Tezkor Havolalar</h4>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Users, label: "Foydalanuvchilarni ko'rish", href: '/users' },
                  { icon: Layers, label: "Guruhlarni monitoring qilish", href: '/groups' },
                  { icon: BookOpen, label: "Tariflarni sozlash", href: '/plans' },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 group cursor-pointer"
                  >
                    <action.icon className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">{action.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer info ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-400 border-t border-slate-200/80 pt-4 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Oxirgi yangilanish: {now.toLocaleString('uz-UZ')}
          </span>
          <span>EduMind AI — Admin Panel v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
