import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  FileText, UploadCloud, Sparkles, CheckCircle2, Layers, Loader2,
  FolderOpen, Eye, Zap, Plus, RefreshCw, X, Brain, ChevronRight,
  Pencil, Trash2, AlertTriangle, Check, FileCheck, MoreVertical
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

// ─── 3-BOSQICHLI DELETE MODAL ─────────────────────────────────
function DeleteModal({ isOpen, onClose, material, onConfirmed }) {
  const [step, setStep] = useState(1); // 1 = ogohlantirish | 2 = tasdiqlash | 3 = o'chirildi
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) { setStep(1); setConfirmText(''); }
  }, [isOpen]);

  if (!isOpen || !material) return null;

  const expectedText = material.title || material.material_name || '';

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/events/${material.id}`);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.error || "O'chirishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Progress Steps */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black transition-all ${
                  s < step ? 'bg-emerald-600 text-white' :
                  s === step ? 'bg-slate-900 text-white' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all ${s < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {step === 1 ? '1-bosqich: Ogohlantirish' : step === 2 ? '2-bosqich: Tasdiqlash' : '3-bosqich: Yakunlandi'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* STEP 1 — Warning */}
          {step === 1 && (
            <>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Materialni O'chirish</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Ushbu materialga tegishli barcha AI savollar ham o'chiriladi.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-[11px] text-slate-500 font-semibold mb-1">O'chiriladigan material:</p>
                <p className="text-sm font-black text-slate-900 line-clamp-2">{expectedText}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {material.questions?.length || 0} ta AI savol • {material.group?.name || "Guruhsiz"}
                </p>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-semibold">
                  Bu amalni orqaga qaytarib bo'lmaydi! Keyingi bosqichda material nomi yozib tasdiqlanadi.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer">
                  Bekor qilish
                </button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer shadow-md shadow-rose-700/20">
                  Davom etish →
                </button>
              </div>
            </>
          )}

          {/* STEP 2 — Confirm by typing name */}
          {step === 2 && (
            <>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Tasdiqlash Kerak</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    O'chirishni tasdiqlash uchun material nomini quyida yozing.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500">Quyidagini aynan yozing:</p>
                <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl">
                  <code className="text-xs font-black text-slate-900 select-all">{expectedText}</code>
                </div>
                <input
                  type="text"
                  placeholder="Material nomini yozing..."
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                    confirmText === expectedText
                      ? 'border-emerald-400 bg-emerald-50 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-300/40'
                  }`}
                  autoFocus
                />
                {confirmText.length > 0 && confirmText !== expectedText && (
                  <p className="text-[11px] text-rose-500 font-semibold">❌ Mos kelmadi, tekshiring</p>
                )}
                {confirmText === expectedText && (
                  <p className="text-[11px] text-emerald-600 font-semibold">✓ Tasdiqlandi, o'chirishga tayyor</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer">
                  ← Orqaga
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== expectedText || loading}
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer shadow-md shadow-rose-700/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> O'chirilmoqda...</> : <><Trash2 className="w-4 h-4" /> Ha, O'chirish</>}
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && (
            <>
              <div className="py-4 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Material O'chirildi!</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Barcha tegishli AI savollar ham o'chirildi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { onConfirmed(); onClose(); }}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Yopish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────
function EditModal({ isOpen, onClose, material, groups, onSaved }) {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen && material) {
      setTitle(material.title || material.material_name || '');
      setGroupId(material.group_id || '');
      setSaved(false);
    }
  }, [isOpen, material]);

  if (!isOpen || !material) return null;

  const handleSave = async () => {
    if (!title.trim()) { alert("Material nomi bo'sh bo'lmaydi!"); return; }
    setSaving(true);
    try {
      await api.put(`/events/${material.id}`, { title: title.trim(), group_id: groupId || null });
      setSaved(true);
      setTimeout(() => { onSaved(); onClose(); }, 900);
    } catch (err) {
      alert(err.response?.data?.error || "Saqlashda xatolik!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Materialni Tahrirlash</h3>
              <p className="text-[11px] text-slate-400 font-medium">Nom va guruhni o'zgartiring</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Material Nomi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
              placeholder="Masalan: Dasturlash Asoslari"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Guruh</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all"
            >
              <option value="">Guruh tanlanmagan</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name} — {g.subject} ({g.course}-kurs)</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer">
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved || !title.trim()}
              style={{ background: EMERALD_GRADIENT }}
              className="flex-1 py-3 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Saqlandi!</> :
               saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</> :
               <><Check className="w-4 h-4" /> Saqlash</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Materials() {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailMaterial, setDetailMaterial] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const [materialTitle, setMaterialTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContentText, setFileContentText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const [myGroups, setMyGroups] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // material id for context menu

  useEffect(() => {
    fetchMyGroups();
    fetchSavedMaterials();
    // close menu on outside click
    const handler = () => setActiveMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/groups/my');
      if (res.data?.groups) {
        setMyGroups(res.data.groups);
        if (res.data.groups.length > 0) setSelectedGroupId(res.data.groups[0].id);
      }
    } catch (err) { console.error('Groups fetch error:', err); }
  };

  const fetchSavedMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get('/events/my-materials');
      if (res.data?.materials) setSavedMaterials(res.data.materials);
    } catch (err) { console.error('Saved materials fetch error:', err); }
    finally { setLoadingMaterials(false); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!materialTitle) setMaterialTitle(file.name.replace(/\.[^/.]+$/, ''));
    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFileContentText(typeof ev.target?.result === 'string' ? ev.target.result : '');
      reader.readAsText(file);
    } else {
      setFileContentText('');
    }
  };

  const handleGenerateAIQuestions = async () => {
    if (!materialTitle && !selectedFile && !fileContentText) {
      alert("Iltimos, dars materiali faylini yuklang yoki sarlavha kiriting!");
      return;
    }
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('material_name', materialTitle || selectedFile?.name || "Dars Materiali");
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (fileContentText) {
        formData.append('material_text', fileContentText);
      }

      const res = await api.post('/events/generate-20-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.questions?.length > 0) {
        const currentTitle = materialTitle || selectedFile?.name || "Dars Materiali";
        const createRes = await api.post('/events/create', {
          title: currentTitle, questions: res.data.questions,
          group_id: selectedGroupId || null, material_name: currentTitle,
        });
        fetchSavedMaterials();
        setShowCreateModal(false);
        setDetailMaterial(createRes.data?.event || { title: currentTitle, questions: res.data.questions, group_id: selectedGroupId });
        setMaterialTitle(''); setSelectedFile(null); setFileContentText('');
      } else { alert("AI savollarni yaratishda xatolik."); }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "AI savollar tuzishda xatolik!");
    } finally { setIsGenerating(false); }
  };

  const handleGoToLiveEvent = (mat) => {
    const qList = mat.questions || [];
    if (!qList.length) { alert("Savollar mavjud emas!"); return; }
    sessionStorage.setItem('ai_quiz_questions', JSON.stringify(qList));
    sessionStorage.setItem('ai_quiz_title', mat.title || mat.material_name || "Quiz");
    sessionStorage.setItem('ai_quiz_group_id', mat.group_id || '');
    navigate('/live-events');
  };

  const totalAIQs = savedMaterials.reduce((s, m) => s + (m.questions?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-7 max-w-7xl mx-auto">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-700/20" style={{ background: EMERALD_GRADIENT }}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Materiallar & AI Savollar</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Dars materiallaringiz va AI 20-savol to'plamlari</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ background: EMERALD_GRADIENT }}
          className="px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg shadow-emerald-700/25 flex items-center gap-2.5 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Yangi Material & AI Savol
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Jami Materiallar", value: savedMaterials.length, icon: FolderOpen, color: "emerald" },
          { label: "AI Savollar", value: totalAIQs, icon: Brain, color: "violet" },
          { label: "Guruhlar", value: myGroups.length, icon: Layers, color: "blue" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              s.color === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
            }`}><s.icon className="w-5 h-5" /></div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none">{s.value}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MATERIALS LIST ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base leading-none">Mening Dars Materiallarim</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">⋯ tugmasi orqali tahrirlash va o'chirish mumkin</p>
            </div>
          </div>
          <button onClick={fetchSavedMaterials} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer" title="Yangilash">
            <RefreshCw className={`w-4 h-4 ${loadingMaterials ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="p-6">
          {loadingMaterials ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="text-xs font-semibold">Materiallar yuklanmoqda...</span>
            </div>
          ) : savedMaterials.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <FolderOpen className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-slate-800 text-sm">Hali dars materiallar yaratilmadi</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Yangi material yarating va AI 20 ta savol shakllantiring.</p>
              </div>
              <button onClick={() => setShowCreateModal(true)} style={{ background: EMERALD_GRADIENT }} className="px-6 py-3 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Birinchi Materialni Yaratish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="group relative bg-slate-50/60 border border-slate-200/90 hover:border-emerald-400/70 hover:bg-white rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-200"
                >
                  {/* Top hover accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Amallar: Tahrirlash va O'chirish — doim ko'rinib turadi, hover shart emas */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setEditTarget(mat)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                      title="Materialni tahrirlash"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(mat)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                      title="Materialni o'chirish (3 bosqichli)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card content (clickable for detail) */}
                  <div className="space-y-3 cursor-pointer" onClick={() => setDetailMaterial(mat)}>
                    <div className="flex items-start justify-between gap-2 pr-20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg leading-none">
                        {mat.group?.name || "Guruhsiz"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(mat.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 pr-20">
                      {mat.title || mat.material_name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">{mat.questions?.length || 20} ta AI Savol</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button onClick={() => setDetailMaterial(mat)} className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
                      <Eye className="w-3.5 h-3.5" /> Ko'rish <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleGoToLiveEvent(mat)}
                      style={{ background: EMERALD_GRADIENT }}
                      className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" /> Live Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Yangi Material & AI 20-Savol Generator" maxWidth="max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] mr-1.5">1</span>
              Biriktiriladigan O'quv Guruhi
            </label>
            <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all">
              {myGroups.length === 0 ? <option value="">Guruhlar mavjud emas</option> :
                myGroups.map((g) => <option key={g.id} value={g.id}>{g.name} — {g.subject} ({g.course}-kurs)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] mr-1.5">2</span>
              Dars Materiali Nomi
            </label>
            <input type="text" placeholder="Masalan: Dasturlash Asoslari va Algoritmlar" value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all placeholder-slate-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] mr-1.5">3</span>
              O'quv Fayli (.docx, .pdf, .txt)
            </label>
            <div className={`border-2 border-dashed rounded-2xl p-7 text-center transition-colors ${selectedFile ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'}`}>
              <input type="file" accept=".txt,.docx,.pdf,.doc" onChange={handleFileUpload} className="hidden" id="mat-file-input" />
              <label htmlFor="mat-file-input" className="cursor-pointer flex flex-col items-center gap-2.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {selectedFile ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>
                <p className="text-xs font-bold text-slate-800">{selectedFile ? selectedFile.name : "Fayl yuklash uchun bosing"}</p>
                {selectedFile ? <span className="text-[11px] text-emerald-700 font-semibold">✓ {(selectedFile.size / 1024).toFixed(1)} KB</span>
                  : <span className="text-[11px] text-slate-400">Qo'llab-quvvatlanadi: .pdf, .docx, .txt</span>}
              </label>
            </div>
          </div>
          <div className="bg-violet-50 border border-violet-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <Brain className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-violet-800 font-medium leading-relaxed">
              <strong>AI tomonidan 20 ta test savol</strong> material matnini tahlil qilib, 4 ta variant bilan avtomatik tayyorlanadi.
            </p>
          </div>
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button onClick={() => setShowCreateModal(false)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer">
              Bekor qilish
            </button>
            <button onClick={handleGenerateAIQuestions} disabled={isGenerating} style={{ background: EMERALD_GRADIENT }}
              className="px-8 py-3 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />AI 20 ta Savol Tuzmoqda...</> : <><Sparkles className="w-4 h-4" />AI 20 ta Savol Tuzish & Saqlash</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      <Modal isOpen={Boolean(detailMaterial)} onClose={() => setDetailMaterial(null)}
        title={detailMaterial ? `${detailMaterial.title || detailMaterial.material_name} — AI Savollar` : ''} maxWidth="max-w-4xl">
        {detailMaterial && (
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg inline-block">
                  {detailMaterial.group?.name || "Guruhga biriktirilgan"}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{detailMaterial.title || detailMaterial.material_name}</h3>
                <p className="text-xs text-slate-500">{detailMaterial.questions?.length || 20} ta AI savol</p>
              </div>
              <button onClick={() => handleGoToLiveEvent(detailMaterial)} style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-3 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap">
                <Zap className="w-4 h-4 fill-current" /> Live Event Boshlash ⚡
              </button>
            </div>
            <div className="space-y-3 max-h-[52vh] overflow-y-auto pr-1">
              {(detailMaterial.questions || []).map((q, idx) => (
                <div key={q.id || idx} className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">#{idx + 1}-savol</span>
                    <span className="text-[10px] text-slate-400 font-semibold">4 Variant</span>
                  </div>
                  <h4 className="font-semibold text-xs md:text-sm text-slate-900 leading-snug">{q.question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options?.map((opt, oIdx) => (
                      <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border ${oIdx === q.correctIndex ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        <span className={`inline-flex w-5 h-5 rounded-md items-center justify-center text-[10px] font-black mr-1.5 ${oIdx === q.correctIndex ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{['A','B','C','D'][oIdx]}</span>
                        {opt}{oIdx === q.correctIndex && <span className="ml-1.5 text-emerald-600">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 flex justify-end border-t border-slate-100">
              <button onClick={() => setDetailMaterial(null)} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800">Yopish</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── DELETE MODAL (3-bosqich) ── */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        material={deleteTarget}
        onConfirmed={fetchSavedMaterials}
      />

      {/* ── EDIT MODAL ── */}
      <EditModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        material={editTarget}
        groups={myGroups}
        onSaved={fetchSavedMaterials}
      />
    </div>
  );
}
