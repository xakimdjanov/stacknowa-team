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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Evaluations = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.status}
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
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Natija & Mezonlar
                      </button>
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
        title="Amaliy Ish va AI Baholash Tafsilotlari"
        maxWidth="max-w-2xl"
      >
        {selectedSub && (
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

            <button
              onClick={() => setSelectedSub(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Yopish
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Evaluations;
