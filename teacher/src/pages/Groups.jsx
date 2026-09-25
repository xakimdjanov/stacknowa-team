import React from 'react';

const Groups = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Groups</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Create groups and share one invite</p>
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

      {/* Your Groups Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your groups</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Students join through one shared link or QR — no manual roster entry.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-sm transition-colors flex items-center space-x-1">
          <span>+</span>
          <span>New group</span>
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

      {/* Fast Onboarding Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center justify-between mb-8">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Fast onboarding</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Share a single invite with the whole class.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold text-blue-600">aipractice.uz/join/BACKEND101</span>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-5 py-1.5 rounded-full transition-colors">Copy link</button>
          </div>

          <div>
            <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">QR READY</span>
            <p className="text-xs text-slate-500 font-medium">32 successful joins · expires 31 Dec 2026</p>
          </div>
        </div>

        {/* QR Code Placeholder (Empty space for future QR code injection) */}
        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center shrink-0">
           <span className="text-[10px] font-bold text-slate-400 text-center px-2">QR Code Space</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">12 active groups - 319 students - 86.4% average completion</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default Groups;
