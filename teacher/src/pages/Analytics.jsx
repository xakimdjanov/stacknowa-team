import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  BarChart3,
  Users,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Loader2,
  RefreshCw,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [groupSummaries, setGroupSummaries] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [groupDetail, setGroupDetail] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/overview');
      if (res.data) {
        setOverview(res.data.overview);
        setGroupSummaries(res.data.group_summaries || []);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = async (groupId) => {
    setSelectedGroupId(groupId);
    if (groupId === 'all') {
      setGroupDetail(null);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/analytics/group/${groupId}`);
      if (res.data) {
        setGroupDetail(res.data);
      }
    } catch (err) {
      console.error("Group detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tahlil va Statistika</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Guruhlar va talabalarning o'zlashtirish ko'rsatkichlari hamda AI monitoring tahlillari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGroupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Barcha guruhlar bo'yicha</option>
            {groupSummaries.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.subject})
              </option>
            ))}
          </select>

          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !overview ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Statistika bazadan yuklanmoqda...</p>
        </div>
      ) : (
        <>
          {/* Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Jami Talabalar</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedGroupId === 'all'
                    ? overview?.total_students || 0
                    : groupDetail?.analytics?.total_students || 0}{' '}
                  <span className="text-xs font-normal text-slate-400">kishi</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">O'quv Guruhlari</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedGroupId === 'all' ? overview?.total_groups || 0 : 1}{' '}
                  <span className="text-xs font-normal text-slate-400">ta</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Topshiriqlar</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedGroupId === 'all'
                    ? overview?.total_assignments || 0
                    : groupDetail?.analytics?.total_assignments || 0}{' '}
                  <span className="text-xs font-normal text-slate-400">ta</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">O'rtacha Ball</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedGroupId === 'all'
                    ? overview?.average_score || 0
                    : groupDetail?.analytics?.average_score || 0}{' '}
                  <span className="text-xs font-normal text-slate-400">/ 100</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Group Analytics Table / Summaries */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Guruhlar O'zlashtirish Monitoringi</h3>
                <p className="text-xs text-slate-500 font-medium">Barcha o'quv guruhlari va amaliy ishlar natijalari</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3 rounded-l-xl">Guruh Nomi</th>
                    <th className="p-3">Fan</th>
                    <th className="p-3">Talabalar Soni</th>
                    <th className="p-3">Topshiriqlar</th>
                    <th className="p-3">Yuborilgan Ishlar</th>
                    <th className="p-3 rounded-r-xl">O'rtacha Ball</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupSummaries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                        Hali statistika uchun guruhlar mavjud emas.
                      </td>
                    </tr>
                  ) : (
                    groupSummaries.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                            {g.name.slice(0, 2).toUpperCase()}
                          </div>
                          {g.name}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{g.subject}</td>
                        <td className="p-3 font-bold text-indigo-600">{g.student_count} kishi</td>
                        <td className="p-3 text-slate-600">{g.assignment_count} ta</td>
                        <td className="p-3 text-slate-600">{g.submission_count} ta</td>
                        <td className="p-3 font-extrabold text-emerald-600">{g.average_score} ball</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Analytics;
