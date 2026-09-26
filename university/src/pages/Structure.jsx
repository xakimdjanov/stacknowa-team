import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Layers, Plus, Building2, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Structure() {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);

  const [facultyName, setFacultyName] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  useEffect(() => {
    fetchStructure();
  }, [user]);

  const fetchStructure = async () => {
    setLoading(true);
    try {
      const uniId = user?.university_id || 'all';
      const res = await api.get(`/universities/${uniId}/structure`);
      if (res.data?.faculties) {
        setFaculties(res.data.faculties);
      }
    } catch (err) {
      console.log("Fetch structure error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!facultyName) return;
    try {
      await api.post('/universities/faculties', {
        name: facultyName,
        code: facultyCode || facultyName.substring(0, 3).toUpperCase(),
        university_id: user?.university_id || undefined
      });
      setShowFacultyModal(false);
      setFacultyName('');
      setFacultyCode('');
      fetchStructure();
    } catch (err) {
      alert("Fakultet yaratishda xatolik: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!deptName || !selectedFacultyId) return;
    try {
      await api.post('/universities/departments', {
        name: deptName,
        code: deptCode || deptName.substring(0, 3).toUpperCase(),
        faculty_id: selectedFacultyId,
        university_id: user?.university_id || undefined
      });
      setShowDeptModal(false);
      setDeptName('');
      setDeptCode('');
      fetchStructure();
    } catch (err) {
      alert("Kafedra yaratishda xatolik: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fakultetlar va Kafedralar</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Universitet ichki tuzilmasi, akademik bo'limlar va o'qituvchilar taqsimoti
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFacultyModal(true)}
            style={{ background: EMERALD_GRADIENT }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yangi Fakultet Qo'shish
          </button>
        </div>
      </div>

      {/* Faculties Grid */}
      <div className="space-y-6">
        {faculties.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Faculty Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black flex items-center justify-center text-sm shadow-sm shadow-amber-500/20">
                  {f.code || f.name.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{f.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">Kafedralar: {f.departments.length} ta</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFacultyId(f.id);
                  setShowDeptModal(true);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-bold text-xs hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Kafedra Qo'shish
              </button>
            </div>

            {/* Departments List */}
            <div className="p-5">
              {f.departments.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium italic">Hali kafedralar qo'shilmagan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {f.departments.map((d) => (
                    <div key={d.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-emerald-300 transition-all">
                      <div>
                        <div className="font-bold text-xs text-slate-800">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">
                          Code: {d.code} • {d.teachersCount} ta O'qituvchi
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      {showFacultyModal && (
        <Modal onClose={() => setShowFacultyModal(false)}>
          <form onSubmit={handleAddFaculty} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg border-b pb-3">Yangi Fakultet Yaratish</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fakultet Nomi *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Kiberxavfsizlik Fakulteti"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qisqa Kodi (KIF/KXF)</label>
              <input
                type="text"
                placeholder="KXF"
                value={facultyCode}
                onChange={(e) => setFacultyCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm font-mono font-bold uppercase outline-none"
              />
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFacultyModal(false)}
                className="px-4 py-2 border rounded-xl font-semibold text-xs text-slate-600"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Fakultet Yaratish
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <Modal onClose={() => setShowDeptModal(false)}>
          <form onSubmit={handleAddDept} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg border-b pb-3">Yangi Kafedra Yaratish</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kafedra Nomi *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Sun'iy Intellekt Kafedrasi"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qisqa Kodi (AIK)</label>
              <input
                type="text"
                placeholder="AIK"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm font-mono font-bold uppercase outline-none"
              />
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 border rounded-xl font-semibold text-xs text-slate-600"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                style={{ background: EMERALD_GRADIENT }}
                className="px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Kafedra Yaratish
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
