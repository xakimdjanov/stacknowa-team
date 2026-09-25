import React from 'react';

const StudentDetail = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Student Detail</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Individual progress and feedback</p>
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
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            T
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex-shrink-0"></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Aziz Karimov</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Backend-101 · joined via group invite · active today 10:42</p>
          </div>
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">ACTIVE</span>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Attendance</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">96%</h2>
          <p className="text-xs font-bold text-emerald-500">Excellent</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Average</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">91.2</h2>
          <p className="text-xs font-bold text-emerald-500">↑ 3.4%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Completed</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">9 / 10</h2>
          <p className="text-xs font-bold text-orange-500">1 pending</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column (Performance Trend) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Performance trend</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Score by recent assignment</p>
          </div>

          {/* Fake Chart / Trend lines */}
          <div className="h-40 relative flex items-end justify-between px-4 border-b border-slate-100 pb-8 mb-8">
            {/* These divs just simulate the step chart from the image */}
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[10%]"></div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[20%]"></div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[30%]"></div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[25%]"></div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[40%]"></div>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mb-[50%]"></div>
          </div>

          {/* List of recent scores */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900 w-1/3">REST API #3</span>
              <span className="text-[13px] font-bold text-slate-900 w-1/6 text-center">94</span>
              <span className="text-xs font-medium text-slate-400 w-1/2 text-right">Strong implementation</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900 w-1/3">SQL #2</span>
              <span className="text-[13px] font-bold text-slate-900 w-1/6 text-center">88</span>
              <span className="text-xs font-medium text-slate-400 w-1/2 text-right">Good reasoning</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900 w-1/3">Git #1</span>
              <span className="text-[13px] font-bold text-slate-900 w-1/6 text-center">91</span>
              <span className="text-xs font-medium text-slate-400 w-1/2 text-right">Clean structure</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900 w-1/3">HTTP Basics</span>
              <span className="text-[13px] font-bold text-slate-900 w-1/6 text-center">92</span>
              <span className="text-xs font-medium text-slate-400 w-1/2 text-right">Excellent</span>
            </div>
          </div>
        </div>

        {/* Right Column (Learning Signals) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Learning signals</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">AI-assisted insight</p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strength</span>
              <span className="text-[13px] font-bold text-slate-900">API implementation</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weak topic</span>
              <span className="text-[13px] font-bold text-slate-900">Testing</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Common error</span>
              <span className="text-[13px] font-bold text-slate-900">Conclusion evidence</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next action</span>
              <span className="text-[13px] font-bold text-slate-900">Testing practice</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">2 unread feedback notes · 1 integrity flag resolved</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default StudentDetail;
