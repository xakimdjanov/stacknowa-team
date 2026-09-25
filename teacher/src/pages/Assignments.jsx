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
  CheckCircle2, 
  FileText, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Download,
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  Layers,
  Award,
  Check,
  ChevronRight
} from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '');
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getFileNameFromUrl = (url) => {
  if (!url) return 'Shablon fayl';
  try {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    return decodeURIComponent(fullName);
  } catch {
    return 'Shablon fayl';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Belgilanmagan';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const isDeadlinePassed = (deadlineStr) => {
  if (!deadlineStr) return false;
  return new Date(deadlineStr) < new Date();
};

const getRemainingTime = (deadlineStr) => {
  if (!deadlineStr) return '';
  const diff = new Date(deadlineStr) - new Date();
  if (diff <= 0) return 'Muddati tugagan';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days} kun ${hours} soat qoldi`;
  return `${hours} soat qoldi`;
};

const Assignments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'EXPIRED'

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
        const firstId = String(grps[0].id);
        setSelectedGroupId(firstId);
        setFormData((prev) => ({ ...prev, group_id: firstId }));
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
      const list = res.data.assignments || [];
      setAssignments(list);
      if (list.length > 0) {
        setSelectedAssignmentId(list[0].id);
      } else {
        setSelectedAssignmentId(null);
      }
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

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = 
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const passed = isDeadlinePassed(a.deadline);
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'ACTIVE' ? !passed :
      statusFilter === 'EXPIRED' ? passed : true;

    return matchesSearch && matchesStatus;
  });

  const selectedGroup = groups.find((g) => String(g.id) === String(selectedGroupId));
  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0] || null;

  // Stats calculation
  const totalAssignmentsCount = assignments.length;
  const activeCount = assignments.filter((a) => !isDeadlinePassed(a.deadline)).length;
  const expiredCount = assignments.filter((a) => isDeadlinePassed(a.deadline)).length;
  const totalSubmissionsCount = assignments.reduce((acc, a) => acc + (a.submissions?.length || 0), 0);

  return (
    <div className="min-h-full bg-slate-50">
      
      {/* ══════════════════════════════════════════════
          HERO HEADER SECTION
      ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 sm:pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  Topshiriqlar Boshqaruvi
                </span>
                {selectedGroup && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {selectedGroup.name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Amaliy Topshiriqlar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Laboratoriya ishlari, shablon fayllar, mezonlar va avtomatlashtirilgan AI baholash
              </p>
            </div>

            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, group_id: selectedGroupId || (groups[0]?.id ? String(groups[0].id) : '') }));
                setShowCreateModal(true);
              }}
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-extrabold text-sm shadow-lg shadow-emerald-700/25 hover:opacity-95 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Topshiriq Yaratish</span>
            </button>
          </div>

          {/* 4 STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Jami Topshiriqlar</span>
                <Layers className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {totalAssignmentsCount}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Joriy guruhda e'lon qilingan</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Faol Qabul</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {activeCount}
              </div>
              <p className="text-[11px] text-emerald-700/80 font-medium mt-0.5">Talabalar ish topshirishi mumkin</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Muddati Tugagan</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-700">
                {expiredCount}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Qabul vaqti yakunlangan</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                <span>Topshirilgan Ishlar</span>
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-violet-600">
                {totalSubmissionsCount}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Talabalar javoblari</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CONTROLS & GROUP SELECTOR
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Group Selector Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden sm:inline">
              Guruh:
            </span>
            <div className="relative flex-1 sm:w-72">
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setFormData((prev) => ({ ...prev, group_id: e.target.value }));
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 pl-3.5 pr-8 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-xs"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.subject} ({g.members?.length || 0} talaba)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Topshiriq qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto justify-center">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Barchasi
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Faol
              </button>
              <button
                onClick={() => setStatusFilter('EXPIRED')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'EXPIRED'
                    ? 'bg-white text-slate-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Muddati o'tgan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA (2 COLUMN)
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 font-semibold shadow-xs">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Topshiriqlar yuklanmoqda...
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {assignments.length === 0 ? "Topshiriqlar mavjud emas" : "Qidiruv natijasida hech narsa topilmadi"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              {assignments.length === 0 
                ? "Ushbu guruh talabalari uchun yangi amaliy ish yoki topshiriq e'lon qiling."
                : "Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang."}
            </p>
            {assignments.length === 0 ? (
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, group_id: selectedGroupId }));
                  setShowCreateModal(true);
                }}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Birinchi topshiriqni yaratish</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: ASSIGNMENT CARDS LIST (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Topshiriqlar ({filteredAssignments.length})
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Tanlash uchun bosing
                </span>
              </div>

              {filteredAssignments.map((a) => {
                const isSelected = activeAssignment?.id === a.id;
                const passed = isDeadlinePassed(a.deadline);
                const submissionCount = a.submissions?.length || 0;

                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAssignmentId(a.id)}
                    className={`group relative rounded-2xl p-4 sm:p-5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {passed ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wide">
                              Muddati o'tgan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Faol Qabul
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-400">
                            {a.max_score} ball
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {a.title}
                        </h3>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform flex-shrink-0 ${isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    </div>

                    {a.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {a.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={passed ? "text-slate-400" : "text-emerald-700 font-bold"}>
                          {getRemainingTime(a.deadline)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {a.template_file_url && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Paperclip className="w-3 h-3" />
                            Shablon bor
                          </span>
                        )}
                        <span className="text-[11px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                          {submissionCount} topshirdi
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT COLUMN: ASSIGNMENT DETAIL & ACTIONS INSPECTOR (7 cols) */}
            <div className="lg:col-span-7">
              {activeAssignment ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 sticky top-6">
                  
                  {/* Top Bar with Status and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      {isDeadlinePassed(activeAssignment.deadline) ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          Yakunlangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Qabul jarayoni faol
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-100">
                        {activeAssignment.max_score} Maksimal Ball
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAssignment(activeAssignment)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tahrirlash</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(activeAssignment)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="py-5">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                      {activeAssignment.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {activeAssignment.description || "Ushbu topshiriq uchun qo'shimcha tavsif berilmagan."}
                    </p>
                  </div>

                  {/* Timeline Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Boshlanish Sanasi
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                          {formatDate(activeAssignment.start_date || activeAssignment.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Tugash (Deadline)
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                          {formatDate(activeAssignment.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attached Template File (AWS S3) */}
                  {activeAssignment.template_file_url ? (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-black text-emerald-950 truncate">
                              {getFileNameFromUrl(activeAssignment.template_file_url)}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Topshiriq uchun biriktirilgan shablon fayl
                            </span>
                          </div>
                        </div>

                        <a
                          href={getFileUrl(activeAssignment.template_file_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 rounded-xl font-bold text-xs shadow-xs transition-colors flex-shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ochish</span>
                          <ExternalLink className="w-3 h-3 text-emerald-500" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Rubric Criteria Distribution */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Baholash Mezonlari (Rubric)
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        Jami: {activeAssignment.max_score} ball
                      </span>
                    </div>

                    <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>1. Mavzu va Maqsadni bayon etish</span>
                          <span className="text-emerald-700">15 ball</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>2. Nazariy tushunchalar va asoslar</span>
                          <span className="text-emerald-700">25 ball</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>3. Amaliy qism (Kod yoki hisobotlar)</span>
                          <span className="text-emerald-700">40 ball</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>4. Xulosa va tahlil</span>
                          <span className="text-emerald-700">20 ball</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Features & Bottom Action Button */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        AI avtomatik tekshiruv
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        Plagiat tahlili yoqilgan
                      </span>
                    </div>

                    <Link
                      to="/evaluations"
                      style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                      className="w-full py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all active:scale-98"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Topshirilgan Ishlarni Tekshirish ({activeAssignment.submissions?.length || 0})</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                </div>
              ) : null}
            </div>

          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          CREATE ASSIGNMENT MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi Amaliy Topshiriq Yaratish"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topshiriq Guruhi</label>
              <select
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topshiriq / Mavzu Nomi</label>
              <input
                type="text"
                required
                placeholder="Masalan: 3-Amaliy ish. RESTful API"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topshiriq Tavsifi va Talablar</label>
            <textarea
              rows="2"
              placeholder="Talabalar nimalarga e'tibor qaratishi kerak..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Topshiriq Shablon Fayli (PDF, DOCX yoki Rasm)
            </label>
            {formData.template_file_url ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate pr-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{formData.template_file_name || getFileNameFromUrl(formData.template_file_url)}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={getFileUrl(formData.template_file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 px-2.5 bg-white border border-emerald-300 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100/60 shadow-xs"
                  >
                    Ochish
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, template_file_url: '', template_file_name: '' }))}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-2.5 text-center transition-colors relative bg-slate-50/50 cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, false)}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {uploadingFile ? (
                  <div className="py-1 text-xs font-bold text-emerald-600 flex items-center justify-center space-x-2">
                    <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Fayl yuklanmoqda...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold py-1">
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Shablon faylni yuklang (PDF, DOCX yoki rasm)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Boshlanish Sanasi</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deadline (Tugash vaqti)</label>
              <input
                type="datetime-local"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maksimal Ball</label>
              <input
                type="number"
                required
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
            >
              Topshiriqni E'lon Qilish
            </button>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════
          EDIT ASSIGNMENT MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        title="Topshiriqni Tahrirlash"
        maxWidth="max-w-2xl"
      >
        {editingAssignment && (
          <form onSubmit={handleUpdateAssignment} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topshiriq Mavzusi</label>
              <input
                type="text"
                required
                value={editingAssignment.title}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topshiriq Tavsifi</label>
              <textarea
                rows="2"
                value={editingAssignment.description || ''}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deadline (Tugash sanasi)</label>
                <input
                  type="datetime-local"
                  required
                  value={editingAssignment.deadline ? new Date(editingAssignment.deadline).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, deadline: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Maksimal Ball</label>
                <input
                  type="number"
                  required
                  value={editingAssignment.max_score}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, max_score: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Fayl yangilash */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shablon Fayl
              </label>

              {editingAssignment.template_file_url ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate pr-2">
                    <Paperclip className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{getFileNameFromUrl(editingAssignment.template_file_url)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={getFileUrl(editingAssignment.template_file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-2.5 bg-white border border-emerald-300 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100/60 shadow-xs"
                    >
                      Ochish
                    </a>
                    <button
                      type="button"
                      onClick={() => setEditingAssignment(prev => ({ ...prev, template_file_url: '' }))}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="border border-dashed border-slate-200 rounded-xl p-2.5 text-center relative bg-slate-50/50 hover:border-emerald-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, true)}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5 py-1">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>
                    {uploadingFile 
                      ? "Fayl yuklanmoqda..." 
                      : (editingAssignment.template_file_url ? "Boshqa fayl yuklash" : "Yangi shablon fayl tanlash")}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
              >
                O'zgarishlarni Saqlash
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ══════════════════════════════════════════════
          DELETE ASSIGNMENT MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Trash2 className="w-7 h-7" />
          </div>
          
          <h3 className="text-lg font-black text-slate-900">Topshiriqni o'chirishni tasdiqlaysizmi?</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            <strong className="text-slate-800">{deleteConfirm?.title}</strong> topshirig'i va unga biriktirilgan talabalar ishlari tizimdan butunlay o'chiriladi.
          </p>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleDeleteAssignment}
              className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all"
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
