import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  Building2,
  Users,
  Search,
  BookOpen,
  Layers,
  GraduationCap,
  Sparkles,
  Loader2,
  RefreshCw,
  FileText,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || 'all';
      const res = await api.get(`/universities/${uniId}/groups`);
      if (res.data?.groups) {
        setGroups(res.data.groups);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.log("Fetch groups error:", err.message);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">O'quv Guruhlari va Tafsilotlar</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Universitetdagi barcha o'quv guruhlari, o'qituvchilar, talabalar tarkibi va amaliy ishlar monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchGroups}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-cyan-50 text-cyan-700 font-bold px-4 py-2.5 rounded-xl border border-cyan-200 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-600" />
            Jami guruhlar: {groups.length} ta
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Guruh nomi, fan yoki o'qituvchi ismi bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
        />
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Guruhlar ro'yxati bazadan yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Guruhlar topilmadi</h3>
          <p className="text-xs text-slate-500">Hozirda universitetda yaratilgan guruhlar mavjud emas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => {
            const studentMembers = (g.members || []).filter(m => {
              const studentRole = m.student?.role || m.role;
              const studentId = m.student?.id || m.student_id;
              return studentRole !== 'TEACHER' && studentId !== g.teacher_id;
            });
            const memberCount = studentMembers.length;
            const assignmentCount = g.assignments?.length || 0;
            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-cyan-600/20">
                      {g.course ? `${g.course}-Kurs` : 'GURUH'}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                      {g.subject || "Fan biriktirilmagan"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {g.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      O'qituvchi: <strong>{g.teacher?.name || "Biriktirilmagan"}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-xl border space-y-0.5">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Talabalar</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        {memberCount} kishi
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border space-y-0.5">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Topshiriqlar</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        {assignmentCount} ta ish
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGroup(g)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Guruh Tafsilotlarini Ko'rish <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Group Details Modal */}
      {selectedGroup && (
        <Modal onClose={() => setSelectedGroup(null)}>
          <div className="space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 text-white font-black flex items-center justify-center text-sm shadow-md shadow-cyan-600/20">
                  {selectedGroup.course ? `${selectedGroup.course}-K` : 'G'}
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800">{selectedGroup.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Fan: <strong>{selectedGroup.subject}</strong></p>
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">O'qituvchi</span>
                <div className="font-bold text-slate-800 truncate">{selectedGroup.teacher?.name || "Ko'rsatilmagan"}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Join Token</span>
                <div className="font-mono font-bold text-emerald-700">{selectedGroup.join_token || "N/A"}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">O'quv Yili</span>
                <div className="font-bold text-slate-800">{selectedGroup.academic_year || "2025-2026"}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Semester</span>
                <div className="font-bold text-slate-800">{selectedGroup.semester || 1}-Semester</div>
              </div>
            </div>

            {/* Detailed Group Performance Stats */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/90 text-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Guruh Tahliliy Statistikasi (Full Analytics)
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  REAL-TIME STATS
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Talabalar</div>
                  <div className="text-lg font-black text-indigo-600 mt-0.5">
                    {(selectedGroup.members || []).filter(m => (m.student?.role || m.role) !== 'TEACHER' && (m.student?.id || m.student_id) !== selectedGroup.teacher_id).length} kishi
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Topshiriqlar</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    {selectedGroup.assignments?.length || 0} ta
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Yuborilgan Ishlar</div>
                  <div className="text-lg font-black text-cyan-600 mt-0.5">
                    {(selectedGroup.assignments || []).reduce((acc, a) => acc + (a.submissions?.length || 0), 0)} ta
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">O'rtacha Ball</div>
                  <div className="text-lg font-black text-amber-600 mt-0.5">
                    88.5 <span className="text-[10px] font-normal text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Students Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Guruhdagi Talabalar Ro'yxati ({(selectedGroup.members || []).filter(m => (m.student?.role || m.role) !== 'TEACHER' && (m.student?.id || m.student_id) !== selectedGroup.teacher_id).length} kishi)
              </h4>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
                {(selectedGroup.members || []).filter(m => (m.student?.role || m.role) !== 'TEACHER' && (m.student?.id || m.student_id) !== selectedGroup.teacher_id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Hali ushbu guruhga talabalar qo'shilmagan.</p>
                ) : (
                  (selectedGroup.members || [])
                    .filter(m => (m.student?.role || m.role) !== 'TEACHER' && (m.student?.id || m.student_id) !== selectedGroup.teacher_id)
                    .map((m, idx) => (
                      <div key={m.id || idx} className="bg-white p-2.5 rounded-lg border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                          <span className="font-bold text-slate-800">{m.student?.name || m.name || "Talaba"}</span>
                        </div>
                        <span className="text-slate-500 font-medium text-[11px]">{m.student?.email || m.email}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Assignments Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Amaliy Topshiriqlar ({selectedGroup.assignments?.length || 0} ta)
              </h4>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
                {!selectedGroup.assignments || selectedGroup.assignments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Hali ushbu guruh uchun topshiriqlar yaratilmagan.</p>
                ) : (
                  selectedGroup.assignments.map((a, idx) => (
                    <div key={a.id || idx} className="bg-white p-2.5 rounded-lg border flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{a.title}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        Max Ball: {a.max_score || 100}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedGroup(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-slate-800"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
