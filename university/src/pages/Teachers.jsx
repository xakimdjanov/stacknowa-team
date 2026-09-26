import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Users,
  Layers,
  Sparkles,
  Loader2,
  RefreshCw,
  Mail,
  Calendar,
  Building2
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Teachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [user]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || 'all';
      const res = await api.get(`/universities/${uniId}/teachers`);
      if (res.data?.teachers) {
        setTeachers(res.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.log("Fetch teachers error:", err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">O'qituvchilar Tarkibi</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Universitetda faoliyat yuritayotgan barcha tasdiqlangan o'qituvchilar va ularning guruhlari
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTeachers}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-2.5 rounded-xl border border-emerald-200 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Jami o'qituvchilar: {teachers.length} ta
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="O'qituvchi ismi yoki emaili bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
        />
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">O'qituvchilar ro'yxati bazadan yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Tasdiqlangan o'qituvchilar topilmadi</h3>
          <p className="text-xs text-slate-500">Hozircha universitetda faol o'qituvchilar mavjud emas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => {
            const initials = t.name
              ? t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : 'T';
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-base shadow-md">
                    {initials}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    TASDIQLANGAN (APPROVED)
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-800">{t.name}</h3>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {t.email}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">Biriktirilgan Guruhlar:</span>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {t.created_groups?.length || 0} ta guruh
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">Ro'yxatdan o'tgan sana:</span>
                    <span className="font-medium text-slate-800">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : "2026-09-25"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
