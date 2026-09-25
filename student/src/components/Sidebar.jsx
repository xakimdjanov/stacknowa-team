import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  GraduationCap,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',            label: 'Boshqaruv Paneli',    shortLabel: 'Boshqaruv',   icon: LayoutDashboard },
  { to: '/groups',      label: 'Mening Guruhlarim',   shortLabel: 'Guruhlar',     icon: Users },
  { to: '/assignments', label: 'Amaliy Topshiriqlar', shortLabel: 'Vazifalar',    icon: BookOpen },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'T';

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR (md+)
      ══════════════════════════════════════ */}
      <aside className="hidden md:flex w-60 lg:w-64 bg-white border-r border-slate-100 flex-col h-screen sticky top-0 z-30 select-none flex-shrink-0">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 tracking-tight block leading-none">AI Practice</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5 block">Talaba Portali</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asosiy Menyu</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    </div>
                    <span className="text-[13px] truncate">{label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm shadow-indigo-300/40">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-none mb-0.5">{user?.name || 'Talaba'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MOBILE TOP APP BAR (< md)
      ══════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-[58px] bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between shadow-xs">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-slate-900 tracking-tight leading-none">AI Practice</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-50 text-[9px] font-bold text-indigo-600 tracking-wide">TALABA</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">O'quv platformasi</span>
        </div>

        {/* User Avatar */}
        <button
          onClick={() => setMobileOpen(true)}
          className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-500/20 active:scale-95 transition-transform"
          title="Profil va menyu"
          aria-label="Profil"
        >
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      </header>

      {/* ══════════════════════════════════════
          MOBILE SLIDE-OVER DRAWER (Offcanvas)
      ══════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-[84%] max-w-[310px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header & User Profile Card */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-indigo-50/50 via-slate-50/30 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-slate-900">AI Practice</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-xs"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Student Profile Card */}
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 shadow-xs flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 truncate leading-snug">{user?.name || 'Talaba'}</h4>
                <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'talaba@platform.uz'}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                Aktiv Talaba
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Asosiy Sahifalar
          </p>

          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-bold">{label}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Quick Help Card */}
          <div className="mt-6 mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-100/70">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">AI Baholash Tizimi</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Topshiriqlaringiz AI tomonidan avtomatik tekshirilib tahlil qilinadi.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Drawer Footer: Logout & System info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 active:scale-[0.98] transition-all shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            Tizimdan chiqish
          </button>

          <p className="text-center text-[10px] text-slate-400 font-medium">
            AI Practice v2.4 • StackNowa
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM BAR (< md)
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center justify-around">
        {navItems.map(({ to, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-indigo-50 text-indigo-600 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-black text-indigo-600' : 'font-medium'}`}>
                  {shortLabel}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Menu Drawer Toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-700 transition-all"
        >
          <div className="w-10 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
            <Menu className="w-5 h-5 stroke-[1.8]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Menyu</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
