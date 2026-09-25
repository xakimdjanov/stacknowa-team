import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Plus, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenJoinModal }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Xush kelibsiz, {user?.name || 'Talaba'} 👋</h2>
        <p className="text-xs text-slate-500 mt-0.5">Amaliy ishlaringizni topshiring va AI dan tezkor tahlil oling</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenJoinModal}
          className="inline-flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-xl text-xs transition-colors border border-indigo-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Guruhga qo'shilish</span>
        </button>

        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>Gemini AI Auto-Grading</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
