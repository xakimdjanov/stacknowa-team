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
  RotateCcw,
  Target,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ─── */
const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

const getFileNameFromUrl = (url) => {
  if (!url) return 'Shablon fayl';
  try { return decodeURIComponent(url.split('/').pop()); }
  catch { return 'Shablon fayl'; }
};

/* ─── Status Badge ─── */
const StatusBadge = ({ mySub }) => {
  if (!mySub) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Topshirilmagan
    </span>
  );
  if (mySub.status === 'returned') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 animate-pulse">
      <RotateCcw className="w-3 h-3" />
      Qayta topshiring
    </span>
  );
  if (mySub.status === 'graded') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" />
      Baholandi
    </span>
  );
  if (mySub.status === 'evaluating' || mySub.status === 'submitted') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
      <Sparkles className="w-3 h-3 animate-spin" />
      AI Tekshiruvda
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 uppercase">
      {mySub.status}
    </span>
  );
};

/* ─── Card border/accent by status ─── */
const cardStyle = (mySub, isOverdue) => {
  if (mySub?.status === 'returned')   return { border: 'border-amber-200',   accent: 'bg-amber-400',   ring: 'ring-2 ring-amber-100' };
  if (mySub?.status === 'graded')     return { border: 'border-emerald-200', accent: 'bg-emerald-500', ring: '' };
  if (mySub?.status === 'evaluating' || mySub?.status === 'submitted')
                                      return { border: 'border-indigo-200',  accent: 'bg-indigo-500',  ring: '' };
  if (isOverdue)                      return { border: 'border-rose-200',    accent: 'bg-rose-400',    ring: '' };
  return { border: 'border-slate-100', accent: 'bg-gradient-to-r from-indigo-400 to-violet-500', ring: '' };
};

/* ═══════════════════ MAIN ═══════════════════ */
const Assignments = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | graded | returned

  useEffect(() => { fetchInitial(); }, []);
  useEffect(() => { if (selectedGroupId) fetchAssignments(selectedGroupId); }, [selectedGroupId]);

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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAssignments = async (groupId) => {
    try {
      const res = await api.get(`/assignments/group/${groupId}`);
      setAssignments(res.data.assignments || []);
    } catch (err) { console.error(err); }
  };

  const filtered = assignments.filter(a => {
    const mySub = a.submissions?.find(s => s.student_id === user?.id);
    if (filter === 'pending')  return !mySub || mySub.status === 'returned';
    if (filter === 'graded')   return mySub?.status === 'graded';
    if (filter === 'returned') return mySub?.status === 'returned';
    return true;
  });

  const counts = {
    all:      assignments.length,
    pending:  assignments.filter(a => { const s = a.submissions?.find(x => x.student_id === user?.id); return !s || s.status === 'returned'; }).length,
    graded:   assignments.filter(a => a.submissions?.find(x => x.student_id === user?.id)?.status === 'graded').length,
    returned: assignments.filter(a => a.submissions?.find(x => x.student_id === user?.id)?.status === 'returned').length,
  };

  const selectedGroup = groups.find(g => String(g.id) === String(selectedGroupId));

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 pt-6 pb-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Amaliy Topshiriqlar</h1>
          <p className="text-sm text-slate-500 mt-1">
            O'qituvchilar e'lon qilgan topshiriqlar, shablon materiallar va muddatlar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4">

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-center gap-3">

          {/* Group selector */}
          {groups.length > 0 && (
            <div className="relative w-full sm:w-auto flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.subject})</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-full sm:flex-initial overflow-x-auto">
            {[
              { key: 'all',      label: 'Barchasi',   count: counts.all },
              { key: 'pending',  label: 'Kutilmoqda', count: counts.pending },
              { key: 'graded',   label: 'Baholandi',  count: counts.graded },
              { key: 'returned', label: 'Qaytarildi', count: counts.returned },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab.key
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-400 ml-auto flex-shrink-0">
            {filtered.length} ta topshiriq
          </span>
        </div>

        {/* ── Assignments Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="h-3 bg-slate-100 rounded-full w-1/3 mb-4" />
                <div className="h-5 bg-slate-100 rounded-lg w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded-full w-full mb-1" />
                <div className="h-3 bg-slate-100 rounded-full w-2/3 mb-6" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-9 h-9 text-slate-300" />
            </div>
            <p className="text-base font-black text-slate-700 mb-1">
              {filter === 'all' ? 'Hali topshiriqlar yo\'q' : 'Bu filtrda topshiriqlar topilmadi'}
            </p>
            <p className="text-sm text-slate-400">
              {filter === 'all' ? "O'qituvchi yangi amaliy mashg'ulot qo'shganda shu yerda ko'rinadi." : 'Boshqa filtrni sinab ko\'ring.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(a => {
              const isOverdue = new Date(a.deadline) < new Date();
              const mySub = a.submissions?.find(s => s.student_id === user?.id);
              const isReturned  = mySub?.status === 'returned';
              const isGraded    = mySub?.status === 'graded';
              const isEvaluating = mySub?.status === 'evaluating' || mySub?.status === 'submitted';
              const { border, accent, ring } = cardStyle(mySub, isOverdue);

              return (
                <div key={a.id}
                  className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col ${border} ${ring}`}>

                  {/* Top accent line */}
                  <div className={`h-1 w-full ${accent}`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header badges */}
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge mySub={mySub} />
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                        <Target className="w-3 h-3" />
                        {a.max_score} ball
                      </span>
                    </div>

                    {/* Title & description */}
                    <h3 className="text-base font-black text-slate-900 mb-1.5 leading-snug">{a.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                      {a.description || 'Topshiriq tavsifi berilmagan.'}
                    </p>

                    {/* Template file */}
                    {a.template_file_url && (
                      <a href={getFileUrl(a.template_file_url)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors mb-4 group">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="truncate flex-1">{getFileNameFromUrl(a.template_file_url)}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                      </a>
                    )}

                    {/* Deadline */}
                    <div className={`flex items-center justify-between text-xs rounded-xl px-3 py-2 mb-4 ${isOverdue ? 'bg-rose-50 border border-rose-100' : 'bg-slate-50 border border-slate-100'}`}>
                      <span className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
                        <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                        {isOverdue ? "Muddati o'tgan" : 'Muddat:'}
                      </span>
                      <span className={`font-bold ${isOverdue ? 'text-rose-700' : 'text-slate-700'}`}>
                        {new Date(a.deadline).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })} · {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Action buttons */}
                    {isReturned ? (
                      <div className="flex gap-2">
                        <Link to={`/whitepaper/${a.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm shadow-amber-400/25 transition-all">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Qayta topshirish
                        </Link>
                        {mySub && (
                          <Link to={`/evaluation/${mySub.id}`}
                            className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors">
                            Izoh
                          </Link>
                        )}
                      </div>
                    ) : isGraded && mySub ? (
                      <div className="flex gap-2">
                        <Link to={`/evaluation/${mySub.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm shadow-emerald-400/20 transition-all">
                          <Award className="w-3.5 h-3.5" />
                          Natijani Ko'rish
                        </Link>
                        <Link to={`/whitepaper/${a.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : isEvaluating ? (
                      <div className="w-full inline-flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold py-2.5 px-4 rounded-xl text-xs">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        AI Tekshiryapti...
                      </div>
                    ) : (
                      <Link to={`/whitepaper/${a.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm shadow-indigo-400/20 transition-all">
                        <FileText className="w-3.5 h-3.5" />
                        Raqamli Daftarni Ochish
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
