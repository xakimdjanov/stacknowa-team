import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  User, 
  Percent,
  Search,
  BookOpen,
  Lock,
  ArrowRight,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import BookViewer from '../components/BookViewer';

const Evaluations = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [modalTab, setModalTab] = useState('book'); // 'book' | 'rubric'
  const [showReturnBox, setShowReturnBox] = useState(false);
  const [returnComment, setReturnComment] = useState('');
  const [returning, setReturning] = useState(false);
  const { user } = useAuth();

  const isPro = user?.plan_type === 'PRO';

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const grpRes = await api.get('/groups/my');
      const groups = grpRes.data.groups || [];
      if (groups.length > 0 && groups[0].assignments?.length > 0) {
        const assignmentId = groups[0].assignments[0].id;
        const subRes = await api.get(`/submissions/assignment/${assignmentId}`);
        setSubmissions(subRes.data.submissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Topshiriqni qayta topshirishga yuborish
  const handleReturnSubmission = async (subId) => {
    try {
      setReturning(true);
      await api.put(`/submissions/${subId}/return`, {
        teacher_comment: returnComment.trim() || "Kamchiliklar aniqlandi. Iltimos, amaliy ishni qayta ko'rib chiqib, to'ldirib qayta jo'nating."
      });
      alert("Topshiriq talabaga qayta topshirish uchun muvaffaqiyatli yuborildi!");
      setShowReturnBox(false);
      setReturnComment('');
      setSelectedSub(prev => prev ? { ...prev, status: 'returned' } : null);
      fetchEvaluations();
    } catch (err) {
      alert(err.response?.data?.message || "Ishni qaytarishda xatolik yuz berdi");
    } finally {
      setReturning(false);
    }
  };

  // Talaba topshirgan sahifalarni ajratib olish
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
      {
        id: 1,
        title: "1-bet: Titul varaqasi",
        html: `
          <div style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 13pt; font-weight: bold; color: #2563eb; text-transform: uppercase;">AMALIY ISH HISOBOTI</p>
            <h1 style="font-size: 22pt; font-weight: 800; color: #0f172a; margin: 24px 0;">${sub.assignment?.title || 'Amaliy Mashg\'ulot'}</h1>
            <div style="margin-top: 80px; text-align: right; max-width: 380px; margin-left: auto; font-size: 12pt; line-height: 1.8;">
              <p><strong>Talaba:</strong> ${sub.student?.name || 'Talaba'}</p>
              <p><strong>Email:</strong> ${sub.student?.email || ''}</p>
              <p><strong>Ball:</strong> ${sub.evaluation?.total_score || 0} / 100</p>
            </div>
          </div>
        `
      },
      parsed.theme && { id: 2, title: "2-bet: Kirish va Mavzu", html: `<h2 style="color:#1d4ed8; font-size:16pt;">Mavzu va Maqsad</h2><p style="font-size:12pt; line-height:1.7;">${parsed.theme}</p>` },
      parsed.theory && { id: 3, title: "3-bet: Nazariy Qism", html: `<h2 style="color:#1d4ed8; font-size:16pt;">Nazariy Asoslar</h2><p style="font-size:12pt; line-height:1.7;">${parsed.theory}</p>` },
      parsed.practical && { id: 4, title: "4-bet: Amaliy Qism", html: `<h2 style="color:#1d4ed8; font-size:16pt;">Amaliy Qism va Natijalar</h2><div style="font-size:12pt; line-height:1.7;">${parsed.practical}</div>` },
      parsed.code && { id: 5, title: "5-bet: Dastur Kodi", html: `<h2 style="color:#1d4ed8; font-size:16pt;">Dastur Kodi</h2><pre style="background:#0f172a; color:#4ade80; padding:16px; border-radius:8px;"><code>${parsed.code}</code></pre>` },
      parsed.conclusion && { id: 6, title: "6-bet: Xulosa", html: `<h2 style="color:#1d4ed8; font-size:16pt;">Xulosa</h2><p style="font-size:12pt; line-height:1.7;">${parsed.conclusion}</p>` },
    ].filter(Boolean);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Baholash va Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">
            Talabalarning amaliy ishlari, AI ballari, rubrika tahlili va plagiat ko'rsatkichlari.
          </p>
        </div>

        {!isPro && (
          <Link
            to="/subscription"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md shadow-amber-500/20 text-xs self-start sm:self-auto transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pro tarifga o'tish (Plagiat & AI-yozuv tahlili)</span>
          </Link>
        )}
      </div>

      {/* Free Plan Notification */}
      {!isPro && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              Siz hozirda <strong>Free tarifidasiz</strong>. Talabalar ishlari rubrika bo'yicha baholanadi, biroq <strong>O'xshashlik (Similarity)</strong> va <strong>AI-yozuv tahlili</strong> faqat Pro obunada mavjud.
            </span>
          </div>
          <Link to="/subscription" className="text-xs font-bold text-amber-700 hover:underline flex items-center flex-shrink-0 ml-4">
            <span>Pro ga o'tish</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Talaba</th>
                <th className="px-6 py-4">Holati</th>
                <th className="px-6 py-4">AI Balli (Rubrika)</th>
                <th className="px-6 py-4">O'xshashlik (Similarity)</th>
                <th className="px-6 py-4">AI-Writing Tahlili</th>
                <th className="px-6 py-4 text-right">Batafsil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">
                    Hozircha baholangan amaliy ishlar mavjud emas
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1d58d8] font-bold flex items-center justify-center border border-blue-100">
                          {sub.student?.name?.[0] || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{sub.student?.name}</p>
                          <p className="text-xs text-slate-400">{sub.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        sub.status === 'returned'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : sub.status === 'graded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {sub.status === 'returned' ? "Qayta topshirishda" : sub.status === 'graded' ? "Baholandi" : sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-base">
                      {sub.evaluation ? (
                        <span className="text-[#1d58d8]">{sub.evaluation.total_score} / 100</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-normal">Kutilmoqda</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isPro ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {sub.evaluation?.similarity_score || 0}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-slate-400 text-xs">
                          <Lock className="w-3 h-3" />
                          <span>Pro tarifda</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isPro ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {Math.round((sub.evaluation?.ai_writing_probability || 0) * 100)}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-slate-400 text-xs">
                          <Lock className="w-3 h-3" />
                          <span>Pro tarifda</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSub(sub);
                            setModalTab('book');
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1d58d8] rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1 border border-blue-200/60 shadow-sm"
                          title="Talaba amaliy ishini kitob shaklida o'qish"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Kitobcha</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSub(sub);
                            setModalTab('rubric');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Natija & Mezonlar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVALUATION DETAIL MODAL */}
      <Modal
        isOpen={Boolean(selectedSub)}
        onClose={() => setSelectedSub(null)}
        title={selectedSub ? `${selectedSub.student?.name} — Amaliy Ish va Baholash` : "Tafsilotlar"}
        maxWidth="max-w-6xl"
      >
        {selectedSub && (
          <div className="space-y-6">
            {/* Modal Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setModalTab('book')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === 'book'
                      ? 'bg-[#1d58d8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📖 Kitob Shaklida Ko'rish ({getSubPages(selectedSub).length} bet)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('rubric')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === 'rubric'
                      ? 'bg-[#1d58d8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Baholash & Rubrika Mezonlari</span>
                </button>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Umumiy Ball:</span>
                <span className="text-2xl font-extrabold text-[#1d58d8]">
                  {selectedSub.evaluation?.total_score || 0}
                  <span className="text-xs font-normal text-slate-400"> / 100</span>
                </span>
              </div>
            </div>

            {/* TAB 1: KITOB SHAKLIDA */}
            {modalTab === 'book' && (
              <div className="space-y-2">
                <BookViewer
                  pages={getSubPages(selectedSub)}
                  documentTitle={selectedSub.assignment?.title || "Amaliy Ish"}
                  studentName={selectedSub.student?.name || "Talaba"}
                />
              </div>
            )}

            {/* TAB 2: AI BAHOLASH VA MEZONLAR */}
            {modalTab === 'rubric' && (
              <div className="space-y-6">
                {/* Student info */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Talaba</p>
                    <p className="text-base font-bold text-slate-900">{selectedSub.student?.name}</p>
                    <p className="text-xs text-slate-500">{selectedSub.student?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Umumiy Ball</p>
                    <p className="text-3xl font-extrabold text-[#1d58d8]">
                      {selectedSub.evaluation?.total_score || 0}
                      <span className="text-sm font-normal text-slate-400">/100</span>
                    </p>
                  </div>
                </div>

                {/* Criteria breakdown */}
                {selectedSub.evaluation?.criteria_results && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      AI Baholash Mezonlari (Rubrika)
                    </h4>
                    <div className="space-y-2">
                      {selectedSub.evaluation.criteria_results.map((c, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{c.name}</p>
                            <p className="text-slate-400 mt-0.5">{c.comment || "Bajarilgan"}</p>
                          </div>
                          <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {c.score} / {c.max}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Feedback */}
                {selectedSub.evaluation?.feedback && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      AI Tavsiyalari & Fikr-Mulohazalari (Feedback)
                    </h4>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1.5">
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

                {/* Plagiarism and AI Writing info (Pro check) */}
                {isPro && selectedSub.evaluation?.similarity_score !== null && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[11px] text-slate-400 font-bold uppercase">Guruhdagi O'xshashlik</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedSub.evaluation?.similarity_score}%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                      <p className="text-[11px] text-purple-700 font-bold uppercase">Neyrotarmoq Yozuvi (AI-Writing)</p>
                      <p className="text-lg font-bold text-purple-900 mt-0.5">
                        {Math.round((selectedSub.evaluation?.ai_writing_probability || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* O'qituvchi tomonidan qayta topshirishga yuborish bo'limi */}
            {selectedSub.status === 'returned' ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                <span className="flex items-center space-x-2 font-semibold">
                  <RotateCcw className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Ushbu topshiriq talabaga qayta topshirish uchun qaytarilgan</span>
                </span>
                <span className="text-[11px] text-amber-700 font-medium">Talaba tahrirlashi kutilmoqda</span>
              </div>
            ) : showReturnBox ? (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Talabaga qaytarish sababi va kamchiliklar:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReturnBox(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Talabaga eslatma (masalan: 7-betdagi hisob-kitoblarni formulalar bilan to'ldiring)..."
                  className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnBox(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReturnSubmission(selectedSub.id)}
                    disabled={returning}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    {returning ? "Yuborilmoqda..." : "Tasdiqlash va Qaytarish"}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex items-center space-x-3 pt-2">
              {selectedSub.status !== 'returned' && !showReturnBox && (
                <button
                  type="button"
                  onClick={() => setShowReturnBox(true)}
                  className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>↩ Qayta Topshirishga Qaytarish</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedSub(null);
                  setShowReturnBox(false);
                  setReturnComment('');
                }}
                className={`py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors ${
                  selectedSub.status !== 'returned' && !showReturnBox ? 'w-36' : 'w-full'
                }`}
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
