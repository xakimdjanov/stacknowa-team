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
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Groups</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Create groups and share one invite</p>
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

      {/* Your Groups Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your groups</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Students join through one shared link or QR — no manual roster entry.
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-sm transition-colors flex items-center space-x-1"
        >
          <span>+</span>
          <span>New group</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {groups.length > 0 ? (
          groups.map(group => (
            <div key={group.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{group.name}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {group.members?.length || 0} students · {group.subject}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Active</span>
                  <Link 
                    to={`/assignments?groupId=${group.id}`}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex items-center justify-center"
                  >
                    Open group
                  </Link>
                  <button 
                    onClick={() => showQr(group.id)}
                    className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
                  >
                    Copy link
                  </button>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {new Date(group.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-sm text-slate-500 py-4">Hozircha guruhlar yo'q</div>
        )}
      </div>

      {/* Fast Onboarding Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center justify-between mb-8">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Fast onboarding</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Share a single invite with the whole class.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold text-blue-600">aipractice.uz/join/BACKEND101</span>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-5 py-1.5 rounded-full transition-colors">Copy link</button>
          </div>

          <div>
            <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">QR READY</span>
            <p className="text-xs text-slate-500 font-medium">32 successful joins · expires 31 Dec 2026</p>
          </div>
        </div>

        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center shrink-0">
           <span className="text-[10px] font-bold text-slate-400 text-center px-2">QR Code Space</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">12 active groups - 319 students - 86.4% average completion</span>
        <span className="text-blue-500">Synced just now</span>
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
            <QRCodeSVG value={selectedGroup?.join_token || selectedGroup?.group?.join_token || selectedGroup?.join_url || ""} size={170} />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-slate-500">Qo'shilish tokeni:</label>
            <div className="flex items-center space-x-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-800 truncate flex-1 text-left select-all">
                {selectedGroup?.join_token || selectedGroup?.group?.join_token || selectedGroup?.join_url}
              </span>
              <button
                onClick={() => copyToClipboard(selectedGroup?.join_token || selectedGroup?.group?.join_token || selectedGroup?.join_url)}
                className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#1d58d8] shadow-sm border border-slate-200 text-xs flex items-center space-x-1"
                title="Nusxalash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
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
