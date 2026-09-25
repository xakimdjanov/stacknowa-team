import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  FileCheck2,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Users,
  Sparkles,
  Paperclip,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

/* ─── Status Badge ───────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    published: { label: 'Faol',     icon: CheckCircle2, bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.2)',  color: '#059669' },
    draft:     { label: 'Qoralama', icon: AlertCircle,  bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#d97706' },
    closed:    { label: 'Yopilgan', icon: XCircle,      bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  color: '#ef4444' },
  };
  const cfg = map[status] || map.draft;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

/* ─── Deadline chip ──────────────────────── */
const DeadlineChip = ({ deadline }) => {
  if (!deadline) return <span className="text-slate-400 text-xs">—</span>;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d - now;
  const isOverdue = diff < 0;
  const isSoon = diff > 0 && diff < 24 * 60 * 60 * 1000;

  const color = isOverdue ? '#ef4444' : isSoon ? '#d97706' : '#64748b';
  const bg = isOverdue ? 'rgba(239,68,68,0.06)' : isSoon ? 'rgba(245,158,11,0.06)' : 'rgba(100,116,139,0.06)';

  return (
    <div>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
        style={{ background: bg, border: `1px solid ${color}22`, color }}
      >
        <Clock className="w-3 h-3" />
        {d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
      <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
        {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

/* ─── Mini Stat ──────────────────────────── */
const MiniStat = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex items-center gap-3 shadow-xs">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Input / Label styles ───────────────── */
const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all bg-slate-50 font-medium';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [saving, setSaving]           = useState(false);

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm]         = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', deadline: '', max_score: 100, status: 'published',
  });

  useEffect(() => { fetchAssignments(); }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments/all');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error('Topshiriqlarni yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (a) => {
    setEditingAssignment(a);
    setFormData({
      title: a.title,
      description: a.description || '',
      deadline: a.deadline ? new Date(a.deadline).toISOString().slice(0, 16) : '',
      max_score: a.max_score,
      status: a.status,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/assignments/${editingAssignment.id}`, formData);
      setEditingAssignment(null);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Tahrirlashda xatolik!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/assignments/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "O'chirishda xatolik!");
    }
  };

  const filtered = assignments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.title?.toLowerCase().includes(q) ||
      a.group?.name?.toLowerCase().includes(q) ||
      a.group?.teacher?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const totalSubmissions = assignments.reduce((s, a) => s + (a.submissions?.length || 0), 0);
  const publishedCount   = assignments.filter((a) => a.status === 'published').length;

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Barcha Topshiriqlar
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Barcha guruhlar bo'yicha e'lon qilingan topshiriqlar monitoringi va nazorati.
            </p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <MiniStat label="Jami topshiriqlar" value={assignments.length} color="#059669" icon={FileCheck2} />
            <MiniStat label="Faol (Published)"  value={publishedCount}     color="#0d9488" icon={CheckCircle2} />
            <MiniStat label="Jami topshirilgan" value={totalSubmissions}   color="#0284c7" icon={Users} />
            <MiniStat label="Yopilgan"          value={assignments.filter((a) => a.status === 'closed').length} color="#ef4444" icon={XCircle} />
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 space-y-5">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Topshiriq yoki guruh nomi bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            {[
              { value: '',          label: 'Hammasi',  color: '#059669' },
              { value: 'published', label: 'Faol',     color: '#059669' },
              { value: 'draft',     label: 'Qoralama', color: '#d97706' },
              { value: 'closed',    label: 'Yopilgan', color: '#ef4444' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                style={
                  statusFilter === opt.value
                    ? { background: 'white', color: opt.color, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                    : { color: '#64748b' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">
            {filtered.length} ta natija
          </span>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {['Topshiriq', 'Guruh & O\'qituvchi', 'Deadline', 'Max Ball', 'Topshirganlar', 'Holat', 'Amallar'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${i === 6 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${45 + j * 7}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <FileCheck2 className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-semibold">Topshiriqlar topilmadi</p>
                        <p className="text-xs">Qidiruvni o'zgartiring yoki filtrni bekor qiling</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="group hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Topshiriq */}
                      <td className="px-5 py-4 max-w-[240px]">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-emerald-50 border border-emerald-100/60"
                          >
                            <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate leading-tight">{a.title}</p>
                            {a.template_file_url && (
                              <a
                                href={a.template_file_url.startsWith('http') ? a.template_file_url : `${(import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, ''))}${a.template_file_url.startsWith('/') ? '' : '/'}${a.template_file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded-md transition-colors bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              >
                                <Paperclip className="w-3 h-3" />
                                Shablon
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Guruh */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-700 text-xs">{a.group?.name || "Noma'lum guruh"}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{a.group?.teacher?.name || a.group?.teacher?.email || '—'}</p>
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-4">
                        <DeadlineChip deadline={a.deadline} />
                      </td>

                      {/* Max Ball */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {a.max_score} ball
                        </span>
                      </td>

                      {/* Topshirganlar */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {a.submissions?.length || 0} nafar
                        </span>
                      </td>

                      {/* Holat */}
                      <td className="px-5 py-4">
                        <StatusBadge status={a.status} />
                      </td>

                      {/* Amallar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(a)}
                            title="Tahrirlash"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(a)}
                            title="O'chirish"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Jami <span className="font-bold text-slate-700">{filtered.length}</span> ta topshiriq
              </span>
              <span className="text-xs text-slate-500">
                Faol: <span className="font-bold text-emerald-600">{publishedCount}</span> | Yopilgan:{' '}
                <span className="font-bold text-slate-600">
                  {assignments.filter((a) => a.status === 'closed').length}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ EDIT MODAL ══ */}
      <Modal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        title="Topshiriqni Tahrirlash"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={labelCls}>Sarlavha</label>
            <input
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Tavsif</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Muddati (Deadline)</label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Maksimal Ball</label>
              <input
                type="number" required min="1" max="1000"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Holati</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={inputCls}
            >
              <option value="published">Faol (Published)</option>
              <option value="draft">Qoralama (Draft)</option>
              <option value="closed">Yopilgan (Closed)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingAssignment(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-md shadow-emerald-700/20 hover:opacity-95 active:scale-95"
              style={{
                background: EMERALD_GRADIENT,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saqlanmoqda...' : 'Yangilash'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ DELETE CONFIRM MODAL ══ */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Trash2 className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Topshiriqni o'chirish</h3>
            <p className="text-sm text-slate-500 mt-2">
              <span className="font-semibold text-slate-800">{deleteConfirm?.title}</span> topshirig'i
              va unga tegishli barcha talabalar yuborgan fayllar o'chiriladi.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
            >
              Ha, o'chirilsin
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assignments;
