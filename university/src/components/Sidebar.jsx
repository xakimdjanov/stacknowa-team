import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Layers,
  Receipt,
  GraduationCap,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMERALD_GRADIENT = 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 100%)';

const navItems = [
  { to: '/', label: 'Boshqaruv Paneli', shortLabel: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teachers', label: "O'qituvchilar Ro'yxati", shortLabel: "O'qituvchilar", icon: GraduationCap },
  { to: '/teacher-approvals', label: "Arizalarni Tasdiqlash", shortLabel: 'Tasdiqlash', icon: UserCheck },
  { to: '/groups', label: "Guruhlar va Details", shortLabel: 'Guruhlar', icon: Building2 },
  { to: '/structure', label: 'Fakultet va Kafedralar', shortLabel: 'Struktura', icon: Layers },
  { to: '/billing', label: "Tarif & To'lovlar Tarixi", shortLabel: "To'lovlar", icon: CreditCard },
  { to: '/settings', label: 'Universitet Sozlamalari', shortLabel: 'Sozlamalar', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const planRaw = user?.university_plan || user?.university?.plan_name || 'ENTERPRISE';
  const isStarter = String(planRaw).toUpperCase().includes('STARTER');
  const isStandart = String(planRaw).toUpperCase().includes('STANDART') || String(planRaw).toUpperCase().includes('STANDARD');
  
  const planTag = isStarter ? "STARTER" : isStandart ? "STANDART" : "ENTERPRISE";
  const planTitle = isStarter ? "Starter Plan" : isStandart ? "Standart Plan" : "Enterprise Plan";
  const planPrice = isStarter ? "12 mln so‘m / yil" : isStandart ? "24 mln so‘m / yil" : "36 mln so‘m / yil";

  const displayName = user?.university_name || user?.name || "Namdtu University";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between min-h-screen p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* University Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-base shadow-md shadow-emerald-600/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
              Universitet Admin
            </span>
            <h2 className="font-bold text-sm text-slate-800 truncate leading-tight">
              {displayName}
            </h2>
            <div className="font-mono text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-emerald-500" />
              {user?.university_code || "TATU-9842"}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => (isActive ? { background: EMERALD_GRADIENT } : {})}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'text-white shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-400 mb-1">
            <span>Obuna Ta'rifi</span>
            <span className="text-emerald-700 font-extrabold">{planTag}</span>
          </div>
          <div className="font-bold text-slate-800">{planTitle}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{planPrice} obuna</div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Tizimdan Chiqish
        </button>
      </div>
    </aside>
  );
}
