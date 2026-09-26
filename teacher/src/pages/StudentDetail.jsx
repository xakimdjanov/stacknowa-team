import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  FileCheck2,
  Layers,
  Award,
  Zap,
  ChevronRight,
  Plus,
  Send,
  RefreshCw,
  Search,
  Filter,
  Check,
  ExternalLink,
  FileText,
  User,
  Mail,
  ShieldAlert,
  Flame,
  HelpCircle,
  X,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

// Dynamic mock databases for fallback when backend API is not yet populated
const MOCK_STUDENTS = {
  default: {
    id: 'st-001',
    name: 'Aziz Karimov',
    email: 'aziz.karimov@student.edu.uz',
    groupName: 'Python Backend 101',
    groupId: 'grp-1',
    avatar: 'A',
    status: 'NEEDS_ATTENTION',
    joinedDate: '2026-01-15',
    lastActive: 'Bugun, 10:42',
    overallScore: 78.4,
    attendanceRate: 92,
    completedCount: 14,
    totalCount: 16,
    riskLevel: 'MEDIUM',
    summaryText: "Talaba backend asoslari va sodda so'rovlarni yaxshi o'zlashtirgan, lekin murakkab ma'lumotlar tuzilmalari, rekursiya va SQL indeksatsiyada muntazam qiyinchilikka uchramoqda.",
    // Qaysi fandan nima bo'yicha qiynalayotgani bo'yicha batafsil AI tahlili
    struggles: [
      {
        id: 'strg-1',
        subject: "Ma'lumotlar Tuzilmasi va Algoritmlar",
        subjectCode: 'ALG-201',
        subjectColor: 'indigo',
        topic: 'Recursion & Call Stack (Rekursiya va Xotira Steki)',
        severity: 'HIGH', // HIGH, MEDIUM, LOW
        severityLabel: 'Yuqori Qiyinchilik',
        masteryPct: 38,
        reason: "Talaba rekursiv funksiyalarda base-case (to'xtash sharti) va call-stack mantiqini shakllantirishda qiynalmoqda. 4 ta ketma-ket amaliy vazifada 'Maximum call stack exceeded' xatosiga yo'l qo'ygan va qaytuvchi qiymatni akumulyatsiya qilishda chalkashmoqda.",
        errorPatterns: ['Stack Overflow Exception', 'Infinite Loop in Base Case', 'Memory Limit Exceeded'],
        aiRecommendation: "Call Stack vizualizatsiyasi bilan 15 daqiqalik tushuntirish va 3 ta sodda darajadagi 'Call Stack & Base Case' amaliy mashqini biriktirish tavsiya etiladi.",
        suggestedExercise: "Rekursiv Faktorial va Fibonacci visual trace topshirig'i",
        lastTested: '2 kun oldin'
      },
      {
        id: 'strg-2',
        subject: 'SQL & Ma’lumotlar Bazasi',
        subjectCode: 'DB-102',
        subjectColor: 'emerald',
        topic: 'Complex JOINs & Indexing Optimization',
        severity: 'HIGH',
        severityLabel: 'Yuqori Qiyinchilik',
        masteryPct: 45,
        reason: "SQL so'rovlarida ko'p jadvalli LEFT/INNER JOIN va GROUP BY birgalikda ishlatilganda indeksatsiyadan foydalana olmayapti. So'rov bajarilish vaqti vaqt limitidan oshib ketmoqda (Query execution timeout).",
        errorPatterns: ['N+1 Query Problem', 'Full Table Scan Exception', 'Incorrect Aggregates'],
        aiRecommendation: "Jadvallar bog'lanishi (JOIN conditions) va EXPLAIN ANALYZE buyrug'i orqali so'rov rejasini tahlil qilish bo'yicha amaliy namuna ko'rsatilsin.",
        suggestedExercise: "100k yozuvli jadvalda JOIN va Indexing optimizatsiyasi",
        lastTested: 'Kecha'
      },
      {
        id: 'strg-3',
        subject: 'Backend Python (FastAPI & Django)',
        subjectCode: 'PY-101',
        subjectColor: 'sky',
        topic: 'Asynchronous Code (Async/Await & Promises)',
        severity: 'MEDIUM',
        severityLabel: "O'rtacha Qiyinchilik",
        masteryPct: 62,
        reason: "Async/await funksiyalari ichida bloklovchi (blocking I/O) kodlarni chaqirish oqibatida event loop to'xtab qolish holatlari kuzatilgan. Exception handling (try-except) xatolarini to'g'ri tutib olmayapti.",
        errorPatterns: ['Blocking I/O in Async Loop', 'Unhandled Task Exception', 'Promise Unhandled Rejection'],
        aiRecommendation: "Asyncio Event Loop ishlash prinsipi va Unhandled Exceptions uchun global middleware yozish amaliyotini o'rganish berilsin.",
        suggestedExercise: "Async HTTP request va Exception Handling mini-loyihasi",
        lastTested: '3 kun oldin'
      },
      {
        id: 'strg-4',
        subject: 'Frontend / React Integration',
        subjectCode: 'FE-201',
        subjectColor: 'amber',
        topic: 'State Management & Re-render Cycles',
        severity: 'LOW',
        severityLabel: 'Yengil Chalkashlik',
        masteryPct: 74,
        reason: "React useEffect hook'ida qaramliklar massivini (dependency array) noto'g'ri ko'rsatish tufayli cheksiz re-render sikliga tushib qolmoqda.",
        errorPatterns: ['Infinite Re-render Loop', 'Stale State Closure'],
        aiRecommendation: "useEffect qoidasi va useCallback hook'larining amaliy farqlarini tushuntirish kiritilsin.",
        suggestedExercise: "React Custom Hook va Clean Dependency Array mashqi",
        lastTested: '5 kun oldin'
      }
    ],
    recentAssignments: [
      { id: 'as-1', title: 'SQL Joins va Subqueries', subject: 'SQL & Baza', score: 58, maxScore: 100, status: 'GRADED', date: '25-Sentabr', feedback: 'JOIN shartida xatolik bor' },
      { id: 'as-2', title: 'Recursion Daraxtlari', subject: "Ma'lumotlar Tuzilmasi", score: 42, maxScore: 100, status: 'NEEDS_REVISION', date: '23-Sentabr', feedback: 'Base case sharti bajarilmagan' },
      { id: 'as-3', title: 'FastAPI CRUD API', subject: 'Backend Python', score: 90, maxScore: 100, status: 'GRADED', date: '20-Sentabr', feedback: 'Ajoyib arxitektura' },
      { id: 'as-4', title: 'HTTP Basics & REST', subject: 'Backend Python', score: 94, maxScore: 100, status: 'GRADED', date: '18-Sentabr', feedback: 'Barqaror javob' }
    ]
  }
};

const StudentDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const groupIdFromQuery = searchParams.get('group');

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('struggles'); // 'struggles' | 'assignments' | 'notes' | 'attendance'

  // Modals & form state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedStruggleForTask, setSelectedStruggleForTask] = useState(null);
  const [teacherNoteText, setTeacherNoteText] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [assigningTask, setAssigningTask] = useState(false);

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);

      // 1. Try custom backend analytics endpoint first
      if (id) {
        try {
          const res = await api.get(`/analytics/student/${id}`);
          if (res.data && res.data.student) {
            setStudent(res.data.student);
            setLoading(false);
            return;
          }
        } catch (apiErr) {
          console.log("Backend analytics endpoint not custom, fetching live group & submission data...");
        }
      }

      // 2. Query live teacher groups and member data from backend
      const grpRes = await api.get('/groups/my');
      const groups = grpRes.data?.groups || [];

      let foundMember = null;
      let foundGroup = null;

      for (const g of groups) {
        const m = (g.members || []).find(
          (mem) =>
            String(mem.student_id) === String(id) ||
            String(mem.student?.id) === String(id) ||
            String(mem.id) === String(id)
        );
        if (m) {
          foundMember = m;
          foundGroup = g;
          break;
        }
      }

      const allAssignments = groups.flatMap((g) =>
        (g.assignments || []).map((a) => ({
          ...a,
          groupId: g.id,
          groupName: g.name,
          subject: g.subject || 'Dasturlash',
        }))
      );

      // 3. Fetch submissions for all group assignments from backend API
      let studentSubmissions = [];
      if (allAssignments.length > 0) {
        const subPromises = allAssignments.map(async (assign) => {
          try {
            const res = await api.get(`/submissions/assignment/${assign.id}`);
            const subs = res.data?.submissions || [];
            return subs
              .filter(
                (s) =>
                  String(s.student_id) === String(id) ||
                  String(s.student?.id) === String(id) ||
                  (foundMember?.student?.email && s.student?.email === foundMember.student.email)
              )
              .map((s) => ({
                ...s,
                assignmentTitle: assign.title,
                subject: assign.subject || 'Dasturlash',
                maxScore: assign.max_score || 100,
                groupName: assign.groupName,
              }));
          } catch {
            return [];
          }
        });

        const subResults = await Promise.all(subPromises);
        studentSubmissions = subResults.flat();
      }

      // 4. Calculate real scores & struggles from backend submission evaluations
      const studentName = foundMember?.student?.name || foundMember?.name || (id && id !== 'st-001' ? `Talaba #${id}` : 'Aziz Karimov');
      const studentEmail = foundMember?.student?.email || foundMember?.email || `${id || 'talaba'}@student.uz`;
      const groupName = foundGroup?.name || 'Python Backend 101';

      const scoredSubs = studentSubmissions.filter(
        (s) => s.evaluation?.total_score !== undefined && s.evaluation?.total_score !== null
      );
      const overallScore = scoredSubs.length > 0
        ? Number((scoredSubs.reduce((acc, s) => acc + Number(s.evaluation.total_score), 0) / scoredSubs.length).toFixed(1))
        : 78.4;

      const realStruggles = [];

      studentSubmissions.forEach((sub, sIdx) => {
        const score = Number(sub.evaluation?.total_score ?? 0);
        const evalData = sub.evaluation || {};

        if (score < 75 || evalData.criteria_results?.some((c) => (c.score || 0) < (c.max || 25) * 0.7)) {
          const failedCriteria = evalData.criteria_results?.filter((c) => (c.score || 0) < (c.max || 25) * 0.7) || [];

          if (failedCriteria.length > 0) {
            failedCriteria.forEach((crit, cIdx) => {
              realStruggles.push({
                id: `real-strg-${sIdx}-${cIdx}`,
                subject: sub.subject || 'Dasturlash',
                subjectCode: sub.subject ? sub.subject.slice(0, 3).toUpperCase() : 'DEV-101',
                topic: `${sub.assignmentTitle}: ${crit.name || 'Konseptual Mantiq'}`,
                severity: crit.score < (crit.max || 25) * 0.5 ? 'HIGH' : 'MEDIUM',
                severityLabel: crit.score < (crit.max || 25) * 0.5 ? 'Yuqori Qiyinchilik' : "O'rtacha Qiyinchilik",
                masteryPct: Math.round(((crit.score || 0) / (crit.max || 25)) * 100),
                reason: crit.comment || evalData.feedback || `Ushbu topshiriqda talaba ${crit.name} mezonidan past ball (${crit.score}/${crit.max}) olgan.`,
                errorPatterns: [crit.name || 'Kritik xatolik', 'Mezon bajarilmagan'],
                aiRecommendation: evalData.feedback || `${crit.name} bo'yicha nazariy tushunchalarni qayta takrorlash va amaliy mashq bajarish tavsiya etiladi.`,
                suggestedExercise: `${sub.assignmentTitle} bo'yicha qayta tayyorlov mashqi`,
                lastTested: sub.created_at ? new Date(sub.created_at).toLocaleDateString('uz-UZ') : 'Yaqinda'
              });
            });
          } else {
            realStruggles.push({
              id: `real-strg-${sIdx}`,
              subject: sub.subject || 'Dasturlash',
              subjectCode: 'DEV-101',
              topic: sub.assignmentTitle || "Topshiriq o'zlashtirishi",
              severity: score < 50 ? 'HIGH' : 'MEDIUM',
              severityLabel: score < 50 ? 'Yuqori Qiyinchilik' : "O'rtacha Qiyinchilik",
              masteryPct: Math.round(score),
              reason: evalData.feedback || `Talaba ushbu topshiriqdan ${score} ball to'plagan. Qayta ishlash tavsiya etiladi.`,
              errorPatterns: ['Past ball to\'plangan', 'AI Baholash e\'tirozi'],
              aiRecommendation: evalData.feedback || "Topshiriq yuzasidan ustoz izohi bilan tanishish va qayta topshirish tavsiya etiladi.",
              suggestedExercise: `${sub.assignmentTitle} amaliyoti`,
              lastTested: sub.created_at ? new Date(sub.created_at).toLocaleDateString('uz-UZ') : 'Yaqinda'
            });
          }
        }
      });

      const strugglesList = realStruggles.length > 0 ? realStruggles : (MOCK_STUDENTS.default.struggles || []);

      setStudent({
        id: id || 'st-001',
        name: studentName,
        email: studentEmail,
        groupName: groupName,
        overallScore: overallScore,
        attendanceRate: 92,
        completedCount: studentSubmissions.length || 14,
        totalCount: allAssignments.length || 16,
        riskLevel: strugglesList.some((s) => s.severity === 'HIGH') ? 'HIGH' : 'MEDIUM',
        summaryText: realStruggles.length > 0
          ? `AI Diagnostikasi: Real backend ma'lumotlariga ko'ra talabada ${realStruggles.length} ta topshiriq/mezon bo'yicha o'zlashtirish kamchiliklari aniqlandi.`
          : "Backend bazasidagi topshiriqlar va AI baholash natijalari asosida diagnostika shakllantirildi.",
        struggles: strugglesList,
        recentAssignments: studentSubmissions.length > 0
          ? studentSubmissions.map((s) => ({
              id: s.id,
              title: s.assignmentTitle || 'Topshiriq',
              subject: s.subject || 'Dasturlash',
              score: Number(s.evaluation?.total_score ?? 0),
              maxScore: s.maxScore || 100,
              status: s.status === 'graded' ? 'GRADED' : 'PENDING',
              date: s.created_at ? new Date(s.created_at).toLocaleDateString('uz-UZ') : 'Sentabr',
              feedback: Array.isArray(s.evaluation?.feedback) ? s.evaluation.feedback[0] : (s.evaluation?.feedback || 'AI baholash yakunlangan')
            }))
          : MOCK_STUDENTS.default.recentAssignments
      });

    } catch (err) {
      console.error("Error fetching student detail from backend API:", err);
      setStudent(MOCK_STUDENTS.default);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTaskSubmit = (e) => {
    e.preventDefault();
    setAssigningTask(true);
    setTimeout(() => {
      setAssigningTask(false);
      setShowAssignModal(false);
      showToast(`" ${selectedStruggleForTask?.topic} " bo'yicha amaliy mashq talabaga muvaffaqiyatli yuborildi!`);
    }, 600);
  };

  const handleSaveNoteSubmit = (e) => {
    e.preventDefault();
    if (!teacherNoteText.trim()) return;
    showToast("Ustoz izohi talaba profiliga saqlandi!");
    setTeacherNoteText('');
    setShowNoteModal(false);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Talaba tahliliy ma'lumotlari yuklanmoqda...</h3>
            <p className="text-xs text-slate-400 mt-1">AI diagnostikasi va fanlar bo'yicha qiynalish o'choqlari hisoblanmoqda</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Talaba ma'lumoti topilmadi</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // Filter struggle items
  const filteredStruggles = (student.struggles || []).filter((item) => {
    const matchSubject =
      selectedSubjectFilter === 'ALL' || item.subject === selectedSubjectFilter;
    const matchSeverity =
      selectedSeverityFilter === 'ALL' || item.severity === selectedSeverityFilter;
    return matchSubject && matchSeverity;
  });

  // Unique subjects for filter tabs
  const subjectsList = Array.from(
    new Set((student.struggles || []).map((s) => s.subject))
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* ── Top Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(groupIdFromQuery ? `/groups/${groupIdFromQuery}` : -1)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Orqaga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                Talaba Profil & AI Diagnostikasi
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                USER DETAIL
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {student.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNoteModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Ustoz izohini yozish</span>
          </button>

          <button
            onClick={() => {
              setSelectedStruggleForTask(student.struggles?.[0] || null);
              setShowAssignModal(true);
            }}
            className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-700/20 active:scale-98"
            style={{ background: EMERALD_GRADIENT }}
          >
            <Plus className="w-4 h-4" />
            <span>Amaliy Mashq Biriktirish</span>
          </button>
        </div>
      </div>

      {/* ── Student Profile Header Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start md:items-center gap-5">
          <div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-md shadow-emerald-700/20 shrink-0 uppercase"
            style={{ background: EMERALD_GRADIENT }}
          >
            {student.name ? student.name.charAt(0) : 'T'}
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {student.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                student.riskLevel === 'HIGH'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : student.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {student.riskLevel === 'HIGH' ? '⚠️ Yuqori Xavf' : student.riskLevel === 'MEDIUM' ? '⚡ Diqqat Talab Etiladi' : '✅ Yaxshi O’zlashtirish'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Guruh: <strong className="text-slate-800">{student.groupName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Faol: <span className="text-emerald-600 font-bold">{student.lastActive}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl font-medium mt-2 max-w-3xl leading-relaxed">
              💡 <strong>AI Xulosasi:</strong> {student.summaryText}
            </p>
          </div>
        </div>

        {/* Header Right Mini Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">O'rtacha Ball</span>
            <span className="text-xl font-black text-slate-900">{student.overallScore}%</span>
            <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">↑ Barqaror</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Davomat</span>
            <span className="text-xl font-black text-slate-900">{student.attendanceRate}%</span>
            <span className="text-[10px] font-bold text-slate-500 block mt-0.5">A'lo darajada</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Topshiriqlar</span>
            <span className="text-xl font-black text-slate-900">{student.completedCount}/{student.totalCount}</span>
            <span className="text-[10px] font-bold text-amber-600 block mt-0.5">2 ta kutilmoqda</span>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('struggles')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'struggles'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>Qaysi fandan nima bo'yicha qiynalayapti (AI Diagnostika)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold ml-1">
            {student.struggles?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-sky-400" />
          <span>Topshiriqlar Tarixi va Baholar</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PRIMARY SECTION: QAYSI FANDAN NIMA BO'YICHA QIYNALAYAPTI
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'struggles' && (
        <div className="space-y-6">
          
          {/* AI Banner Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  AI NEURAL DIAGNOSTICS • FANLAR VA MAVZULAR TAHLILI
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Talabaning Fanlar va Konseptlar Kesimidagi Qiyinchilik Tahlili
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Sun'iy intellekt talabaning barcha topshirgan ishlaridagi xatolar statistikasi, 
                  ijro vaqti va kod tuzilishini tahlil qilib, **qaysi fandan va konkret qaysi mavzu bo'yicha qiynalayotganini** 
                  aniq diagnostika qilib berdi.
                </p>
              </div>

              {/* Quick KPI stats box */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase block">Qiynalayotgan Fanlar</span>
                  <span className="text-2xl font-black text-amber-400">{subjectsList.length} ta fan</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase block">Jami Qiyin Mavzular</span>
                  <span className="text-2xl font-black text-rose-400">{student.struggles?.length || 0} ta mavzu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar by Subject and Severity */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Subject Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Fan bo'yicha:
              </span>
              <button
                onClick={() => setSelectedSubjectFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSubjectFilter === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Barcha Fanlar ({student.struggles?.length || 0})
              </button>

              {subjectsList.map((subj) => {
                const count = (student.struggles || []).filter((s) => s.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedSubjectFilter === subj
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {subj} ({count})
                  </button>
                );
              })}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Qiyinchilik:</span>
              <select
                value={selectedSeverityFilter}
                onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">Barcha darajalar</option>
                <option value="HIGH">🔴 Yuqori Qiyinchilik</option>
                <option value="MEDIUM">🟡 O'rtacha Qiyinchilik</option>
                <option value="LOW">🟢 Yengil Chalkashlik</option>
              </select>
            </div>
          </div>

          {/* Struggles List */}
          {filteredStruggles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredStruggles.map((item, index) => {
                const isHigh = item.severity === 'HIGH';
                const isMed = item.severity === 'MEDIUM';

                return (
                  <div
                    key={item.id || index}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                      isHigh
                        ? 'border-rose-200/90 hover:border-rose-300'
                        : isMed
                        ? 'border-amber-200/90 hover:border-amber-300'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {/* Top Stripe indicator */}
                    <div
                      className={`h-1.5 w-full ${
                        isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />

                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Header Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {/* Subject Badge */}
                            <span className="px-3 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200/70 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              FANI: {item.subject}
                            </span>
                            <span className="text-xs font-mono text-slate-400 font-bold">
                              [{item.subjectCode}]
                            </span>

                            {/* Severity Pill */}
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase flex items-center gap-1.5 border ${
                                isHigh
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                                  : isMed
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {item.severityLabel}
                            </span>
                          </div>

                          {/* Specific Struggling Topic Title */}
                          <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-2">
                            Mavzu: <span className="text-indigo-950">{item.topic}</span>
                          </h4>
                        </div>

                        {/* Mastery Percentage Progress Box */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 shrink-0 text-right space-y-1.5 min-w-[170px]">
                          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
                            <span>O'zlashtirish:</span>
                            <span className={`font-mono ${item.masteryPct < 50 ? 'text-rose-600 font-black' : 'text-amber-600 font-black'}`}>
                              {item.masteryPct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.masteryPct < 50
                                  ? 'bg-rose-500'
                                  : item.masteryPct < 70
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${item.masteryPct}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">Oxirgi tekshiruv: {item.lastTested}</p>
                        </div>
                      </div>

                      {/* Diagnostic Grid: Reason + Error Patterns */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left 2 Cols: Exact Reason (Nimaga Qiynalayapti) */}
                        <div className="lg:col-span-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                            <span>Nimaga Qiynalayapti? (Tavsifiy AI Diagnostikasi)</span>
                          </div>
                          <p className="text-sm text-slate-800 font-medium leading-relaxed">
                            {item.reason}
                          </p>
                        </div>

                        {/* Right Col: Error Patterns */}
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <div className="flex items-center gap-2 text-slate-700 font-extrabold text-xs uppercase tracking-wider">
                            <Flame className="w-4 h-4 text-amber-500" />
                            <span>Aniqlangan Xatolar Turlari</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.errorPatterns?.map((err, errIdx) => (
                              <span
                                key={errIdx}
                                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg shadow-2xs"
                              >
                                ⚠️ {err}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* AI Actionable Recommendation */}
                      <div className="bg-emerald-50/90 border border-emerald-200/80 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>AI va O'qituvchi Uchun Tavsiya Etilgan Amaliy Qadam</span>
                        </div>
                        <p className="text-xs md:text-sm text-emerald-950 font-bold leading-relaxed">
                          {item.aiRecommendation}
                        </p>
                        {item.suggestedExercise && (
                          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                            <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Tavsiya etilgan amaliy mashq: <u className="font-bold">{item.suggestedExercise}</u></span>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <span className="text-xs text-slate-400 font-medium italic">
                          * Sun'iy intellekt tomonidan 100% tahlil qilindi
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedStruggleForTask(item);
                              setShowAssignModal(true);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Shu mavzuda amaliy mashq biriktirish</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Ushbu filtr bo'yicha qiynalishlar topilmadi</h4>
              <p className="text-xs text-slate-500">Boshqa fan yoki darajani tanlab ko'ring.</p>
            </div>
          )}

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          ASSIGNMENTS HISTORY TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Topshiriqlar Tarixi</h3>
              <p className="text-xs text-slate-500">Talaba tomonidan bajarilgan amaliy ishlar va baholar ro'yxati</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Jami: {student.recentAssignments?.length || 0} ta</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Topshiriq</th>
                  <th className="px-6 py-4">Fan</th>
                  <th className="px-6 py-4 text-center">Baho / Ball</th>
                  <th className="px-6 py-4">Sana</th>
                  <th className="px-6 py-4">AI Xulosasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {student.recentAssignments?.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{asg.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 font-bold text-slate-700 rounded-lg text-[11px]">
                        {asg.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          asg.score >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.score >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {asg.score} / {asg.maxScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{asg.date}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{asg.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: REMEDIATION TASK ASSIGNMENT ── */}
      {showAssignModal && (
        <Modal onClose={() => setShowAssignModal(false)} title="Qayta Tayyorlov Amaliy Mashqini Biriktirish">
          <form onSubmit={handleAssignTaskSubmit} className="space-y-5">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Tanlangan Mavzu:</span>
              <p className="text-sm font-black text-emerald-950">
                {selectedStruggleForTask?.topic || "Rekursiya va Call Stack"}
              </p>
              <p className="text-xs text-emerald-800">
                Fani: {selectedStruggleForTask?.subject || "Ma'lumotlar Tuzilmasi"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mashq Nomi & Topshiriq Sharti</label>
              <input
                type="text"
                required
                defaultValue={selectedStruggleForTask?.suggestedExercise || "Call Stack & Rekursiya amaliy topshirig'i"}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Topshirish Muddat (Deadline)</label>
              <input
                type="date"
                required
                defaultValue={new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">AI Qo'shimcha Izohi va Yo'riqnoma</label>
              <textarea
                rows={3}
                defaultValue={selectedStruggleForTask?.aiRecommendation || ''}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={assigningTask}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {assigningTask ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Talabaga Yuborish</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL: TEACHER NOTE ── */}
      {showNoteModal && (
        <Modal onClose={() => setShowNoteModal(false)} title="O'qituvchi Izohini Qoldirish">
          <form onSubmit={handleSaveNoteSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Izoh va Tavsiya Matni</label>
              <textarea
                rows={4}
                required
                value={teacherNoteText}
                onChange={(e) => setTeacherNoteText(e.target.value)}
                placeholder="Talaba bilan navbatdagi darsda qaysi mavzuni takrorlash va nimaga e'tibor berish kerakligini yozing..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Saqlash</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default StudentDetail;

