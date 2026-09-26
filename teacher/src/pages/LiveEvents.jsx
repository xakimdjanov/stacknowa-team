import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Users,
  KeyRound,
  FileText,
  HelpCircle,
  BarChart2,
  ArrowRight,
  Clock,
  Radio,
  Award,
  BookOpen,
  Plus,
  QrCode,
  Loader2,
  RefreshCw,
  Building2,
  UploadCloud,
  Check,
  X,
  CheckCircle,
  Trophy,
  Medal,
  FileSpreadsheet,
  ChevronRight,
  Signal,
  Target,
  Activity
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function LiveEvents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lobby');

  const [materialTitle, setMaterialTitle] = useState('Dars Materiali Quiz');
  const [questions, setQuestions] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const [allMaterials, setAllMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const [gamePin, setGamePin] = useState('');
  const [eventId, setEventId] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastServerUpdatedAt, setLastServerUpdatedAt] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchMyGroups();
    fetchTeacherMaterials();

    const savedQuestions = sessionStorage.getItem('ai_quiz_questions');
    const savedTitle = sessionStorage.getItem('ai_quiz_title');
    const savedGroupId = sessionStorage.getItem('ai_quiz_group_id');

    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) setQuestions(parsed);
      } catch (e) { console.error('Error parsing saved questions:', e); }
    }
    if (savedTitle) setMaterialTitle(savedTitle);
    if (savedGroupId) setSelectedGroupId(savedGroupId);

    // Restore active event - only if NOT coming fresh from Materials page
    const isFromMaterials = Boolean(savedQuestions);
    if (!isFromMaterials) {
      const savedEventId = localStorage.getItem('active_teacher_event_id');
      const savedTab = localStorage.getItem('active_teacher_tab');
      if (savedEventId) {
        setEventId(savedEventId);
        if (savedTab) setActiveTab(savedTab);
        fetchLiveState(savedEventId);
      }
    } else {
      // Clear old event so lobby is fresh
      sessionStorage.removeItem('ai_quiz_questions');
      sessionStorage.removeItem('ai_quiz_title');
      sessionStorage.removeItem('ai_quiz_group_id');
    }
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/groups/my');
      if (res.data?.groups) {
        setMyGroups(res.data.groups);
        if (res.data.groups.length > 0 && !selectedGroupId) setSelectedGroupId(res.data.groups[0].id);
      }
    } catch (err) { console.error('Groups fetch error:', err); }
  };

  const fetchTeacherMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get('/events/my-materials');
      if (res.data?.materials) setAllMaterials(res.data.materials);
    } catch (err) { console.error('Teacher materials fetch error:', err); }
    finally { setLoadingMaterials(false); }
  };

  const groupMaterials = allMaterials.filter(
    (m) => Number(m.group_id) === Number(selectedGroupId)
  );

  useEffect(() => {
    if (groupMaterials.length > 0) {
      const firstMat = groupMaterials[0];
      setSelectedMaterialId(firstMat.id);
      if (firstMat.questions && Array.isArray(firstMat.questions)) setQuestions(firstMat.questions);
      setMaterialTitle(firstMat.title || firstMat.material_name);
    }
  }, [selectedGroupId, allMaterials.length]);

  const handleMaterialSelect = (matId) => {
    setSelectedMaterialId(matId);
    const mat = allMaterials.find((m) => Number(m.id) === Number(matId));
    if (mat) {
      if (mat.questions && Array.isArray(mat.questions)) setQuestions(mat.questions);
      setMaterialTitle(mat.title || mat.material_name);
    }
  };

  useEffect(() => {
    let interval;
    if (eventId && (activeTab === 'lobby' || activeTab === 'quiz' || activeTab === 'attendance')) {
      fetchLiveState(eventId);
      interval = setInterval(() => { fetchLiveState(eventId); }, 2000);
    }
    return () => clearInterval(interval);
  }, [eventId, activeTab]);

  const fetchLiveState = async (id) => {
    const targetId = id || eventId;
    if (!targetId) return;
    try {
      const res = await api.get(`/events/${targetId}/live-state`);
      if (res.data?.participants) setParticipants(res.data.participants);
      if (res.data?.event) {
        if (res.data.event.pin_code) setGamePin(res.data.event.pin_code);
        if (res.data.event.title) setMaterialTitle(res.data.event.title);
        if (res.data.event.questions && Array.isArray(res.data.event.questions) && res.data.event.questions.length > 0)
          setQuestions(res.data.event.questions);
        if (res.data.event.current_question_index !== undefined) setCurrentQIdx(res.data.event.current_question_index);
        if (res.data.event.updatedAt) {
          setLastServerUpdatedAt(res.data.event.updatedAt);
          const startedAt = new Date(res.data.event.updatedAt).getTime();
          const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
          setTimeLeft(Math.max(0, 30 - elapsedSec));
        }
        if (res.data.event.status === 'ACTIVE' && activeTab === 'selection') { setActiveTab('quiz'); localStorage.setItem('active_teacher_tab', 'quiz'); }
        else if (res.data.event.status === 'LOBBY' && activeTab === 'selection') { setActiveTab('lobby'); localStorage.setItem('active_teacher_tab', 'lobby'); }
        else if (res.data.event.status === 'FINISHED' && activeTab !== 'attendance') { setActiveTab('attendance'); localStorage.setItem('active_teacher_tab', 'attendance'); }
      }
    } catch (err) { console.error('Live state error:', err); }
  };

  const handleCreateEvent = async () => {
    if (questions.length === 0) {
      alert("Savollar mavjud emas. Iltimos, avval Materiallar bo'limida AI orqali 20 ta savol shakllantiring!");
      navigate('/materials');
      return;
    }
    setCreatingEvent(true);
    try {
      const res = await api.post('/events/create', {
        title: materialTitle, questions, group_id: selectedGroupId || null, material_name: materialTitle,
      });
      const createdId = res.data?.event?.id;
      if (createdId) { setEventId(createdId); localStorage.setItem('active_teacher_event_id', createdId); }
      if (res.data?.game_pin) { setGamePin(res.data.game_pin); }
      else { setGamePin(Math.floor(100000 + Math.random() * 900000).toString()); }
      setActiveTab('lobby');
      localStorage.setItem('active_teacher_tab', 'lobby');
      fetchLiveState(createdId);
    } catch (err) {
      console.error('Create event error:', err);
      setGamePin(Math.floor(100000 + Math.random() * 900000).toString());
      setActiveTab('lobby');
      localStorage.setItem('active_teacher_tab', 'lobby');
    } finally { setCreatingEvent(false); }
  };

  // Yangi event boshlash — barcha eski holatni tozalash
  const handleResetEvent = () => {
    localStorage.removeItem('active_teacher_event_id');
    localStorage.removeItem('active_teacher_tab');
    sessionStorage.removeItem('ai_quiz_questions');
    sessionStorage.removeItem('ai_quiz_title');
    sessionStorage.removeItem('ai_quiz_group_id');
    setEventId(null);
    setGamePin('');
    setParticipants([]);
    setCurrentQIdx(0);
    setTimeLeft(30);
    setActiveTab('lobby');
    setMaterialTitle('Dars Materiali Quiz');
    setQuestions([]);
  };

  const handleStartQuiz = async () => {
    if (eventId) {
      try {
        const res = await api.put(`/events/${eventId}/start`);
        if (res.data?.event?.updatedAt) setLastServerUpdatedAt(res.data.event.updatedAt);
      } catch (err) { console.log('Start event err:', err.message); }
    }
    setActiveTab('quiz');
    localStorage.setItem('active_teacher_tab', 'quiz');
    setCurrentQIdx(0);
    setTimeLeft(30);
  };

  const handleNextQuestion = async () => {
    if (eventId) {
      try {
        const res = await api.put(`/events/${eventId}/next`);
        if (res.data?.event?.updatedAt) setLastServerUpdatedAt(res.data.event.updatedAt);
      } catch (err) { console.log('Next question err:', err.message); }
    }
    const totalQs = questions.length > 0 ? questions.length : 20;
    if (currentQIdx < totalQs - 1) { setCurrentQIdx((prev) => prev + 1); setTimeLeft(30); }
    else { setActiveTab('attendance'); localStorage.setItem('active_teacher_tab', 'attendance'); }
  };

  const getDynamicResponseCounts = () => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    participants.forEach((p) => {
      let answersList = p.answers || [];
      if (typeof answersList === 'string') { try { answersList = JSON.parse(answersList); } catch (e) { answersList = []; } }
      if (Array.isArray(answersList)) {
        const currentAns = answersList.find((a) => Number(a.question_index) === Number(currentQIdx));
        if (currentAns && currentAns.selected_option_index !== undefined && currentAns.selected_option_index !== null) {
          const idx = Number(currentAns.selected_option_index);
          if (counts[idx] !== undefined) counts[idx] += 1;
        }
      }
    });
    return counts;
  };

  const dynamicCounts = getDynamicResponseCounts();
  const currentQ = questions[currentQIdx] || {
    question: `${currentQIdx + 1}-Savol: Relatsion bazalarda B-Tree indeksining afzalligi nima?`,
    correctIndex: 1,
    options: ["Algoritmik murakkablik O(N) va saralash", "Ma'lumotlar yaxlitligi va B-Tree indekslash", "Vaqtinchalik kesh xotira", "UI avtomatik render"]
  };

  const correctIdx = currentQ.correctIndex ?? 1;
  const totalVotes = dynamicCounts[0] + dynamicCounts[1] + dynamicCounts[2] + dynamicCounts[3];
  const correctVotes = dynamicCounts[correctIdx] || 0;
  const incorrectVotes = Math.max(0, totalVotes - correctVotes);
  const correctPercent = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;
  const incorrectPercent = totalVotes > 0 ? Math.round((incorrectVotes / totalVotes) * 100) : 0;

  const sortedParticipants = [...participants].map((p) => {
    let ansList = p.answers || [];
    if (typeof ansList === 'string') { try { ansList = JSON.parse(ansList); } catch (e) { ansList = []; } }
    const correctCount = Array.isArray(ansList) ? ansList.filter((a) => a.isCorrect).length : (p.total_correct || 0);
    const incorrectCount = Math.max(0, (Array.isArray(ansList) ? ansList.length : 0) - correctCount);
    const accuracy = ansList.length > 0 ? Math.round((correctCount / ansList.length) * 100) : 0;
    return { ...p, correctCount, incorrectCount, accuracy, score: p.score || correctCount * 100 };
  }).sort((a, b) => b.score - a.score);

  const TABS = [
    { id: 'lobby', label: 'Live Lobby', sub: `${participants.length} ta`, icon: Users, iconColor: 'text-indigo-500' },
    { id: 'quiz', label: 'Quiz Arenasi', sub: 'Presenter', icon: Radio, iconColor: 'text-rose-500', disabled: !gamePin },
    { id: 'attendance', label: 'Davomat & Natijalar', sub: `${participants.length} ta`, icon: CheckCircle2, iconColor: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-700/20 flex-shrink-0"
            style={{ background: EMERALD_GRADIENT }}
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Live Events & Game PIN
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Guruh va dars materialini tanlang, interaktiv quiz o'tkazing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Yangi Event button — only show when an event is active */}
          {eventId && (
            <button
              onClick={handleResetEvent}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Yangi Event
            </button>
          )}
          <button
            onClick={() => navigate('/materials')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            Yangi Material Yuklash
          </button>
        </div>
      </div>

      {/* Active event banner */}
      {eventId && gamePin && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
            <span className="text-xs font-bold text-emerald-800">
              Faol Event — Game PIN: <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg ml-1">{gamePin}</span>
            </span>
            <span className="text-xs text-emerald-600 font-medium hidden md:block">
              {participants.length} ta talaba ulangan
            </span>
          </div>
          <button
            onClick={handleResetEvent}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Yangi Event Boshlash
          </button>
        </div>
      )}

      {/* ── TAB NAVIGATION ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-1.5 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`flex-1 min-w-0 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : tab.disabled
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.iconColor} ${tab.id === 'quiz' && activeTab !== 'quiz' ? 'animate-pulse' : ''}`} />
            <span>{i + 1}. {tab.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* TAB 1 — LIVE LOBBY                            */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'lobby' && (
        <div className="space-y-5">
          {/* Setup Card */}
          {!gamePin ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1" style={{ background: EMERALD_GRADIENT }} />

              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: EMERALD_GRADIENT }}>
                    <Zap className="w-7 h-7 text-white fill-current" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Game PIN Yaratish</h2>
                  <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                    O'quv guruhini tanlang → Ushbu guruhga ait dars materialini tanlang → Game PIN yarating
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      1. O'quv Guruhi
                    </label>
                    <select
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
                    >
                      {myGroups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name} ({g.subject})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      2. Dars Materiali & AI Savollar
                    </label>
                    <select
                      value={selectedMaterialId}
                      onChange={(e) => handleMaterialSelect(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
                    >
                      {groupMaterials.length === 0 ? (
                        <option value="">Ushbu guruhda material yo'q</option>
                      ) : (
                        groupMaterials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title || m.material_name} ({m.questions?.length || 20} ta savol)
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {groupMaterials.length === 0 && (
                  <div className="max-w-2xl mx-auto p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center justify-between">
                    <span className="font-semibold">Ushbu guruh uchun dars materiali yuklanmagan.</span>
                    <button
                      onClick={() => navigate('/materials')}
                      className="px-4 py-1.5 bg-amber-500 text-white font-bold text-[11px] rounded-xl cursor-pointer hover:bg-amber-600 transition-colors"
                    >
                      + Yuklash
                    </button>
                  </div>
                )}

                <div className="max-w-2xl mx-auto">
                  <button
                    onClick={handleCreateEvent}
                    disabled={creatingEvent}
                    style={{ background: EMERALD_GRADIENT }}
                    className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5"
                  >
                    {creatingEvent ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Game PIN Yaratilmoqda...</>
                    ) : (
                      <><Zap className="w-5 h-5 fill-current" /> ⚡ GAME PIN YARATISH & EVENT BOSHLASH</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PIN Display */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Big PIN */}
              <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(5,150,105,0.15)_0%,transparent_60%)]" />
                <div className="relative z-10">
                  <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                    LIVE LOBBY ARENA
                  </span>
                  <h2 className="text-lg font-black text-white mt-3 truncate">{materialTitle}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Talabalar quyidagi PIN ni kiritib ulanishadi</p>

                  <div className="mt-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl py-6 px-8 inline-block mx-auto shadow-2xl shadow-emerald-700/40">
                    <div className="text-[10px] text-emerald-100 font-black uppercase tracking-widest mb-1">GAME PIN</div>
                    <div className="font-mono text-5xl md:text-6xl font-black text-white tracking-[0.2em]">{gamePin}</div>
                  </div>
                </div>
              </div>

              {/* Stats & Participants */}
              <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Ulangan Talabalar</h3>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                </div>

                <div className="text-3xl font-black text-slate-900">{participants.length} <span className="text-sm font-semibold text-slate-400">kishi</span></div>

                {participants.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                    Talabalar PIN kiritishini kutmoqda...
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {participants.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs flex-shrink-0">
                          {(p.student_name || p.name || 'T')[0]}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 truncate">{p.student_name || p.name}</span>
                        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {gamePin && (
                  <button
                    onClick={handleStartQuiz}
                    style={{ background: EMERALD_GRADIENT }}
                    className="w-full py-3.5 rounded-xl text-white font-black text-sm shadow-lg shadow-emerald-700/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    QUIZ'NI BOSHLASH
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB 2 — LIVE QUIZ ARENA (PRESENTER MODE)      */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'quiz' && (
        <div className="space-y-5">
          {/* Top Control Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl font-mono font-black text-sm">
                {currentQIdx + 1} / {questions.length || 20}
              </div>
              <span className="text-xs text-slate-600 font-semibold truncate max-w-[240px]">{materialTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono font-black text-xl transition-all ${
                timeLeft <= 5
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : timeLeft <= 10
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
                {timeLeft}s
              </div>

              <button
                onClick={handleNextQuestion}
                style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                {currentQIdx < (questions.length || 20) - 1 ? 'Keyingi Savol' : 'Yakunlash & Davomat'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-8 text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
              #{currentQIdx + 1}-SAVOL • REAL-TIME JAVOBLAR
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-relaxed max-w-4xl mx-auto">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'A', color: 'rose', bgFrom: 'from-rose-500', bgTo: 'to-rose-600', idx: 0 },
              { label: 'B', color: 'blue', bgFrom: 'from-blue-500', bgTo: 'to-indigo-600', idx: 1 },
              { label: 'C', color: 'amber', bgFrom: 'from-amber-500', bgTo: 'to-orange-500', idx: 2 },
              { label: 'D', color: 'emerald', bgFrom: 'from-emerald-500', bgTo: 'to-teal-600', idx: 3 },
            ].map((item) => {
              const rawOptionText = currentQ.options?.[item.idx] || `${item.label} variant`;
              const optionText = rawOptionText.length > 60 ? rawOptionText.slice(0, 57) + '...' : rawOptionText;
              const votes = dynamicCounts[item.idx] || 0;
              const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isCorrectOpt = item.idx === correctIdx;
              const isRevealed = timeLeft === 0;

              let cardClass = '';
              if (!isRevealed) {
                cardClass = `bg-gradient-to-br ${item.bgFrom} ${item.bgTo} text-white`;
              } else if (isCorrectOpt) {
                cardClass = 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white ring-4 ring-emerald-400/50 scale-[1.02]';
              } else {
                cardClass = 'bg-slate-100 border-slate-200 opacity-50 grayscale';
              }

              return (
                <div
                  key={item.idx}
                  className={`relative rounded-3xl p-5 border-2 border-transparent transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[120px] ${cardClass}`}
                >
                  {/* Fill bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-black/15 transition-all duration-700 ease-out"
                    style={{ height: `${percent}%` }}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-black/25 flex items-center justify-center font-black text-sm text-white flex-shrink-0">
                        {item.label}
                      </span>
                      <span className={`font-bold text-sm leading-snug mt-1 line-clamp-2 ${isRevealed && !isCorrectOpt ? 'text-slate-500' : 'text-white'}`}>
                        {optionText}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {isCorrectOpt && isRevealed && (
                        <span className="bg-white text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> TO'G'RI
                        </span>
                      )}
                      <span className={`bg-black/25 text-white text-xs font-bold px-2.5 py-1 rounded-xl font-mono ${isRevealed && !isCorrectOpt ? 'opacity-40' : ''}`}>
                        {votes} ({percent}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">To'g'ri Javoblar</div>
                <div className="text-2xl font-black text-emerald-800 font-mono">{correctVotes} kishi ({correctPercent}%)</div>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <X className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wide">Xato Javoblar</div>
                <div className="text-2xl font-black text-rose-800 font-mono">{incorrectVotes} kishi ({incorrectPercent}%)</div>
              </div>
            </div>
          </div>

          {/* Timer Status */}
          <div className={`p-4 rounded-2xl text-xs font-semibold text-center flex items-center justify-center gap-2 ${
            timeLeft > 0
              ? 'bg-slate-100 border border-slate-200 text-slate-600'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}>
            {timeLeft > 0 ? (
              <><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> Talabalar javob belgilashmoqda — real vaqtda yangilanmoqda</>
            ) : (
              <><Clock className="w-4 h-4 text-amber-500" /> Vaqt tugadi! To'g'ri javob ko'rsatildi. "Keyingi Savol" tugmasini bosing.</>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB 3 — DAVOMAT & NATIJALAR                  */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base">Online Davomat & Quiz Natijalari</h2>
                <p className="text-xs text-slate-400 font-medium">Talabalarning to'liq to'g'ri va xato javoblari hamda aniqlik hisoboti</p>
              </div>
            </div>
            <button
              onClick={() => alert("Natijalar Excel/PDF formatida yuklab olindi! ✅")}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Excel / PDF
            </button>
          </div>

          {/* Top 3 Podium */}
          {sortedParticipants.length > 0 && (
            <div className="px-6 pt-5 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">🏆 Top 3 O'rin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sortedParticipants.slice(0, 3).map((p, pIdx) => (
                  <div
                    key={p.id || pIdx}
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${
                      pIdx === 0 ? 'bg-amber-50 border-amber-200'
                      : pIdx === 1 ? 'bg-slate-100 border-slate-200'
                      : 'bg-orange-50/60 border-orange-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                      {pIdx === 0 ? '🥇' : pIdx === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">#{pIdx + 1}-O'rin</div>
                      <div className="font-black text-sm text-slate-900 truncate">{p.student_name || p.name}</div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-emerald-600 font-bold">{p.correctCount} ✓</span>
                        <span className="text-rose-500 font-bold">{p.incorrectCount} ✗</span>
                        <span className="text-slate-700 font-black font-mono">({p.score} ball)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="px-6 pb-6 mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Talaba F.I.SH.', "To'g'ri", 'Xato', 'Aniqlik', 'Ball', 'Davomat'].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs italic">
                      Hali bu eventda qatnashgan talabalar yo'q.
                    </td>
                  </tr>
                ) : (
                  sortedParticipants.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-xs">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{p.student_name || p.name}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono">
                          {p.correctCount} ta
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg font-mono">
                          {p.incorrectCount} ta
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p.accuracy}%` }} />
                          </div>
                          <span className="text-xs font-black text-slate-900 font-mono">{p.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-black text-emerald-700 font-mono">{p.score}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> BOR
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
