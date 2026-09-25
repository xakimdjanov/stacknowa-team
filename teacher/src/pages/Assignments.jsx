import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  FileCheck2, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  UploadCloud, 
  Sparkles,
  BookOpen,
  Paperclip,
  CheckCircle,
  CheckCircle2,
  FileText,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Download
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '');
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getFileNameFromUrl = (url) => {
  if (!url) return 'Fayl';
  try {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    return decodeURIComponent(fullName);
  } catch {
    return 'Shablon fayl';
  }
};

const Assignments = () => {
  const [searchParams] = useSearchParams();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [loading, setLoading] = useState(true);
  
  // Modallar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    group_id: initialGroupId,
    title: '',
    description: '',
    template_file_url: '',
    template_file_name: '',
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    max_score: 100,
    allow_resubmission: true,
  });

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchAssignments(selectedGroupId);
    }
  }, [selectedGroupId]);

  const fetchInitial = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      const grps = res.data.groups || [];
      setGroups(grps);

      if (grps.length > 0 && !selectedGroupId) {
        setSelectedGroupId(String(grps[0].id));
        setFormData((prev) => ({ ...prev, group_id: grps[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (groupId) => {
    try {
      const res = await api.get(`/assignments/group/${groupId}`);
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploadingFile(true);
    try {
      const res = await api.post('/upload/file', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (isEdit) {
        setEditingAssignment((prev) => ({
          ...prev,
          template_file_url: res.data.file_url,
          template_file_name: file.name,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          template_file_url: res.data.file_url,
          template_file_name: file.name,
        }));
      }
    } catch (err) {
      alert("Fayl yuklashda xatolik yuz berdi");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        group_id: Number(formData.group_id),
        title: formData.title,
        description: formData.description || '',
        template_file_url: formData.template_file_url || null,
        start_date: formData.start_date || null,
        deadline: formData.deadline,
        max_score: Number(formData.max_score) || 100,
        allow_resubmission: formData.allow_resubmission,
      };

      if (!payload.group_id) {
        alert("Iltimos, guruhni tanlang!");
        return;
      }
      if (!payload.deadline) {
        alert("Iltimos, topshiriq muddatini kiriting!");
        return;
      }

      await api.post('/assignments', payload);
      setShowCreateModal(false);
      setFormData({
        group_id: selectedGroupId,
        title: '',
        description: '',
        template_file_url: '',
        template_file_name: '',
        start_date: new Date().toISOString().split('T')[0],
        deadline: '',
        max_score: 100,
        allow_resubmission: true,
      });
      fetchAssignments(selectedGroupId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Topshiriq yaratishda xatolik!");
    }
  };


  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${editingAssignment.id}`, {
        title: editingAssignment.title,
        description: editingAssignment.description,
        deadline: editingAssignment.deadline,
        max_score: Number(editingAssignment.max_score),
        template_file_url: editingAssignment.template_file_url,
      });
      setEditingAssignment(null);
      fetchAssignments(selectedGroupId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Tahrirlashda xatolik!");
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/assignments/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchAssignments(selectedGroupId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "O'chirishda xatolik!");
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Templates, rubrics and automation</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm w-64 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center cursor-pointer">
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            T
          </div>
        </div>
      </div>

      {/* Select Group Filter (Hidden in screenshot but needed for backend logic to work, so I'll place it elegantly) */}
      <div className="mb-6 max-w-sm">
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-sm w-full"
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.subject})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assignments & templates</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Reusable practical-work templates, rubrics and automated evaluation rules.
          </p>
        </div>
        <button 
          onClick={() => {
            setFormData((prev) => ({ ...prev, group_id: selectedGroupId }));
            setShowCreateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-sm transition-colors flex items-center space-x-1"
        >
          <span>+</span>
          <span>Create assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Col - Assignments List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Active assignments</h3>
            <p className="text-xs text-slate-500 font-medium">{assignments.length} live</p>
          </div>

          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-sm text-slate-500 py-4">No assignments yet.</div>
            ) : (
              assignments.map((a, idx) => (
                <div key={a.id} className={`border ${idx === 0 ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200'} rounded-xl p-5 flex items-center justify-between cursor-pointer transition-colors hover:border-blue-400`}>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{a.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">Practical Work · {a.max_score} pts</p>
                    <p className="text-[11px] text-slate-400 font-bold mt-2">Due {new Date(a.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {idx === 0 ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Auto-Score ON
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col - Details Mock */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">REST API yaratish</h3>
          <p className="text-xs text-slate-500 font-medium mb-8">Template: Practical Work v3</p>

          <div className="space-y-6 mb-10">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
                <span>Format</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
                <span>Implementation</span>
                <span className="text-blue-600">40 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
                <span>Explanation</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
                <span>Conclusion</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start space-y-3">
            <span className="bg-green-50 text-green-700 text-xs font-bold px-4 py-2 rounded-full">Auto-score enabled</span>
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-4 py-2 rounded-full">Similarity check</span>
            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-4 py-2 rounded-full">AI-writing signal</span>
          </div>

          <div className="mt-8">
            <button className="bg-blue-50 text-blue-600 text-xs font-bold px-6 py-2.5 rounded-full transition-colors hover:bg-blue-100">
              Save assignment
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">4 criteria · 100 points · AI evaluation + integrity checks enabled</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi Amaliy Topshiriq Yaratish"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Guruhi</label>
            <select
              value={formData.group_id}
              onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8] font-medium"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq / Amaliy ish Mavzusi</label>
            <input
              type="text"
              required
              placeholder="Masalan: 3-Amaliy ish. RESTful API arxitekturasi"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Tavsifi va Talablar</label>
            <textarea
              rows="3"
              placeholder="Talabalar nimalarga e'tibor qaratishi kerak..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topshiriq Shablon Fayli (PDF, DOCX yoki Rasm)
            </label>
            {formData.template_file_url ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-900 text-xs font-semibold truncate pr-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{formData.template_file_name || getFileNameFromUrl(formData.template_file_url)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, template_file_url: '', template_file_name: '' }))}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex-shrink-0"
                  >
                    O'chirish
                  </button>
                </div>
                <div className="flex items-center space-x-2 pt-1 border-t border-emerald-100">
                  <a
                    href={getFileUrl(formData.template_file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 py-1.5 px-3 bg-white border border-emerald-300 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100/60 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Yuklangan faylni tekshirish (Ochish)</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ AWS S3 ga muvaffaqiyatli yuklandi
                  </span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#1d58d8] transition-colors relative bg-slate-50/50">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, false)}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {uploadingFile ? (
                  <div className="py-2 text-xs font-semibold text-[#1d58d8] flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#1d58d8] border-t-transparent rounded-full animate-spin"></div>
                    <span>Fayl AWS S3 ga yuklanmoqda...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Shablon faylni yuklang</p>
                    <p className="text-[11px] text-slate-400">PDF, DOCX yoki rasm (AWS S3 ai/)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Boshlanish Sanasi</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline (Tugash sanasi)</label>
              <input
                type="datetime-local"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              Topshiriqni E'lon Qilish
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT ASSIGNMENT MODAL (TAHRIRLASH) */}
      <Modal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        title="Topshiriqni Tahrirlash"
      >
        {editingAssignment && (
          <form onSubmit={handleUpdateAssignment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Mavzusi</label>
              <input
                type="text"
                required
                value={editingAssignment.title}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Tavsifi</label>
              <textarea
                rows="3"
                value={editingAssignment.description || ''}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline (Tugash sanasi)</label>
                <input
                  type="datetime-local"
                  required
                  value={editingAssignment.deadline}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, deadline: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Maksimal Ball</label>
                <input
                  type="number"
                  required
                  value={editingAssignment.max_score}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, max_score: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
                />
              </div>
            </div>

            {/* Fayl yangilash / tekshirish */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shablon Fayl (AWS S3)
              </label>

              {editingAssignment.template_file_url ? (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-blue-900 font-semibold truncate pr-2">
                      <Paperclip className="w-4 h-4 text-[#1d58d8] flex-shrink-0" />
                      <span className="truncate">{getFileNameFromUrl(editingAssignment.template_file_url)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingAssignment(prev => ({ ...prev, template_file_url: '' }))}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex-shrink-0"
                    >
                      O'chirish
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 pt-1 border-t border-blue-100">
                    <a
                      href={getFileUrl(editingAssignment.template_file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 py-1 px-2.5 bg-white border border-blue-200 text-[#1d58d8] text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Faylni tekshirish (Ochish)</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                    <span className="text-[11px] text-slate-500">
                      Joriy biriktirilgan shablon
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center relative bg-slate-50/50 hover:border-[#1d58d8] transition-colors">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, true)}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-xs text-[#1d58d8] font-semibold flex items-center justify-center space-x-1.5">
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {uploadingFile 
                      ? "Fayl AWS S3 ga yuklanmoqda..." 
                      : (editingAssignment.template_file_url ? "Boshqa fayl yuklash" : "Yangi shablon fayl tanlash")}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                O'zgarishlarni Saqlash
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE ASSIGNMENT MODAL (O'CHIRISH) */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Trash2 className="w-7 h-7" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900">Topshiriqni o'chirishni tasdiqlaysizmi?</h3>
          <p className="text-sm text-slate-500">
            <strong className="text-slate-800">{deleteConfirm?.title}</strong> topshirig'i va unga topshirilgan barcha talabalar ishlari tizimdan o'chiriladi.
          </p>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleDeleteAssignment}
              className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all"
            >
              Ha, O'chirilsin
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assignments;
