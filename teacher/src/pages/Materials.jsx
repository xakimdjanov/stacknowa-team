import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Layers,
  Loader2,
  Play,
  ArrowRight,
  BookOpen,
  FileCheck,
  Building2,
  HelpCircle,
  Calendar,
  FolderOpen,
  Eye,
  Zap,
  Plus,
  RefreshCw,
  X,
  File
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Materials() {
  const navigate = useNavigate();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailMaterial, setDetailMaterial] = useState(null);

  // Form State inside Create Modal
  const [materialTitle, setMaterialTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContentText, setFileContentText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Data lists
  const [myGroups, setMyGroups] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    fetchMyGroups();
    fetchSavedMaterials();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/groups/my');
      if (res.data?.groups) {
        setMyGroups(res.data.groups);
        if (res.data.groups.length > 0) {
          setSelectedGroupId(res.data.groups[0].id);
        }
      }
    } catch (err) {
      console.error("Groups fetch error:", err);
    }
  };

  const fetchSavedMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get('/events/my-materials');
      if (res.data?.materials) {
        setSavedMaterials(res.data.materials);
      }
    } catch (err) {
      console.error("Saved materials fetch error:", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  // File upload reader
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!materialTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setMaterialTitle(nameWithoutExt);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      setFileContentText(typeof text === 'string' ? text : '');
    };
    reader.readAsText(file);
  };

  // Generate 20 AI Questions & Save Material
  const handleGenerateAIQuestions = async () => {
    if (!materialTitle && !fileContentText) {
      alert("Iltimos, avval dars materiali faylini yuklang yoki sarlavha kiriting!");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/events/generate-20-questions', {
        material_name: materialTitle || selectedFile?.name || "Dars Materiali",
        material_text: fileContentText || `Fan: ${materialTitle}. Amaliy mashg'ulot bo'yicha relatsion bazalar va algoritmik mantiq.`
      });

      if (res.data?.questions && res.data.questions.length > 0) {
        const generatedQs = res.data.questions;
        const currentTitle = materialTitle || selectedFile?.name || "Dars Materiali";

        // Save to backend database for permanent record
        try {
          const createRes = await api.post('/events/create', {
            title: currentTitle,
            questions: generatedQs,
            group_id: selectedGroupId || null,
            material_name: currentTitle,
          });

          fetchSavedMaterials();

          // Close Create modal and open detail view for new material
          setShowCreateModal(false);
          setDetailMaterial(createRes.data?.event || {
            title: currentTitle,
            material_name: currentTitle,
            questions: generatedQs,
            group_id: selectedGroupId
          });

          // Reset form
          setMaterialTitle('');
          setSelectedFile(null);
          setFileContentText('');
        } catch (saveErr) {
          console.error("Save material error:", saveErr);
        }
      } else {
        alert("AI savollarni yaratishda xatolik yuz berdi.");
      }
    } catch (err) {
      console.error("Generate questions error:", err);
      alert(err.response?.data?.error || err.message || "AI savollar tuzishda xatolik!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Launch Live Event from material
  const handleGoToLiveEvent = (mat) => {
    const qList = mat.questions || [];
    const title = mat.title || mat.material_name || "Dars Materiali";
    const gId = mat.group_id;

    if (qList.length === 0) {
      alert("Savollar mavjud emas!");
      return;
    }

    sessionStorage.setItem('ai_quiz_questions', JSON.stringify(qList));
    sessionStorage.setItem('ai_quiz_title', title);
    sessionStorage.setItem('ai_quiz_group_id', gId);

    navigate('/live-events');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Header with Main Create Button */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Materiallar & AI Savollar Ro'yxati</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Guruhlaringizga biriktirilgan dars materiallari va AI 20-savol to'plamlari ro'yxati
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{ background: EMERALD_GRADIENT }}
          className="px-6 py-3.5 rounded-2xl text-white font-black text-xs shadow-lg shadow-emerald-700/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          + Yangi Material & AI Savol Yaratish
        </button>
      </div>

      {/* 1. SAVED MATERIALS LIST (PRIMARY SCREEN) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              Mening Dars Materiallarim va AI Savollarim ({savedMaterials.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Material ustiga bosib savollarni ko'rishingiz va Live Event boshlashingiz mumkin
            </p>
          </div>

          <button
            onClick={fetchSavedMaterials}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMaterials ? 'animate-spin' : ''}`} />
            Yangilash
          </button>
        </div>

        {loadingMaterials ? (
          <div className="py-16 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            Materiallar ro'yxati yuklanmoqda...
          </div>
        ) : savedMaterials.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h4 className="font-black text-slate-800 text-base">Hali dars materiallari yaratilmadi</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              "Yangi Material & AI Savol Yaratish" tugmasini bosib o'quv faylingizni yuklang va 20 ta savol shakllantiring.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ background: EMERALD_GRADIENT }}
              className="px-6 py-3 rounded-2xl text-white font-bold text-xs shadow-md mx-auto inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              Birinchi Materialni Yaratish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setDetailMaterial(mat)}
                className="bg-slate-50/80 border border-slate-200/90 hover:border-emerald-500 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-lg">
                      {mat.group?.name || "O'quv Guruhi"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {new Date(mat.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {mat.title || mat.material_name}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      {mat.questions?.length || 20} ta AI Savol
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-indigo-600 flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    Savollarni Ko'rish ➔
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoToLiveEvent(mat);
                    }}
                    style={{ background: EMERALD_GRADIENT }}
                    className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Live Event ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CREATE MATERIAL & AI 20-QUESTIONS MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="➕ Yangi Material & AI 20-Savol Generator"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">1. Biriktiriladigan O'quv Guruhi</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {myGroups.length === 0 ? (
                <option value="">Guruhlar mavjud emas</option>
              ) : (
                myGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.subject} ({g.course}-kurs)
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">2. Dars Materiali Nomi</label>
            <input
              type="text"
              placeholder="Masalan: Dasturlash Asoslari va Algoritmlar"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">3. O'quv Fayli (.docx, .pdf, .txt)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".txt,.docx,.pdf,.doc"
                onChange={handleFileUpload}
                className="hidden"
                id="modal-material-file-input"
              />
              <label htmlFor="modal-material-file-input" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="w-10 h-10 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : "Fayl yuklash uchun bosing"}
                </span>
                {selectedFile ? (
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                    ✓ Fayl yuklandi ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Qo'llab-quvvatlanadi: .pdf, .docx, .txt</span>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={handleGenerateAIQuestions}
              disabled={isGenerating}
              style={{ background: EMERALD_GRADIENT }}
              className="px-8 py-3 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 20 ta Savol Tuzmoqda...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  🤖 AI 20 ta Savol Tuzish & Saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. MATERIAL QUESTIONS DETAIL MODAL (ICHIGA KIRGANDA SAVOLLAR KO'RINADI) */}
      <Modal
        isOpen={Boolean(detailMaterial)}
        onClose={() => setDetailMaterial(null)}
        title={detailMaterial ? `📄 ${detailMaterial.title || detailMaterial.material_name} — 20 ta AI Savollar` : ''}
        maxWidth="max-w-4xl"
      >
        {detailMaterial && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                  {detailMaterial.group?.name || "Guruhga biriktirilgan"}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {detailMaterial.title || detailMaterial.material_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {detailMaterial.questions?.length || 20} ta AI tomonidan tayyorlangan test savollari
                </p>
              </div>

              <button
                onClick={() => handleGoToLiveEvent(detailMaterial)}
                style={{ background: EMERALD_GRADIENT }}
                className="px-6 py-3 rounded-xl text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                Ushbu Material Bilan Live Event Boshlash ⚡
              </button>
            </div>

            {/* Questions List inside Modal */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {(detailMaterial.questions || []).map((q, idx) => (
                <div key={q.id || idx} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                      #{idx + 1}-savol
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">4 Variant</span>
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-snug">{q.question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl font-semibold border ${
                          oIdx === q.correctIndex
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {opt} {oIdx === q.correctIndex && " (TO'G'RI)"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setDetailMaterial(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
