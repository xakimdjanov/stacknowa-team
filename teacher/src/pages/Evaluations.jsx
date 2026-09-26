import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  User, 
  Percent,
  Search,
  BookOpen, 
  Lock,
  ArrowRight,
  Filter,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  FileCheck2,
  LayoutGrid,
  List,
  AlertCircle,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

const Evaluations = () => {
  const [searchParams] = useSearchParams();
  const initialAssignId = searchParams.get('assignmentId') || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');
  const [selectedAssignId, setSelectedAssignId] = useState(initialAssignId || 'ALL');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'GRADED', 'PENDING'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const { user } = useAuth();

  const isPro = user?.plan_type === 'PRO';

  useEffect(() => {
    fetchGroupsAndSubmissions();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      loadSubmissions();
    }
  }, [selectedGroupId, selectedAssignId]);

  const fetchGroupsAndSubmissions = async () => {
    try {
      setLoading(true);
      const grpRes = await api.get('/groups/my');
      const grps = grpRes.data.groups || [];
      setGroups(grps);

      const allAssignments = grps.flatMap((g) =>
        (g.assignments || []).map((a) => ({
          ...a,
          groupId: g.id,
          groupName: g.name,
          subject: g.subject,
        }))
      );

      if (allAssignments.length > 0) {
        await fetchSubmissionsForAssignments(allAssignments);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsForAssignments = async (assignmentsList) => {
    try {
      const promises = assignmentsList.map(async (assign) => {
        try {
          const res = await api.get(`/submissions/assignment/${assign.id}`);
          const subs = res.data.submissions || [];
          return subs.map((s) => ({
            ...s,
            assignmentTitle: assign.title,
            maxScore: assign.max_score || 100,
            groupName: assign.groupName,
            groupId: assign.groupId,
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(promises);
      const flat = results.flat();
      flat.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setSubmissions(flat);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      let targetAssignments = [];

      if (selectedGroupId === 'ALL') {
        targetAssignments = groups.flatMap((g) =>
          (g.assignments || []).map((a) => ({
            ...a,
            groupId: g.id,
            groupName: g.name,
          }))
        );
      } else {
        const found = groups.find((g) => String(g.id) === String(selectedGroupId));
        if (found) {
          targetAssignments = (found.assignments || []).map((a) => ({
            ...a,
            groupId: found.id,
            groupName: found.name,
          }));
        }
      }

      if (selectedAssignId !== 'ALL') {
        targetAssignments = targetAssignments.filter((a) => String(a.id) === String(selectedAssignId));
      }

      await fetchSubmissionsForAssignments(targetAssignments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableAssignments = groups.flatMap((g) => {
    if (selectedGroupId !== 'ALL' && String(g.id) !== String(selectedGroupId)) return [];
    return (g.assignments || []).map((a) => ({ ...a, groupName: g.name }));
  });

  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.student?.name || '';
    const studentEmail = sub.student?.email || '';
    const assignTitle = sub.assignmentTitle || '';

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const isGraded = sub.status === 'graded' || Boolean(sub.evaluation);
    const matchesStatus =
      statusFilter === 'ALL' ? true :
      statusFilter === 'GRADED' ? isGraded :
      statusFilter === 'PENDING' ? !isGraded : true;

    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const gradedCount = submissions.filter((s) => s.status === 'graded' || s.evaluation).length;
  const pendingCount = totalCount - gradedCount;

  const scoredSubs = submissions.filter((s) => s.evaluation?.total_score !== undefined && s.evaluation?.total_score !== null);
  const avgScore = scoredSubs.length > 0 
    ? (scoredSubs.reduce((acc, s) => acc + Number(s.evaluation.total_score), 0) / scoredSubs.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-full bg-slate-50">
      
      {/* ══════════════════════════════════════════════
          HERO HEADER SECTION
      ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 sm:pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Baholash Natijalari
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  {totalCount} ta talaba ishi
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                AI Baholash Tizimi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Sun'iy intellekt (AI) orqali tezkor, xolis va mezonlarga asoslangan avtomatik baholash tahlillari
              </p>
            </div>

            <Link
              to="/assignments"
              style={{ background: EMERALD_GRADIENT }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-emerald-700/25 hover:opacity-95 transition-all active:scale-95 self-start md:self-auto flex-shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Topshiriqlarni Boshqarish</span>
            </Link>
          </div>

          {/* 4 STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Jami Ishlar</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {totalCount}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Talabalar yuborgan topshiriqlar</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>AI Baholangan</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {gradedCount}
              </div>
              <p className="text-[11px] text-emerald-700/80 font-medium mt-0.5">Avtomatlashtirilgan baholash</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Tekshiruv Kutilmoqda</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-700">
                {pendingCount}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Navbatdagi amaliy ishlar</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>O'rtacha Ball</span>
                <Percent className="w-4 h-4 text-violet-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-violet-600">
                {avgScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Guruhlar o'rtacha ko'rsatkichi</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CONTROLS & FILTERS TOOLBAR
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Group and Assignment Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setSelectedAssignId('ALL');
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                <option value="ALL">Barcha Guruhlar</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.members?.length || 0} talaba)
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedAssignId}
                onChange={(e) => setSelectedAssignId(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs max-w-xs truncate"
              >
                <option value="ALL">Barcha Topshiriqlar</option>
                {availableAssignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.groupName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search, Status Filters & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Talaba yoki mavzu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto justify-center">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Barchasi ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter('GRADED')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'GRADED'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Baholangan ({gradedCount})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'PENDING'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Kutilmoqda ({pendingCount})
              </button>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Kartochka ko'rinishi"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Jadval ko'rinishi"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 font-semibold shadow-xs">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Topshirilgan ishlar yuklanmoqda...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {submissions.length === 0 ? "Topshirilgan ishlar mavjud emas" : "Qidiruv natijasida ishlar topilmadi"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              {submissions.length === 0 
                ? "Talabalar amaliy ishlarini topshirishgach, bu yerda sun'iy intellekt tahlili va ballar avtomatik ko'rinadi."
                : "Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang."}
            </p>
            {submissions.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ── GRID CARD VIEW ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubmissions.map((sub, idx) => {
              const studentName = sub.student?.name || 'Talaba';
              const score = sub.evaluation?.total_score ?? null;
              const max = sub.maxScore || 100;
              const initials = studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const similarity = sub.evaluation?.similarity_score;
              const isGraded = sub.status === 'graded' || Boolean(sub.evaluation);

              return (
                <div
                  key={sub.id || idx}
                  onClick={() => setSelectedSub(sub)}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-700/5 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Student & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-xs"
                          style={{ background: EMERALD_GRADIENT }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                            {studentName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {sub.student?.email || 'talaba@platform.uz'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0 ${
                          isGraded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {isGraded ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Baholandi
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Kutilmoqda
                          </>
                        )}
                      </span>
                    </div>

                    {/* Assignment & Group Information */}
                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                        {sub.groupName || 'O\'quv Guruhi'}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                        {sub.assignmentTitle || 'Amaliy Topshiriq'}
                      </h5>
                    </div>

                    {/* Score & Integrity Chips */}
                    <div className="flex items-center justify-between gap-2 pt-1 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          AI Natijasi
                        </span>
                        {score !== null ? (
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-2xl font-black text-slate-900 leading-none">
                              {score}
                            </span>
                            <span className="text-xs font-bold text-slate-400">/ {max} ball</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-500 mt-0.5 inline-block">
                            Baholanmagan
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Plagiat Tahlili
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className={`text-xs font-black ${similarity && similarity > 20 ? 'text-amber-600' : 'text-slate-700'}`}>
                            {similarity ? `${similarity}% o'xshashlik` : 'Toza ish'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Date & Action CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : 'Yaqinda'}
                    </span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Natijani ko'rish <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── TABLE VIEW ── */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Talabalar Topshiriqlari Ro'yxati ({filteredSubmissions.length})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Batafsil ko'rish uchun qator ustiga bosing
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="px-5 sm:px-7 py-3.5">Talaba</th>
                    <th className="px-5 sm:px-7 py-3.5">Topshiriq & Guruh</th>
                    <th className="px-5 sm:px-7 py-3.5">AI Balli</th>
                    <th className="px-5 sm:px-7 py-3.5">O'xshashlik & Tahlil</th>
                    <th className="px-5 sm:px-7 py-3.5">Sana</th>
                    <th className="px-5 sm:px-7 py-3.5 text-right">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub, idx) => {
                    const studentName = sub.student?.name || 'Talaba';
                    const score = sub.evaluation?.total_score ?? null;
                    const max = sub.maxScore || 100;
                    const initials = studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                    const similarity = sub.evaluation?.similarity_score;

                    return (
                      <tr
                        key={sub.id || idx}
                        onClick={() => setSelectedSub(sub)}
                        className="hover:bg-emerald-50/20 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 sm:px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0 shadow-xs"
                              style={{ background: EMERALD_GRADIENT }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <Link
                                to={`/students/${sub.student_id || 'st-001'}`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 hover:underline transition-colors truncate block"
                                title="Talabaning qiynalayotgan fani va mavzularini ko'rish (User Detail)"
                              >
                                {studentName}
                              </Link>
                              <p className="text-[11px] text-slate-400 truncate">
                                {sub.student?.email || "talaba@platform.uz"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 sm:px-7 py-4">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm block truncate max-w-xs">
                            {sub.assignmentTitle || 'Amaliy ish'}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {sub.groupName || 'Guruh'}
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
                              {score} / {max}
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
                            {similarity && similarity > 20 ? (
                              <span className="text-amber-600 font-bold">{similarity}% o'xshashlik</span>
                            ) : (
                              'Mustaqil ish'
                            )}
                          </span>
                        </td>

                        <td className="px-5 sm:px-7 py-4 text-xs font-medium text-slate-500">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : 'Yaqinda'}
                        </td>

                        <td className="px-5 sm:px-7 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/50">
                            <CheckCircle2 className="w-3 h-3" />
                            {sub.status === 'graded' ? 'Baholangan' : 'Qabul qilingan'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 sm:px-7 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium bg-slate-50/50">
              <span>Jami {filteredSubmissions.length} ta topshiriq ko'rsatilmoqda</span>
              <span className="text-emerald-700 font-bold">Avtomatik sinxronizatsiya faol</span>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          EVALUATION DETAIL MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={Boolean(selectedSub)}
        onClose={() => setSelectedSub(null)}
        title="Amaliy Ish va AI Baholash Tafsilotlari"
        maxWidth="max-w-2xl"
      >
        {selectedSub && (
          <div className="space-y-5">
            
            {/* Student info banner */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Talaba</p>
                <p className="text-base font-black text-slate-900">{selectedSub.student?.name}</p>
                <p className="text-xs text-slate-500 font-medium">{selectedSub.student?.email}</p>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  {selectedSub.groupName} • {selectedSub.assignmentTitle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Umumiy Ball</p>
                <p className="text-3xl font-black text-emerald-600">
                  {selectedSub.evaluation?.total_score ?? 0}
                  <span className="text-xs font-bold text-slate-400">/{selectedSub.maxScore || 100}</span>
                </p>
              </div>
            </div>

            {/* Criteria breakdown (Rubrika) */}
            {selectedSub.evaluation?.criteria_results && (
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  AI Baholash Mezonlari (Rubrika)
                </h4>
                <div className="space-y-2">
                  {selectedSub.evaluation.criteria_results.map((c, i) => {
                    const score = c.score || 0;
                    const max = c.max || c.max_score || 25;
                    const pct = Math.min(100, Math.round((score / max) * 100));

                    return (
                      <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{c.name || `Mezon #${i + 1}`}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{c.comment || "Bajarilgan"}</p>
                          </div>
                          <span className="font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {score} / {max}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%`, background: EMERALD_GRADIENT }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Feedback */}
            {selectedSub.evaluation?.feedback && (
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  AI Tavsiyalari & Fikr-Mulohazalari (Feedback)
                </h4>
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs text-slate-700 space-y-1.5 leading-relaxed font-medium">
                  {Array.isArray(selectedSub.evaluation.feedback) ? (
                    selectedSub.evaluation.feedback.map((f, i) => (
                      <p key={i}>• {f}</p>
                    ))
                  ) : (
                    <p>{selectedSub.evaluation.feedback}</p>
                  )}
                </div>
              </div>
            )}

            {/* Plagiarism and AI Writing info */}
            {selectedSub.evaluation?.similarity_score !== null && selectedSub.evaluation?.similarity_score !== undefined && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">O'xshashlik (Plagiat)</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">{selectedSub.evaluation.similarity_score}%</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-[10px] text-purple-700 font-black uppercase tracking-wider">AI Yozuv Ehtimoli</p>
                  <p className="text-base font-black text-purple-900 mt-0.5">
                    {Math.round((selectedSub.evaluation.ai_writing_probability || 0) * 100)}%
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedSub(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Evaluations;
