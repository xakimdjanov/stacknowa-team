import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Search,
  Plus,
  QrCode,
  Copy,
  Check,
  Trash2,
  UserX,
  Layers,
  FileText,
  Sparkles,
  BarChart3,
  Share2,
  Loader2,
  Save,
  ShieldCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'assignments' | 'analytics'

  // Davomat holati (Attendance state)
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [attendanceData, setAttendanceData] = useState({}); // { student_id: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }
  const [attendanceNotes, setAttendanceNotes] = useState({});
  const [overallStats, setOverallStats] = useState({});
  const [totalRecordedDays, setTotalRecordedDays] = useState(0);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PRESENT, ABSENT, LATE

  const [savingAttendance, setSavingAttendance] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modallar
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    fetchGroupDetail();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [id, selectedDate]);

  const fetchGroupDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/groups/${id}`);
      setGroup(res.data.group || null);
    } catch (err) {
      console.error(err);
      alert("Guruh ma'lumotlarini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForDate = async (date) => {
    try {
      const res = await api.get(`/groups/${id}/attendance?date=${date}`);
      const records = res.data.records || [];
      const statsMap = res.data.statsByStudent || {};
      setOverallStats(statsMap);
      setTotalRecordedDays(res.data.total_days || 0);

      // Populate current date attendance state
      const initialAtt = {};
      const initialNotes = {};
      records.forEach((r) => {
        initialAtt[r.student_id] = r.status;
        if (r.note) initialNotes[r.student_id] = r.note;
      });

      setAttendanceData(initialAtt);
      setAttendanceNotes(initialNotes);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Davomat statusini o'zgartirish
  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Hamma talabalarni PRESENT deb belgilash
  const handleMarkAllPresent = () => {
    if (!group?.members) return;
    const updated = { ...attendanceData };
    group.members.forEach((m) => {
      updated[m.student_id] = 'PRESENT';
    });
    setAttendanceData(updated);
    showToast("Barcha talabalar 'Keldi' deb belgilandi");
  };

  // Davomatni bazaga saqlash
  const handleSaveAttendance = async () => {
    if (!group?.members) return;
    setSavingAttendance(true);
    try {
      const recordsPayload = group.members.map((m) => ({
        student_id: m.student_id,
        status: attendanceData[m.student_id] || 'PRESENT',
        note: attendanceNotes[m.student_id] || '',
      }));

      await api.post(`/groups/${id}/attendance`, {
        date: selectedDate,
        records: recordsPayload,
      });

      showToast(`Davomat (${selectedDate}) muvaffaqiyatli saqlandi! ✅`);
      fetchAttendanceForDate(selectedDate);
    } catch (err) {
      alert(err.response?.data?.message || "Davomatni saqlashda xatolik yuz berdi");
    } finally {
      setSavingAttendance(false);
    }
  };

  // Yangi talaba qo'shish
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentEmail) return;
    setAddingStudent(true);
    try {
      const res = await api.post(`/groups/${id}/add-student`, {
        email: newStudentEmail,
        name: newStudentName,
      });
      showToast(res.data.message || "Talaba muvaffaqiyatli qo'shildi!");
      setNewStudentEmail('');
      setNewStudentName('');
      setShowAddStudentModal(false);
      fetchGroupDetail();
      fetchAttendanceForDate(selectedDate);
    } catch (err) {
      alert(err.response?.data?.message || "Talabani qo'shishda xatolik");
    } finally {
      setAddingStudent(false);
    }
  };

  // Talabani guruhdan o'chirish
  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`${studentName || 'Talaba'}ni ushbu guruhdan o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await api.delete(`/groups/${id}/members/${studentId}`);
      showToast("Talaba guruhdan chiqarildi");
      fetchGroupDetail();
      fetchAttendanceForDate(selectedDate);
    } catch (err) {
      alert(err.response?.data?.message || "O'chirishda xatolik");
    }
  };

  const copyLink = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Sanani oldingi / keyingi kunga surish
  const shiftDate = (days) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Guruh ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-900">Guruh topilmadi</h2>
        <p className="text-xs text-slate-500 mt-2 mb-4">Ushbu guruh o'chirilgan yoki sizda ko'rish ruxsati yo'q.</p>
        <Link to="/groups" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
          Guruhlarga qaytish
        </Link>
      </div>
    );
  }

  const members = group.members || [];
  const assignments = group.assignments || [];

  // Filtered members by search
  const filteredMembers = members.filter((m) => {
    const sName = m.student?.name || '';
    const sEmail = m.student?.email || '';
    const matchesSearch =
      sName.toLowerCase().includes(search.toLowerCase()) ||
      sEmail.toLowerCase().includes(search.toLowerCase());

    const currentStatus = attendanceData[m.student_id] || 'PRESENT';
    const matchesStatus = filterStatus === 'ALL' || currentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Today's attendance counts
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  members.forEach((m) => {
    const st = attendanceData[m.student_id] || 'PRESENT';
    if (st === 'PRESENT') presentCount++;
    else if (st === 'ABSENT') absentCount++;
    else if (st === 'LATE') lateCount++;
    else if (st === 'EXCUSED') excusedCount++;
  });

  const attendanceRate = members.length > 0 ? Math.round(((presentCount + lateCount) / members.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 pt-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Link
              to="/groups"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Guruhlarga qaytish</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>QR Kod & Taklif</span>
              </button>

              <button
                onClick={() => setShowAddStudentModal(true)}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Talaba Qo'shish</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                  {group.course}-kurs
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {group.semester}-semestr
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {group.academic_year}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span>{group.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{group.subject}</span>
                {group.faculty && <span>· {group.faculty}</span>}
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
              <div className="text-center px-3 border-r border-slate-200">
                <p className="text-xs text-slate-400 font-bold uppercase">Talabalar</p>
                <p className="text-lg font-black text-slate-900">{members.length}</p>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <p className="text-xs text-slate-400 font-bold uppercase">Davomat Rate</p>
                <p className="text-lg font-black text-emerald-600">{attendanceRate}%</p>
              </div>
              <div className="text-center px-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Vazifalar</p>
                <p className="text-lg font-black text-purple-600">{assignments.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-5 py-3.5 text-xs font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'attendance'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Talabalar va Davomat</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-5 py-3.5 text-xs font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'assignments'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Guruh Topshiriqlari</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
              {assignments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-3.5 text-xs font-black transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistika & Tahlil</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* TAB 1: ATTENDANCE & ROSTER */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* DATE & QUICK STATS CONTROL BAR */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Date Navigation */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                    <button
                      onClick={() => shiftDate(-1)}
                      className="p-2 hover:bg-white rounded-xl text-slate-600 transition-all cursor-pointer shadow-2xs"
                      title="Oldingi kun"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="px-3 py-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-xs sm:text-sm font-black text-slate-900 outline-none cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => shiftDate(1)}
                      className="p-2 hover:bg-white rounded-xl text-slate-600 transition-all cursor-pointer shadow-2xs"
                      title="Keyingi kun"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedDate(getTodayString())}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedDate === getTodayString()
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Bugun
                  </button>
                </div>

                {/* Actions & Mark All Present */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllPresent}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hamma keldi deb belgilash</span>
                  </button>

                  <button
                    onClick={handleSaveAttendance}
                    disabled={savingAttendance}
                    style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                    className="px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {savingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Davomatni Saqlash</span>
                  </button>
                </div>
              </div>

              {/* Status Breakdown Chips for selected date */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-900 leading-none">{presentCount}</p>
                    <p className="text-[10px] font-bold text-emerald-700 mt-0.5">Kelganlar</p>
                  </div>
                </div>

                <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-rose-900 leading-none">{absentCount}</p>
                    <p className="text-[10px] font-bold text-rose-700 mt-0.5">Kelmaganlar</p>
                  </div>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-amber-900 leading-none">{lateCount}</p>
                    <p className="text-[10px] font-bold text-amber-700 mt-0.5">Kechikkanlar</p>
                  </div>
                </div>

                <div className="bg-sky-50/60 border border-sky-200/60 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-sky-900 leading-none">{excusedCount}</p>
                    <p className="text-[10px] font-bold text-sky-700 mt-0.5">Sababli</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROSTER TABLE & SEARCH */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Table Header Filter & Search */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Talabalar ismi yoki emaili bo'yicha qidiruv..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Filter by status */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
                  {[
                    { label: 'Barchasi', value: 'ALL' },
                    { label: 'Kelgan', value: 'PRESENT' },
                    { label: 'Kelmagan', value: 'ABSENT' },
                    { label: 'Kechikkan', value: 'LATE' },
                  ].map((st) => (
                    <button
                      key={st.value}
                      onClick={() => setFilterStatus(st.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        filterStatus === st.value
                          ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              {filteredMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-200/80">
                        <th className="px-6 py-4">#</th>
                        <th className="px-6 py-4">Talaba</th>
                        <th className="px-6 py-4">Davomat Holati ({selectedDate})</th>
                        <th className="px-6 py-4 text-center">Umumiy Davomat (%)</th>
                        <th className="px-6 py-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {filteredMembers.map((member, idx) => {
                        const student = member.student || {};
                        const stId = member.student_id;
                        const currentStatus = attendanceData[stId] || 'PRESENT';

                        // Overall stats per student
                        const studentStats = overallStats[stId] || { present: 0, absent: 0, late: 0, total: 0 };
                        const totalDays = totalRecordedDays || 1;
                        const studentPres = (studentStats.present || 0) + (studentStats.late || 0);
                        const pct = totalRecordedDays > 0 ? Math.round((studentPres / totalRecordedDays) * 100) : 100;

                        return (
                          <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <Link
                                to={`/students/${stId || 'st-001'}?group=${id}`}
                                className="flex items-center gap-3 group/item hover:opacity-90 transition-opacity cursor-pointer"
                                title="Talaba shaxsiy tahliliga o'tish (User Detail)"
                              >
                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center uppercase shrink-0 border border-emerald-200 group-hover/item:scale-105 transition-transform">
                                  {student.name ? student.name.charAt(0) : 'T'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-slate-900 text-sm group-hover/item:text-emerald-600 transition-colors">
                                      {student.name || 'Talaba'}
                                    </p>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      Detail →
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-mono">{student.email || '-'}</p>
                                </div>
                              </Link>
                            </td>

                            {/* Davomat Buttons */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleStatusChange(stId, 'PRESENT')}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border ${
                                    currentStatus === 'PRESENT'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Keldi</span>
                                </button>

                                <button
                                  onClick={() => handleStatusChange(stId, 'ABSENT')}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border ${
                                    currentStatus === 'ABSENT'
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                                  }`}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Kelmadi</span>
                                </button>

                                <button
                                  onClick={() => handleStatusChange(stId, 'LATE')}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border ${
                                    currentStatus === 'LATE'
                                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                                  }`}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Kechikdi</span>
                                </button>

                                <button
                                  onClick={() => handleStatusChange(stId, 'EXCUSED')}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border ${
                                    currentStatus === 'EXCUSED'
                                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700'
                                  }`}
                                >
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Sababli</span>
                                </button>
                              </div>
                            </td>

                            {/* Overall Attendance Progress */}
                            <td className="px-6 py-4 text-center min-w-[160px]">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                  <div
                                    className={`h-full transition-all rounded-full ${
                                      pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className={`font-mono font-bold text-xs ${
                                  pct >= 85 ? 'text-emerald-700' : pct >= 70 ? 'text-amber-700' : 'text-rose-700'
                                }`}>
                                  {pct}%
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  to={`/students/${stId || 'st-001'}?group=${id}`}
                                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Talabaning qiynalayotgan fani va mavzularini ko'rish"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>Tahlil</span>
                                </Link>

                                <button
                                  onClick={() => handleRemoveStudent(stId, student.name)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                  title="Talabani guruhdan chiqarish"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    {search ? "Qidiruv bo'yicha talabalar topilmadi" : "Guruhda hali talabalar yo'q"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Talabalarni email orqali qo'shing yoki QR-kod/linkni tarqating.
                  </p>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Talaba Qo'shish
                  </button>
                </div>
              )}

              {/* Table Footer Save Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Jami: <strong>{members.length}</strong> ta talaba
                </span>

                <button
                  onClick={handleSaveAttendance}
                  disabled={savingAttendance}
                  style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                  className="px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>O'zgarishlarni Saqlash</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Guruh Topshiriqlari</h3>
                <p className="text-xs text-slate-500">Ushbu guruh talabalari uchun ajratilgan topshiriqlar ro'yxati</p>
              </div>
              <Link
                to={`/assignments?groupId=${group.id}&create=true`}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/20 hover:opacity-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Topshiriq Yaratish</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.length > 0 ? (
                assignments.map((assign) => (
                  <div key={assign.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black uppercase">
                        {assign.difficulty || 'Oddiy'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {assign.due_date ? new Date(assign.due_date).toLocaleDateString() : 'Muddatsiz'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base">{assign.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{assign.description || 'Tavsif ko\'rsatilmagan'}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">
                        {assign.max_score || 100} ball
                      </span>
                      <Link
                        to={`/assignments?id=${assign.id}`}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Batafsil →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Ushbu guruhda hali topshiriqlar yaratilmagan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">O'rtacha Davomat</p>
                <h2 className="text-3xl font-black text-emerald-600">{attendanceRate}%</h2>
                <p className="text-xs text-slate-500">Jami davomati ko'rsatkichi yaxshi holatda.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qayd etilgan Dars kunlari</p>
                <h2 className="text-3xl font-black text-slate-900">{totalRecordedDays} kun</h2>
                <p className="text-xs text-slate-500">Bazada belgilangan dars mashg'ulotlari soni.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">A'zo Talabalar Soni</p>
                <h2 className="text-3xl font-black text-slate-900">{members.length} nafar</h2>
                <p className="text-xs text-slate-500">Guruhda faol ro'yxatdan o'tganlar.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD STUDENT */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Guruhga Yangi Talaba Qo'shish"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Talaba Emaili <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="masalan: talaba@tuit.uz"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Talaba Ismi Sharif (Ixtiyoriy)
            </label>
            <input
              type="text"
              placeholder="masalan: Sardor Alimov"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={addingStudent}
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {addingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Qo'shish</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: QR & SHARE */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title={`${group.name} - QR & Taklif Kodi`}
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Talabalar ushbu QR-kodni telefon kamerasi bilan skanerlab guruhga bir zumda a'zo bo'lishlari mumkin.
          </p>

          <div className="p-5 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl inline-block mx-auto">
            <QRCodeSVG
              value={`${window.location.origin}/join/${group.join_token}`}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-1.5 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Taklif Tokeni
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700 truncate flex-1 select-all">
                {group.join_token}
              </span>
              <button
                onClick={() => copyLink(group.join_token)}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? "Nusxalandi" : "Nusxalash"}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowQrModal(false)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Yopish
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupDetail;
