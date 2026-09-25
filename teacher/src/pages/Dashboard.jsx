import React from 'react';
import { Search } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Teaching workload, groups and AI review</p>
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
            {/* Empty circle for notification icon placeholder */}
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            T
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Active groups</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">12</h2>
          <p className="text-xs font-semibold text-blue-600">+2 this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Pending reviews</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">12</h2>
          <p className="text-xs font-semibold text-blue-600">4 urgent</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">AI evaluations</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">1,240</h2>
          <p className="text-xs font-semibold text-blue-600">+14%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 mb-2">Avg score</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">86.4</h2>
          <p className="text-xs font-semibold text-blue-600">↑ 4.8%</p>
        </div>
      </div>

      {/* Middle Two Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Teaching Workload */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Teaching workload</h3>
            <p className="text-xs text-slate-500 font-medium">Current assignments and review queue</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="text-sm font-bold text-slate-900">REST API #3</span>
              </div>
              <span className="text-xs font-medium text-slate-400 w-1/3 text-center">32 submissions</span>
              <span className="text-xs font-bold text-slate-500 w-1/3 text-right">Today 16:30</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-900">SQL Normalization</span>
              </div>
              <span className="text-xs font-medium text-slate-400 w-1/3 text-center">18 submissions</span>
              <span className="text-xs font-bold text-slate-500 w-1/3 text-right">Tomorrow 09:00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-900">Testing Basics</span>
              </div>
              <span className="text-xs font-medium text-slate-400 w-1/3 text-center">12 submissions</span>
              <span className="text-xs font-bold text-slate-500 w-1/3 text-right">Fri 23:59</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-900">Final Project</span>
              </div>
              <span className="text-xs font-medium text-slate-400 w-1/3 text-center">7 drafts</span>
              <span className="text-xs font-bold text-slate-500 w-1/3 text-right">Mon 12:00</span>
            </div>
          </div>
        </div>

        {/* Group Health */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Group health</h3>
            <p className="text-xs text-slate-500 font-medium">Completion by active cohort</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-900">Backend-101</span>
                <span className="text-xs font-bold text-slate-900">91%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-900">Database-201</span>
                <span className="text-xs font-bold text-slate-900">86%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-900">Web-301</span>
                <span className="text-xs font-bold text-slate-900">80%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-900">AI-401</span>
                <span className="text-xs font-bold text-slate-900">89%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Student</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Assignment</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Score</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-500">Integrity</th>
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
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end pr-4 text-xs font-bold text-blue-500">
        Synced just now
      </div>
    </div>
  );
};

export default Dashboard;
