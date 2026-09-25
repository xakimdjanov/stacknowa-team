import React from 'react';

const Submissions = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Submissions</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Review AI-scored work</p>
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

      {/* Sub Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Submission review</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          AI scores first; teacher keeps final review and override control.
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Pending review</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">12</h2>
          <p className="text-xs font-bold text-orange-500">4 urgent</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">AI scored</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">116</h2>
          <p className="text-xs font-bold text-blue-600">91% of queue</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Needs override</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">4</h2>
          <p className="text-xs font-bold text-blue-600">Manual check</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Avg review time</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">2m 18s</h2>
          <p className="text-xs font-bold text-blue-600">↓ 24%</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Student</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Assignment</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Score</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">AI analysis</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Aziz Karimov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">94</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">2m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Malika Rahimova</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">88</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">14% similar</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">5m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Jasur Tursunov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">SQL #2</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">76</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">AI signal</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">18m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Nodira Aliyeva</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">91</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">21m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Bekzod Saidov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Git #1</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">83</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">9% similar</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">28m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Madina Toshpulatova</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">SQL #2</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">79</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">34m ago</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Sardor Ergashev</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Testing Basics</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-900">87</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">41m ago</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-6 py-2.5 rounded-full transition-colors">
          Open next review
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">12 pending · 116 AI-scored · 4 require teacher override</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default Submissions;
