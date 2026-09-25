import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { CreditCard, Plus, Check, Edit2 } from 'lucide-react';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price_uzs: 0,
    duration_days: 30,
    role_target: 'TEACHER',
    features: '',
    max_groups: 10,
    ai_credits: 100,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("Tariflarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      title: '',
      description: '',
      price_uzs: 0,
      duration_days: 30,
      role_target: 'TEACHER',
      features: 'Cheksiz guruhlar, AI baholash, Plagiat tahlili',
      max_groups: 10,
      ai_credits: 100,
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingPlan(p);
    setFormData({
      name: p.name,
      title: p.title,
      description: p.description || '',
      price_uzs: p.price_uzs,
      duration_days: p.duration_days,
      role_target: p.role_target,
      features: Array.isArray(p.features) ? p.features.join(', ') : '',
      max_groups: p.max_groups,
      ai_credits: p.ai_credits,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price_uzs: Number(formData.price_uzs),
        duration_days: Number(formData.duration_days),
        max_groups: Number(formData.max_groups),
        ai_credits: Number(formData.ai_credits),
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
      alert(err.response?.data?.message || err.message || "Saqlashda xatolik!");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Obuna Tariflari (Plans)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Admin tomonidan o'qituvchi va talabalar uchun yangi tariflar va narxlar belgilash.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-indigo-600/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Tarif Qo'shish</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                  {p.name}
                </span>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.description || "Ushbu tarif bo'yicha cheklovlar"}</p>

              <div className="my-6">
                <span className="text-3xl font-extrabold text-slate-900">
                  {p.price_uzs === 0 ? "Bepul" : `${p.price_uzs.toLocaleString()} so'm`}
                </span>
                {p.price_uzs > 0 && <span className="text-xs text-slate-400 ml-1">/ {p.duration_days} kun</span>}
              </div>

              {/* Limits */}
              <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-b border-slate-100 py-4">
                <div className="flex justify-between">
                  <span>Guruhlar limiti:</span>
                  <span className="font-semibold text-slate-900">{p.max_groups >= 9000 ? 'Cheksiz' : p.max_groups}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI baholash krediti:</span>
                  <span className="font-semibold text-slate-900">{p.ai_credits >= 9000 ? 'Cheksiz' : p.ai_credits}</span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2.5">
                {Array.isArray(p.features) && p.features.map((f, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Status: <span className="text-emerald-600 font-semibold">Faol</span></span>
              <span>Rol: {p.role_target}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT PLAN (PORTAL MODAL) */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? "Tarifni Tahrirlash" : "Yangi Tarif Qo'shish"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tarif Kodi (Name)</label>
              <input
                type="text"
                required
                placeholder="PRO_CUSTOM"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomi (Title)</label>
              <input
                type="text"
                required
                placeholder="O'qituvchi VIP"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ta'rif (Description)</label>
            <input
              type="text"
              placeholder="Qisqacha ta'rif..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Narxi (UZS)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price_uzs}
                onChange={(e) => setFormData({ ...formData, price_uzs: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Davomiyligi (Kun)</label>
              <input
                type="number"
                required
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Guruhlar</label>
              <input
                type="number"
                required
                value={formData.max_groups}
                onChange={(e) => setFormData({ ...formData, max_groups: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Imkoniyatlar (vergul bilan)</label>
            <textarea
              rows="2"
              placeholder="Cheksiz guruhlar, AI baholash, Plagiat tahlili"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Plans;
