import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Users, 
  Layers, 
  FileCheck2, 
  AlertTriangle, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    activePlans: 0,
  });
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [groupsRes, plansRes] = await Promise.all([
        api.get('/groups/my'),
        api.get('/plans'),
      ]);

      const groups = groupsRes.data.groups || [];
      const plans = plansRes.data.plans || [];

      let assignmentsCount = 0;
      groups.forEach((g) => {
        assignmentsCount += g.assignments?.length || 0;
      });

      setStats({
        totalGroups: groups.length,
        totalAssignments: assignmentsCount,
        totalSubmissions: 12, // Namoyish uchun
        activePlans: plans.length,
      });

      setRecentGroups(groups.slice(0, 5));
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Jami Guruhlar', value: stats.totalGroups, icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Topshiriqlar', value: stats.totalAssignments, icon: FileCheck2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'AI Baholangan Ishlar', value: stats.totalSubmissions, icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Faol Tariflar', value: stats.activePlans, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platforma Tahlili & Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">
          Universitet amaliy ishlari, AI baholash jarayonlari va obunalar statistikasi.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{c.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Practice Core Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
            Hackathon MVP 2026
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Avtomatlashtirilgan Ta'lim Ekotizimi
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            O'qituvchilar uchun self-service guruh havolalari, talabalar uchun raqamli ish maydoni va
            har bir ish uchun avtomatlashtirilgan AI baholash, rubrika taqsimoti hamda plagiat tahlili.
          </p>
        </div>
      </div>

      {/* Recent Groups Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">So'nggi Yaratilgan Guruhlar</h3>
            <p className="text-xs text-slate-500 mt-0.5">O'qituvchilar tomonidan yaratilgan faol guruhlar</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Guruh Nomi</th>
                <th className="px-6 py-4">Fan</th>
                <th className="px-6 py-4">Kurs & Semestr</th>
                <th className="px-6 py-4">O'qituvchi</th>
                <th className="px-6 py-4">Talabalar Soni</th>
                <th className="px-6 py-4">Join Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentGroups.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm">
                    Hozircha guruhlar mavjud emas
                  </td>
                </tr>
              ) : (
                recentGroups.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{g.name}</td>
                    <td className="px-6 py-4 text-slate-600">{g.subject}</td>
                    <td className="px-6 py-4 text-slate-600">{g.course}-kurs, {g.semester}-semestr</td>
                    <td className="px-6 py-4 text-slate-600">{g.teacher?.name || 'Nomaʼlum'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {g.members?.length || 0} talaba
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold">{g.join_token}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
