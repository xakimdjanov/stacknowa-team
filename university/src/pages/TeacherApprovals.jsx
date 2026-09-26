import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  UserCheck,
  Check,
  X,
  KeyRound,
  ShieldCheck,
  Search,
  CheckCircle2,
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function TeacherApprovals() {
  const { user } = useAuth();
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');



  useEffect(() => {
    fetchPending();
    fetchFaculties();
  }, [user]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || user?.id || 'all';
      const res = await api.get(`/universities/${uniId}/pending-teachers`);
      if (res.data?.pendingTeachers) {
        setPendingTeachers(res.data.pendingTeachers);
      } else {
        setPendingTeachers([]);
      }
    } catch (err) {
      console.log("Fetch pending teachers error:", err.message);
      setPendingTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const uniId = user?.university_id || user?.id || '1';
      const res = await api.get(`/universities/${uniId}/structure`);
      if (res.data?.faculties) {
        setFaculties(res.data.faculties);
      }
    } catch (err) {
      console.log("Fetch faculties error:", err.message);
    }
  };

  const handleApprove = async () => {
    if (!selectedTeacher) return;
    try {
      await api.put(`/universities/teachers/${selectedTeacher.id}/approve`, {
        faculty_id: facultyId,
        department_id: departmentId
      });
      setPendingTeachers(pendingTeachers.filter(t => t.id !== selectedTeacher.id));
      setSelectedTeacher(null);
    } catch (err) {
      alert("Tasdiqlashda xatolik: " + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/universities/teachers/${id}/reject`);
      setPendingTeachers(pendingTeachers.filter(t => t.id !== id));
    } catch (err) {
      alert("Rad etishda xatolik: " + (err.response?.data?.error || err.message));
    }
  };

  const filtered = pendingTeachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">O'qituvchilarni Tasdiqlash (Approval Queue)</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Universitetingiz unique kodi ({user?.university_code || "TATU-9842"}) bilan ro'yxatdan o'tgan o'qituvchilarni tasdiqlash va kafedraga biriktirish
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPending}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-2 bg-indigo-50/80 text-indigo-700 font-bold px-4 py-2.5 rounded-xl border border-indigo-200/80 text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Kutilayotgan arizalar: {pendingTeachers.length} ta
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="O'qituvchi ismi yoki emaili bo'yicha izlash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
        />
      </div>

      {/* Pending Teachers Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Arizalar yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">Barcha arizalar tasdiqlangan!</h3>
            <p className="text-sm text-slate-500">Hozirda kutilayotgan yangi o'qituvchi arizalari mavjud emas.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold flex items-center justify-center flex-shrink-0 text-base shadow-sm shadow-indigo-500/20">
                    {t.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      {t.name}
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Kutilmoqda (PENDING)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{t.email}</p>
                    <div className="font-mono text-xs font-bold text-emerald-700 mt-1">Code: {t.university_code}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleReject(t.id)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Rad etish
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTeacher(t);
                      setFacultyId('1');
                      setDepartmentId('1');
                    }}
                    style={{ background: EMERALD_GRADIENT }}
                    className="px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Tasdiqlash & Biriktirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval & Faculty Assignment Modal */}
      {selectedTeacher && (
        <Modal onClose={() => setSelectedTeacher(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">O'qituvchini Tasdiqlash</h3>
                <p className="text-xs text-slate-500">Fakultet va Kafedrani tanlab biriktiring</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border space-y-1 text-xs">
              <div className="font-bold text-slate-800 text-sm">{selectedTeacher.name}</div>
              <div className="text-slate-500 font-medium">{selectedTeacher.email}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fakultetni Tanlang *</label>
                <select
                  value={facultyId}
                  onChange={(e) => {
                    setFacultyId(e.target.value);
                    const selectedFac = faculties.find(f => String(f.id) === String(e.target.value));
                    if (selectedFac?.departments?.length) {
                      setDepartmentId(String(selectedFac.departments[0].id));
                    } else {
                      setDepartmentId('');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none"
                >
                  <option value="">Fakultetni tanlang</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kafedrani Tanlang *</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none"
                >
                  <option value="">Kafedrani tanlang</option>
                  {faculties
                    .find((f) => String(f.id) === String(facultyId))
                    ?.departments?.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 border rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleApprove}
                style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Tasdiqlash & Kafedraga Biriktirish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
