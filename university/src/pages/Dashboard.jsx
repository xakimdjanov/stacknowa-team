import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || 'all';
      const res = await api.get(`/universities/${uniId}/stats`);
      if (res.data) {
        setStats(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.log("Fetch stats error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
              ENTERPRISE PRO PLAN
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              Code: {user?.university_code || "TATU-9842"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">{user?.name || "Toshkent Axborot Texnologiyalari Universiteti"}</h1>
          <p className="text-xs text-slate-400 font-medium max-w-xl">
            O'qituvchilar tarkibi, fakultetlar va dars jarayonlarining real-vaqt monitoringi va statistikasi
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Online Davomat %</div>
            <div className="text-2xl font-black text-emerald-400">{stats.attendanceRate}%</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Faol Live Eventlar</div>
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-current animate-pulse" />
              {stats.activeEvents}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">O'qituvchilar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalTeachers} ta</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Tasdiqlangan o'qituvchilar
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Talabalar</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalStudents} kishi</div>
          <div className="text-[11px] text-indigo-600 font-semibold">Tizimda faol talabalar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fakultet va Kafedralar</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalFaculties} / {stats.totalDepartments}</div>
          <div className="text-[11px] text-amber-600 font-semibold">Fakultet / Kafedralar soni</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Guruhlar Soni</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.totalGroups} guruh</div>
          <div className="text-[11px] text-cyan-600 font-semibold">Dars guruhlari</div>
        </div>
      </div>

      {/* Topshiriqlar va AI Baholash statistikasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Topshiriqlar va AI Baholash Natijalari</h3>
              <p className="text-xs text-slate-500">Universitet talabalari tomonidan topshirilgan amaliy ishlar</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Jami: 2,135 ta ish
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-1">
              <div className="text-2xl font-black text-emerald-700">{stats.assignments.submitted}</div>
              <div className="text-xs font-bold text-emerald-800">Tekshirildi & AI Baholandi</div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 space-y-1">
              <div className="text-2xl font-black text-amber-700">{stats.assignments.reviewing}</div>
              <div className="text-xs font-bold text-amber-800">Qayta ishlashda (Review)</div>
            </div>

            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100 space-y-1">
              <div className="text-2xl font-black text-rose-700">{stats.assignments.missing}</div>
              <div className="text-xs font-bold text-rose-800">Topshirilmadi</div>
            </div>
          </div>
        </div>

        {/* Tarif & To'lov holati vidjeti */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                TO'LANGAN (PAID)
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-base">Obuna Ma'lumotlari</h4>
              <p className="text-xs text-slate-500">Enterprise Pro Yillik Obunasi</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Summa:</span>
                <span className="font-bold text-slate-800">$3,500 / yil</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Muddati:</span>
                <span className="font-bold text-emerald-700">2027-09-25 gacha</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>To'lov usuli:</span>
                <span className="font-bold text-slate-800">Uzcard / InPay Invoice</span>
              </div>
            </div>
          </div>

          <a
            href="/billing"
            className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl text-center shadow-md hover:bg-slate-800 transition-colors block"
          >
            To'lovlar Tarixini Ko'rish ➔
          </a>
        </div>
      </div>
    </div>
  );
}
