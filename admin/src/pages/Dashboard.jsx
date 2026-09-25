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
} from 'lucide-react';

/* ─── Mini Inline Bar Chart ─────────────────────────── */
const MiniBar = ({ values = [], color = '#6366f1' }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            height: `${Math.max(15, (v / max) * 100)}%`,
            backgroundColor: color,
            opacity: i === values.length - 1 ? 1 : 0.35 + i * 0.1,
            borderRadius: '3px 3px 0 0',
            width: '6px',
            transition: 'height 0.6s ease',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, gradient, barColor, trend, trendLabel, bars }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between"
    style={{
      background: gradient,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      minHeight: '148px',
    }}
  >
    {/* Top row */}
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-white leading-none">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>

    {/* Bottom row */}
    <div className="flex items-end justify-between mt-4">
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80">
        <ArrowUpRight className="w-3.5 h-3.5" />
        {trendLabel}
      </span>
      <MiniBar values={bars} color={barColor} />
    </div>

    {/* Decorative circle */}
    <div
      className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10"
      style={{ background: 'white' }}
    />
  </div>
);

/* ─── Quick Info Card ────────────────────────────────── */
const QuickInfo = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-base font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────── */
const Dashboard = () => {
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
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      barColor: '#a5b4fc',
      trendLabel: 'Faol guruhlar',
      bars: [2, 3, 4, 3, 5, 4, stats.totalGroups || 1],
    },
    {
      label: 'Topshiriqlar',
      value: stats.totalAssignments,
      icon: FileCheck2,
      gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      barColor: '#6ee7b7',
      trendLabel: 'Barcha topshiriqlar',
      bars: [1, 3, 2, 4, 3, 5, stats.totalAssignments || 1],
    },
    {
      label: 'AI Baholangan',
      value: stats.totalSubmissions,
      icon: Sparkles,
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
      barColor: '#f0abfc',
      trendLabel: 'Jami ishlar',
      bars: [3, 5, 4, 7, 6, 9, 12],
    },
    {
      label: 'Faol Tariflar',
      value: stats.activePlans,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      barColor: '#fde68a',
      trendLabel: 'Hozirgi tariflar',
      bars: [1, 1, 2, 2, 2, stats.activePlans || 1, stats.activePlans || 1],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 pt-7 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-indigo-500 text-sm font-semibold mb-1">
                {greeting}, Super Admin 👋
              </p>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Platforma Tahlili
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Barcha o'qituvchilar, talabalar va AI baholash jarayonlarini kuzating.
              </p>
            </div>
            {/* Live Indicator */}
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 self-start sm:self-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-700 text-xs font-semibold">Sistema Faol</span>
            </div>
          </div>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c, i) => (
              <StatCard key={i} {...c} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* ── Quick Info Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickInfo
            icon={Users}
            label="Jami Foydalanuvchilar"
            value={`${stats.totalUsers} ta hisob`}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <QuickInfo
            icon={Shield}
            label="Tizim Holati"
            value="Barcha tizimlar faol"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <QuickInfo
            icon={Zap}
            label="AI Integratsiya"
            value="Gemini 1.5 Flash"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
          <QuickInfo
            icon={Activity}
            label="Server Vaqti"
            value={now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* ── Recent Groups Table + Side Panel ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Table — takes 2/3 */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">So'nggi Yaratilgan Guruhlar</h3>
                <p className="text-xs text-slate-400 mt-0.5">O'qituvchilar tomonidan yaratilgan faol guruhlar</p>
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full">
                {recentGroups.length} ta guruh
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
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
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((__, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + j * 8}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentGroups.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-14 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Layers className="w-8 h-8 opacity-30" />
                          <p className="text-sm font-medium">Hozircha guruhlar mavjud emas</p>
                          <p className="text-xs">O'qituvchilar guruh yaratgandan keyin bu yerda ko'rinadi</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentGroups.map((g) => (
                      <tr
                        key={g.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                            {g.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs">{g.subject}</td>
                        <td className="px-5 py-3.5">
                          <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            {g.course}-kurs
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-xs">{g.teacher?.name || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            <Users className="w-3 h-3" />
                            {g.members?.length || 0}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <code className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider">
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Tizim Ko'rsatkichlari</h4>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Guruhlar dolzarbligi', value: stats.totalGroups > 0 ? 92 : 0, color: '#6366f1' },
                  { label: 'AI baholash sifati', value: 87, color: '#8b5cf6' },
                  { label: 'To\'lov muvaffaqiyati', value: 94, color: '#059669' },
                  { label: 'Foydalanuvchi faolligi', value: stats.totalUsers > 0 ? 78 : 0, color: '#d97706' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">{item.label}</span>
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
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <h4 className="text-sm font-bold">Tez Harakatlar</h4>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Users, label: 'Foydalanuvchi qo\'shish', href: '/users' },
                  { icon: Layers, label: 'Guruhlarni ko\'rish', href: '/groups' },
                  { icon: BookOpen, label: 'Tariflarni boshqarish', href: '/plans' },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 group"
                  >
                    <action.icon className="w-4 h-4 text-indigo-200" />
                    <span className="text-xs font-semibold text-white">{action.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-200 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer info ── */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Oxirgi yangilanish: {now.toLocaleString('uz-UZ')}
          </span>
          <span>AI Practice Admin Panel v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
