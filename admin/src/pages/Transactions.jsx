import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { CreditCard, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">To'lovlar & Tranzaksiyalar Tarixi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Foydalanuvchilarning Pro obuna uchun amalga oshirgan barcha to'lovlari (real-time).
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-2xl transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Foydalanuvchi</th>
                <th className="px-6 py-4">Tarif</th>
                <th className="px-6 py-4">Summa (UZS)</th>
                <th className="px-6 py-4">To'lov Usuli</th>
                <th className="px-6 py-4">Holati</th>
                <th className="px-6 py-4">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-sm">
                    Hozircha hech qanday to'lov amalga oshirilmagan
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">
                      {tx.order_id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{tx.user?.name || "Noma'lum"}</p>
                      <p className="text-xs text-slate-400">{tx.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {tx.plan?.title || tx.plan?.name || "Pro Tarif"}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {tx.amount?.toLocaleString()} so'm
                    </td>
                    <td className="px-6 py-4">
                      <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {tx.payment_method || "karta"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'success' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Muvaffaqiyatli</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Kutilmoqda</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
