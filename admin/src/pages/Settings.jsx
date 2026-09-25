import React from 'react';
import { Settings as SettingsIcon, Server, ShieldCheck, Key, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tizim Konfiguratsiyasi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Server sozlamalari, integratsiyalar (AWS S3, inPAY, Gemini AI) holati.
        </p>
      </div>

      <div className="space-y-4">
        {/* PostgreSQL Database */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">PostgreSQL + Sequelize</h3>
              <p className="text-xs text-slate-500">localhost:5432 / DB: backend</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            Ulangan (Connected)
          </span>
        </div>

        {/* AWS S3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">AWS S3 / Cloudflare R2 Storage</h3>
              <p className="text-xs text-slate-500">Talaba fayllari va rasmlarini saqlash</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            Tayyor (.env)
          </span>
        </div>

        {/* inPAY Gateway */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">inPAY REST API v1</h3>
              <p className="text-xs text-slate-500">Click, Payme, Kartalar orqali to'lov</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            Aktiv
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
