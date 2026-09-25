import React from 'react';
import { Search } from 'lucide-react';

const GroupDetail = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Group Detail</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">Roster, QR and activity</p>
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

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Backend-101</h2>
            <p className="text-sm text-slate-500 font-medium">Backend Development · 32 students · 3 active assignments</p>
          </div>
          <div className="flex items-center space-x-6">
            <span className="bg-green-100 text-green-700 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Active</span>
            <span className="text-sm font-bold text-blue-600">aipractice.uz/join/BACKEND101</span>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-6 py-2 rounded-full transition-colors">Copy link</button>
          </div>
        </div>

        {/* QR Section */}
        <div className="mt-6 md:mt-0 flex items-center space-x-4 border border-slate-200 p-4 rounded-xl">
           {/* QR Code Placeholder (Empty space) */}
           <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center shrink-0">
             <span className="text-[9px] font-bold text-slate-400 text-center px-1">QR Space</span>
           </div>
           <div className="space-y-2">
             <p className="text-xs font-bold text-green-600">Ready · 32 scans</p>
             <p className="text-[11px] text-slate-500 font-medium">31 Dec 2026</p>
             <p className="text-[11px] text-slate-500 font-medium">32 enrolled</p>
           </div>
        </div>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Completion</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">91.6%</h2>
          <p className="text-xs font-bold text-green-500">↑ 4.2%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Avg score</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">82.4</h2>
          <p className="text-xs font-bold text-green-500">↑ 2.1</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Integrity flags</p>
          <h2 className="text-[32px] font-extrabold text-slate-900 mb-1">7</h2>
          <p className="text-xs font-bold text-orange-500">2 unresolved</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Student</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Latest work</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Score</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">AI / Similarity</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Aziz Karimov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">94</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Submitted</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Malika Rahimova</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">88</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">14% similar</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Review</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Jasur Tursunov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">SQL #2</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">76</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">AI signal</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Review</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Nodira Aliyeva</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">REST API #3</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">91</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Submitted</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Bekzod Saidov</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Git #1</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">83</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">9% similar</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Submitted</td>
            </tr>
            <tr>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">Madina Toshpulatova</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">SQL #2</td>
              <td className="px-8 py-5 text-sm font-bold text-slate-900">79</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Clean</td>
              <td className="px-8 py-5 text-sm font-medium text-slate-500">Submitted</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-2">
        <span className="text-[11px] font-bold text-slate-400">Invite link active - Last joined today 14:32</span>
        <span className="text-[11px] font-bold text-blue-500">Synced just now</span>
      </div>
    </div>
  );
};

export default GroupDetail;
