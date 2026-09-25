import React from 'react';

const Settings = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Grading, AI and notifications</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm w-64 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center cursor-pointer">
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            T
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">Teacher settings</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Grading, AI, notifications and account security.</p>
        </div>

        <div className="space-y-6 max-w-4xl">
          
          {/* Field: Display name */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">Display name</label>
            <div className="flex-1">
              <input 
                type="text" 
                defaultValue="Professor Karimov" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field: Email */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">Email</label>
            <div className="flex-1">
              <input 
                type="email" 
                defaultValue="teacher@university.edu" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field: Default rubric */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">Default rubric</label>
            <div className="flex-1">
              <input 
                type="text" 
                defaultValue="University standard" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field: AI evaluation */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">AI evaluation</label>
            <div className="flex-1">
              <input 
                type="text" 
                defaultValue="Enabled" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field: Notifications */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">Notifications</label>
            <div className="flex-1">
              <input 
                type="text" 
                defaultValue="Enabled" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field: Two-factor authentication */}
          <div className="flex flex-col sm:flex-row sm:items-center pb-8">
            <label className="sm:w-64 text-[13px] font-bold text-slate-500 mb-2 sm:mb-0">Two-factor authentication</label>
            <div className="flex-1">
              <input 
                type="text" 
                defaultValue="Enabled" 
                className="w-full sm:max-w-xl border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center pt-8 border-t border-slate-100">
            <div className="sm:w-64">
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-emerald-100">
                PRO PLAN
              </span>
            </div>
            <div>
              <button 
                style={{ background: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)' }}
                className="text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md shadow-emerald-700/20 hover:opacity-95 transition-all cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">Plan PRO · AI evaluation enabled · 2FA enabled</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default Settings;
