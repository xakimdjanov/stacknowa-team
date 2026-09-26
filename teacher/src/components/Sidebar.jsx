import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  FileCheck2, 
  Sparkles, 
  CreditCard, 
  LogOut,
  ChevronRight,
  GraduationCap,
  Crown,
  Menu,
  X,
  Zap,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    title: "ASOSIY BO'LIMLAR",
    items: [
      { to: '/', label: 'Dashboard & Tahlil', shortLabel: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/materials', label: 'Materiallar & AI Savollar', shortLabel: 'Materiallar', icon: FileText },
      { to: '/live-events', label: 'Live Events & Game PIN', shortLabel: 'Live Events', icon: Zap },
      { to: '/groups', label: 'Guruhlarim', shortLabel: 'Guruhlar', icon: Layers },
      { to: '/assignments', label: 'Amaliy Topshiriqlar', shortLabel: 'Topshiriqlar', icon: FileCheck2 },
      { to: '/evaluations', label: 'AI Baholash Natijalari', shortLabel: 'AI Baholar', icon: Sparkles },
    ],
  },
  {
    title: 'MOLIYA & REJA',
    items: [
      { to: '/subscription', label: 'Pro Obuna & Tariflar', shortLabel: 'Pro Obuna', icon: CreditCard },
    ],
  },
];

const bottomNavItems = [
  { to: '/', label: 'Dashboard', shortLabel: 'Asosiy', icon: LayoutDashboard, end: true },
  { to: '/materials', label: 'Materiallar', shortLabel: 'Materiallar', icon: FileText },
  { to: '/live-events', label: 'Live Events', shortLabel: 'Live Events', icon: Zap },
  { to: '/groups', label: 'Guruhlar', shortLabel: 'Guruhlar', icon: Layers },
];

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 350);
  };

  const isPro = user?.plan_type === 'PRO';
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* ══════════════════════════════════════════════
          DESKTOP FIXED SIDEBAR (md+)
      ══════════════════════════════════════════════ */}
      <aside className="hidden md:flex w-64 lg:w-68 h-screen sticky top-0 flex-col flex-shrink-0 z-30 select-none bg-white border-r border-slate-200/80 shadow-[1px_0_12px_rgba(0,0,0,0.03)]">
        
        {/* Top vibrant accent gradient line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1" 
          style={{ background: EMERALD_GRADIENT }}
        />

        {/* ── Brand Header ── */}
        <div className="p-5 pt-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-700/25 flex-shrink-0"
              style={{ background: EMERALD_GRADIENT }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight leading-none">
                  EduMind AI
                </span>
                {isPro && (
                  <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 mt-1 block">
                O'qituvchi Portali
              </span>
            </div>
          </div>
        </div>

        {/* ── Scrollable Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    style={({ isActive }) => isActive ? { background: EMERALD_GRADIENT } : {}}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-white shadow-md shadow-emerald-700/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[13px] truncate">{label}</span>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User Profile & Logout ── */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="bg-white rounded-2xl p-2.5 flex items-center gap-3 border border-slate-200/70 shadow-2xs">
            <div className="relative flex-shrink-0">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xs"
                style={{ background: EMERALD_GRADIENT }}
              >
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-black text-slate-900 truncate leading-tight">
                  {user?.name || "O'qituvchi"}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>

            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
                isPro ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {user?.plan_type || 'FREE'}
            </span>
          </div>

          {user?.university_code && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider">
                  🏛️ {user?.university_name || "OTM / Universitet"}
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white ${
                  user?.approval_status === 'APPROVED' ? 'bg-emerald-600' : 'bg-amber-500'
                }`}>
                  {user?.approval_status === 'APPROVED' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                </span>
              </div>
              <div className="text-[10px] text-emerald-900 font-mono font-bold">
                Code: {user?.university_code}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all active:scale-98 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Chiqilmoqda...' : 'Tizimdan chiqish'}</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════
          MOBILE TOP APP BAR (< md)
      ══════════════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-[58px] bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between shadow-xs">
        {/* Brand Title */}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ background: EMERALD_GRADIENT }}
          >
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none">
                EduMind AI
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-[9px] font-bold text-emerald-700 tracking-wide border border-emerald-200/50">
                USTOZ
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">O'qituvchi kabineti</span>
          </div>
        </div>

        {/* User Avatar Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-emerald-700/20 active:scale-95 transition-transform cursor-pointer"
          style={{ background: EMERALD_GRADIENT }}
          title="Menyu & Profil"
          aria-label="Menyu va profil"
        >
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
        </button>
      </header>

      {/* ══════════════════════════════════════════════
          MOBILE SLIDE-OVER DRAWER (Offcanvas)
      ══════════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-[84%] max-w-[310px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-emerald-700/25"
                style={{ background: EMERALD_GRADIENT }}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-slate-900">EduMind AI Teacher</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-xs cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Profile Card */}
          <div className="p-3 bg-white rounded-2xl border border-emerald-100/80 shadow-xs flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-700/20"
                style={{ background: EMERALD_GRADIENT }}
              >
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                  {user?.name || "O'qituvchi"}
                </h4>
                {isPro && <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              <span
                className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  isPro ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isPro ? 'PRO Ustoz' : 'Standart Reja'}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    style={({ isActive }) => isActive ? { background: EMERALD_GRADIENT } : {}}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'text-white shadow-md shadow-emerald-700/25'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[13px] font-bold truncate">{label}</span>
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
              </div>
            </div>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Chiqilmoqda...' : 'Tizimdan chiqish'}</span>
          </button>

          <p className="text-center text-[10px] text-slate-400 font-medium">
            EduMind AI — Teacher
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE BOTTOM BAR (< md)
      ══════════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center justify-around">
        {bottomNavItems.map(({ to, shortLabel, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-emerald-50 text-emerald-600 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[64px] ${
                    isActive ? 'font-black text-emerald-700' : 'font-medium'
                  }`}
                >
                  {shortLabel}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Menu Drawer Trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        >
          <div className="w-9 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
            <Menu className="w-4 h-4 stroke-[1.8]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Menyu</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;

