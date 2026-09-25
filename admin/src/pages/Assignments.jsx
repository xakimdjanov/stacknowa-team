import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles,
  BookOpen,
  Paperclip,
  ExternalLink,
  Eye
} from 'lucide-react';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modallar
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    max_score: 100,
    status: 'published',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments/all');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error("Topshiriqlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (a) => {
    setEditingAssignment(a);
    setFormData({
      title: a.title,
      description: a.description || '',
      deadline: a.deadline ? new Date(a.deadline).toISOString().slice(0, 16) : '',
      max_score: a.max_score,
      status: a.status,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${editingAssignment.id}`, formData);
      setEditingAssignment(null);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Tahrirlashda xatolik!");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/assignments/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "O'chirishda xatolik!");
    }
  };

  const filtered = assignments.filter((a) => {
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.group?.name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Topshiriqlar Boshqaruvi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Barcha o'qituvchilarning amaliy ishlari, muddatlari va mezonlarini tahrirlash hamda nazorat qilish.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Topshiriq yoki guruh bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Jami topshiriqlar: <strong className="text-slate-700">{filtered.length} ta</strong>
        </span>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Topshiriq Nomi</th>
                <th className="px-6 py-4">Guruh & O'qituvchi</th>
                <th className="px-6 py-4">Tugash Sanasi (Deadline)</th>
                <th className="px-6 py-4">Max Ball</th>
                <th className="px-6 py-4">Topshirganlar</th>
                <th className="px-6 py-4">Holati</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-sm">
                    Topshiriqlar topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{a.title}</p>
                      {a.template_file_url && (
                        <a
                          href={a.template_file_url.startsWith('http') ? a.template_file_url : `http://localhost:5000${a.template_file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-[#1d58d8] hover:underline font-semibold mt-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                        >
                          <Paperclip className="w-3 h-3 text-[#1d58d8]" />
                          <span>Shablon faylni ko'rish</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{a.group?.name || "Noma'lum guruh"}</p>
                      <p className="text-xs text-slate-400">{a.group?.teacher?.name || a.group?.teacher?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-rose-600">
                      {new Date(a.deadline).toLocaleDateString()} {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {a.max_score} ball
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {a.submissions?.length || 0} nafar
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        a.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(a)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT ASSIGNMENT MODAL */}
      <Modal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        title="Topshiriqni Tahrirlash"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Mavzusi</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Tavsifi</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline (Tugash sanasi)</label>
              <input
                type="datetime-local"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maksimal Ball</label>
              <input
                type="number"
                required
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topshiriq Holati</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-600 font-semibold"
            >
              <option value="published">Faol (published)</option>
              <option value="draft">Qoralama (draft)</option>
              <option value="closed">Yopilgan (closed)</option>
            </select>
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
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
            <strong className="text-slate-800">{deleteConfirm?.title}</strong> topshirig'i va unga biriktirilgan barcha baholashlar o'chiriladi.
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
              onClick={handleDelete}
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
