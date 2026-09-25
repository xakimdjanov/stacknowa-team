import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Layers, 
  Plus, 
  QrCode, 
  Users, 
  Calendar, 
  Copy, 
  Check, 
  Key, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    course: 1,
    faculty: '',
    academic_year: '2025-2026',
    semester: 1,
    access_code: '',
    allowed_email_domain: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups', formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        subject: '',
        course: 1,
        faculty: '',
        academic_year: '2025-2026',
        semester: 1,
        access_code: '',
        allowed_email_domain: '',
      });
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Guruh yaratishda xatolik!");
    }
  };

  const showQr = async (id) => {
    try {
      const res = await api.get(`/groups/${id}`);
      setSelectedGroup(res.data);
      setCopied(false);
    } catch (err) {
      alert("Ma'lumotlarni yuklab bo'lmadi");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Akademik Guruhlarim</h1>
          <p className="text-sm text-slate-500 mt-1">
            Guruhlar yarating, talabalar uchun QR-kod yoki havola oling.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-blue-500/20 text-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Guruh Yaratish</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1d58d8] border border-blue-100">
                  {g.course}-kurs | {g.academic_year}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {g.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{g.name}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{g.subject}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Talabalar soni:</span>
                  <span className="font-semibold text-slate-900">{g.members?.length || 0} nafar</span>
                </div>
                <div className="flex justify-between">
                  <span>Topshiriqlar:</span>
                  <span className="font-semibold text-slate-900">{g.assignments?.length || 0} ta</span>
                </div>
                {g.access_code && (
                  <div className="flex justify-between">
                    <span>Guruh kodi (Parol):</span>
                    <span className="font-mono text-[#1d58d8] font-bold">{g.access_code}</span>
                  </div>
                )}
                {g.allowed_email_domain && (
                  <div className="flex justify-between">
                    <span>Faqat domen:</span>
                    <span className="font-mono text-slate-700">@{g.allowed_email_domain}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/assignments?groupId=${g.id}`}
                className="text-xs font-bold text-[#1d58d8] hover:underline"
              >
                Topshiriqlar ({g.assignments?.length || 0})
              </Link>
              <button
                onClick={() => showQr(g.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>QR & Link</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE GROUP MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi Guruh Yaratish"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Guruh Nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: TATU 210-21 guruh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fan Nomi</label>
            <input
              type="text"
              required
              placeholder="Masalan: Sun'iy Intellekt Asoslari"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kurs</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semestr</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              >
                <option value={1}>1-semestr</option>
                <option value={2}>2-semestr</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">O'quv Yili</label>
              <input
                type="text"
                required
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kirish Kodi (Access Code)
              </label>
              <input
                type="text"
                placeholder="Ixtiyoriy parol"
                value={formData.access_code}
                onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#1d58d8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faqat Email Domen
              </label>
              <input
                type="text"
                placeholder="Masalan: tuit.uz"
                value={formData.allowed_email_domain}
                onChange={(e) => setFormData({ ...formData, allowed_email_domain: e.target.value })}
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
              Guruhni Yaratish
            </button>
          </div>
        </form>
      </Modal>

      {/* QR CODE & LINK MODAL */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.group?.name}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-slate-500">
            Talabalar ushbu QR-kodni skaner qilib yoki havola orqali guruhga mustaqil qo'shiladi.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block my-2">
            <QRCodeSVG value={selectedGroup?.join_url || "https://aipractice.uz"} size={170} />
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-mono text-slate-700 truncate flex-1 text-left">
              {selectedGroup?.join_url}
            </span>
            <button
              onClick={() => copyToClipboard(selectedGroup?.join_url)}
              className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#1d58d8] shadow-sm border border-slate-200 text-xs flex items-center space-x-1"
              title="Nusxalash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {selectedGroup?.group?.access_code && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800">
              Kirish kodi: <strong className="font-mono text-sm">{selectedGroup.group.access_code}</strong>
            </div>
          )}

          <button
            onClick={() => setSelectedGroup(null)}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Yopish
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
