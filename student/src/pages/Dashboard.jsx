import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Plus,
  FileText,
  AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join group modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [requiresAccessCode, setRequiresAccessCode] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Talabaning guruhlarini olamiz
      const grpRes = await api.get('/groups/student');
      const studentGroups = grpRes.data.groups || [];
      setGroups(studentGroups);

      // Har bir guruhdan topshiriqlarni yuklaymiz
      const allAssignments = [];
      for (const grp of studentGroups) {
        try {
          const assignRes = await api.get(`/assignments/group/${grp.id}`);
          const grpAssignments = assignRes.data.assignments || [];
          grpAssignments.forEach(a => {
            allAssignments.push({ ...a, group_name: grp.name, subject: grp.subject });
          });
        } catch (e) {
          console.error(e);
        }
      }
      setAssignments(allAssignments);
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
        fetchDashboardData();
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

  const totalGroups = groups.length;
  const totalAssignments = assignments.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white shadow-xl shadow-indigo-600/10 overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>AI Yordamida Tezkor Baholash</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Amaliy Mashg'ulotlaringizni Boshlang
            </h1>
            <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
              O'qituvchingiz biriktirgan mavzular bo'yicha raqamli daftarchani to'ldiring va sun'iy intellektdan xolis baho oling.
            </p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-indigo-700 font-bold py-3 px-6 rounded-2xl shadow-lg shadow-black/10 text-sm transition-all self-start md:self-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Guruhga Qo'shilish</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">A'zo Guruhlar</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalGroups}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topshiriqlar</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalAssignments}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topshirildi</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
              {assignments.filter(a => a.submissions && a.submissions.length > 0).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Holati</p>
            <p className="text-base font-bold text-purple-700 mt-1">Avtomatik Faol</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Groups & Recent Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Kutilayotgan Amaliy Ishlar</h2>
              <p className="text-xs text-slate-500">Muddati yaqinlashayotgan topshiriqlarni bajaring</p>
            </div>
            <Link to="/assignments" className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1">
              <span>Barchasini ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Yuklanmoqda...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Hozircha amaliy ishlar mavjud emas</p>
              <p className="text-xs text-slate-400">O'qituvchingiz guruhiga a'zo bo'ling va yangi vazifalarni kuting</p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 font-semibold py-2 px-4 rounded-xl text-xs hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Guruhga a'zo bo'lish</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((a) => {
                const isDeadlinePassed = new Date(a.deadline) < new Date();
                return (
                  <div
                    key={a.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {a.group_name} • {a.subject}
                        </span>
                        {a.template_file_url && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            Shablon fayl bor
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className={isDeadlinePassed ? "text-rose-600 font-semibold" : ""}>
                            Muddat: {new Date(a.deadline).toLocaleDateString()} {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                        <span className="font-semibold text-slate-700">Max: {a.max_score} ball</span>
                      </div>
                    </div>

                    <Link
                      to={`/whitepaper/${a.id}`}
                      className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-sm shadow-indigo-600/20 text-xs transition-all flex-shrink-0"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Daftarni Ochish</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: My Groups List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mening Guruhlarim</h2>
            <Link to="/groups" className="text-xs font-bold text-indigo-600 hover:underline">
              Barchasi
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            {groups.length === 0 ? (
              <div className="text-center py-6">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Hech qaysi guruhga a'zo emassiz</p>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
                >
                  + Kod orqali guruhga ulanish
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{g.name}</h4>
                    <p className="text-xs text-slate-500">{g.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">O'qituvchi: {g.teacher?.name || "O'qituvchi"}</p>
                  </div>
                  <Link
                    to={`/assignments?groupId=${g.id}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    title="Vazifalarni ko'rish"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
              placeholder="Masalan: abc123xy yoki taklif havolasi"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-indigo-600 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              O'qituvchingiz yuborgan taklif kodi yoki to'liq ulanish havolasini kiriting.
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

export default Dashboard;
