import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import { 
  Users, 
  Plus, 
  BookOpen, 
  ArrowRight, 
  Mail, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal holatlari
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [requiresAccessCode, setRequiresAccessCode] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/student');
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    setJoining(true);

    try {
      let token = joinToken.trim();
      if (token.includes('/join/')) {
        token = token.split('/join/').pop();
      }

      const res = await api.post(`/groups/join/${token}`, {
        access_code: accessCode.trim(),
      });
      setJoinSuccess(res.data.message || "Guruhga muvaffaqiyatli qo'shildingiz!");
      setJoinToken('');
      setAccessCode('');
      setRequiresAccessCode(false);
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess('');
        fetchGroups();
      }, 1200);
    } catch (err) {
      if (err.response?.data?.requires_access_code) {
        setRequiresAccessCode(true);
      }
      setJoinError(err.response?.data?.message || err.message || "Guruhga qo'shilishda xatolik");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mening Guruhlarim</h1>
          <p className="text-sm text-slate-500 mt-1">
            Siz a'zo bo'lgan barcha fan guruhlari va o'qituvchilar ro'yxati.
          </p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-indigo-600/20 text-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Guruhga Qo'shilish</span>
        </button>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Guruhlar yuklanmoqda...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-semibold text-slate-700">Siz hali hech qanday guruhga a'zo emassiz</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            O'qituvchingiz taqdim etgan taklif kodi yoki havolasi orqali guruhga qo'shiling va topshiriqlarni boshlang.
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="mt-2 inline-flex items-center space-x-2 bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-2xl text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Guruhga Ulanish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                    {g.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ID: #{g.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{g.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {g.description || "Guruh tavsifi kiritilmagan"}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>O'qituvchi: <strong className="text-slate-800">{g.teacher?.name || "O'qituvchi"}</strong></span>
                  </div>
                  {g.teacher?.email && (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{g.teacher.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/assignments?groupId=${g.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Topshiriqlarni Ko'rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JOIN GROUP MODAL */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Guruhga Qo'shilish"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Guruh Taklif Kodi yoki Havolasi
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: 3f8a9b1c yoki to'liq havola"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-indigo-600 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              O'qituvchingiz bergan taklif kodini kiriting va guruhdagi topshiriqlarni oching.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Guruh Paroli (Access Code)</span>
              <span className={`text-[11px] ${requiresAccessCode ? 'text-indigo-600 font-bold' : 'text-slate-400 font-normal'}`}>
                {requiresAccessCode ? "Parol kiritilishi shart" : "Ixtiyoriy"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Agar o'qituvchi parol o'rnatgan bo'lsa kiriting"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className={`w-full border rounded-2xl p-3 text-sm focus:outline-none transition-all font-medium ${
                requiresAccessCode 
                  ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-200' 
                  : 'border-slate-200 focus:border-indigo-600'
              }`}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Agar guruh parolsiz bo'lsa, ushbu maydonni bo'sh qoldiring.
            </p>
          </div>

          {joinError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{joinError}</span>
            </div>
          )}

          {joinSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{joinSuccess}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={joining || !joinToken.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {joining ? "Ulanmoqda..." : "Guruhga a'zo bo'lish"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;
