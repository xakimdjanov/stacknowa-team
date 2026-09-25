import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  FileCheck2,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  BookOpen,
  ChevronRight,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  {
    group: 'ASOSIY',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    group: 'BOSHQARUV',
    items: [
      { to: '/users', label: 'Foydalanuvchilar', icon: Users },
      { to: '/assignments', label: 'Topshiriqlar', icon: FileCheck2 },
      { to: '/groups', label: 'Guruhlar & QR', icon: Layers },
    ],
  },
  {
    group: 'MOLIYA',
    items: [
      { to: '/plans', label: 'Tariflar', icon: CreditCard },
      { to: '/transactions', label: "To'lovlar Tarixi", icon: BookOpen },
    ],
  },
  {
    group: 'TIZIM',
    items: [
      { to: '/settings', label: 'Sozlamalar', icon: Settings },
    ],
  },
];

const bottomNavItems = [
  { to: '/', label: 'Dashboard', shortLabel: 'Asosiy', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Foydalanuvchilar', shortLabel: 'Foydalanuvchilar', icon: Users },
  { to: '/groups', label: 'Guruhlar', shortLabel: 'Guruhlar', icon: Layers },
  { to: '/transactions', label: "To'lovlar", shortLabel: "To'lovlar", icon: BookOpen },
];

/* ─── Nav Item Component ─────────────────────────── */
const NavItem = ({ to, label, icon: Icon, end, onClick }) => {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))' : 'transparent',
        color: isActive ? '#4f46e5' : '#64748b',
      }}
    >
      {/* Active left bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ background: 'linear-gradient(180deg,#6366f1,#8b5cf6)' }}
        />
      )}

      {/* Icon */}
      <span
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          background: isActive
            ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
            : 'rgba(100,116,139,0.08)',
        }}
      >
        <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : '#94a3b8' }} />
      </span>

      <span className="flex-1 truncate font-semibold text-xs sm:text-sm">{label}</span>

      {isActive && (
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6366f1' }} />
      )}

      {!isActive && (
        <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(99,102,241,0.05)' }} />
      )}
    </NavLink>
  );
};

/* ─── Main Sidebar Component ─────────────────────── */
const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close drawer on route change
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
    }, 400);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR (md+)
      ══════════════════════════════════════ */}
      <aside
        className="hidden md:flex w-64 h-screen sticky top-0 flex-col flex-shrink-0 relative overflow-y-auto z-30 select-none"
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
        }}
      >
        {/* Top indigo accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)' }}
        />

        {/* ── Brand ── */}
        <div className="px-5 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold tracking-tight text-slate-800 leading-none">
                AI Practice
              </h1>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-2.5 h-2.5 text-indigo-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 h-px bg-slate-100" />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 space-y-5 overflow-y-auto pb-4">
          {links.map((section) => (
            <div key={section.group}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* ── User Profile & Logout ── */}
        <div className="p-4">
          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 text-white"
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              {/* Online dot */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              color: loggingOut ? '#94a3b8' : '#ef4444',
              background: loggingOut ? '#f8fafc' : 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onMouseEnter={(e) => { if (!loggingOut) e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { if (!loggingOut) e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Chiqilmoqda...' : 'Tizimdan chiqish'}</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MOBILE TOP APP BAR (< md)
      ══════════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-[58px] bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none">AI Practice</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-50 text-[9px] font-bold text-indigo-600 tracking-wide">ADMIN</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Boshqaruv markazi</span>
          </div>
        </div>

        {/* User Avatar & Status */}
        <button
          onClick={() => setMobileOpen(true)}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-500/20 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          title="Menyu & Profil"
          aria-label="Menyu va profil"
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
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-indigo-50/50 via-slate-50/30 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-slate-900">AI Practice Admin</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-xs"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Profile Card */}
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 shadow-xs flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 truncate leading-snug">{user?.name || 'Administrator'}</h4>
                <Shield className="w-3 h-3 text-indigo-600 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@platform.uz'}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {links.map((section) => (
            <div key={section.group}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {section.group}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.to}
                    {...item}
                    onClick={() => setMobileOpen(false)}
                  />
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
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 active:scale-[0.98] transition-all shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Chiqilmoqda...' : 'Tizimdan chiqish'}</span>
          </button>

          <p className="text-center text-[10px] text-slate-400 font-medium">
            AI Practice Admin v2.4 • StackNowa
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM BAR (< md)
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center justify-around">
        {bottomNavItems.map(({ to, shortLabel, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-indigo-50 text-indigo-600 shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[64px] ${isActive ? 'font-black text-indigo-600' : 'font-medium'}`}>
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
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-400 hover:text-slate-700 transition-all"
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
