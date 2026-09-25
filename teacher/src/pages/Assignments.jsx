import React, { useState, useEffect } from 'react';
import api from '../api/client';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups/my');
      const allGroups = res.data.groups || [];
      const allAssignments = allGroups.flatMap(g => g.assignments || []);
      setAssignments(allAssignments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 max-w-[1400px] mx-auto min-h-screen">Loading assignments...</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Templates, rubrics and automation</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assignments & templates</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Reusable practical-work templates, rubrics and automated evaluation rules.
          </p>
        </div>
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2.5 px-6 rounded-full transition-colors flex items-center space-x-1">
          <span>+</span>
          <span>Create assignment</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Left Column (Active Assignments List) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Active assignments</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">{assignments.length} live</p>
          </div>

          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((assignment, idx) => (
                <div key={assignment.id} className={`p-5 rounded-2xl border cursor-pointer transition-colors ${idx === 0 ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[15px] font-bold text-slate-900">{assignment.title}</h4>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${idx === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                      {idx === 0 ? 'AUTO-SCORE ON' : 'READY'}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500 font-medium mb-3">Max pts: {assignment.max_score || 100}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'No deadline'}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">Hozircha topshiriqlar yo'q</div>
            )}
          </div>
        </div>

        {/* Right Column (Assignment Details) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-[22px] font-bold text-slate-900 mb-1">REST API yaratish</h3>
            <p className="text-[13px] text-slate-500 font-medium">Template: Practical Work v3</p>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Progress/Weight items */}
            <div>
              <div className="flex justify-between items-center mb-2 text-[13px] font-bold">
                <span className="text-slate-900">Format</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-[13px] font-bold">
                <span className="text-slate-900">Implementation</span>
                <span className="text-blue-600">40 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-[13px] font-bold">
                <span className="text-slate-900">Explanation</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-[13px] font-bold">
                <span className="text-slate-900">Conclusion</span>
                <span className="text-blue-600">20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Badges */}
            <div className="pt-6 flex flex-col gap-4 items-start">
              <span className="bg-green-50 text-green-700 text-[11px] font-bold px-4 py-2 rounded-full text-center min-w-[140px]">
                Auto-score enabled
              </span>
              <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-4 py-2 rounded-full text-center min-w-[140px]">
                Similarity check
              </span>
              <span className="bg-orange-50 text-orange-700 text-[11px] font-bold px-4 py-2 rounded-full text-center min-w-[140px]">
                AI-writing signal
              </span>
            </div>
          </div>

          <div className="pt-10">
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[13px] font-bold px-6 py-2.5 rounded-full transition-colors w-32">
              Save assignment
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">4 criteria · 100 points · AI evaluation + Integrity checks enabled</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default Assignments;
