import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { CreditCard, Check, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('998901234567');
  const [paymentMethod, setPaymentMethod] = useState('click');
  const [processing, setProcessing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const { user, refreshUser } = useAuth();

  useEffect(() => {
    fetchPlans();
    checkLatestStatus();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkLatestStatus = async () => {
    setCheckingStatus(true);
    try {
      await refreshUser();
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await api.post('/plans/subscribe', {
        plan_id: selectedPlan.id,
        payment_method: paymentMethod,
        phone: phone,
      });

      if (res.data.pay_url) {
        window.location.href = res.data.pay_url;
      } else {
        alert(res.data.message || "To'lov so'rovi muvaffaqiyatli yaratildi");
        setSelectedPlan(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "To'lovni boshlashda xatolik!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#1d58d8] font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Obunalar & Imkoniyatlar</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Teacher Pro Tarifiga O'ting
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Cheksiz guruhlar, to'liq AI baholash, talabalar o'rtasidagi plagiat (similarity) va AI-yozuv tahlillaridan to'liq foydalaning.
          </p>
        </div>

        {/* To'lovni tekshirish / Yangilash tugmasi */}
        <button
          onClick={checkLatestStatus}
          disabled={checkingStatus}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-2xl transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin text-[#1d58d8]' : ''}`} />
          <span>To'lov holatini tekshirish</span>
        </button>
      </div>

      {/* Pro status badge banner */}
      {user?.plan_type === 'PRO' && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-emerald-900">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Sizda Teacher PRO obunasi faol! 🎉</p>
              <p className="text-emerald-700 mt-0.5">
                Amal qilish muddati: {user.plan_expires_at ? new Date(user.plan_expires_at).toLocaleDateString() : "Cheksiz"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = user?.plan_type === p.name;
          const isPro = p.price_uzs > 0;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-8 border transition-all flex flex-col justify-between ${
                isPro
                  ? 'bg-white border-[#1d58d8] shadow-xl shadow-blue-500/10 ring-2 ring-[#1d58d8]'
                  : 'bg-white border-slate-200/80 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isPro ? 'bg-blue-50 text-[#1d58d8]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Amaldagi tarif
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.description}</p>

                <div className="my-6">
                  <span className="text-3xl font-black text-slate-900">
                    {p.price_uzs === 0 ? "Bepul" : `${p.price_uzs.toLocaleString()} so'm`}
                  </span>
                  {p.price_uzs > 0 && <span className="text-xs text-slate-400 ml-1">/ {p.duration_days} kun</span>}
                </div>

                {/* Features */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  {Array.isArray(p.features) && p.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                {isPro ? (
                  <button
                    onClick={() => setSelectedPlan(p)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1d58d8] hover:bg-[#1648b8] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>To'lov qilish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full py-3 text-center text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Boshlang'ich tarif
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TO'LOV MODALI */}
      <Modal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        title="Obuna To'lovi"
      >
        <form onSubmit={handleSubscribe} className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tanlangan Tarif</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedPlan?.title}</p>
            <p className="text-2xl font-black text-[#1d58d8] mt-1">
              {selectedPlan?.price_uzs?.toLocaleString()} so'm
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Telefon Raqamingiz (SMS xabarnoma uchun)
            </label>
            <input
              type="text"
              required
              placeholder="998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              To'lov Usulini Tanlang
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['click', 'payme', 'cardsystem'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                    paymentMethod === m
                      ? 'border-[#1d58d8] bg-blue-50 text-[#1d58d8] ring-1 ring-[#1d58d8]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-[#1d58d8] hover:bg-[#1648b8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 text-sm mt-4"
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Xavfsiz To'lov Sahifasiga O'tish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Subscription;
