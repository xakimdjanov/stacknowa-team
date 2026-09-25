import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  Layers,
  QrCode,
  Users,
  Copy,
  Check,
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  Hash,
  FileCheck2,
  SlidersHorizontal,
  Link2,
} from 'lucide-react';

/* ─── Status Badge ───────────────────────── */
const StatusBadge = ({ status }) => {
  const active = status === 'active' || status === 'ACTIVE';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={
        active
          ? { background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', color: '#059669' }
          : { background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: active ? '#059669' : '#94a3b8' }}
      />
      {active ? 'Faol' : status}
    </span>
  );
};

/* ─── Group Card ─────────────────────────── */
const GroupCard = ({ g, onQr }) => {
  const colors = [
    { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.18)', accent: '#6366f1', light: '#eef2ff' },
    { bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.18)',  accent: '#059669', light: '#ecfdf5' },
    { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.18)',  accent: '#d97706', light: '#fffbeb' },
    { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.18)', accent: '#8b5cf6', light: '#f5f3ff' },
    { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)',  accent: '#ef4444', light: '#fef2f2' },
  ];
  const c = colors[g.id % colors.length];

  const teacherInitials = g.teacher?.name
    ? g.teacher.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden flex flex-col shadow-sm group transition-all duration-200 hover:shadow-md"
      style={{ borderColor: '#e2e8f0' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.accent + '44')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)` }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Layers className="w-5 h-5" style={{ color: c.accent }} />
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: c.light, color: c.accent }}
            >
              {g.course}-kurs
            </span>
            <StatusBadge status={g.status} />
          </div>
        </div>

        {/* Name & Subject */}
        <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-0.5">{g.name}</h3>
        <p className="text-xs font-semibold mb-4" style={{ color: c.accent }}>{g.subject}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Users,      label: 'Talaba',      value: g.members?.length || 0 },
            { icon: FileCheck2, label: 'Topshiriq',   value: g.assignments?.length || 0 },
            { icon: Calendar,   label: 'Yil',         value: g.academic_year || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl p-2 text-center"
              style={{ background: '#f8fafc' }}
            >
              <Icon className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
              <p className="text-sm font-extrabold text-slate-800 leading-none">{value}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Teacher row */}
        <div className="flex items-center gap-2.5 py-3 border-t border-slate-100 mt-auto">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent}cc)` }}
          >
            {teacherInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{g.teacher?.name || "O'qituvchi yo'q"}</p>
            <p className="text-[10px] text-slate-400 truncate">{g.teacher?.email || ''}</p>
          </div>
          <GraduationCap className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
        </div>

        {/* Token + QR button */}
        <div className="flex items-center gap-2 mt-3">
          <div
            className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl min-w-0"
            style={{ background: '#f1f5f9' }}
          >
            <Hash className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <code className="text-[11px] font-mono text-indigo-600 font-semibold truncate">
              {g.join_token || '—'}
            </code>
          </div>
          <button
            onClick={() => onQr(g.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
            style={{ background: c.bg, color: c.accent, border: `1px solid ${c.border}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.light)}
            onMouseLeave={(e) => (e.currentTarget.style.background = c.bg)}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR & Havola
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Skeleton Card ──────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="h-1 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-20 h-5 rounded-md bg-slate-100" />
      </div>
      <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="h-10 bg-slate-100 rounded-xl" />
      <div className="h-8 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

/* ─── Mini Stat ──────────────────────────── */
const MiniStat = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-3 shadow-sm">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Groups = () => {
  const [groups, setGroups]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [copied, setCopied]           = useState(false);

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showQrModal = async (id) => {
    try {
      const res = await api.get(`/groups/${id}`);
      setSelectedGroup(res.data);
      setCopied(false);
    } catch (err) {
      alert("Guruh ma'lumotlarini yuklashda xatolik");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = groups.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch =
      g.name?.toLowerCase().includes(q) ||
      g.subject?.toLowerCase().includes(q) ||
      g.teacher?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter
      ? (g.status || '').toLowerCase() === statusFilter
      : true;
    return matchSearch && matchStatus;
  });

  const totalMembers     = groups.reduce((s, g) => s + (g.members?.length || 0), 0);
  const totalAssignments = groups.reduce((s, g) => s + (g.assignments?.length || 0), 0);
  const activeCount      = groups.filter((g) => g.status === 'active' || g.status === 'ACTIVE').length;

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Guruhlar & QR Kodlar
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              O'qituvchilar tomonidan yaratilgan barcha akademik guruhlar, talabalar va topshiriqlar.
            </p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <MiniStat label="Jami guruhlar"  value={groups.length}    color="#6366f1" icon={Layers}      />
            <MiniStat label="Faol guruhlar"  value={activeCount}      color="#059669" icon={Layers}      />
            <MiniStat label="Jami talabalar" value={totalMembers}     color="#8b5cf6" icon={Users}       />
            <MiniStat label="Topshiriqlar"   value={totalAssignments} color="#d97706" icon={FileCheck2}  />
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 space-y-5">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Guruh nomi, fan yoki o'qituvchi bo'yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            {[
              { value: '',       label: 'Hammasi' },
              { value: 'active', label: 'Faol'    },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  statusFilter === opt.value
                    ? { background: 'white', color: '#6366f1', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                    : { color: '#94a3b8' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">
            {filtered.length} ta guruh
          </span>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Layers className="w-12 h-12 opacity-20" />
            <p className="text-sm font-semibold">Guruhlar topilmadi</p>
            <p className="text-xs">Qidiruvni o'zgartiring yoki filtrni bekor qiling</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((g) => (
              <GroupCard key={g.id} g={g} onQr={showQrModal} />
            ))}
          </div>
        )}
      </div>

      {/* ══ QR Modal ══ */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.group?.name || "QR Kod & Havola"}
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 text-center">
            Talabalar ushbu QR-kodni skanerlab mustaqil ravishda guruhga qo'shiladi
          </p>

          {/* QR Code */}
          {selectedGroup?.qr_code ? (
            <div
              className="p-5 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <img src={selectedGroup.qr_code} alt="QR Code" className="w-48 h-48" />
            </div>
          ) : (
            <div
              className="h-48 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{ background: '#f8fafc', border: '1px dashed #e2e8f0' }}
            >
              <QrCode className="w-10 h-10 text-slate-300" />
              <p className="text-xs text-slate-400">QR kod mavjud emas</p>
            </div>
          )}

          {/* Join URL */}
          {selectedGroup?.join_url && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Kirish havolasi
              </p>
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <span className="text-[11px] font-mono text-slate-600 truncate flex-1">
                  {selectedGroup.join_url}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedGroup.join_url)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: copied ? 'rgba(5,150,105,0.1)' : 'white',
                    border: '1px solid #e2e8f0',
                    color: copied ? '#059669' : '#64748b',
                  }}
                  title="Nusxalash"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 ml-1">
                  ✓ Nusxalandi!
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setSelectedGroup(null)}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            Yopish
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
