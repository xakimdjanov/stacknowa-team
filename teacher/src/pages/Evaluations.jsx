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
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Submissions</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review AI-scored work</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm w-64 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center cursor-pointer">
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            T
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Submission review</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          AI scores first; teacher keeps final review and override control.
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Pending review</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">12</h2>
          <p className="text-xs font-bold text-orange-500">4 urgent</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">AI scored</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">{submissions.length}</h2>
          <p className="text-xs font-bold text-blue-600">91% of queue</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Needs override</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">4</h2>
          <p className="text-xs font-bold text-blue-600">Manual check</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Avg review time</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">2m 18s</h2>
          <p className="text-xs font-bold text-blue-600">↓ 24%</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Student</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Assignment</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Score</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">AI analysis</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-5 text-sm font-medium text-slate-500 text-center">No submissions yet</td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSelectedSub(sub)}>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">{sub.student?.name}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">Practical Work</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">{sub.evaluation?.total_score || 'N/A'}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {sub.evaluation?.similarity_score > 10 ? `${sub.evaluation.similarity_score}% similar` : 'Clean'}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{new Date(sub.created_at || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-6 py-2.5 rounded-full transition-colors">
          Open next review
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2 mb-8">
        <span className="text-slate-400">12 pending · {submissions.length} AI-scored · 4 require teacher override</span>
        <span className="text-blue-500">Synced just now</span>
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
