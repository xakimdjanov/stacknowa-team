import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import { Layers, QrCode, ExternalLink, Users, Calendar, Copy, Check } from 'lucide-react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const showQrModal = async (id) => {
    try {
      const res = await api.get(`/groups/${id}`);
      setSelectedGroup(res.data);
      setCopied(false);
    } catch (err) {
      alert("Guruh ma'lumotlarini yuklashda xatolik");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Guruhlar va Topshiriqlar</h1>
        <p className="text-sm text-slate-500 mt-1">
          O'qituvchilar tomonidan yaratilgan barcha akademik guruhlar, talabalar va topshiriqlar holati.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {g.course}-kurs | {g.academic_year}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {g.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{g.name}</h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">{g.subject}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>O'qituvchi:</span>
                  <span className="font-semibold text-slate-900">{g.teacher?.name || 'Mavjud emas'}</span>
                </div>
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
                    <span>Kirish kodi:</span>
                    <span className="font-mono text-indigo-600 font-bold">{g.access_code}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                Token: {g.join_token}
              </span>
              <button
                onClick={() => showQrModal(g.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>QR & Havola</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR CODE & LINK (PORTAL MODAL) */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.group?.name}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-slate-500">Talabalar ushbu QR-kodni skanerlab mustaqil ravishda guruhga qo'shiladi</p>

          {selectedGroup?.qr_code && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block my-1">
              <img src={selectedGroup.qr_code} alt="QR Code" className="w-44 h-44 mx-auto" />
            </div>
          )}

          <div className="flex items-center space-x-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-mono text-slate-700 truncate flex-1 text-left">
              {selectedGroup?.join_url}
            </span>
            <button
              onClick={() => copyToClipboard(selectedGroup?.join_url)}
              className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-indigo-600 shadow-sm border border-slate-200 text-xs flex items-center space-x-1"
              title="Nusxalash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

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
