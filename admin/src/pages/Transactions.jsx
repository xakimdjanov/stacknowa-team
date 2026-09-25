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
          ? { background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', color: '#059669' }
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
  <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex items-center gap-3 shadow-xs">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{sub}</p>}
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
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                To'lovlar Tarixi
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Foydalanuvchilarning Pro obuna uchun amalga oshirgan barcha tranzaksiyalari.
              </p>
            </div>

            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all duration-200 w-full sm:w-auto self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              Yangilash
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <StatCard
              label="Jami daromad"
              value={`${totalRevenue.toLocaleString()} so'm`}
              color="#059669"
              icon={Banknote}
              sub={`${successCount} ta to'lov`}
            />
            <StatCard
              label="Muvaffaqiyatli"
              value={successCount}
              color="#0d9488"
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, email, order ID yoki tarif bo'yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100/60 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            {[
              { value: '',         label: 'Hammasi',       color: '#059669' },
              { value: 'success',  label: "Muvaffaqiyatli", color: '#059669' },
              { value: 'pending',  label: 'Kutilmoqda',     color: '#d97706' },
              { value: 'failed',   label: 'Rad etilgan',    color: '#ef4444' },
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {['Order ID', 'Foydalanuvchi', 'Tarif', 'Summa', "To'lov usuli", 'Holat', 'Sana'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
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
                        <CreditCard className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-semibold">Tranzaksiyalar topilmadi</p>
                        <p className="text-xs">Qidiruvni o'zgartiring yoki filtrni bekor qiling</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="group hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {tx.order_id || `#TX-${tx.id}`}
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800 leading-tight">{tx.user?.name || "Noma'lum"}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{tx.user?.email || '—'}</p>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-700 text-xs">
                          {tx.plan?.title || tx.plan?.name || 'Pro Obuna'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="font-black text-slate-800 text-sm">
                          {Number(tx.amount || 0).toLocaleString()} so'm
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
                      <td className="px-5 py-4 text-xs text-slate-400 font-medium">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString('uz-UZ', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
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
                Jami <span className="font-bold text-slate-700">{filtered.length}</span> ta to'lov
              </span>
              <span className="text-xs text-slate-500">
                Muvaffaqiyatli: <span className="font-bold text-emerald-600">{successCount}</span> | Rad etilgan:{' '}
                <span className="font-bold text-rose-500">{failedCount}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
