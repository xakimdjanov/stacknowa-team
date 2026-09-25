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
  ExternalLink,
  Search,
  BookOpen,
  GraduationCap,
  Share2,
  FileCheck2,
  Shield,
  Download,
  School,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

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
      alert(err.response?.data?.message || err.message || "Guruh yaratishda xatolik yuz berdi!");
    }
  };

  const showQr = async (id) => {
    try {
      const res = await api.get(`/groups/${id}`);
      setSelectedGroup(res.data);
    } catch (err) {
      // Fallback to local group data if single endpoint fails
      const found = groups.find((g) => g.id === id);
      if (found) setSelectedGroup({ group: found, join_token: found.join_token, join_url: `${window.location.origin}/join/${found.join_token}` });
      else alert("Ma'lumotlarni yuklab bo'lmadi");
    }
  };

  const copyToClipboard = (text, type = 'token') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(text);
      setTimeout(() => setCopiedToken(null), 2000);
    } else {
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Filter groups by search and course
  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      (g.name && g.name.toLowerCase().includes(search.toLowerCase())) ||
      (g.subject && g.subject.toLowerCase().includes(search.toLowerCase())) ||
      (g.faculty && g.faculty.toLowerCase().includes(search.toLowerCase())) ||
      (g.join_token && g.join_token.toLowerCase().includes(search.toLowerCase()));

    const matchesCourse = courseFilter === '' || Number(g.course) === Number(courseFilter);

    return matchesSearch && matchesCourse;
  });

  const totalMembers = groups.reduce((acc, g) => acc + (g.members?.length || 0), 0);
  const totalAssignments = groups.reduce((acc, g) => acc + (g.assignments?.length || 0), 0);
  const firstGroup = groups.length > 0 ? groups[0] : null;

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
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Guruhlar Boshqaruvi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  {groups.length} ta guruh
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Guruhlarim
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Guruhlarni boshqaring va talabalarni bir zumda a'zo qiling.
              </p>
            </div>

            {/* Create Group Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-extrabold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-700/25 hover:opacity-95 self-start md:self-auto flex-shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yangi Guruh Yaratish
            </button>
          </div>

          {/* Mini KPI Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">{groups.length}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Jami Guruhlar</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">{totalMembers}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Jami Talabalar</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">{totalAssignments}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Topshiriqlar</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">100%</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">QR Ulanish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* ── FAST ONBOARDING BANNER (TEZKOR QR TAKLIF) ── */}
        {firstGroup && (
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Tezkor Ulanish (Fast Onboarding)
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Talabalarni birgina QR-kod orqali auditoriyada guruhga qo'shing
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Ruxsat etilgan guruh: <strong className="text-white font-bold">{firstGroup.name}</strong> ({firstGroup.subject}). Talaba o'z telefonida kamerani ochib ushbu QR-kodni skaner qilishi kifoya.
                </p>

                {/* Quick token box */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs font-mono text-emerald-200 select-all">
                    Token: <strong className="text-white">{firstGroup.join_token}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(firstGroup.join_token, 'token')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {copiedToken === firstGroup.join_token ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Nusxalandi!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Tokenni nusxalash</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => showQr(firstGroup.id)}
                    style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Katta QR Kodni ko'rsatish</span>
                  </button>
                </div>
              </div>

              {/* Real QR Code Box */}
              <div
                onClick={() => showQr(firstGroup.id)}
                className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center self-start md:self-auto cursor-pointer group hover:scale-105 transition-transform"
                title="Kattalashtirish uchun bosing"
              >
                <QRCodeSVG
                  value={firstGroup.join_url || `${window.location.origin}/join/${firstGroup.join_token}`}
                  size={120}
                  level="M"
                />
                <span className="text-[10px] font-bold text-slate-700 mt-2 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-emerald-600" />
                  Kattalashtirish
                </span>
              </div>
            </div>

            {/* Ambient background lights */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Guruh nomi, fan yoki token bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Course filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto flex-shrink-0">
            {[
              { label: 'Barchasi', value: '' },
              { label: '1-kurs', value: 1 },
              { label: '2-kurs', value: 2 },
              { label: '3-kurs', value: 3 },
              { label: '4-kurs', value: 4 },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setCourseFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  courseFilter === tab.value
                    ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-400 px-2 flex-shrink-0 self-center">
            {filteredGroups.length} ta guruh
          </span>
        </div>

        {/* ── GROUPS CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const studentCount = group.members?.length || 0;
              const assignCount = group.assignments?.length || 0;

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 group"
                >
                  {/* Top card section */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                            {group.course}-kurs
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {group.semester}-semestr
                          </span>
                          {group.access_code && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                              <Key className="w-3 h-3 text-amber-500" />
                              Parolli
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {group.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => showQr(group.id)}
                        className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-all flex-shrink-0 shadow-xs active:scale-95 cursor-pointer"
                        title="QR Kodni ko'rish"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{group.subject || "Fan ko'rsatilmagan"}</span>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none">{studentCount}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Talabalar</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none">{assignCount}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Topshiriqlar</p>
                        </div>
                      </div>
                    </div>

                    {/* Join Token Box */}
                    <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/70 mb-4 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ulanish Tokeni</p>
                        <p className="font-mono text-xs font-bold text-emerald-700 truncate">{group.join_token}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(group.join_token, 'token')}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
                        title="Tokenni nusxalash"
                      >
                        {copiedToken === group.join_token ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => showQr(group.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors active:scale-98 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Kod</span>
                    </button>

                    <Link
                      to={`/assignments?groupId=${group.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors active:scale-98 shadow-xs"
                    >
                      <span>Vazifalar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 flex flex-col items-center justify-center gap-3">
              <Layers className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <h3 className="text-base font-bold text-slate-800">
                {search ? "Qidiruv bo'yicha guruh topilmadi" : "Hozircha guruhlar mavjud emas"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Yangi guruh yarating va talabalarni QR-kod orqali qo'shing.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-700/25 hover:opacity-95 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Birinchi guruhni yaratish
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          CREATE GROUP MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi Guruh Yaratish"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Guruh Nomi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: TATU 210-21 DI"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fan Nomi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Veb Dasturlash Asoslari"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kurs</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium bg-white"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Semestr</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 font-medium bg-white"
              >
                <option value={1}>1-semestr</option>
                <option value={2}>2-semestr</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">O'quv Yili</label>
              <input
                type="text"
                required
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kirish Kodi (Access Code)
              </label>
              <input
                type="text"
                placeholder="Ixtiyoriy parol (masalan: 2026)"
                value={formData.access_code}
                onChange={(e) => setFormData({ ...formData, access_code: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">Guruhga qo'shilish uchun talaba ushbu parolni kiritadi.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cheklangan Email Domen
              </label>
              <input
                type="text"
                placeholder="Masalan: tuit.uz"
                value={formData.allowed_email_domain}
                onChange={(e) => setFormData({ ...formData, allowed_email_domain: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">Faqat ushbu universitet emaili bo'lgan talabalar kira oladi.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
              className="px-6 py-2.5 rounded-xl text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
            >
              Guruhni Yaratish
            </button>
          </div>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════
          QR CODE & SHARING MODAL
      ══════════════════════════════════════════════ */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.group?.name || selectedGroup?.name || "Guruh QR Kodi"}
        maxWidth="max-w-md"
      >
        {selectedGroup && (
          <div className="text-center space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              Auditoriyadagi talabalar ushbu QR-kodni telefon kamerasi bilan skaner qilib, darhol guruhga a'zo bo'lishlari mumkin.
            </p>

            {/* QR SVG Container */}
            <div className="p-5 bg-white rounded-3xl border-2 border-emerald-100 shadow-xl inline-block mx-auto">
              <QRCodeSVG
                value={
                  selectedGroup.join_url ||
                  `${window.location.origin}/join/${selectedGroup.join_token || selectedGroup.group?.join_token}`
                }
                size={210}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Join token and copy */}
            <div className="space-y-1.5 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                Taklif Havolasi & Tokeni
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-700 truncate flex-1 select-all">
                  {selectedGroup.join_token || selectedGroup.group?.join_token}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(selectedGroup.join_token || selectedGroup.group?.join_token, 'token')
                  }
                  style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                  className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors flex-shrink-0 cursor-pointer hover:opacity-95"
                >
                  {copiedToken === (selectedGroup.join_token || selectedGroup.group?.join_token) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxalash</span>
                    </>
                  )}
                </button>
              </div>
            </div>


            {/* Access code reminder if any */}
            {(selectedGroup.group?.access_code || selectedGroup.access_code) && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span className="font-medium">Guruh paroli:</span>
                <strong className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-200">
                  {selectedGroup.group?.access_code || selectedGroup.access_code}
                </strong>
              </div>
            )}

            <button
              onClick={() => setSelectedGroup(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-xs"
            >
              Yopish
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Groups;
