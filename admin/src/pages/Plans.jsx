import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  CreditCard,
  Plus,
  Check,
  Edit2,
  Sparkles,
  Zap,
  Crown,
  Users,
  Layers,
  Star,
  Calendar,
  BadgeCheck,
  Building2,
  Trash2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

/* ─── Plan Icon by name ──────────────────── */
const getPlanStyle = (name = '') => {
  const n = name.toUpperCase();
  if (n.includes('FREE'))
    return {
      icon: Zap,
      gradient: 'linear-gradient(135deg,#64748b,#94a3b8)',
      badge: { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', color: '#64748b' },
      glow: 'rgba(100,116,139,0.15)',
      popular: false,
    };
  if (n.includes('ENTERPRISE'))
    return {
      icon: Crown,
      gradient: 'linear-gradient(135deg,#4f46e5,#059669)',
      badge: { bg: 'rgba(79,70,229,0.1)', border: 'rgba(79,70,229,0.3)', color: '#4f46e5' },
      glow: 'rgba(79,70,229,0.25)',
      popular: false,
    };
  if (n.includes('STANDART') || n.includes('STANDARD'))
    return {
      icon: Star,
      gradient: EMERALD_GRADIENT,
      badge: { bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.3)', color: '#059669' },
      glow: 'rgba(5,150,105,0.25)',
      popular: true,
    };
  if (n.includes('STARTER') || n.includes('BASIC'))
    return {
      icon: Building2,
      gradient: 'linear-gradient(135deg,#0d9488,#059669)',
      badge: { bg: 'rgba(13,148,136,0.1)', border: 'rgba(13,148,136,0.25)', color: '#0d9488' },
      glow: 'rgba(13,148,136,0.15)',
      popular: false,
    };
  if (n.includes('PRO') || n.includes('PREMIUM'))
    return {
      icon: Crown,
      gradient: EMERALD_GRADIENT,
      badge: { bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.3)', color: '#059669' },
      glow: 'rgba(5,150,105,0.25)',
      popular: true,
    };
  return {
    icon: Sparkles,
    gradient: 'linear-gradient(135deg,#d97706,#ea580c)',
    badge: { bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.25)', color: '#d97706' },
    glow: 'rgba(217,119,6,0.15)',
    popular: false,
  };
};

/* ─── Plan Card ──────────────────────────── */
const PlanCard = ({ p, onEdit, onDelete }) => {
  const s = getPlanStyle(p.name);
  const Icon = s.icon;
  const isFree = p.price_uzs === 0;
  const isProtected = p.is_default || ['STARTER', 'STANDART', 'ENTERPRISE', 'FREE'].includes(String(p.name || '').toUpperCase());

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden flex flex-col relative transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: s.popular ? 'rgba(5,150,105,0.35)' : '#e2e8f0',
        boxShadow: s.popular ? `0 0 0 2px rgba(5,150,105,0.15), 0 4px 24px ${s.glow}` : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Popular badge */}
      {s.popular && (
        <div
          className="absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white shadow-sm"
          style={{ background: EMERALD_GRADIENT }}
        >
          ⭐ Eng ommabop
        </div>
      )}

      {/* Top gradient bar */}
      <div className="h-1.5" style={{ background: s.gradient }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + Plan name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: s.gradient, boxShadow: `0 4px 12px ${s.glow}` }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={s.badge}
              >
                {p.name}
              </span>
              {isProtected && (
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1" title="Standart tizim tarifi">
                  <Lock className="w-2.5 h-2.5 text-slate-400" /> Standart
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-800 leading-tight mt-1">{p.title}</h3>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => onEdit(p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer border border-slate-200"
              title="Tarifni tahrirlash (Edit)"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {isProtected ? (
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-300 bg-slate-50 cursor-not-allowed border border-slate-100"
                title="Asosiy standart tarif (o'chirib bo'lmaydi, faqat tahrirlash mumkin)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </span>
            ) : (
              <button
                onClick={() => onDelete(p)}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer border border-slate-200"
                title="Tarifni o'chirish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">{p.description}</p>
        )}

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {isFree ? 'Bepul' : `${Number(p.price_uzs).toLocaleString()}`}
            </span>
            {!isFree && (
              <>
                <span className="text-sm font-semibold text-slate-400">so'm</span>
                <span className="text-xs text-slate-400 ml-1">/ {p.duration_days} kun</span>
              </>
            )}
          </div>
          {isFree && (
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Hech qanday to'lovsiz</p>
          )}
        </div>

        {/* Limits */}
        <div
          className="rounded-xl p-4 mb-5 space-y-2.5 bg-slate-50 border border-slate-100"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Guruhlar limiti:
            </span>
            <span className="font-bold text-slate-800">
              {p.max_groups >= 999 ? 'Cheksiz' : `${p.max_groups} ta`}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              AI Kreditlari:
            </span>
            <span className="font-bold text-slate-800">
              {p.ai_credits >= 9999 ? 'Cheksiz' : `${p.ai_credits} ta`}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Amal qilish:
            </span>
            <span className="font-bold text-slate-800">{p.duration_days} kun</span>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-2 mb-6 flex-1">
          {(Array.isArray(p.features) ? p.features : []).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Target role & ID footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {p.role_target === 'ALL' ? 'UNIVERSITET / BARCHASI (ALL)' : `${p.role_target} UCHUN`}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Skeleton ───────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse">
    <div className="h-1.5 bg-slate-100" />
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-100" />
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-28" />
        </div>
      </div>
      <div className="h-8 bg-slate-100 rounded w-32" />
      <div className="h-28 bg-slate-100 rounded-xl" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-3 bg-slate-100 rounded" />)}
      </div>
    </div>
  </div>
);

/* ─── Input / Label styles ───────────────── */
const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all bg-slate-50 font-medium';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Plans = () => {
  const [plans, setPlans]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const [formData, setFormData] = useState({
    name: '', title: '', description: '',
    price_uzs: 0, duration_days: 30, role_target: 'TEACHER',
    features: 'Cheksiz guruhlar, AI baholash, Plagiat tahlili',
    max_groups: 10, ai_credits: 100,
  });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error('Tariflarni yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '', title: '', description: '',
      price_uzs: 0, duration_days: 30, role_target: 'TEACHER',
      features: 'Cheksiz guruhlar, AI baholash, Plagiat tahlili',
      max_groups: 10, ai_credits: 100,
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingPlan(p);
    setFormData({
      name: p.name, title: p.title, description: p.description || '',
      price_uzs: p.price_uzs, duration_days: p.duration_days, role_target: p.role_target,
      features: Array.isArray(p.features) ? p.features.join(', ') : '',
      max_groups: p.max_groups, ai_credits: p.ai_credits,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        price_uzs:    Number(formData.price_uzs),
        duration_days: Number(formData.duration_days),
        max_groups:   Number(formData.max_groups),
        ai_credits:   Number(formData.ai_credits),
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      };
      if (editingPlan) {
        await api.put(`/plans/${editingPlan.id}`, payload);
      } else {
        await api.post('/plans', payload);
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Saqlashda xatolik!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/plans/${deleteTarget.id}`);
      setPlans(plans.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Tarifni o'chirishda xatolik yuz berdi!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Obuna Tariflari
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              O'qituvchi va talabalar uchun narxlar hamda imkoniyatlarni boshqarish.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-700/20 hover:opacity-95 active:scale-95 w-full sm:w-auto self-start sm:self-auto"
            style={{ background: EMERALD_GRADIENT }}
          >
            <Plus className="w-4 h-4" />
            Yangi Tarif
          </button>
        </div>

        {/* Stat chips */}
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-5">
          {[
            { label: 'Jami tariflar', value: plans.length, icon: CreditCard, color: '#059669' },
            { label: 'Universitet (ALL)', value: plans.filter((p) => p.role_target === 'ALL').length, icon: Building2, color: '#6366f1' },
            { label: 'Boshlang‘ich (Starter)', value: '12 mln', icon: Sparkles, color: '#0d9488' },
            { label: 'Enterprise (Yillik)', value: '36 mln', icon: Crown, color: '#d97706' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-200/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 shadow-xs flex-1 min-w-[130px]"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-800 leading-none">{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <CreditCard className="w-12 h-12 opacity-20" />
            <p className="text-sm font-semibold">Hali tariflar qo'shilmagan</p>
            <button
              onClick={openCreateModal}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Birinchi tarifni qo'shing →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((p) => (
              <PlanCard key={p.id} p={p} onEdit={openEditModal} onDelete={(plan) => setDeleteTarget(plan)} />
            ))}
          </div>
        )}
      </div>

      {/* ══ CREATE / EDIT MODAL ══ */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? 'Tarifni Tahrirlash' : "Yangi Tarif Qo'shish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tarif Kodi</label>
              <input
                type="text" required placeholder="PRO_TEACHER"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Ko'rsatiladigan Nomi</label>
              <input
                type="text" required placeholder="Pro Teacher"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Ta'rif</label>
            <input
              type="text" placeholder="Tarif haqida qisqacha..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Narxi (UZS)</label>
              <input
                type="number" required min="0"
                value={formData.price_uzs}
                onChange={(e) => setFormData({ ...formData, price_uzs: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Davomiyligi (kun)</label>
              <input
                type="number" required min="1"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Max Guruhlar</label>
              <input
                type="number" required min="1"
                value={formData.max_groups}
                onChange={(e) => setFormData({ ...formData, max_groups: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>AI Kreditlari</label>
              <input
                type="number" required min="0"
                value={formData.ai_credits}
                onChange={(e) => setFormData({ ...formData, ai_credits: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Mo'ljallangan Rol</label>
              <select
                value={formData.role_target}
                onChange={(e) => setFormData({ ...formData, role_target: e.target.value })}
                className={inputCls}
              >
                <option value="ALL">Barchasi / Universitet (ALL)</option>
                <option value="TEACHER">O'qituvchi (TEACHER)</option>
                <option value="STUDENT">Talaba (STUDENT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Xususiyatlar (vergul bilan ajrating)</label>
            <textarea
              rows={3}
              placeholder="Cheksiz guruhlar, AI baholash, Plagiat tahlili"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className={inputCls}
            />
          </div>

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
              className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all duration-200 shadow-md shadow-emerald-700/20 hover:opacity-95 active:scale-95"
              style={{
                background: EMERALD_GRADIENT,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saqlanmoqda...' : editingPlan ? 'Yangilash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ DELETE CONFIRMATION MODAL ══ */}
      {deleteTarget && (
        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Tarifni O'chirish"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <div>
                <p className="font-bold">Tarifni o'chirmoqchimisiz?</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  <strong>{deleteTarget.title}</strong> ({deleteTarget.name}) tarifi platformadan butunlay o'chiriladi.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Tarif narxi:</strong> {Number(deleteTarget.price_uzs).toLocaleString()} UZS</div>
              <div><strong>Amal qilish muddati:</strong> {deleteTarget.duration_days} kun</div>
              <div><strong>Rol:</strong> {deleteTarget.role_target}</div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeletePlan}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? "O'chirilmoqda..." : "Ha, O'chirish"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Plans;
