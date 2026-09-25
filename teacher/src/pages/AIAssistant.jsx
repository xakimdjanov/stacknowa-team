import React from 'react';
import { Check } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">AI Assistant</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Teacher AI assistant</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column (Chat Area) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col min-h-[600px]">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-900">Teacher AI assistant</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Ask about submissions, patterns, feedback and next actions.</p>
          </div>

          <div className="space-y-6 flex-1">
            
            {/* You */}
            <div className="flex items-start space-x-4">
              <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">You</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">Which mistakes appear most often?</p>
              </div>
            </div>

            {/* AI */}
            <div className="flex items-start space-x-4">
              <span className="bg-purple-50 text-purple-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">AI</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">11 students omit 4xx/5xx error handling.</p>
              </div>
            </div>

            {/* You */}
            <div className="flex items-start space-x-4">
              <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">You</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">Who needs urgent feedback?</p>
              </div>
            </div>

            {/* AI */}
            <div className="flex items-start space-x-4">
              <span className="bg-purple-50 text-purple-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">AI</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">Jasur T. and Bekzod S. need review today.</p>
              </div>
            </div>

            {/* You */}
            <div className="flex items-start space-x-4">
              <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">You</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">Draft feedback for Malika.</p>
              </div>
            </div>

            {/* AI */}
            <div className="flex items-start space-x-4">
              <span className="bg-purple-50 text-purple-600 text-[11px] font-bold px-4 py-2 rounded-full w-16 text-center shrink-0">AI</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[13px] font-medium text-slate-700">Draft prepared from the rubric and her submission.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (Context & Actions) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col min-h-[600px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">Context</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">What the assistant can use</p>
          </div>

          <div className="space-y-6 flex-1">
            <div className="flex items-center space-x-2 bg-green-50/50 w-max px-4 py-2 rounded-full border border-green-100/50">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
              <span className="text-[11px] font-bold text-slate-700">Backend-101</span>
            </div>

            <div className="flex items-center space-x-2 bg-green-50/50 w-max px-4 py-2 rounded-full border border-green-100/50">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
              <span className="text-[11px] font-bold text-slate-700">32 submissions</span>
            </div>

            <div className="flex items-center space-x-2 bg-green-50/50 w-max px-4 py-2 rounded-full border border-green-100/50">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
              <span className="text-[11px] font-bold text-slate-700">Current rubric</span>
            </div>

            <div className="flex items-center space-x-2 bg-green-50/50 w-max px-4 py-2 rounded-full border border-green-100/50">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
              <span className="text-[11px] font-bold text-slate-700">Integrity results</span>
            </div>

            <div className="flex items-center space-x-2 bg-green-50/50 w-max px-4 py-2 rounded-full border border-green-100/50">
              <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
              <span className="text-[11px] font-bold text-slate-700">Recent feedback</span>
            </div>

            <div className="pt-8">
              <p className="text-[11px] font-medium text-slate-400">Student drafts stay within your course context.</p>
            </div>
            
            <div className="pt-6 flex flex-col gap-4 items-start">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold px-6 py-2.5 rounded-full text-center transition-colors">
                Draft feedback
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 text-[11px] font-bold px-6 py-2.5 rounded-full text-center transition-colors">
                Find patterns
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] font-bold px-2">
        <span className="text-slate-400">14 patterns found · 6 suggestions ready</span>
        <span className="text-blue-500">Synced just now</span>
      </div>

    </div>
  );
};

export default AIAssistant;
