import React from 'react';

const Analytics = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Performance and common mistakes</p>
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

      {/* Sub Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Group analytics</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Understand completion, score distribution and recurring mistakes.
        </p>
      </div>

      {/* Top Grid: Bar Chart & At-risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Bar Chart (Average score by assignment) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900">Average score by assignment</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Last 6 assignments</p>
          </div>
          
          <div className="h-64 flex items-end justify-between px-4 pb-2 border-b-2 border-slate-50">
            {/* Bar 1 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[65%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">REST</span>
            </div>
            {/* Bar 2 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[70%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">SQL</span>
            </div>
            {/* Bar 3 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[75%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Git</span>
            </div>
            {/* Bar 4 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[72%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">HTTP</span>
            </div>
            {/* Bar 5 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[78%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Test</span>
            </div>
            {/* Bar 6 */}
            <div className="flex flex-col items-center w-[12%]">
              <div className="w-full bg-[#2563eb] rounded-t-lg h-[82%]"></div>
              <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">API</span>
            </div>
          </div>
        </div>

        {/* At-risk Students */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">At-risk students</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Based on score + completion</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900">Jasur T.</span>
              <span className="text-[13px] font-bold text-orange-500">62%</span>
              <span className="text-[11px] font-medium text-slate-500">Testing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900">Madina T.</span>
              <span className="text-[13px] font-bold text-orange-500">68%</span>
              <span className="text-[11px] font-medium text-slate-500">SQL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900">Sardor E.</span>
              <span className="text-[13px] font-bold text-orange-500">71%</span>
              <span className="text-[11px] font-medium text-slate-500">Conclusion</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-900">Bekzod S.</span>
              <span className="text-[13px] font-bold text-orange-500">73%</span>
              <span className="text-[11px] font-medium text-slate-500">Git</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Box: Topic Mastery */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900">Topic mastery</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Common course concepts</p>
        </div>

        <div className="space-y-6">
          {/* HTTP */}
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-slate-600 w-24">HTTP</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 w-12 text-right">92%</span>
          </div>
          
          {/* REST */}
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-slate-600 w-24">REST</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 w-12 text-right">88%</span>
          </div>

          {/* SQL */}
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-slate-600 w-24">SQL</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '81%' }}></div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 w-12 text-right">81%</span>
          </div>

          {/* Git */}
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-slate-600 w-24">Git</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '76%' }}></div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 w-12 text-right">76%</span>
          </div>

          {/* Testing */}
          <div className="flex items-center">
            <span className="text-[11px] font-bold text-slate-600 w-24">Testing</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '64%' }}></div>
            </div>
            <span className="text-[11px] font-bold text-slate-900 w-12 text-right">64%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">91.6% completion · 86.4 average · 5 students at risk</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default Analytics;
