import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center sticky top-0 z-20">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Xush kelibsiz, {user?.name || 'Talaba'} 👋
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">AI Practice — Talaba portali</p>
      </div>
    </header>
  );
};

export default Navbar;
