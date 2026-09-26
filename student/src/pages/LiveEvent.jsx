import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Zap,
  Users,
  CheckCircle2,
  Clock,
  Radio,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
  Loader2,
  Check,
  Trophy,
  X
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function LiveEvent() {
  const { user } = useAuth();
  const [gamePin, setGamePin] = useState('');
  const [studentName, setStudentName] = useState(user?.name || '');

  const [joining, setJoining] = useState(false);
  const [joinedEvent, setJoinedEvent] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Quiz State (Server-Synced 30s Timer)
  const [quizState, setQuizState] = useState('pin'); // 'pin' | 'lobby' | 'active' | 'finished'
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [lastServerUpdatedAt, setLastServerUpdatedAt] = useState(null);

  useEffect(() => {
    if (user?.name && !studentName) {
      setStudentName(user.name);
    }
    
    // RESTORE ACTIVE STUDENT EVENT ON PAGE REFRESH (F5)
    const savedEventStr = localStorage.getItem('active_student_event');
    const savedState = localStorage.getItem('active_student_quiz_state');
    const savedName = localStorage.getItem('active_student_name');
    const savedParticipantStr = localStorage.getItem('active_student_participant');

    if (savedName) setStudentName(savedName);

    if (savedEventStr) {
      try {
        const parsedEvent = JSON.parse(savedEventStr);
        if (parsedEvent && parsedEvent.id) {
          setJoinedEvent(parsedEvent);
          if (savedState) setQuizState(savedState);
          if (savedParticipantStr) {
            setParticipant(JSON.parse(savedParticipantStr));
          }
        }
      } catch (e) {
        console.error("Error restoring student event state:", e);
      }
    }
  }, [user]);

  // Polling for live status when in lobby or active (Synchronized with Server)
  useEffect(() => {
    let interval;
    if (joinedEvent && (quizState === 'lobby' || quizState === 'active')) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/events/${joinedEvent.id}/live-state`);
          if (res.data?.event) {
            if (res.data.event.status === 'ACTIVE' && quizState === 'lobby') {
              setQuizState('active');
              localStorage.setItem('active_student_quiz_state', 'active');
            }
            if (res.data.event.status === 'FINISHED') {
              setQuizState('finished');
              localStorage.setItem('active_student_quiz_state', 'finished');
            }
            if (res.data.event.questions) {
              setQuestions(res.data.event.questions);
            }
            // Sync server timestamp & question index across all devices
            if (res.data.event.current_question_index !== undefined && res.data.event.current_question_index !== currentQIdx) {
              setCurrentQIdx(res.data.event.current_question_index);
              setSelectedOption(null);
              setLastSubmissionResult(null);
            }
            if (res.data.event.updatedAt) {
              setLastServerUpdatedAt(res.data.event.updatedAt);
              const startedAt = new Date(res.data.event.updatedAt).getTime();
              const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
              const remaining = Math.max(0, 30 - elapsedSec);
              setTimeLeft(remaining);
            }
          }
        } catch (err) {
          console.error("Live state poll error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [joinedEvent, quizState, currentQIdx]);

  // 1-second interval timer synced with server timestamp
  useEffect(() => {
    let timer;
    if (quizState === 'active') {
      timer = setInterval(() => {
        if (lastServerUpdatedAt) {
          const startedAt = new Date(lastServerUpdatedAt).getTime();
          const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
          setTimeLeft(Math.max(0, 30 - elapsedSec));
        } else {
          setTimeLeft((prev) => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, lastServerUpdatedAt]);

  // Join Event by PIN
  const handleJoinEvent = async (e) => {
    e.preventDefault();
    if (!gamePin.trim()) {
      setErrorMsg("Iltimos, 6-xonali Game PIN kiriting!");
      return;
    }

    setJoining(true);
    setErrorMsg('');
    try {
      const res = await api.post('/events/join', {
        game_pin: gamePin.trim(),
        student_name: studentName.trim() || user?.name || "Talaba"
      });

      setJoinedEvent(res.data.event);
      setParticipant(res.data.participant);
      
      const targetState = res.data.event?.status === 'ACTIVE' ? 'active' : 'lobby';
      setQuizState(targetState);

      localStorage.setItem('active_student_event', JSON.stringify(res.data.event));
      localStorage.setItem('active_student_participant', JSON.stringify(res.data.participant || {}));
      localStorage.setItem('active_student_quiz_state', targetState);
      localStorage.setItem('active_student_name', studentName.trim() || user?.name || "Talaba");
    } catch (err) {
      console.error("Join event error:", err);
      setErrorMsg(err.response?.data?.error || err.message || "Game PIN xato kiritildi!");
    } finally {
      setJoining(false);
    }
  };

  // Submit Answer to Backend (Real-Time Dynamic Count)
  const handleAnswerSelect = async (optIdx) => {
    if (selectedOption !== null || submitting) return;
    setSelectedOption(optIdx);
    setSubmitting(true);

    try {
      if (joinedEvent?.id && participant?.id) {
        const res = await api.post('/events/submit-answer', {
          event_id: joinedEvent.id,
          participant_id: participant.id,
          question_index: currentQIdx,
          selected_option_index: optIdx
        });
        setLastSubmissionResult(res.data);
        if (res.data?.isCorrect) {
          setScore((prev) => prev + 100);
          setTotalCorrect((prev) => prev + 1);
        }
      } else {
        const currentQ = questions[currentQIdx];
        const isCorrect = currentQ && Number(currentQ.correctIndex) === Number(optIdx);
        setLastSubmissionResult({ isCorrect, correctIndex: currentQ?.correctIndex });
        if (isCorrect) {
          setScore((prev) => prev + 100);
          setTotalCorrect((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Submit answer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalQsCount = questions.length > 0 ? questions.length : 20;
  const totalIncorrect = Math.max(0, currentQIdx + 1 - totalCorrect);
  const accuracyPercent = (currentQIdx + 1) > 0 ? Math.round((totalCorrect / (currentQIdx + 1)) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Live Event & Game PIN Arena</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            O'qituvchi taqdim etgan Game PIN kodini kiriting va online dars musobaqasiga ulaning
          </p>
        </div>

        {quizState !== 'pin' && (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            ONLINE DAVOMAT: BOR (PRESENT)
          </span>
        )}
      </div>

      {/* STEP 1: GAME PIN ENTRY */}
      {quizState === 'pin' && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 max-w-xl mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
            <KeyRound className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Game PIN Kiriting</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              O'qituvchi ekranida ko'rsatilgan 6 xonali unikal Game PIN kodini kiriting
            </p>
          </div>

          <form onSubmit={handleJoinEvent} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 text-center uppercase tracking-wider">
                GAME PIN KODI
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={gamePin}
                onChange={(e) => setGamePin(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center font-mono text-3xl md:text-4xl font-black tracking-widest px-4 py-4 bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 text-emerald-400 rounded-2xl outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Talaba Ismi-Familiyasi</label>
              <input
                type="text"
                required
                placeholder="F.I.SH."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white text-xs font-bold rounded-xl outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={joining || !gamePin}
              style={{ background: EMERALD_GRADIENT }}
              className="w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg shadow-emerald-700/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {joining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ulanmoqda...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  ⚡ LIVE EVENTGA QO'SHILISH
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: LOBBY WAITING SCREEN */}
      {quizState === 'lobby' && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xl border border-slate-800">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Online Davomatda Belgilandingiz (PRESENT)
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">{joinedEvent?.title || "AI PRACTICE Live Quiz"}</h2>
            <p className="text-xs text-slate-400 font-medium">
              Material: <span className="text-emerald-400 font-bold">{joinedEvent?.material_name || "Dars Hujjati"}</span>
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <h3 className="font-bold text-sm text-slate-200">O'qituvchi testni boshlashini kutmoqdasiz...</h3>
            <p className="text-xs text-slate-400">
              Ustoz "START" tugmasini bosishi bilanoq ekraningizda 30 sekundlik savollar ko'rinadi.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: ACTIVE QUIZ ARENA (SERVER SYNCED 30s TIMER) */}
      {quizState === 'active' && (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 text-white rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl border border-slate-800/90 relative overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black font-mono">
                Savol {currentQIdx + 1} / {questions.length > 0 ? questions.length : 20}
              </span>
              <span className="text-xs text-slate-300 font-bold truncate max-w-[200px]">
                {joinedEvent?.title || "AI Live Quiz"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-black text-xl bg-slate-800/80 px-3.5 py-1 rounded-xl border border-amber-500/30">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                {timeLeft}s
              </div>
              <div className="text-xs font-black text-emerald-400 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                Ball: {score}
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              #{currentQIdx + 1}-SAVOL • 30 SEKUND VAQT
            </span>
            <h2 className="text-lg md:text-xl font-black text-white leading-relaxed">
              {questions[currentQIdx]?.question || `${currentQIdx + 1}-Savol: Relatsion bazada B-Tree indeksi nima uchun qo'llaniladi?`}
            </h2>
          </div>

          {/* 4 Answer Choice Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: '▲ A', gradient: 'from-rose-600 via-rose-600 to-rose-700 border-rose-400/50 shadow-rose-950/40', idx: 0 },
              { label: '◆ B', gradient: 'from-blue-600 via-blue-600 to-indigo-700 border-blue-400/50 shadow-blue-950/40', idx: 1 },
              { label: '● C', gradient: 'from-amber-500 via-amber-600 to-orange-600 border-amber-300/50 shadow-amber-950/40', idx: 2 },
              { label: '■ D', gradient: 'from-emerald-600 via-emerald-600 to-teal-700 border-emerald-400/50 shadow-emerald-950/40', idx: 3 },
            ].map((item) => {
              const rawOptionText = questions[currentQIdx]?.options?.[item.idx] || `${String.fromCharCode(65 + item.idx)} variant`;
              const optionText = rawOptionText.length > 55 ? rawOptionText.slice(0, 52) + '...' : rawOptionText;
              const isSelected = selectedOption === item.idx;

              // Retain vibrant signature color gradient on all cards; add glowing white halo ring to selected option
              let btnStyle = `bg-gradient-to-br ${item.gradient} hover:scale-[1.01]`;
              if (isSelected) {
                btnStyle = `bg-gradient-to-br ${item.gradient} ring-4 ring-white border-white scale-[1.03] shadow-[0_0_35px_rgba(255,255,255,0.45)] z-20 brightness-110`;
              } else if (selectedOption !== null || timeLeft === 0) {
                btnStyle = `bg-gradient-to-br ${item.gradient} opacity-65 scale-[0.99] grayscale-[0.2]`;
              }

              return (
                <button
                  key={item.idx}
                  onClick={() => handleAnswerSelect(item.idx)}
                  disabled={selectedOption !== null || timeLeft === 0}
                  className={`min-h-[90px] p-5 rounded-3xl font-extrabold text-white text-left transition-all duration-300 flex items-center justify-between shadow-2xl border-2 ${btnStyle} ${
                    selectedOption !== null || timeLeft === 0 ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <span className="flex items-center gap-3 overflow-hidden pr-2">
                    <span className="px-3.5 py-1.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/30 font-black text-sm text-white shadow-md shrink-0">
                      {item.label}
                    </span>
                    <span
                      title={rawOptionText}
                      className="font-extrabold text-xs md:text-sm leading-snug text-white drop-shadow-md line-clamp-2"
                    >
                      {optionText}
                    </span>
                  </span>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-2xl bg-white text-emerald-950 flex items-center justify-center font-black shrink-0 shadow-lg border-2 border-emerald-300">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Glassmorphic Real-Time Feedback Banner once Option is Selected */}
          {selectedOption !== null && (
            <div className="pt-2">
              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-2xl backdrop-blur-md ${
                timeLeft === 0 && lastSubmissionResult
                  ? lastSubmissionResult.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500/50 shadow-emerald-500/20 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500/50 shadow-rose-500/20 text-rose-200'
                  : 'bg-slate-900/90 border-slate-800 text-emerald-400'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    timeLeft === 0 && lastSubmissionResult
                      ? lastSubmissionResult.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {timeLeft === 0 && lastSubmissionResult ? (
                      lastSubmissionResult.isCorrect ? <CheckCircle2 className="w-6 h-6 stroke-[3]" /> : <XCircle className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">
                      {timeLeft === 0 && lastSubmissionResult
                        ? lastSubmissionResult.isCorrect
                          ? "🎉 TO'G'RI JAVOB! BALL QO'SHILDI (+100)"
                          : "❌ AFSUSKI, XATO JAVOB!"
                        : "Javobingiz qabul qilindi!"}
                    </div>
                    <div className="text-xs text-slate-300 font-medium pt-0.5">
                      {timeLeft === 0
                        ? "Vaqt tugadi. O'qituvchi keyingi savolga o'tgach davom etasiz."
                        : "Natijangiz real-vaqtda o'qituvchi ekranida aks etdi."}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black font-mono border ${
                    timeLeft === 0 && lastSubmissionResult
                      ? lastSubmissionResult.isCorrect
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                        : 'bg-rose-600 text-white border-rose-400 shadow-md'
                      : 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {timeLeft === 0 && lastSubmissionResult
                      ? lastSubmissionResult.isCorrect ? "+100 BALL" : "0 BALL"
                      : "QABUL QILINDI ✓"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Banner message when timer expires and no option was selected */}
          {selectedOption === null && timeLeft === 0 && (
            <div className="p-4 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xl">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>30 sekundlik vaqt tugadi! Siz javob belgilashga ulgurmadingiz.</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: QUIZ FINISHED & COMPLETE FINAL PERFORMANCE BREAKDOWN */}
      {quizState === 'finished' && (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-lg text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-800">Tabriklaymiz! Test Yakunlandi 🚀</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Natijangiz va online davomatingiz o'qituvchiga yuborildi</p>
          </div>

          {/* Full Performance Breakdown Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Jami Savollar</span>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">{totalQsCount} ta</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">To'g'ri Javoblar</span>
              <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">{totalCorrect} ta</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase block">Xato Javoblar</span>
              <div className="text-xl font-black text-rose-600 font-mono mt-0.5">{totalIncorrect} ta</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Jami Ball</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{score}</div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-extrabold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            Online Davomat: BOR (PRESENT) • Aniqlik: {accuracyPercent}%
          </div>

          <button
            onClick={() => {
              setQuizState('pin');
              setGamePin('');
              setSelectedOption(null);
              setLastSubmissionResult(null);
              setCurrentQIdx(0);
              setScore(0);
              setTotalCorrect(0);
            }}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Qaytadan Boshqa Eventga Ulanish
          </button>
        </div>
      )}
    </div>
  );
}
