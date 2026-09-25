import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  FileCheck2, 
  Sparkles, 
  CreditCard, 
  Settings, 
  LogOut,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard & Statistika', icon: LayoutDashboard },
    { to: '/groups', label: 'Guruhlarim & QR Link', icon: Layers },
    { to: '/assignments', label: 'Amaliy Topshiriqlar', icon: FileCheck2 },
    { to: '/evaluations', label: 'AI Baholash Natijalari', icon: Sparkles },
    { to: '/subscription', label: 'Pro Obuna', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1d58d8] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">AI PRACTICE</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
              Teacher Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1d58d8] text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 mb-3">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
              {user?.name?.[0] || 'T'}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <p className="text-sm font-semibold text-white truncate">{user?.name || "O'qituvchi"}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  user?.plan_type === 'PRO' ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {user?.plan_type || 'FREE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
