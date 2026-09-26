import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download,
  Receipt,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Layers,
  ArrowUpRight,
  Clock,
  Phone,
  Loader2,
  ExternalLink,
  Check,
  BadgeCheck
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export const getNormalizedPlanKey = (rawPlan = '') => {
  const p = String(rawPlan || '').toUpperCase();
  if (p.includes('STARTER')) return 'STARTER';
  if (p.includes('STANDART') || p.includes('STANDARD')) return 'STANDART';
  return 'ENTERPRISE';
};

export default function Billing() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history'
  const [universityProfile, setUniversityProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // InPay Modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('click');
  const [phone, setPhone] = useState('+998901234567');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const b2bPlans = [
    {
      id: "STARTER",
      name: "STARTER",
      title: "Starter",
      category: "Kichik OTMlar (< 5 000 talaba)",
      price_uzs: 12000000,
      price_display: "12 mln so‘m / yil",
      features: [
        "5 tagacha fakultet",
        "30 tagacha o‘qituvchi",
        "Asosiy AI savollar (limit bilan)",
        "Davomat va avtomat baholash",
        "Email orqali qo‘llab-quvvatlash"
      ],
      popular: false,
      faculties_limit: "5 ta fakultet",
      teachers_limit: "30 ta o‘qituvchi",
      students_limit: "< 5 000 talaba",
      ai_limit: "Asosiy (500 so‘rov/oy)"
    },
    {
      id: "STANDART",
      name: "STANDART",
      title: "Standart",
      category: "O‘rta OTMlar (5 000 – 20 000 talaba)",
      price_uzs: 24000000,
      price_display: "24 mln so‘m / yil",
      badge: "Eng ommabop",
      features: [
        "15 tagacha fakultet",
        "100 tagacha o‘qituvchi",
        "AI savollar (kengaytirilgan)",
        "Analitika va to‘liq hisobotlar",
        "Integratsiya (HEMIS va b.)",
        "Prioritet texnik qo‘llab-quvvatlash"
      ],
      popular: true,
      faculties_limit: "15 ta fakultet",
      teachers_limit: "100 ta o‘qituvchi",
      students_limit: "5 000 – 20 000 talaba",
      ai_limit: "Kengaytirilgan (5,000/oy)"
    },
    {
      id: "ENTERPRISE",
      name: "ENTERPRISE",
      title: "Enterprise",
      category: "Yirik OTMlar (> 20 000 talaba)",
      price_uzs: 36000000,
      price_display: "36 mln so‘m / yil",
      features: [
        "Cheksiz fakultet va kafedralar",
        "Cheksiz o‘qituvchi va guruhlar",
        "Cheksiz AI baholash va savollar",
        "Maxsus HEMIS va API integratsiyalar",
        "Dedicated 24/7 menejer qo‘llab-quvvatlashi",
        "Shaxsiy server va maxsus sozlashlar"
      ],
      popular: false,
      faculties_limit: "Cheksiz (Unlimited)",
      teachers_limit: "Cheksiz (Unlimited)",
      students_limit: "> 20 000 talaba",
      ai_limit: "Cheksiz (Unlimited)"
    }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || '1';
      const [profileRes, txRes] = await Promise.all([
        api.get(`/universities/${uniId}/profile`).catch(() => null),
        api.get('/plans/transactions').catch(() => null),
      ]);

      if (profileRes?.data?.university) {
        setUniversityProfile(profileRes.data.university);
        if (profileRes.data.university.plan_name && updateUser) {
          updateUser({ university_plan: profileRes.data.university.plan_name });
        }
      }

      if (txRes?.data?.transactions) {
        setTransactions(txRes.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.log("Fetch billing data error:", err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const currentPlanKey = getNormalizedPlanKey(
    universityProfile?.plan_name || user?.university_plan || user?.university?.plan_name || 'ENTERPRISE'
  );

  const activePlanObj = b2bPlans.find(p => p.id === currentPlanKey) || b2bPlans[2];

  const handleInPaySubscribe = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setSubmittingPayment(true);
    setPaymentMessage('');
    setErrorMessage('');

    try {
      const uniId = user?.university_id || user?.id || '1';

      // 1. Universitetning real DB dagi tarifini yangilash
      await api.put(`/universities/${uniId}/plan`, {
        plan_name: selectedPlan.name,
      });

      // 2. inPAY to'lov so'rovini ro'yxatdan o'tkazish
      await api.post('/plans/subscribe', {
        plan_id: selectedPlan.name === 'STARTER' ? 1 : selectedPlan.name === 'STANDART' ? 2 : 3,
        payment_method: paymentMethod,
        phone,
      }).catch(() => null);

      // 3. Mahalliy context va profilni yangilash
      if (updateUser) {
        updateUser({ university_plan: selectedPlan.name });
      }
      setUniversityProfile(prev => prev ? { ...prev, plan_name: selectedPlan.name } : null);

      const newTx = {
        id: `INV-${Date.now().toString().substring(5)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        description: `EduMind AI ${selectedPlan.title} Yillik B2B Obuna`,
        amount_uzs: `${(selectedPlan.price_uzs || 36000000).toLocaleString()} UZS`,
        method: `inPAY (${paymentMethod.toUpperCase()})`,
        status: "PAID"
      };
      setTransactions([newTx, ...transactions]);

      setPaymentMessage(`Tabriklaymiz! Siz muvaffaqiyatli ${selectedPlan.title} tarifiga o‘tdingiz ✅`);
      setTimeout(() => {
        setSelectedPlan(null);
        setPaymentMessage('');
      }, 1600);
    } catch (err) {
      console.error("Subscription error:", err);
      setErrorMessage("To'lovni tasdiqlashda xatolik yuz berdi: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleDownloadPdfReceipt = (tx) => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>inPAY Rasmiy Chek - ${tx.id || tx.order_id || 'Receipt'}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #1e293b; background-color: #f8fafc; }
          .receipt-box { max-width: 650px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 22px; font-weight: 900; color: #059669; letter-spacing: -0.5px; }
          .badge { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; margin-bottom: 24px; background: #f8fafc; padding: 20px; border-radius: 16px; }
          .info-label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
          .info-val { font-weight: 700; color: #0f172a; }
          .table-box { margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; padding: 12px; background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; }
          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600; }
          .total-box { display: flex; justify-content: space-between; align-items: center; background: #059669; color: #ffffff; padding: 20px; border-radius: 16px; margin-top: 24px; }
          .total-amount { font-size: 24px; font-weight: 900; color: #ffffff; }
          .stamp { text-align: center; margin-top: 32px; font-size: 11px; color: #94a3b8; font-weight: 600; border-top: 1px dashed #e2e8f0; padding-top: 20px; }
          @media print {
            body { background: white; padding: 0; }
            .receipt-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div class="logo">EduMind AI Enterprise</div>
            <div class="badge">TO‘LANGAN (PAID)</div>
          </div>

          <div class="info-grid">
            <div>
              <div class="info-label">Invoys Raqami</div>
              <div class="info-val">${tx.id || tx.order_id || 'INV-2026-98421'}</div>
            </div>
            <div>
              <div class="info-label">To‘lov Sanasi</div>
              <div class="info-val">${tx.date || tx.created_at || '2026-09-25 14:20'}</div>
            </div>
            <div>
              <div class="info-label">Buyurtmachi (OTM)</div>
              <div class="info-val">${universityProfile?.name || user?.name || "Toshkent Axborot Texnologiyalari Universiteti"}</div>
            </div>
            <div>
              <div class="info-label">To‘lov Turi</div>
              <div class="info-val">${tx.method || "InPay Gateway"}</div>
            </div>
          </div>

          <div class="table-box">
            <table>
              <thead>
                <tr>
                  <th>Xizmat Nomi</th>
                  <th>Muddati</th>
                  <th style="text-align: right;">Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${tx.description || "EduMind AI Yillik Obuna"}</td>
                  <td>1 Yil (B2B Obuna)</td>
                  <td style="text-align: right;">${tx.amount_uzs || '36,000,000 UZS'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="total-box">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.8); font-weight: 700;">Jami To‘langan Summa</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 2px;">Barcha xizmatlar va inPAY komissiyasi o‘z ichiga olingan</div>
            </div>
            <div class="total-amount">${tx.amount_uzs || '36,000,000 UZS'}</div>
          </div>

          <div class="stamp">
            ✔ Ushbu kvitansiya inPAY va EduMind AI Enterprise tizimi tomonidan avtomatik shakllantirildi va rasmiy kuchga ega.
          </div>
        </div>
        <script>
          setTimeout(() => { window.print(); }, 400);
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(receiptHtml);
      printWin.document.close();
    } else {
      alert("Iltimos, brauzeringizda pop-up (yangi oyna) ochishga ruxsat bering.");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Obuna Tariflari va inPAY To‘lovlar Shlyuzi</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            inPAY API Payment Gateway (Uzcard, Humo, Click, Payme) orqali obunani boshqarish va hisob-fakturalar arxivi
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faol Obuna & Tariflar
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            To‘lovlar Tarixi ({transactions.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* All Enterprise Plans Showcase (3 B2B Tiers) */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Universitetlar Uchun Narxlash Paketlari</h3>
              <p className="text-xs text-slate-500">
                OTMlarning o‘lchamiga mos moslashuvchan yillik B2B tariflar. Siz hozirda <strong className="text-emerald-700">{activePlanObj.title}</strong> tarifidasiz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {b2bPlans.map((p) => {
                const isCurrent = p.id === currentPlanKey;
                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-3xl p-6 border flex flex-col justify-between space-y-6 relative transition-all ${
                      isCurrent
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg bg-emerald-50/15'
                        : 'border-slate-200/80 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {isCurrent && (
                      <span
                        style={{ background: EMERALD_GRADIENT }}
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase px-4 py-1 rounded-full text-white tracking-widest shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> SIZ SHU OBUNADASIZ
                      </span>
                    )}

                    {p.badge && !isCurrent && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase px-3.5 py-1 rounded-full text-emerald-800 bg-emerald-100 border border-emerald-200 tracking-wider">
                        {p.badge}
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-5 h-5 ${isCurrent ? 'text-emerald-700' : 'text-slate-600'}`} />
                          <h4 className="font-black text-slate-900 text-xl">{p.title}</h4>
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">{p.category}</div>
                        <div className="text-2xl font-black text-slate-900 mt-3">
                          {p.price_display}
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                        {p.features?.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-slate-700 font-medium">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCurrent ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isCurrent ? (
                      <div className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-2 shadow-xs">
                        <BadgeCheck className="w-4 h-4 text-emerald-700" />
                        Siz hozir shu tarifdasiz (Faol)
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPlan(p)}
                        style={{ background: EMERALD_GRADIENT }}
                        className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-md shadow-emerald-700/20 hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        Ushbu tarifga o‘tish (inPAY 💳)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">inPAY Orqali Bajarilgan To‘lovlar Tarixi</h3>
              <p className="text-xs text-slate-500">InPay Payment Gateway orqali to‘langan rasmiy shartnomalar va cheklar</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-400 mx-auto flex items-center justify-center">
                  <Receipt className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Hozircha to‘lovlar tarixi mavjud emas</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  inPAY to‘lov shlyuzi orqali birinchi to‘lov amalga oshirilgach, rasmiy invoyslar va PDF cheklar bu yerda avtomatik saqlanadi.
                </p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id || tx.order_id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0 border border-emerald-100">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{tx.order_id || tx.id}</span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {tx.status === 'PAID' || tx.status === 'COMPLETED' ? 'TO‘LANGAN (PAID)' : (tx.status || 'KUTILMOQDA')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{tx.description || `${tx.plan?.title || 'B2B'} Obuna To‘lovi`}</p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 font-medium">
                        <span>Sana: {tx.created_at ? new Date(tx.created_at).toLocaleString('uz-UZ') : (tx.date || '—')}</span>
                        <span>•</span>
                        <span>Usul: {tx.payment_method || tx.method || "inPAY Gateway"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-base">
                        {tx.amount ? `${Number(tx.amount).toLocaleString('uz-UZ')} UZS` : (tx.amount_uzs || '—')}
                      </div>
                      <div className="text-xs font-semibold text-emerald-600">Tasdiqlangan</div>
                    </div>

                    <button
                      onClick={() => handleDownloadPdfReceipt(tx)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer bg-slate-50 hover:bg-white"
                    >
                      <Download className="w-4 h-4" />
                      PDF Chek
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* InPay Payment Checkout Modal */}
      {selectedPlan && (
        <Modal onClose={() => setSelectedPlan(null)}>
          <form onSubmit={handleInPaySubscribe} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">inPAY Orqali Tarifga O‘tish</h3>
                <p className="text-xs text-slate-500">Uzcard, Humo, Click, Payme va Bank hisob raqami orqali</p>
              </div>
            </div>

            {paymentMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                {paymentMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Tanlangan Yangi Tarif</div>
              <div className="font-bold text-slate-900 text-base">{selectedPlan.title}</div>
              <div className="font-black text-emerald-700 text-lg">
                {selectedPlan.price_display}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">To‘lov Shlyuzi (Payment Gateway)</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('click')}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'click' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    Click / Uzcard
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payme')}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'payme' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    Payme / Humo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('invoice')}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'invoice' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 bg-white'
                    }`}
                  >
                    Bank Shartnomasi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mas’ul xodim telefon raqami *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submittingPayment}
                style={{ background: EMERALD_GRADIENT }}
                className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submittingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    To‘lov Shlyuziga Ulanmoqda...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Tarifni Faollashtirish va inPAY Orqali To‘lash
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
