import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../api/client';
import api from '../api/client';
import { 
  Users, 
  Layers, 
  FileCheck2, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let totalStudents = 0;
  let totalAssignments = 0;
  groups.forEach((g) => {
    totalStudents += g.members?.length || 0;
    totalAssignments += g.assignments?.length || 0;
  });

  if (loading) {
    return <div className="p-8 max-w-[1400px] mx-auto min-h-screen">Loading dashboard...</div>;
  }
  const cards = [
    { label: 'Guruhlarim', value: groups.length, icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Jami Talabalar', value: totalStudents, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Topshiriqlar', value: totalAssignments, icon: FileCheck2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'AI Baholash', value: '100% Avto', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">O'qituvchi Boshqaruv Markazi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Guruhlar statistikasi, amaliy topshiriqlar va talabalar faolligi.
          </p>
        </div>
        <Link
          to="/groups"
          className="inline-flex items-center space-x-2 bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-blue-500/20 text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Guruh Yaratish</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Active groups</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{groups.length}</h2>
          <p className="text-xs font-semibold text-blue-600">+2 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Pending reviews</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">12</h2>
          <p className="text-xs font-semibold text-blue-600">4 urgent</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">AI evaluations</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">1,240</h2>
          <p className="text-xs font-semibold text-blue-600">+14%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Avg score</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">86.4</h2>
          <p className="text-xs font-semibold text-blue-600">↑ 4.8%</p>
        </div>
      </div>

      {/* Middle Two Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Teaching Workload */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Teaching workload</h3>
            <p className="text-xs text-slate-500 font-medium">Current assignments and review queue</p>
          </div>
          
          <div className="space-y-6">
            {groups.flatMap(g => g.assignments || []).slice(0, 4).length > 0 ? (
              groups.flatMap(g => g.assignments || []).slice(0, 4).map((assignment, idx) => (
                <div key={assignment.id || idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 w-1/3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-sm font-bold text-slate-900">{assignment.title || 'Assignment'}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 w-1/3 text-center">0 submissions</span>
                  <span className="text-xs font-bold text-slate-500 w-1/3 text-right">
                    {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs font-medium text-slate-400">Hozircha topshiriqlar yo'q</div>
            )}
          </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
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

      {/* Core Principle Banner */}
      <div className="bg-gradient-to-r from-[#1d58d8] via-blue-700 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
            Self-Service Guruh Mexanizmi
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Talabalarni qo'lda qo'shish shart emas!
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Guruh oching, bir marta QR-kod yoki havolani ulashing. Talabalar mustaqil qo'shiladi va amaliy ishlarini raqamli doskada topshiradi. AI esa bir necha soniyada rubrika bo'yicha baholaydi!
          </p>
        </div>
      </div>

        {/* Group Health */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Group health</h3>
            <p className="text-xs text-slate-500 font-medium">Completion by active cohort</p>
          </div>

          <div className="space-y-6">
            {groups.length > 0 ? (
              groups.slice(0, 4).map((group, idx) => {
                const colors = ['bg-blue-600', 'bg-teal-500', 'bg-orange-500', 'bg-purple-600'];
                const color = colors[idx % colors.length];
                // Simulated completion rate
                const completion = Math.floor(Math.random() * 20) + 75; 
                return (
                  <div key={group.id || idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-900">{group.name}</span>
                      <span className="text-xs font-bold text-slate-900">{completion}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${completion}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs font-medium text-slate-400">Hozircha guruhlar yo'q</div>
            )}
      {/* Groups List Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Faol Guruhlarim</h3>
            <p className="text-xs text-slate-500 mt-0.5">Siz rahbarlik qilayotgan akademik guruhlar</p>
          </div>
          <Link to="/groups" className="text-xs font-bold text-[#1d58d8] hover:underline flex items-center">
            <span>Barchasini ko'rish</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Guruh Nomi</th>
                <th className="px-6 py-4">Fan</th>
                <th className="px-6 py-4">Talabalar</th>
                <th className="px-6 py-4">Topshiriqlar</th>
                <th className="px-6 py-4">Join Token</th>
                <th className="px-6 py-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm">
                    Hozircha guruhlar mavjud emas. Yangi guruh yarating!
                  </td>
                </tr>
              ) : (
                groups.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{g.name}</td>
                    <td className="px-6 py-4 text-slate-600">{g.subject}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {g.members?.length || 0} nafar
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{g.assignments?.length || 0} ta</td>
                    <td className="px-6 py-4 font-mono text-xs text-[#1d58d8] font-bold">{g.join_token}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/groups"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Batafsil
                      </Link>
                    </td>
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
