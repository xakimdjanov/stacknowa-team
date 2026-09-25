import React from 'react';

const Groups = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Akademik Guruhlarim</h1>
          <p className="text-sm text-slate-500 mt-1">
            Guruhlar yarating, talabalar uchun QR-kod yoki havola oling.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 bg-[#1d58d8] hover:bg-[#1648b8] text-white font-semibold py-2.5 px-5 rounded-2xl shadow-md shadow-blue-500/20 text-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Guruh Yaratish</span>
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Backend-101</h3>
            <p className="text-xs text-slate-500 font-medium">32 students · 82.4% avg</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Active</span>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Open group</button>
              <button className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Copy link</button>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Today · 10:42</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Database-201</h3>
            <p className="text-xs text-slate-500 font-medium">28 students · 86.1% avg</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Active</span>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Open group</button>
              <button className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Copy link</button>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Today · 10:42</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Web-301</h3>
            <p className="text-xs text-slate-500 font-medium">35 students · 79.7% avg</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Active</span>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Open group</button>
              <button className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Copy link</button>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Today · 10:42</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">AI-401</h3>
            <p className="text-xs text-slate-500 font-medium">24 students · 88.6% avg</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Active</span>
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Open group</button>
              <button className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Copy link</button>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Today · 10:42</span>
          </div>
        </div>

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
        </form >
      </Modal >

  {/* QR CODE & LINK MODAL */ }
  < Modal
isOpen = { Boolean(selectedGroup) }
onClose = {() => setSelectedGroup(null)}
title = { selectedGroup?.group?.name }
maxWidth = "max-w-sm"
  >
  <div className="text-center space-y-4">
    <p className="text-xs text-slate-500">
      Talabalar ushbu QR-kodni skaner qilib yoki havola orqali guruhga mustaqil qo'shiladi.
    </p>

    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block my-2">
      <QRCodeSVG value={selectedGroup?.join_url || "https://aipractice.uz"} size={170} />
    </div>

    <div className="flex items-center space-x-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
      <span className="text-xs font-mono text-slate-700 truncate flex-1 text-left">
        {selectedGroup?.join_url}
      </span>
      <button
        onClick={() => copyToClipboard(selectedGroup?.join_url)}
        className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-[#1d58d8] shadow-sm border border-slate-200 text-xs flex items-center space-x-1"
        title="Nusxalash"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
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
      </Modal >
    </div >
  );
};

export default Groups;
