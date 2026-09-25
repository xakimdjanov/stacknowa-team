import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Layers, 
  Plus, 
  QrCode, 
  Users, 
  Calendar, 
  Copy, 
  Check, 
  Key, 
  Sparkles,
  ExternalLink,
  TrendingUp,
  Award,
  BookOpen,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  BarChart3,
  ShieldCheck,
  Percent,
  X,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BookViewer from '../components/BookViewer';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  // Group Detail & Statistics state
  const [detailGroup, setDetailGroup] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('all'); // 'all' | 'graded' | 'returned' | 'none'
  const [viewingBookletSub, setViewingBookletSub] = useState(null);
  
  // Return for revision state
  const [returningSubId, setReturningSubId] = useState(null);
  const [returnComment, setReturnComment] = useState('');
  const [returning, setReturning] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    course: 1,
    faculty: '',
    academic_year: '2025-2026',
    semester: 1,
    access_code: '',
    allowed_email_domain: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups', formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        subject: '',
        course: 1,
        faculty: '',
        academic_year: '2025-2026',
        semester: 1,
        access_code: '',
        allowed_email_domain: '',
      });
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Guruh yaratishda xatolik!");
    }
  };

  const showQr = async (id) => {
    try {
      const res = await api.get(`/groups/${id}`);
      setSelectedGroup(res.data);
      setCopied(false);
    } catch (err) {
      alert("Ma'lumotlarni yuklab bo'lmadi");
    }
  };

  const handleOpenGroupDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await api.get(`/groups/${id}`);
      setDetailGroup(res.data);
      setStudentSearch('');
      setStudentFilter('all');
    } catch (err) {
      alert("Guruh statistikasini yuklashda xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReturnStudentSub = async (subId) => {
    try {
      setReturning(true);
      await api.put(`/submissions/${subId}/return`, {
        teacher_comment: returnComment.trim() || "Kamchiliklar aniqlandi. Iltimos, amaliy ishni qayta ko'rib chiqib, to'ldirib qayta topshiring."
      });
      alert("Topshiriq talabaga qayta topshirish uchun muvaffaqiyatli yuborildi!");
      setReturningSubId(null);
      setReturnComment('');
      // Guruh ma'lumotlarini yangilash
      if (detailGroup?.group?.id) {
        handleOpenGroupDetail(detailGroup.group.id);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setReturning(false);
    }
  };

  const getSubPages = (sub) => {
    if (!sub || !sub.content) return [];
    let parsed = {};
    try {
      parsed = typeof sub.content === 'string' ? JSON.parse(sub.content) : sub.content;
    } catch {
      parsed = { practical: sub.content };
    }
    if (parsed.pages && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
      return parsed.pages;
    }
    return [
      { id: 1, title: "1-bet: Titul varaqasi", html: `<div style="text-align:center; padding: 40px 20px;"><h2>${sub.assignment?.title || 'Amaliy Ish'}</h2><p>Talaba: ${sub.student?.name || ''}</p></div>` },
      parsed.practical && { id: 2, title: "Amaliy Qism", html: `<div>${parsed.practical}</div>` }
    ].filter(Boolean);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered students for group detail
  const stats = detailGroup?.statistics;
  const rawStudentStats = stats?.student_stats || [];
  const filteredStudents = rawStudentStats.filter((st) => {
    const matchesSearch = 
      !studentSearch ||
      st.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.email?.toLowerCase().includes(studentSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (studentFilter === 'graded') {
      return st.submissions.some(s => s.status === 'graded');
    }
    if (studentFilter === 'returned') {
      return st.has_returned;
    }
    if (studentFilter === 'none') {
      return st.submissions_count === 0;
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Akademik Guruhlarim</h1>
          <p className="text-sm text-slate-500 mt-1">
            Guruhlar statistikasi, talabalar tahlili, topshiriqlar va QR-kod havolalarini boshqaring.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-blue-500/20 text-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Guruh Yaratish</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1d58d8] border border-blue-100">
                  {g.course}-kurs | {g.academic_year}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {g.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                <Link to={`/groups/${g.id}`} className="hover:text-[#1d58d8] transition-colors">
                  {g.name}
                </Link>
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{g.subject}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Talabalar soni:</span>
                  <span className="font-semibold text-slate-900">{g.members?.length || 0} nafar</span>
                </div>
                <div className="flex justify-between">
                  <span>Topshiriqlar:</span>
                  <span className="font-semibold text-slate-900">{g.assignments?.length || 0} ta</span>
                </div>
                {g.access_code && (
                  <div className="flex justify-between">
                    <span>Guruh kodi (Parol):</span>
                    <span className="font-mono text-[#1d58d8] font-bold">{g.access_code}</span>
                  </div>
                )}
                {g.allowed_email_domain && (
                  <div className="flex justify-between">
                    <span>Faqat domen:</span>
                    <span className="font-mono text-slate-700">@{g.allowed_email_domain}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                to={`/groups/${g.id}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1d58d8] rounded-xl text-xs font-bold transition-all border border-blue-200/60 shadow-sm"
                title="Guruh batafsil statistikasi va monitoring sahifasi"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Statistika</span>
              </Link>

              <div className="flex items-center space-x-1.5">
                <Link
                  to={`/assignments?groupId=${g.id}`}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Topshiriqlar ({g.assignments?.length || 0})
                </Link>
                <button
                  onClick={() => showQr(g.id)}
                  className="flex items-center space-x-1 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  title="QR & Havola"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. IDEAL GROUP DETAIL & STATISTICS MODAL                                   */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(detailGroup)}
        onClose={() => setDetailGroup(null)}
        title={detailGroup ? `${detailGroup.group?.name} — Guruh Statistikasi va Monitoring` : "Guruh Tafsilotlari"}
        maxWidth="max-w-6xl"
      >
        {detailGroup && (
          <div className="space-y-6">
            {/* Header info bar */}
            <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  {detailGroup.group?.course}-kurs • {detailGroup.group?.academic_year} o'quv yili • {detailGroup.group?.semester}-semestr
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {detailGroup.group?.name}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Fan: <strong className="text-blue-700 font-bold">{detailGroup.group?.subject}</strong>
                  {detailGroup.group?.access_code && (
                    <span> • Parol: <code className="bg-white px-1.5 py-0.5 rounded text-blue-800 font-bold">{detailGroup.group.access_code}</code></span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup(detailGroup);
                    setCopied(false);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm flex items-center space-x-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>QR & Havola</span>
                </button>

                <Link
                  to={`/assignments?groupId=${detailGroup.group?.id}`}
                  className="px-3.5 py-2 bg-[#1d58d8] hover:bg-[#1648b8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Topshiriq qo'shish</span>
                </Link>
              </div>
            </div>

            {/* Top KPI Cards (5 ta ko'rsatkich) */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* 1. Talabalar */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Talabalar</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{stats.total_students}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">a'zo bo'lgan talaba</p>
                </div>

                {/* 2. Topshiriqlar */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Topshiriqlar</span>
                    <Layers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{stats.total_assignments}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">amaliy mashg'ulot</p>
                </div>

                {/* 3. Topshirish ko'rsatkichi */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Topshirish</span>
                    <Percent className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600">{stats.submission_rate}%</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{stats.total_submissions} ta ish qabul qilindi</p>
                </div>

                {/* 4. O'rtacha ball */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">O'rtacha Ball</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {stats.average_score > 0 ? stats.average_score : '—'}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Maks: <strong className="text-emerald-600">{stats.max_score}</strong> • Min: <strong className="text-rose-500">{stats.min_score}</strong>
                  </p>
                </div>

                {/* 5. AI Tahlil nazorati */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">AI Nazorati</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    O'xshashlik: <span className="text-blue-600 font-extrabold">{stats.avg_similarity}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    AI-yozuv ehtimoli: <span className="text-purple-600 font-bold">{stats.avg_ai_writing}%</span>
                  </p>
                </div>
              </div>
            )}

            {/* Baholash Taqsimoti (Grade Distribution) */}
            {stats?.grade_distribution && (
              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Guruh Bo'yicha Baholar Taqsimoti</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Baholangan ishlar: <strong className="text-slate-700">{stats.graded_count} ta</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* A'lo */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800">A'lo (86 - 100)</span>
                      <span className="font-extrabold text-emerald-700">{stats.grade_distribution.excellent} ta</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${stats.graded_count > 0 ? (stats.grade_distribution.excellent / stats.graded_count) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Yaxshi */}
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-800">Yaxshi (71 - 85)</span>
                      <span className="font-extrabold text-blue-700">{stats.grade_distribution.good} ta</span>
                    </div>
                    <div className="w-full h-1.5 bg-blue-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${stats.graded_count > 0 ? (stats.grade_distribution.good / stats.graded_count) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Qoniqarli */}
                  <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800">Qoniqarli (55 - 70)</span>
                      <span className="font-extrabold text-amber-700">{stats.grade_distribution.satisfactory} ta</span>
                    </div>
                    <div className="w-full h-1.5 bg-amber-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${stats.graded_count > 0 ? (stats.grade_distribution.satisfactory / stats.graded_count) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Qoniqarsiz */}
                  <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-800">Qoniqarsiz (&lt; 55)</span>
                      <span className="font-extrabold text-rose-700">{stats.grade_distribution.unsatisfactory} ta</span>
                    </div>
                    <div className="w-full h-1.5 bg-rose-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${stats.graded_count > 0 ? (stats.grade_distribution.unsatisfactory / stats.graded_count) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Talabalar Monitoringi Jadvali */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl self-start">
                  <button
                    type="button"
                    onClick={() => setStudentFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      studentFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Barcha Talabalar ({rawStudentStats.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter('graded')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      studentFilter === 'graded'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Baholanganlar
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter('returned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      studentFilter === 'returned'
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Qayta topshirishda ({stats?.returned_count || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter('none')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      studentFilter === 'none'
                        ? 'bg-white text-slate-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Topshirmaganlar
                  </button>
                </div>

                {/* Qidiruv */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Talaba ismi yoki email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Jadval */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Talaba</th>
                        <th className="px-4 py-3 text-center">Topshirgan Ishlari</th>
                        <th className="px-4 py-3 text-center">O'rtacha Ball</th>
                        <th className="px-4 py-3">Holati</th>
                        <th className="px-4 py-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                            Mos keladigan talabalar topilmadi
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => {
                          const latestSub = st.submissions?.[0] || null;
                          return (
                            <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1d58d8] font-bold text-xs flex items-center justify-center border border-blue-100 flex-shrink-0">
                                    {st.name?.[0] || 'T'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{st.name}</p>
                                    <p className="text-[11px] text-slate-400">{st.email}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <span className="font-bold text-slate-800">
                                  {st.submissions_count} / {stats?.total_assignments || 0}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-center">
                                {st.average_score !== null ? (
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                    st.average_score >= 86
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : st.average_score >= 71
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {st.average_score} ball
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                {st.has_returned ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Qayta topshirishda</span>
                                  </span>
                                ) : latestSub?.status === 'graded' ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Baholangan</span>
                                  </span>
                                ) : latestSub?.status === 'submitted' ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    <Clock className="w-3 h-3" />
                                    <span>Kutilmoqda</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                                    <span>Topshirmagan</span>
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  {/* Kitobcha ko'rish tugmasi */}
                                  {latestSub ? (
                                    <button
                                      type="button"
                                      onClick={() => setViewingBookletSub(latestSub)}
                                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1d58d8] rounded-lg text-[11px] font-bold transition-colors inline-flex items-center space-x-1 border border-blue-200/60"
                                      title="Talaba kitobchasini ko'rish"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      <span>Kitobcha</span>
                                    </button>
                                  ) : null}

                                  {/* Qayta topshirishga yuborish tugmasi */}
                                  {latestSub && latestSub.status !== 'returned' ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReturningSubId(latestSub.id);
                                        setReturnComment('');
                                      }}
                                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center space-x-1 border border-amber-300"
                                      title="Topshiriqni talabaga qayta topshirish uchun qaytarish"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      <span>Qaytarish</span>
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailGroup(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. TALABA KITOBCHASINI KO'RISH MODALI                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(viewingBookletSub)}
        onClose={() => setViewingBookletSub(null)}
        title={viewingBookletSub ? `${viewingBookletSub.student?.name} — Amaliy Ish Kitobchasi` : "Kitobcha"}
        maxWidth="max-w-6xl"
      >
        {viewingBookletSub && (
          <div className="space-y-4">
            <BookViewer 
              pages={getSubPages(viewingBookletSub)}
              documentTitle={detailGroup?.group?.name || "Amaliy Ish"}
              studentName={viewingBookletSub.student?.name || "Talaba"}
            />

            <div className="flex justify-between items-center pt-2">
              {viewingBookletSub.status !== 'returned' && (
                <button
                  type="button"
                  onClick={() => {
                    setReturningSubId(viewingBookletSub.id);
                    setReturnComment('');
                    setViewingBookletSub(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ushbu ishni qayta topshirishga qaytarish</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewingBookletSub(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors ml-auto"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 3. TALABAGA QAYTA TOPSHIRISHGA YUBORISH MODALI                             */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(returningSubId)}
        onClose={() => setReturningSubId(null)}
        title="Topshiriqni Talabaga Qayta Topshirishga Qaytarish"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Topshiriq qaytarilganda talaba o'z online daftariga kirib, xatoliklarni to'g'rilab, qayta yuborish imkoniga ega bo'ladi.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kamchiliklar va Talabaga Izoh (Eslatma)
            </label>
            <textarea
              rows={3}
              value={returnComment}
              onChange={(e) => setReturnComment(e.target.value)}
              placeholder="Masalan: 7-betdagi formulalar va hisoblarni to'ldiring, xulosani kengaytiring..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setReturningSubId(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => handleReturnStudentSub(returningSubId)}
              disabled={returning}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              {returning ? "Yuborilmoqda..." : "Tasdiqlash va Qaytarish"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. CREATE GROUP MODAL                                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi Guruh Yaratish"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Guruh Nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: TATU 210-21 guruh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fan Nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: Sun'iy Intellekt Asoslari"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kurs</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semestr</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              >
                <option value={1}>1-semestr</option>
                <option value={2}>2-semestr</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">O'quv Yili</label>
              <input
                type="text"
                required
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kirish Kodi (Access Code)
              </label>
              <input
                type="text"
                placeholder="Ixtiyoriy parol"
                value={formData.access_code}
                onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faqat Email Domen
              </label>
              <input
                type="text"
                placeholder="Masalan: tuit.uz"
                value={formData.allowed_email_domain}
                onChange={(e) => setFormData({ ...formData, allowed_email_domain: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              Guruhni Yaratish
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 5. QR CODE & LINK MODAL                                                   */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.group?.name}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-slate-500">
            Talabalar ushbu QR-kodni skaner qilib yoki havola orqali guruhga mustaqil qo'shiladi.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block my-2">
            <QRCodeSVG value={selectedGroup?.join_url || "https://aipractice.uz"} size={170} />
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-mono text-slate-700 truncate flex-1 text-left">
              {selectedGroup?.join_url}
            </span>
            <button
              onClick={() => copyToClipboard(selectedGroup?.join_url)}
              className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#1d58d8] shadow-sm border border-slate-200 text-xs flex items-center space-x-1"
              title="Nusxalash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {selectedGroup?.group?.access_code && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800">
              Kirish kodi: <strong className="font-mono text-sm">{selectedGroup.group.access_code}</strong>
            </div>
          )}

          <button
            onClick={() => setSelectedGroup(null)}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Yopish
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
