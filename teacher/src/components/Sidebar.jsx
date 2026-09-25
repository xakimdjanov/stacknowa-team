import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/', label: 'Overview' },
    { to: '/groups', label: 'Groups' },
    { to: '/group-detail', label: 'Group Detail' },
    { to: '/assignments', label: 'Assignments' },
    { to: '/submissions', label: 'Submissions' },
    { to: '/student-detail', label: 'Student Detail' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/ai-assistant', label: 'AI Assistant' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white min-h-screen flex flex-col justify-between border-r border-slate-200 flex-shrink-0">
      <div>
        {/* Brand */}
        <div className="p-8 pb-4">
          <h1 className="text-slate-900 font-extrabold text-xl tracking-tight uppercase">AI PRACTICE</h1>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1 block">
            TEACHER
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {links.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block px-5 py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 relative ${
                    isActive
                      ? 'bg-blue-50 text-slate-900 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:bg-blue-600 before:rounded-r-full'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            {user?.name?.[0] || 'T'}
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">Account</p>
            <p className="text-[11px] font-medium text-slate-500">{user?.email || 'teacher@uni.edu'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

