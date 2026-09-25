import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  TrendingUp,
  Banknote,
  SlidersHorizontal,
  Hash,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Status Badge ───────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    success: { label: 'Muvaffaqiyatli', icon: CheckCircle2, bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)', color: '#059669' },
    pending: { label: 'Kutilmoqda',     icon: Clock,        bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#d97706' },
    failed:  { label: 'Rad etilgan',    icon: XCircle,      bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  color: '#ef4444' },
  };
  const cfg = map[status] || map.pending;
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

/* ─── Payment Method Badge ───────────────── */
const MethodBadge = ({ method }) => {
  const m = (method || 'karta').toLowerCase();
  const isCard = m.includes('card') || m.includes('karta');
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={
        isCard
          ? { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1' }
          : { background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }
      }
    >
      <CreditCard className="w-2.5 h-2.5" />
      {method || 'karta'}
    </span>
  );
};

/* ─── Stat Card ──────────────────────────── */
const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-3 shadow-sm">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xl font-extrabold text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{sub}</p>}
    </div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans/transactions');
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("To'lovlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    const matchSearch =
      tx.user?.name?.toLowerCase().includes(q) ||
      tx.user?.email?.toLowerCase().includes(q) ||
      tx.order_id?.toLowerCase().includes(q) ||
      tx.plan?.title?.toLowerCase().includes(q);
    const matchStatus = statusFilter ? tx.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  /* Stats */
  const totalRevenue  = transactions.filter((tx) => tx.status === 'success').reduce((s, tx) => s + (tx.amount || 0), 0);
  const successCount  = transactions.filter((tx) => tx.status === 'success').length;
  const pendingCount  = transactions.filter((tx) => tx.status === 'pending').length;
  const failedCount   = transactions.filter((tx) => tx.status === 'failed').length;

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                To'lovlar Tarixi
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Foydalanuvchilarning Pro obuna uchun amalga oshirgan barcha tranzaksiyalari.
              </p>
            </div>

            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all w-full sm:w-auto self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
              Yangilash
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <StatCard
              label="Jami daromad"
              value={`${totalRevenue.toLocaleString()} so'm`}
              color="#6366f1"
              icon={Banknote}
              sub={`${successCount} ta to'lov`}
            />
            <StatCard
              label="Muvaffaqiyatli"
              value={successCount}
              color="#059669"
              icon={CheckCircle2}
            />
            <StatCard
              label="Kutilmoqda"
              value={pendingCount}
              color="#d97706"
              icon={Clock}
            />
            <StatCard
              label="Rad etilgan"
              value={failedCount}
              color="#ef4444"
              icon={XCircle}
            />
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
              placeholder="Ism, email, order ID yoki tarif bo'yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            {[
              { value: '',         label: 'Hammasi',       color: '#6366f1' },
              { value: 'success',  label: "Muvaffaqiyatli", color: '#059669' },
              { value: 'pending',  label: 'Kutilmoqda',     color: '#d97706' },
              { value: 'failed',   label: 'Rad etilgan',    color: '#ef4444' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={
                  statusFilter === opt.value
                    ? { background: 'white', color: opt.color, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                    : { color: '#94a3b8' }
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg,#f8faff,#f1f5ff)' }}>
                  {['Order ID', 'Foydalanuvchi', 'Tarif', 'Summa', "To'lov usuli", 'Holat', 'Sana'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100"
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
                        <CreditCard className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-semibold">To'lovlar topilmadi</p>
                        <p className="text-xs">Hozircha hech qanday tranzaksiya amalga oshirilmagan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="group transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                          <Hash className="w-3 h-3" />
                          {tx.order_id || `TXN-${tx.id}`}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                          >
                            {tx.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs leading-tight">
                              {tx.user?.name || "Noma'lum"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{tx.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-slate-700">
                          {tx.plan?.title || tx.plan?.name || 'Pro Tarif'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span
                          className="text-sm font-extrabold"
                          style={{ color: tx.status === 'success' ? '#059669' : '#64748b' }}
                        >
                          {tx.amount ? `${Number(tx.amount).toLocaleString()} so'm` : '—'}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-5 py-4">
                        <MethodBadge method={tx.payment_method} />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={tx.status} />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString('uz-UZ', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })
                          : '—'}
                        <p className="text-[10px] mt-0.5">
                          {tx.created_at
                            ? new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Jami <span className="font-semibold text-slate-600">{filtered.length}</span> ta tranzaksiya
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {totalRevenue.toLocaleString()} so'm daromad
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
