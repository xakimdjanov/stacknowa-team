import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, KeyRound, Save, ShieldCheck, Loader2 } from 'lucide-react';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.university_name || user?.name || "Namdtu");
  const [email, setEmail] = useState(user?.email || "university@gmail.com");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const uniId = user?.university_id || user?.id || '1';
    try {
      const res = await api.get(`/universities/${uniId}/profile`);
      if (res.data?.university) {
        setName(res.data.university.name);
        setEmail(res.data.university.email);
      }
    } catch (err) {
      console.log("Fetch profile error:", err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const uniId = user?.university_id || user?.id || '1';
    try {
      await api.put(`/universities/${uniId}`, { name, email });
      if (updateUser) {
        updateUser({ name, email, university_name: name });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Saqlashda xatolik: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Universitet Profili va Sozlamalari</h1>
            <p className="text-xs text-slate-500">Universitet rekvizitlari va unique kodi</p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
            Ma'lumotlar muvaffaqiyatli saqlandi ✅
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Universitet Unique Code (O'qituvchilar bog'lanishi uchun)</label>
            <div className="p-3 bg-slate-50 border rounded-xl font-mono font-bold text-emerald-700 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                {user?.university_code || "TATU-9842"}
              </span>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded">Tizim kodi</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Universitet Rasmiy Nomi *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Emaili *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold outline-none"
            />
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              style={{ background: EMERALD_GRADIENT }}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saqlanmoqda..." : "Sozlamalarni Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
