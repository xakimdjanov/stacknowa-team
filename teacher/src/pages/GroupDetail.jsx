import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import BookViewer from '../components/BookViewer';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Plus,
  Percent,
  ShieldCheck,
  FileText,
  BarChart3,
  Calendar,
  Layers,
  X,
  FileCheck,
  RefreshCw,
  Eye
} from 'lucide-react';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Student filtering & search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('all'); // 'all' | 'submitted' | 'returned' | 'none'

  // Booklet viewer state
  const [viewingSub, setViewingSub] = useState(null);

  // Return submission modal state
  const [returningSubId, setReturningSubId] = useState(null);
  const [returnComment, setReturnComment] = useState('');
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    fetchGroupDetail();
  }, [groupId]);

  const fetchGroupDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/groups/${groupId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Guruh ma'lumotlarini yuklashda xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
      fetchGroupDetail();
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

    if (parsed?.pages && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
      return parsed.pages;
    }

    return [
      {
        id: 1,
        title: "1-bet: Titul varaqasi",
        html: `
          <div style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 13pt; font-weight: bold; color: #2563eb; text-transform: uppercase;">"${group?.name || 'Guruh'}"</p>
            <h1 style="font-size: 24pt; font-weight: 800; color: #0f172a; margin: 20px 0;">${sub.assignment?.title || 'Amaliy Mashg\'ulot'}</h1>
            <p style="font-size: 14pt; color: #64748b;">AMALIY ISH HISOBOTI</p>
            <div style="margin-top: 100px; text-align: right; max-width: 380px; margin-left: auto; font-size: 12pt; line-height: 1.8;">
              <p><strong>Talaba:</strong> ${sub.student?.name || 'Talaba'}</p>
              <p><strong>Baholash bali:</strong> ${sub.evaluation?.total_score || sub.score || 0} ball</p>
              <p><strong>Holati:</strong> ${sub.status || 'Baholangan'}</p>
            </div>
          </div>
        `
      },
      parsed?.theme && {
        id: 2,
        title: "2-bet: Kirish va Mavzu",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">KIRISH VA MAVZU</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsed.theme}</div>`
      },
      parsed?.theory && {
        id: 3,
        title: "3-bet: Nazariy Asoslar",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">1-BOB. NAZARIY QISM</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsed.theory}</div>`
      },
      parsed?.practical && {
        id: 4,
        title: "4-bet: Amaliy Tajriba",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">2-BOB. AMALIYOT VA TAHLIL</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsed.practical}</div>`
      },
      parsed?.conclusion && {
        id: 5,
        title: "5-bet: Xulosa",
        html: `<h2 style="color:#1d4ed8; font-size:16pt; border-bottom:2px solid #bfdbfe; padding-bottom:6px;">XULOSA VA TAVSIYALAR</h2><div style="font-size:12pt; line-height:1.8; margin-top:16px;">${parsed.conclusion}</div>`
      }
    ].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Guruh statistikasi yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">{error || "Guruh topilmadi"}</h2>
          <button
            onClick={() => navigate('/groups')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Guruhlar ro'yxatiga qaytish</span>
          </button>
        </div>
      </div>
    );
  }

  const { group, statistics, join_url } = data;
  const stats = statistics || {};
  const gradeDist = stats.grade_distribution || { excellent: 0, good: 0, satisfactory: 0, unsatisfactory: 0 };
  const studentList = stats.student_stats || [];

  // Filter students
  const filteredStudents = studentList.filter((st) => {
    const matchesSearch = (st.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
                          (st.email || '').toLowerCase().includes(studentSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (studentFilter === 'submitted') {
      return (st.submissions_count || 0) > 0;
    }
    if (studentFilter === 'returned') {
      return st.has_returned;
    }
    if (studentFilter === 'none') {
      return (st.submissions_count || 0) === 0;
    }
    return true;
  });

  const totalGradedCount = stats.graded_count || 0;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* 1. TOP BREADCRUMB & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            title="Guruhlarga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Link to="/groups" className="hover:text-indigo-600 transition-colors">Guruhlar</Link>
              <span>/</span>
              <span className="text-slate-600 font-semibold">{group.name}</span>
              <span>/</span>
              <span>Statistika</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-3 mt-0.5">
              <span>{group.name}</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {group.subject}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchGroupDetail}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            title="Yangilash"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-colors shadow-sm"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>QR Kod</span>
          </button>
          <Link
            to={`/assignments?groupId=${group.id}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Topshiriq</span>
          </Link>
        </div>
      </div>

      {/* 2. GROUP HERO CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-indigo-200 backdrop-blur-md border border-white/10 uppercase tracking-wider">
                {group.faculty || "Fakultet"} • {group.course}-kurs • {group.semester}-semestr
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Faol Guruh ({group.academic_year || "2025-2026"})
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Ushbu sahifada {group.name} guruhining umumiy o'zlashtirish darajasi, amaliy mashg'ulotlar topshirilishi, Gemini AI baholash tahlillari va talabalar monitoringini to'liq ko'rishingiz mumkin.
            </p>
          </div>

          {/* Join Code & Quick link widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Guruhga Ulanish Kodi</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-xl font-black text-white tracking-widest bg-white/10 px-3 py-1 rounded-xl">
                  {group.access_code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(group.access_code)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Kodni nusxalash"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:border-l sm:border-white/15 sm:pl-3 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Talaba Havolasi</p>
              <button
                type="button"
                onClick={() => handleCopyLink(join_url)}
                className="mt-1 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Nusxalandi!" : "Havolani Nusxalash"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 5 KEY KPI STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Talabalar</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.total_students || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">A'zo bo'lgan faol talabalar</p>
          </div>
        </div>

        {/* KPI 2: Assignments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topshiriqlar</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.total_assignments || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">E'lon qilingan amaliy ishlar</p>
          </div>
        </div>

        {/* KPI 3: Submissions & Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topshirish Nisbati</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.submission_rate || 0}%</span>
              <span className="text-xs text-slate-400 font-semibold">({stats.total_submissions || 0} ta ish)</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, stats.submission_rate || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 4: Average Score */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">O'rtacha Ball</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black text-amber-600 tracking-tight">{stats.average_score || 0}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Min: <strong className="text-slate-600">{stats.min_score || 0}</strong> • Max: <strong className="text-slate-600">{stats.max_score || 0}</strong>
            </p>
          </div>
        </div>

        {/* KPI 5: AI & Plagiarism */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Tahlillari</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-extrabold text-slate-900">
              O'xshashlik: <span className="text-purple-600">{stats.avg_similarity || 0}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Neyrotarmoq yozuvi: <strong className="text-purple-700 font-bold">{stats.avg_ai_writing || 0}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 4. ANALYTICS ROW: GRADE DISTRIBUTION & PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grade Distribution Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>O'zlashtirish va Baholar Taqsimoti</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Baholangan jami <strong>{totalGradedCount} ta</strong> amaliy ish natijalari bo'yicha
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl self-start sm:self-auto">
              Standart grading (5 lik / 100 ballik)
            </span>
          </div>

          <div className="space-y-4">
            {/* A'lo (86-100) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>A'lo (86 - 100 ball)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{gradeDist.excellent || 0} ta</span>
                  <span className="text-slate-400">
                    ({totalGradedCount > 0 ? Math.round(((gradeDist.excellent || 0) / totalGradedCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalGradedCount > 0 ? ((gradeDist.excellent || 0) / totalGradedCount) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Yaxshi (71-85) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Yaxshi (71 - 85 ball)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{gradeDist.good || 0} ta</span>
                  <span className="text-slate-400">
                    ({totalGradedCount > 0 ? Math.round(((gradeDist.good || 0) / totalGradedCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalGradedCount > 0 ? ((gradeDist.good || 0) / totalGradedCount) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Qoniqarli (55-70) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Qoniqarli (55 - 70 ball)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{gradeDist.satisfactory || 0} ta</span>
                  <span className="text-slate-400">
                    ({totalGradedCount > 0 ? Math.round(((gradeDist.satisfactory || 0) / totalGradedCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalGradedCount > 0 ? ((gradeDist.satisfactory || 0) / totalGradedCount) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Qoniqarsiz (<55) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Qoniqarsiz (0 - 54 ball)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{gradeDist.unsatisfactory || 0} ta</span>
                  <span className="text-slate-400">
                    ({totalGradedCount > 0 ? Math.round(((gradeDist.unsatisfactory || 0) / totalGradedCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalGradedCount > 0 ? ((gradeDist.unsatisfactory || 0) / totalGradedCount) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Monitoring Summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Guruh Monitoringi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Topshiriqlar holati va tahlillar</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-xs text-emerald-950 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Baholangan ishlar</span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white text-emerald-700 border border-emerald-200">
                {stats.graded_count || 0} ta
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-xs text-amber-950 font-semibold">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Qayta topshirishda</span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white text-amber-800 border border-amber-200">
                {stats.returned_count || 0} ta
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-xs text-indigo-950 font-semibold">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Kutilayotgan ishlar</span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white text-indigo-700 border border-indigo-200">
                {stats.pending_count || 0} ta
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/evaluations"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <span>Barcha Baholashlarni Ko'rish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. STUDENTS MATRIX TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header & Filters */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Talabalar Faolligi va Natijalari</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Guruhdagi har bir talabaning amaliy ishlari, bali va topshirilgan daftarlari
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setStudentFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studentFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Barchasi ({studentList.length})
              </button>
              <button
                type="button"
                onClick={() => setStudentFilter('submitted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studentFilter === 'submitted' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topshirganlar ({studentList.filter((s) => (s.submissions_count || 0) > 0).length})
              </button>
              <button
                type="button"
                onClick={() => setStudentFilter('returned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studentFilter === 'returned' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Qaytarilganlar ({studentList.filter((s) => s.has_returned).length})
              </button>
              <button
                type="button"
                onClick={() => setStudentFilter('none')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studentFilter === 'none' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topshirmaganlar ({studentList.filter((s) => (s.submissions_count || 0) === 0).length})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Talaba ismi yoki email orqali qidiring..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Body */}
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Mos keluvchi talabalar topilmadi</p>
            <p className="text-xs text-slate-400">Qidiruv yoki filtr mezonlarini o'zgartirib ko'ring.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Talaba</th>
                  <th className="px-6 py-4">Topshirilgan Ishlar</th>
                  <th className="px-6 py-4">O'rtacha Ball</th>
                  <th className="px-6 py-4">Oxirgi Topshiriq Holati</th>
                  <th className="px-6 py-4 text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((st, idx) => {
                  const latestSub = st.submissions && st.submissions.length > 0 ? st.submissions[st.submissions.length - 1] : null;

                  return (
                    <tr key={st.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {(st.name || 'T').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[11px] text-slate-400">{st.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800">
                            {st.submissions_count || 0} / {stats.total_assignments || 0}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({stats.total_assignments > 0 ? Math.round(((st.submissions_count || 0) / stats.total_assignments) * 100) : 0}%)
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {st.average_score !== null ? (
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black ${
                            st.average_score >= 86
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.average_score >= 71
                              ? 'bg-blue-100 text-blue-800'
                              : st.average_score >= 55
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}>
                            <Award className="w-3 h-3" />
                            <span>{st.average_score} ball</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Baholanmagan</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {latestSub ? (
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            latestSub.status === 'returned'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : latestSub.status === 'graded'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {latestSub.status === 'returned' && <RotateCcw className="w-3 h-3" />}
                            {latestSub.status === 'graded' && <CheckCircle2 className="w-3 h-3" />}
                            <span>
                              {latestSub.status === 'returned'
                                ? "Qayta topshirishda"
                                : latestSub.status === 'graded'
                                ? "Baholandi"
                                : "Kutilmoqda"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Topshirmagan</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {latestSub ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setViewingSub(latestSub)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200/60 shadow-sm"
                                title="Talabaning amaliy ishini kitob shaklida ko'rish"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Kitobcha</span>
                              </button>

                              {latestSub.status !== 'returned' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReturningSubId(latestSub.id);
                                    setReturnComment('');
                                  }}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors border border-amber-200"
                                  title="Talabaga qayta topshirish uchun qaytarish"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Qaytarish</span>
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Faollik yo'q</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. MODAL: BOOKLET VIEWER */}
      {viewingSub && (
        <Modal
          isOpen={!!viewingSub}
          onClose={() => setViewingSub(null)}
          title={`📖 ${viewingSub.student?.name || 'Talaba'} — Amaliy Ish Kitobchasi`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-slate-600">
                  Talaba: <strong className="text-slate-900">{viewingSub.student?.name}</strong>
                </span>
                <span>•</span>
                <span className="text-slate-600">
                  Topshiriq: <strong className="text-slate-900">{viewingSub.assignment?.title || 'Amaliy Ish'}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-lg">
                  Ball: {viewingSub.evaluation?.total_score || viewingSub.score || 0} / 100
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold ${
                  viewingSub.status === 'returned'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {viewingSub.status === 'returned' ? 'Qayta topshirishda' : 'Baholangan'}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50/50">
              <BookViewer
                pages={getSubPages(viewingSub)}
                title={viewingSub.assignment?.title || "Amaliy Ish"}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* 7. MODAL: RETURN SUBMISSION WITH TEACHER COMMENT */}
      {returningSubId && (
        <Modal
          isOpen={!!returningSubId}
          onClose={() => setReturningSubId(null)}
          title="↩ Amaliy Ishni Qayta Topshirishga Qaytarish"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center space-x-1.5">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Talabaga qayta topshirish imkoniyati beriladi</span>
              </p>
              <p className="text-amber-800">
                Talaba o'z raqamli daftariga kirib, kamchiliklarni to'g'rilaydi va yana qayta jo'nata oladi.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">O'qituvchi eslatmasi / kamchiliklar:</label>
              <textarea
                rows={3}
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Masalan: 3-betdagi hisob-kitoblar formulasi to'ldirilsin va xulosaga asosiy parametrlar kiritilsin..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReturningSubId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => handleReturnStudentSub(returningSubId)}
                disabled={returning}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{returning ? "Qaytarilmoqda..." : "Talabaga Qaytarish"}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 8. MODAL: QR CODE */}
      {showQrModal && (
        <Modal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          title={`📱 ${group.name} — QR Kod`}
          maxWidth="max-w-sm"
        >
          <div className="text-center space-y-4">
            <div className="p-6 bg-white border border-slate-200 rounded-3xl inline-block shadow-md">
              <QRCodeSVG value={join_url} size={220} />
            </div>
            <p className="text-xs text-slate-500">
              Talabalar kamerasi orqali skaner qilib ushbu guruhga darhol a'zo bo'lishlari mumkin.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 break-all select-all">
              {join_url}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupDetail;
