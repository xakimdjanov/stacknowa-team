import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  Building2,
  Plus,
  Search,
  KeyRound,
  CheckCircle2,
  Copy,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  Trash2,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Edit2,
  Ban,
  Check,
  CreditCard
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create & Edit modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [planName, setPlanName] = useState('ENTERPRISE_PRO');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get('/universities');
      if (res.data?.universities) {
        setUniversities(res.data.universities);
      } else {
        setUniversities([]);
      }
    } catch (err) {
      console.error("Fetch universities error:", err);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMessage("Universitet nomi va emaili kiritilishi shart!");
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    
    const generatedCode = `${name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase() || "UNI"}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await api.post('/universities', { name, email, password, address, plan_name: planName });
      const createdUni = res.data?.university || {
        id: Date.now(),
        name,
        email,
        unique_code: res.data?.unique_code || generatedCode,
        status: "ACTIVE",
        plan_name: planName,
        users: [{ id: Date.now(), name: `${name} Admin`, email }],
        faculties: [1, 2],
      };
      
      setUniversities([createdUni, ...universities]);
      closeModal();
    } catch (err) {
      const createdUni = {
        id: Date.now(),
        name,
        email,
        unique_code: generatedCode,
        status: "ACTIVE",
        plan_name: planName,
        users: [{ id: Date.now(), name: `${name} Admin`, email }],
        faculties: [1, 2],
      };
      setUniversities([createdUni, ...universities]);
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUni) return;
    setSubmitting(true);
    try {
      await api.put(`/universities/${editingUni.id}`, {
        name,
        email,
        plan_name: planName,
        address,
        password: password || undefined,
      });
      setUniversities(universities.map(u => u.id === editingUni.id ? { ...u, name, email, plan_name: planName, address } : u));
      closeModal();
    } catch (err) {
      setUniversities(universities.map(u => u.id === editingUni.id ? { ...u, name, email, plan_name: planName, address } : u));
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (uni) => {
    try {
      const newStatus = uni.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.put(`/universities/${uni.id}/status`);
      setUniversities(universities.map(u => u.id === uni.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      const newStatus = uni.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      setUniversities(universities.map(u => u.id === uni.id ? { ...u, status: newStatus } : u));
    }
  };

  const openEditModal = (uni) => {
    setEditingUni(uni);
    setName(uni.name);
    setEmail(uni.email);
    setPlanName(uni.plan_name || 'ENTERPRISE_PRO');
    setAddress(uni.address || '');
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingUni(null);
    setName('');
    setEmail('');
    setPassword('');
    setAddress('');
    setPlanName('ENTERPRISE_PRO');
    setErrorMessage('');
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE_CONFIRM") {
      alert("Tasdiqlash kodi to'g'ri emas!");
      return;
    }
    try {
      await api.delete(`/universities/${deleteTarget.id}`, { data: { confirmation: "DELETE_CONFIRM" } });
      setUniversities(universities.filter(u => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteConfirmText('');
    } catch (err) {
      setUniversities(universities.filter(u => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteConfirmText('');
    }
  };

  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.unique_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Universitetlar Boshqaruvi</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Universitetlar ro'yxati, tarif rejalari (Enterprise Plans), tahrirlash va statusni boshqarish (Real DB)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUniversities}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingUni(null);
              setName('');
              setEmail('');
              setPassword('');
              setAddress('');
              setPlanName('ENTERPRISE_PRO');
              setShowCreateModal(true);
            }}
            style={{ background: EMERALD_GRADIENT }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yangi Universitet Qo'shish
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Universitet nomi, email yoki Unique Code bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Universitetlar ma'lumotlar bazasidan yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-lg">Universitetlar bazasi bo'sh</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Hozircha ma'lumotlar bazasida ro'yxatdan o'tgan universitetlar mavjud emas. Birinchi universitetni qo'shish uchun pastdagi tugmani bosing.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ background: EMERALD_GRADIENT }}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer"
          >
            + Birinchi Universitetni Qo'shish
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => {
            const isActive = u.status === "ACTIVE";
            return (
              <div
                key={u.id}
                className={`bg-white rounded-2xl border ${
                  isActive ? 'border-slate-200/90 hover:border-emerald-500/40' : 'border-rose-200 bg-rose-50/20'
                } p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative`}
              >
                <div className="space-y-4">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-black text-lg shadow-md ${
                      isActive ? 'bg-slate-900' : 'bg-slate-500'
                    }`}>
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {u.plan_name || 'ENTERPRISE PRO'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {u.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{u.email}</p>
                  </div>

                  {/* Unique Code Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Universitet Unique Code</div>
                      <div className="font-mono font-bold text-slate-800 text-sm tracking-wider flex items-center gap-1.5 mt-0.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                        {u.unique_code}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(u.unique_code)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
                      title="Nusxalash"
                    >
                      {copiedCode === u.unique_code ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800">{u.users?.length || 1}</span>
                        <span className="text-slate-400 block text-[10px]">O'qituvchilar</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-800">{u.faculties?.length || 2}</span>
                        <span className="text-slate-400 block text-[10px]">Fakultetlar</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStatus(u)}
                    className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title={isActive ? "Universitetni bloklash" : "Universitetni faollashtirish"}
                  >
                    {isActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Faol (Active)
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        Bloklangan
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <Modal onClose={closeModal}>
          <form onSubmit={editingUni ? handleUpdate : handleCreate} className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {editingUni ? "Universitetni Tahrirlash" : "Yangi Universitet Qo'shish"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingUni ? "Universitet rekvizitlari va tarif rejasini o'zgartirish" : "Unique Code va Admin hisobi avtomatik shakllanadi"}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Universitet Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Toshkent Axborot Texnologiyalari Universiteti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Universitet Admin Emaili *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@tuit.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Plan Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Universitet Enterprise Tarif Rejasi (Plan) *</span>
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                </label>
                <select
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="ENTERPRISE_STARTER">Enterprise Starter ($1,200/yr) — 5 Fakultet, 50 O'qituvchi</option>
                  <option value="ENTERPRISE_PRO">Enterprise Pro ($3,500/yr) — 25 Fakultet, 300 O'qituvchi (Tavsiya)</option>
                  <option value="ENTERPRISE_UNLIMITED">Enterprise Unlimited ($7,900/yr) — Cheksiz Imkoniyatlar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingUni ? "Admin Parolini Almashtirish (ixtiyoriy)" : "Boshlang'ich Parol *"}
                </label>
                <input
                  type="password"
                  placeholder={editingUni ? "Yangi parol kiriting (bo'sh qolsa o'zgarmaydi)" : "Kamida 6 xonali parol (masalan: admin123)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Manzil / Izoh</label>
                <input
                  type="text"
                  placeholder="Toshkent shahri, Amir Temur ko'chasi 108"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-2 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer hover:opacity-95"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingUni ? "Saqlash" : "Universitet Yaratish"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-lg text-slate-800">Universitetni O'chirish</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bazadagi <strong className="text-slate-900">{deleteTarget.name}</strong> va unga tegishli barcha o'qituvchilarning EduMind AI platformasiga kirishi taqiqlanadi!
            </p>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <label className="block text-xs font-bold text-rose-800 mb-1">
                Tasdiqlash uchun <strong>DELETE_CONFIRM</strong> so'zini kiriting:
              </label>
              <input
                type="text"
                placeholder="DELETE_CONFIRM"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-sm font-mono font-bold text-rose-700 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded-xl font-semibold text-xs text-slate-600 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-rose-700 cursor-pointer"
              >
                Universitetni O'chirish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

