import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { 
  BookOpen, 
  Clock, 
  Paperclip, 
  ExternalLink, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

const getFileNameFromUrl = (url) => {
  if (!url) return 'Shablon fayl';
  try {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    return decodeURIComponent(fullName);
  } catch {
    return 'Shablon fayl';
  }
};

const Assignments = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchAssignments(selectedGroupId);
    }
  }, [selectedGroupId]);

  const fetchInitial = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/student');
      const grps = res.data.groups || [];
      setGroups(grps);

      if (grps.length > 0) {
        const targetId = initialGroupId || String(grps[0].id);
        setSelectedGroupId(targetId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (groupId) => {
    try {
      const res = await api.get(`/assignments/group/${groupId}`);
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Amaliy Mashg'ulot Topshiriqlari</h1>
        <p className="text-sm text-slate-500 mt-1">
          O'qituvchilar tomonidan e'lon qilingan topshiriqlar, shablon materiallar va muddatlar.
        </p>
      </div>

      {/* Group selector filter */}
      {groups.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guruhni tanlang:</span>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-indigo-600 font-semibold text-slate-800"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.subject})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assignments list */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Topshiriqlar yuklanmoqda...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-semibold text-slate-700">Ushbu guruhda hali topshiriqlar yo'q</p>
          <p className="text-xs text-slate-400">O'qituvchi yangi amaliy mashg'ulot qo'shganda shu yerda ko'rinadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => {
            const isDeadlinePassed = new Date(a.deadline) < new Date();
            const mySub = a.submissions?.find((s) => s.student_id === user?.id);
            const isReturned = mySub?.status === 'returned';
            const isGraded = mySub?.status === 'graded';
            const isEvaluating = mySub?.status === 'evaluating' || mySub?.status === 'submitted';

            return (
              <div
                key={a.id}
                className={`bg-white rounded-3xl border ${isReturned ? 'border-amber-300 ring-2 ring-amber-200/50 shadow-md' : 'border-slate-200/80 shadow-sm'} p-6 hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {isReturned ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 animate-pulse">
                        <RotateCcw className="w-3 h-3 text-amber-700" />
                        <span>Qayta topshirish talab etiladi</span>
                      </span>
                    ) : isGraded ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Baholangan</span>
                      </span>
                    ) : isEvaluating ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-indigo-600 animate-spin" />
                        <span>AI Tekshiruvda</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {a.status}
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                      Maksimal: {a.max_score} ball
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{a.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                    {a.description || "Topshiriq tavsifi berilmagan"}
                  </p>

                  {/* Shablon Fayl bo'lsa (AWS S3) */}
                  {a.template_file_url && (
                    <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-900 flex items-center space-x-1.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="truncate" title={getFileNameFromUrl(a.template_file_url)}>
                            {getFileNameFromUrl(a.template_file_url)}
                          </span>
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex-shrink-0">
                          {a.template_file_url.includes('amazonaws.com') ? 'AWS S3' : 'Shablon'}
                        </span>
                      </div>
                      <a
                        href={getFileUrl(a.template_file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Shablon faylni ko'rish / yuklab olish</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Deadline (Muddati):</span>
                      </span>
                      <span className={`font-semibold ${isDeadlinePassed ? "text-rose-600" : "text-slate-800"}`}>
                        {new Date(a.deadline).toLocaleDateString()} {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 text-indigo-600 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Tekshiruv:</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Faollashtirilgan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isReturned ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/whitepaper/${a.id}`}
                        className="flex-1 inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-amber-600/20 text-xs transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Qayta Ishlash va Topshirish</span>
                      </Link>
                      {mySub && (
                        <Link
                          to={`/evaluations/${mySub.id}`}
                          className="inline-flex items-center justify-center px-3 py-3 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold"
                          title="Izoh va bahoni ko'rish"
                        >
                          Izohni Ko'rish
                        </Link>
                      )}
                    </div>
                  ) : isGraded && mySub ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/evaluations/${mySub.id}`}
                        className="flex-1 inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-3 rounded-2xl shadow-md shadow-emerald-600/20 text-xs transition-all"
                      >
                        <Award className="w-4 h-4" />
                        <span>Baholash Natijasi</span>
                      </Link>
                      <Link
                        to={`/whitepaper/${a.id}`}
                        className="inline-flex items-center justify-center px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all"
                        title="Daftarni ko'rish"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/whitepaper/${a.id}`}
                      className="w-full inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-indigo-600/20 text-xs transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Raqamli Daftarni Ochish</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;
