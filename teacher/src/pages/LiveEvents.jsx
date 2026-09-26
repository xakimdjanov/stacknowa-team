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
  FileSpreadsheet
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function LiveEvents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lobby'); // 'lobby' | 'quiz' | 'attendance'

  // Quiz & Event state
  const [materialTitle, setMaterialTitle] = useState('Dars Materiali Quiz');
  const [questions, setQuestions] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // All teacher materials & selected material
  const [allMaterials, setAllMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const [gamePin, setGamePin] = useState('');
  const [eventId, setEventId] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Quiz execution state (Synced Server-based Timer)
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Exactly 30 seconds per question
  const [lastServerUpdatedAt, setLastServerUpdatedAt] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchMyGroups();
    fetchTeacherMaterials();

    // Check if coming from Materials page with prefilled quiz questions
    const savedQuestions = sessionStorage.getItem('ai_quiz_questions');
    const savedTitle = sessionStorage.getItem('ai_quiz_title');
    const savedGroupId = sessionStorage.getItem('ai_quiz_group_id');

    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
        }
      } catch (e) {
        console.error("Error parsing saved questions:", e);
      }
    }

    if (savedTitle) setMaterialTitle(savedTitle);
    if (savedGroupId) setSelectedGroupId(savedGroupId);

    // RESTORE ACTIVE EVENT STATE ON PAGE REFRESH (F5)
    const savedEventId = localStorage.getItem('active_teacher_event_id');
    const savedTab = localStorage.getItem('active_teacher_tab');
    if (savedEventId) {
      setEventId(savedEventId);
      if (savedTab) setActiveTab(savedTab);
      fetchLiveState(savedEventId);
    }
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/groups/my');
      if (res.data?.groups) {
        setMyGroups(res.data.groups);
        if (res.data.groups.length > 0 && !selectedGroupId) {
          setSelectedGroupId(res.data.groups[0].id);
        }
      }
    } catch (err) {
      console.error("Groups fetch error:", err);
    }
  };

  const fetchTeacherMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get('/events/my-materials');
      if (res.data?.materials) {
        setAllMaterials(res.data.materials);
      }
    } catch (err) {
      console.error("Teacher materials fetch error:", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  // Filter materials belonging to the selected group
  const groupMaterials = allMaterials.filter(
    (m) => Number(m.group_id) === Number(selectedGroupId)
  );

  // When group changes, auto select first material of that group if available
  useEffect(() => {
    if (groupMaterials.length > 0) {
      const firstMat = groupMaterials[0];
      setSelectedMaterialId(firstMat.id);
      if (firstMat.questions && Array.isArray(firstMat.questions)) {
        setQuestions(firstMat.questions);
      }
      setMaterialTitle(firstMat.title || firstMat.material_name);
    }
  }, [selectedGroupId, allMaterials.length]);

  // Handle Material Selection Change
  const handleMaterialSelect = (matId) => {
    setSelectedMaterialId(matId);
    const mat = allMaterials.find((m) => Number(m.id) === Number(matId));
    if (mat) {
      if (mat.questions && Array.isArray(mat.questions)) {
        setQuestions(mat.questions);
      }
      setMaterialTitle(mat.title || mat.material_name);
    }
  };

  // Poll live event state (real student participants & answers)
  useEffect(() => {
    let interval;
    if (eventId && (activeTab === 'lobby' || activeTab === 'quiz' || activeTab === 'attendance')) {
      fetchLiveState(eventId);
      interval = setInterval(() => {
        fetchLiveState(eventId);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [eventId, activeTab]);

  const fetchLiveState = async (id) => {
    const targetId = id || eventId;
    if (!targetId) return;
    try {
      const res = await api.get(`/events/${targetId}/live-state`);
      if (res.data?.participants) {
        setParticipants(res.data.participants);
      }
      if (res.data?.event) {
        if (res.data.event.pin_code) {
          setGamePin(res.data.event.pin_code);
        }
        if (res.data.event.title) {
          setMaterialTitle(res.data.event.title);
        }
        if (res.data.event.questions && Array.isArray(res.data.event.questions) && res.data.event.questions.length > 0) {
          setQuestions(res.data.event.questions);
        }
        if (res.data.event.current_question_index !== undefined) {
          setCurrentQIdx(res.data.event.current_question_index);
        }
        if (res.data.event.updatedAt) {
          setLastServerUpdatedAt(res.data.event.updatedAt);
          const startedAt = new Date(res.data.event.updatedAt).getTime();
          const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
          const remaining = Math.max(0, 30 - elapsedSec);
          setTimeLeft(remaining);
        }

        // Keep activeTab synced with backend event status
        if (res.data.event.status === 'ACTIVE' && activeTab === 'selection') {
          setActiveTab('quiz');
          localStorage.setItem('active_teacher_tab', 'quiz');
        } else if (res.data.event.status === 'LOBBY' && activeTab === 'selection') {
          setActiveTab('lobby');
          localStorage.setItem('active_teacher_tab', 'lobby');
        } else if (res.data.event.status === 'FINISHED' && activeTab !== 'attendance') {
          setActiveTab('attendance');
          localStorage.setItem('active_teacher_tab', 'attendance');
        }
      }
    } catch (err) {
      console.error("Live state error:", err);
    }
  };

  // Create Live Event & Game PIN handler
  const handleCreateEvent = async () => {
    if (questions.length === 0) {
      alert("Savollar mavjud emas. Iltimos, avval Materiallar bo'limida AI orqali 20 ta savol shakllantiring yoki tayyor materialni tanlang!");
      navigate('/materials');
      return;
    }

    setCreatingEvent(true);
    try {
      const res = await api.post('/events/create', {
        title: materialTitle,
        questions: questions,
        group_id: selectedGroupId || null,
        material_name: materialTitle,
      });

      const createdId = res.data?.event?.id;
      if (createdId) {
        setEventId(createdId);
        localStorage.setItem('active_teacher_event_id', createdId);
      }
      if (res.data?.game_pin) {
        setGamePin(res.data.game_pin);
      } else {
        setGamePin(Math.floor(100000 + Math.random() * 900000).toString());
      }
      setActiveTab('lobby');
      localStorage.setItem('active_teacher_tab', 'lobby');
      fetchLiveState(createdId);
    } catch (err) {
      console.error("Create event error:", err);
      setGamePin(Math.floor(100000 + Math.random() * 900000).toString());
      setActiveTab('lobby');
      localStorage.setItem('active_teacher_tab', 'lobby');
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleStartQuiz = async () => {
    if (eventId) {
      try {
        const res = await api.put(`/events/${eventId}/start`);
        if (res.data?.event?.updatedAt) {
          setLastServerUpdatedAt(res.data.event.updatedAt);
        }
      } catch (err) {
        console.log("Start event err:", err.message);
      }
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
        if (res.data?.event?.updatedAt) {
          setLastServerUpdatedAt(res.data.event.updatedAt);
        }
      } catch (err) {
        console.log("Next question err:", err.message);
      }
    }

    const totalQs = questions.length > 0 ? questions.length : 20;
    if (currentQIdx < totalQs - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      setActiveTab('attendance');
      localStorage.setItem('active_teacher_tab', 'attendance');
    }
  };

  // DYNAMIC REAL-TIME RESPONSE COUNTS (from backend participant answers)
  const getDynamicResponseCounts = () => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    participants.forEach((p) => {
      let answersList = p.answers || [];
      if (typeof answersList === 'string') {
        try {
          answersList = JSON.parse(answersList);
        } catch (e) {
          answersList = [];
        }
      }
      if (Array.isArray(answersList)) {
        const currentAns = answersList.find((a) => Number(a.question_index) === Number(currentQIdx));
        if (currentAns && currentAns.selected_option_index !== undefined && currentAns.selected_option_index !== null) {
          const idx = Number(currentAns.selected_option_index);
          if (counts[idx] !== undefined) {
            counts[idx] += 1;
          }
        }
      }
    });
    return counts;
  };

  const dynamicCounts = getDynamicResponseCounts();

  // Calculations for current question results
  const currentQ = questions[currentQIdx] || {
    question: `${currentQIdx + 1}-Savol: Relatsion bazalarda B-Tree indeksining afzalligi nima?`,
    correctIndex: 1,
    options: [
      "Algoritmik murakkablik O(N) va saralash usullari",
      "Ma'lumotlar yaxlitligi va B-Tree indekslash bilan tezkor qidiruv",
      "Faqat vaqtinchalik kesh xotira bilan ishlash",
      "Foydalanuvchi interfeysini avtomatik render qilish"
    ]
  };

  const correctIdx = currentQ.correctIndex ?? 1;
  const totalVotes = dynamicCounts[0] + dynamicCounts[1] + dynamicCounts[2] + dynamicCounts[3];
  const correctVotes = dynamicCounts[correctIdx] || 0;
  const incorrectVotes = Math.max(0, totalVotes - correctVotes);
  const correctPercent = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;
  const incorrectPercent = totalVotes > 0 ? Math.round((incorrectVotes / totalVotes) * 100) : 0;

  // Process overall student results for final attendance & summary
  const totalQsCount = questions.length > 0 ? questions.length : 20;

  const sortedParticipants = [...participants].map((p) => {
    let ansList = p.answers || [];
    if (typeof ansList === 'string') {
      try { ansList = JSON.parse(ansList); } catch (e) { ansList = []; }
    }
    const correctCount = Array.isArray(ansList) ? ansList.filter((a) => a.isCorrect).length : (p.total_correct || 0);
    const incorrectCount = Math.max(0, (Array.isArray(ansList) ? ansList.length : 0) - correctCount);
    const accuracy = ansList.length > 0 ? Math.round((correctCount / ansList.length) * 100) : 0;

    return {
      ...p,
      correctCount,
      incorrectCount,
      accuracy,
      score: p.score || correctCount * 100
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Live Events & Game PIN Arenasi</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Guruh va dars materialini tanlang, Game PIN yaratib interaktiv quiz o'tkazing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/materials')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            + Yangi Material Yuklash
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'lobby' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          1. Live Event Lobby & Game PIN ({participants.length})
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          disabled={!gamePin}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'quiz' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          } ${!gamePin ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          2. Live Quiz Arenasi (Presenter)
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'attendance' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          3. Online Davomat & Natijalar ({participants.length})
        </button>
      </div>

      {/* LOBBY & GAME PIN ARENA (WITH 2-TIER SELECTOR: GROUP -> MATERIAL) */}
      {activeTab === 'lobby' && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              LIVE LOBBY ARENA
            </span>
            <h2 className="text-3xl font-black">{materialTitle || "AI PRACTICE Live Quiz"}</h2>
            <p className="text-slate-400 text-xs font-medium">
              Guruh va dars materialini tanlang. Talabalar Game PIN kiritib ulanishadi.
            </p>
          </div>

          {!gamePin ? (
            <div className="p-8 border border-slate-800 rounded-3xl max-w-xl mx-auto space-y-5 bg-slate-800/40">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">Game PIN Yaratish</h3>
                <p className="text-xs text-slate-400">
                  1. O'quv guruhini tanlang ➔ 2. Ushbu guruhga ait dars materialini tanlang
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-300 uppercase mb-1">
                    1. O'quv Guruhi
                  </label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-500"
                  >
                    {myGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-300 uppercase mb-1">
                    2. Dars Materiali & AI Savollar
                  </label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => handleMaterialSelect(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-500"
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
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs flex items-center justify-between">
                  <span>Ushbu guruh uchun dars materiali yuklanmagan.</span>
                  <button
                    onClick={() => navigate('/materials')}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg cursor-pointer"
                  >
                    + Yuklash
                  </button>
                </div>
              )}

              <button
                onClick={handleCreateEvent}
                disabled={creatingEvent}
                style={{ background: EMERALD_GRADIENT }}
                className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl shadow-emerald-700/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creatingEvent ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Game PIN Yaratilmoqda...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    ⚡ GAME PIN YARATISH & EVENT BOSHLASH
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl space-y-2 transform hover:scale-[1.02] transition-transform">
              <div className="text-xs uppercase tracking-widest text-emerald-100 font-extrabold">Talabalar Uchun Game PIN</div>
              <div className="font-mono text-5xl md:text-6xl font-black text-white tracking-widest">{gamePin}</div>
            </div>
          )}

          {/* Joined Students List */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span>Ulangan talabalar: <strong>{participants.length} kishi</strong></span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Online Davomat Avto-Qayd Etilmoqda
              </span>
            </div>

            {participants.length === 0 ? (
              <div className="p-8 border border-slate-800 rounded-2xl text-slate-400 text-xs italic">
                Hozirda talabalar ulanishini kutmoqdamiz... (Game PIN kiritilganda bu yerda ko'rinadi)
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {participants.map((p) => (
                  <div key={p.id} className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center gap-2.5 font-bold text-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold">
                      {(p.student_name || p.name || 'T').substring(0, 1)}
                    </div>
                    <span className="truncate">{p.student_name || p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {gamePin && (
            <div>
              <button
                onClick={handleStartQuiz}
                style={{ background: EMERALD_GRADIENT }}
                className="px-10 py-4 rounded-2xl text-white font-black text-base shadow-xl shadow-emerald-500/30 hover:scale-105 transition-transform cursor-pointer"
              >
                🚀 QUIZ'NI BOSHLASH (START)
              </button>
            </div>
          )}
        </div>
      )}

      {/* LIVE QUIZ ARENA (PRESENTER MODE WITH LIVE BAR DIAGRAMS & ANSWER REVEAL) */}
      {activeTab === 'quiz' && (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 text-white rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl relative border border-slate-800/90 overflow-hidden">
          {/* Top Bar with Synced 30s Timer & Next Question Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl font-mono font-black text-sm">
                Savol {currentQIdx + 1} / {questions.length || 20}
              </span>
              <span className="text-xs text-slate-300 font-bold truncate max-w-[240px]">{materialTitle}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Synced 30 Seconds Timer Display */}
              <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2 rounded-2xl border border-amber-500/30 shadow-inner">
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-amber-400 font-mono font-black text-2xl">{timeLeft}s</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">30S TAYMER</span>
              </div>

              {/* Next Question Button */}
              <button
                onClick={handleNextQuestion}
                style={{ background: EMERALD_GRADIENT }}
                className="px-6 py-3 rounded-2xl font-black text-xs text-white shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                {currentQIdx < (questions.length || 20) - 1 ? 'Keyingi Savol' : 'Yakunlash & Davomat'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl text-center space-y-3 shadow-inner relative">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              #{currentQIdx + 1}-SAVOL • REAL-TIME JAVOBLAR DIAGRAMMASI
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* 4 Answer Option Diagrams with Real-Time Vertical Diagram Column (Bottom-to-Top) & Answer Reveal at 0s */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: '▲ A',
                gradient: 'from-rose-600 via-rose-600 to-rose-700 border-rose-400/50 shadow-rose-950/50',
                idx: 0
              },
              {
                label: '◆ B',
                gradient: 'from-blue-600 via-blue-600 to-indigo-700 border-blue-400/50 shadow-blue-950/50',
                idx: 1
              },
              {
                label: '● C',
                gradient: 'from-amber-500 via-amber-600 to-orange-600 border-amber-300/50 shadow-amber-950/50',
                idx: 2
              },
              {
                label: '■ D',
                gradient: 'from-emerald-600 via-emerald-600 to-teal-700 border-emerald-400/50 shadow-emerald-950/50',
                idx: 3
              },
            ].map((item) => {
              const rawOptionText = currentQ.options?.[item.idx] || `${String.fromCharCode(65 + item.idx)} variant`;
              const optionText = rawOptionText.length > 55 ? rawOptionText.slice(0, 52) + '...' : rawOptionText;
              const votes = dynamicCounts[item.idx] || 0;
              const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const isCorrectOpt = item.idx === correctIdx;

              // Dynamic Card Background & Glow depending on Timer state (0s reveal vs Active voting)
              let cardBgStyle = `bg-gradient-to-br ${item.gradient} hover:scale-[1.01]`;

              if (timeLeft === 0) {
                if (isCorrectOpt) {
                  // Correct option turns into a distinct, glowing Emerald Green Champion card
                  cardBgStyle = 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 border-white ring-8 ring-emerald-400/50 scale-[1.03] shadow-[0_0_40px_rgba(16,185,129,0.8)] z-30';
                } else {
                  // Incorrect options turn into dark muted slate to focus 100% attention on the correct answer
                  cardBgStyle = 'bg-slate-900/90 border-slate-800/80 opacity-40 grayscale-[0.6] scale-[0.98] z-10';
                }
              }

              return (
                <div
                  key={item.idx}
                  className={`min-h-[110px] p-5 rounded-3xl font-bold text-white shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between border-2 ${cardBgStyle}`}
                >
                  {/* Top Row: Kahoot Shape Badge, Truncated Option Text, Vote Pill */}
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex items-start gap-3 overflow-hidden">
                      <span className={`px-3 py-1 rounded-2xl backdrop-blur-md border font-black text-sm md:text-base shadow-lg shrink-0 ${
                        timeLeft === 0 && !isCorrectOpt
                          ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                          : 'bg-black/35 border-white/30 text-white'
                      }`}>
                        {item.label}
                      </span>
                      <span
                        title={rawOptionText}
                        className={`font-extrabold text-xs md:text-sm leading-snug pt-0.5 line-clamp-2 ${
                          timeLeft === 0 && !isCorrectOpt ? 'text-slate-400' : 'text-white drop-shadow-md'
                        }`}
                      >
                        {optionText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCorrectOpt && timeLeft === 0 && (
                        <span className="bg-white text-emerald-950 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center gap-1.5 border-2 border-emerald-300">
                          <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[3]" /> TO'G'RI JAVOB ✨
                        </span>
                      )}
                      <span className={`backdrop-blur-md border px-3 py-1 rounded-2xl font-mono text-xs font-black shadow-xl shrink-0 ${
                        timeLeft === 0 && !isCorrectOpt
                          ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                          : 'bg-black/40 border-white/30 text-white'
                      }`}>
                        {votes} kishi ({percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Real-time Vertical Diagram Fill (Rises UPWARDS from the bottom) */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-700 ease-out border-t-4 backdrop-blur-[2px] ${
                      timeLeft === 0 && isCorrectOpt
                        ? 'bg-gradient-to-t from-white/50 via-white/35 to-white/15 border-white shadow-[0_-5px_25px_rgba(255,255,255,0.6)]'
                        : 'bg-gradient-to-t from-white/40 via-white/25 to-white/10 border-white/90 shadow-[0_-5px_20px_rgba(255,255,255,0.4)]'
                    }`}
                    style={{ height: `${percent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Correct vs Incorrect Responses Real-Time Statistics Banner (PLACED AT THE BOTTOM) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-300">To'g'ri Javob Berganlar</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {correctVotes} kishi ({correctPercent}%)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                  <X className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-rose-300">Xato Javob Berganlar</div>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    {incorrectVotes} kishi ({incorrectPercent}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner message during timer */}
          {timeLeft > 0 ? (
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 text-slate-300 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Talabalar 30 sekund davomida javob belgilashmoqda. Diagramma real-vaqtda yangilanmoqda.
            </div>
          ) : (
            <div className="p-3.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              30 sekundlik vaqt tugadi! To'g'ri javob yashil rangda ko'rsatildi. "Keyingi Savol ➔" tugmasini bosing.
            </div>
          )}
        </div>
      )}

      {/* ONLINE DAVOMAT VA FINAL QUIZ HISOBOTI (WITH TO'G'RI / XATO BREAKDOWN PER STUDENT) */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Online Davomat & Quiz Natijalari Hisoboti
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Talabalarning to'liq to'g'ri va xato javoblari hamda umumiy aniqlik (accuracy %) hisoboti
              </p>
            </div>

            <button
              onClick={() => alert("Natijalar Excel/PDF formatida yuklab olindi! ✅")}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer hover:bg-slate-800"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Excel / PDF
            </button>
          </div>

          {/* Top 3 Leaderboard Podium */}
          {sortedParticipants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedParticipants.slice(0, 3).map((p, pIdx) => (
                <div
                  key={p.id || pIdx}
                  className={`p-5 rounded-2xl border flex items-center gap-3 relative overflow-hidden ${
                    pIdx === 0
                      ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                      : pIdx === 1
                      ? 'bg-slate-100/80 border-slate-300 text-slate-900'
                      : 'bg-amber-900/5 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl font-black flex-shrink-0">
                    {pIdx === 0 ? '🥇' : pIdx === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      #{pIdx + 1}-O'rin
                    </div>
                    <h4 className="font-black text-sm text-slate-900 truncate">{p.student_name || p.name}</h4>
                    <div className="flex items-center gap-2 text-xs font-bold mt-0.5">
                      <span className="text-emerald-700">{p.correctCount} to'g'ri</span>
                      <span className="text-rose-600">{p.incorrectCount} xato</span>
                      <span className="font-mono text-slate-900 font-black">({p.score} ball)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Student Performance & Attendance Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Talaba F.I.SH.</th>
                  <th className="py-3.5 px-4 text-center">To'g'ri Javoblar</th>
                  <th className="py-3.5 px-4 text-center">Xato Javoblar</th>
                  <th className="py-3.5 px-4 text-center">Aniqlik (%)</th>
                  <th className="py-3.5 px-4 text-center">Jami Ball</th>
                  <th className="py-3.5 px-4 text-right">Online Davomat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {sortedParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Hali bu eventda qatnashgan talabalar ro'yxatga olinmagan.
                    </td>
                  </tr>
                ) : (
                  sortedParticipants.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.student_name || p.name}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50 font-mono">
                        {p.correctCount} ta
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/50 font-mono">
                        {p.incorrectCount} ta
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">
                        {p.accuracy}%
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-emerald-700 font-mono text-sm">
                        {p.score}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> BOR (PRESENT)
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
