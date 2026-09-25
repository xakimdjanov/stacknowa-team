import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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

/* ─── Nav Item ─────────────────────────────────── */
const NavItem = ({ to, label, icon: Icon, end }) => {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))' : 'transparent',
        color: isActive ? '#4f46e5' : '#64748b',
      }}
    >
      {/* Active left bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
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

      <span className="flex-1 truncate">{label}</span>

      {isActive && (
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6366f1' }} />
      )}

      {!isActive && (
        <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(99,102,241,0.05)' }} />
      )}
    </NavLink>
  );
};

/* ─── Main Sidebar ─────────────────────────────── */
const Sidebar = () => {
  const { logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => logout(), 500);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <aside
      className="w-64 h-screen flex flex-col flex-shrink-0 relative overflow-y-auto"
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

      {/* ── User Profile ── */}
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
  );
};

export default Sidebar;
