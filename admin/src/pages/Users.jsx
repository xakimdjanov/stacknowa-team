import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Sparkles,
  SlidersHorizontal,
  Eye,
  EyeOff,
} from 'lucide-react';

/* ─── Role badge ─────────────────────────── */
const RoleBadge = ({ role }) => {
  const map = {
    ADMIN: {
      label: 'Admin',
      icon: ShieldCheck,
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.25)',
      color: '#ef4444',
    },
    TEACHER: {
      label: "O'qituvchi",
      icon: GraduationCap,
      bg: 'rgba(99,102,241,0.1)',
      border: 'rgba(99,102,241,0.25)',
      color: '#6366f1',
    },
    STUDENT: {
      label: 'Talaba',
      icon: BookOpen,
      bg: 'rgba(5,150,105,0.1)',
      border: 'rgba(5,150,105,0.25)',
      color: '#059669',
    },
  };
  const cfg = map[role] || map.STUDENT;
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

/* ─── Plan badge ─────────────────────────── */
const PlanBadge = ({ plan }) => {
  const isPro = plan === 'PRO';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={
        isPro
          ? { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#d97706' }
          : { background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }
      }
    >
      {isPro && <Sparkles className="w-3 h-3" />}
      {plan}
    </span>
  );
};

/* ─── Avatar ─────────────────────────────── */
const Avatar = ({ name, role }) => {
  const colors = {
    ADMIN: { bg: 'linear-gradient(135deg,#ef4444,#f97316)', shadow: 'rgba(239,68,68,0.3)' },
    TEACHER: { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', shadow: 'rgba(99,102,241,0.3)' },
    STUDENT: { bg: 'linear-gradient(135deg,#059669,#0d9488)', shadow: 'rgba(5,150,105,0.3)' },
  };
  const c = colors[role] || colors.STUDENT;
  const initials = name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: c.bg, boxShadow: `0 2px 8px ${c.shadow}` }}
    >
      {initials}
    </div>
  );
};

/* ─── Stat mini card ─────────────────────── */
const MiniStat = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-3 shadow-sm">
    <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
    <div>
      <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Input styles ───────────────────────── */
const inputCls =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-slate-50 placeholder-slate-400';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Users = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [showModal, setShowModal]               = useState(false);
  const [editingUser, setEditingUser]           = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [saving, setSaving]                     = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT', plan_type: 'FREE', is_active: true,
  });

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/users', { params });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'STUDENT', plan_type: 'FREE', is_active: true });
    setShowModalPassword(false);
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, password: '', role: u.role, plan_type: u.plan_type, is_active: u.is_active });
    setShowModalPassword(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmUser) return;
    try {
      await api.delete(`/users/${deleteConfirmUser.id}`);
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "O'chirishda xatolik");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'ADMIN').length,
    teacher: users.filter((u) => u.role === 'TEACHER').length,
    student: users.filter((u) => u.role === 'STUDENT').length,
  };

  /* ── Render ── */
  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                Foydalanuvchilar Boshqaruvi
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Platformadagi barcha o'qituvchilar, talabalar va administratorlar.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all w-full sm:w-auto self-start sm:self-auto"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <UserPlus className="w-4 h-4" />
              Yangi Foydalanuvchi
            </button>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <MiniStat label="Jami hisob" value={counts.all} color="linear-gradient(#6366f1,#8b5cf6)" />
            <MiniStat label="Adminlar" value={counts.admin} color="linear-gradient(#ef4444,#f97316)" />
            <MiniStat label="O'qituvchilar" value={counts.teacher} color="linear-gradient(#6366f1,#818cf8)" />
            <MiniStat label="Talabalar" value={counts.student} color="linear-gradient(#059669,#0d9488)" />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 space-y-5">

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism yoki email bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Role filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            {[
              { value: '', label: 'Hammasi' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'TEACHER', label: "O'qituvchi" },
              { value: 'STUDENT', label: 'Talaba' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRoleFilter(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={
                  roleFilter === opt.value
                    ? { background: 'white', color: '#6366f1', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                    : { color: '#94a3b8' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Count badge */}
          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">
            {filteredUsers.length} ta natija
          </span>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,#f8faff,#f1f5ff)' }}>
                  {['Foydalanuvchi', 'Rol', 'Tarif', 'Holat', "Ro'yxatdan o'tgan", 'Amallar'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div
                            className="h-4 bg-slate-100 rounded-lg animate-pulse"
                            style={{ width: `${50 + j * 8}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <UsersIcon className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-semibold">Foydalanuvchilar topilmadi</p>
                        <p className="text-xs">Qidiruvni o'zgartiring yoki yangi foydalanuvchi qo'shing</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="group transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} role={u.role} />
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{u.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4">
                        <PlanBadge plan={u.plan_type} />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {u.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Faol
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Bloklangan
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString('uz-UZ', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(u)}
                            title="Tahrirlash"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 transition-all"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                              e.currentTarget.style.color = '#6366f1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#94a3b8';
                            }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            title="O'chirish"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 transition-all"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#94a3b8';
                            }}
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

          {/* Table footer */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Jami <span className="font-semibold text-slate-600">{filteredUsers.length}</span> ta foydalanuvchi
              </span>
              <span className="text-xs text-slate-400">
                PRO:{' '}
                <span className="font-semibold text-amber-600">
                  {filteredUsers.filter((u) => u.plan_type === 'PRO').length}
                </span>{' '}
                | FREE:{' '}
                <span className="font-semibold text-slate-600">
                  {filteredUsers.filter((u) => u.plan_type === 'FREE').length}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ CREATE / EDIT MODAL ══ */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Foydalanuvchini Tahrirlash' : "Yangi Foydalanuvchi Qo'shish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>To'liq Ismi (F.I.SH)</label>
            <input
              type="text" required placeholder="Ali Valiyev"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email Manzil</label>
            <input
              type="email" required placeholder="ali@university.uz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>
              Parol{' '}
              {editingUser && (
                <span className="text-slate-400 font-normal">(bo'sh qoldirsangiz o'zgarmaydi)</span>
              )}
            </label>
            <div className="relative">
              <input
                type={showModalPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputCls + ' pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowModalPassword(!showModalPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                tabIndex={-1}
              >
                {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Roli</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={inputCls}
              >
                <option value="STUDENT">Talaba</option>
                <option value="TEACHER">O'qituvchi</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tarif</label>
              <select
                value={formData.plan_type}
                onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                className={inputCls}
              >
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <div
              className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ background: formData.is_active ? '#6366f1' : '#e2e8f0' }}
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            >
              <div
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                style={{ transform: formData.is_active ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">Hisob faol (Aktiv)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {saving ? 'Saqlanmoqda...' : editingUser ? 'Yangilash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ DELETE CONFIRM MODAL ══ */}
      <Modal
        isOpen={Boolean(deleteConfirmUser)}
        onClose={() => setDeleteConfirmUser(null)}
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
            <h3 className="text-lg font-bold text-slate-900">O'chirishni tasdiqlaysizmi?</h3>
            <p className="text-sm text-slate-500 mt-2">
              <span className="font-semibold text-slate-800">{deleteConfirmUser?.name}</span>{' '}
              ({deleteConfirmUser?.email}) hisobi tizimdan butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmUser(null)}
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

export default Users;
