import React, { useState } from 'react';
import {
  LayoutDashboard, Building2, Layers, GraduationCap, Users, UserCheck,
  FileText, Video, LineChart, Settings, Bell, Search, Sparkles,
  TrendingUp, PlayCircle, ArrowUpRight
} from 'lucide-react';

export default function ProductShowcase({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const sidebarNav = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Faculties', icon: Building2 },
    { name: 'Departments', icon: Layers },
    { name: 'Teachers', icon: GraduationCap },
    { name: 'Students', icon: Users },
    { name: 'Groups', icon: UserCheck },
    { name: 'Assignments', icon: FileText },
    { name: 'Live Classes', icon: Video },
    { name: 'Analytics', icon: LineChart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid #E2E8F0'
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} color="#059669" /> REAL-TIME ADMIN DASHBOARD
          </span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>
            Universitetingizni real vaqt rejimida ko'ring.
          </h2>
          <p className="section-subheading">
            Butun universitet faoliyati, akademik baholar va jonli davomat ko'rsatkichlari bitta interaktiv SaaS boshqaruv panelida.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Floating Cards — Hidden on small mobile */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-16px',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 15px 30px -5px rgba(5, 150, 105, 0.15)',
          }} className="floating-card-left">
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
              <FileText size={16} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>Topshiriq baholandi</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Axborot xavfsizligi • 120 talaba</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '38%',
            right: '-16px',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.15)',
          }} className="floating-card-right">
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
              <PlayCircle size={16} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>Live dars boshlandi</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Game PIN #849201</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-16px',
            left: '12%',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 15px 30px -5px rgba(217, 119, 6, 0.15)',
          }} className="floating-card-bottom">
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
              <UserCheck size={16} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>Davomat yangilandi</div>
              <div style={{ fontSize: '10px', color: '#059669', fontWeight: '600' }}>94% qayd etildi</div>
            </div>
          </div>

          {/* Main Dashboard Shell */}
          <div style={{
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.6)'
          }}>
            
            {/* Top Bar */}
            <div className="dashboard-top-bar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div className="dashboard-search-box" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', color: '#64748B', overflow: 'hidden', minWidth: 0 }}>
                  <Search size={12} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Qidiruv...</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Bell size={16} color="#64748B" />
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '7px', height: '7px', background: '#059669', borderRadius: '50%' }} />
                </div>
                <div className="dashboard-admin-badge" style={{ display: 'flex', alignItems: 'center', gap: '7px', borderLeft: '1px solid #E2E8F0', paddingLeft: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#FFFFFF', fontSize: '10px', flexShrink: 0 }}>
                    RA
                  </div>
                  <div className="dashboard-admin-text">
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', lineHeight: '1.2' }}>Rektorat Admin</div>
                    <div style={{ fontSize: '9px', color: '#059669', fontWeight: '700' }}>Boshqaruvchi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inner: Sidebar + Main */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr' }} className="dashboard-grid">
              
              {/* Sidebar */}
              <div className="dashboard-sidebar" style={{
                backgroundColor: '#F8FAFC',
                borderRight: '1px solid #E2E8F0',
                padding: '14px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div className="dashboard-sidebar-title" style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ASOSIY MENYU
                </div>
                {sidebarNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className="dashboard-sidebar-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        borderRadius: '9px',
                        backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                        color: isActive ? '#059669' : '#64748B',
                        border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                        fontSize: '12px',
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Icon size={14} color={isActive ? '#059669' : '#64748B'} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Area */}
              <div className="dashboard-main-area" style={{ padding: '18px', backgroundColor: '#FFFFFF' }}>
                
                {/* Metrics Row */}
                <div className="dashboard-metrics-row" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px',
                  marginBottom: '18px'
                }}>
                  {[
                    { label: 'Talabalar', val: '24,500', sub: '+12.4% bu semestr', icon: Users, iconColor: '#059669', subColor: '#059669' },
                    { label: 'O\'qituvchilar', val: '1,240', sub: '100% akkreditatsiya', icon: GraduationCap, iconColor: '#2563EB', subColor: '#64748B' },
                    { label: 'O\'rtacha Davomat', val: '92%', sub: 'Avto QR va Live PIN', icon: UserCheck, iconColor: '#059669', valColor: '#059669', subColor: '#059669' },
                    { label: 'Jonli Darslar', val: '186', sub: 'Hozir dars ketmoqda', icon: Video, iconColor: '#D97706', subColor: '#D97706' },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '11px', fontWeight: '600' }}>
                          <span>{m.label}</span>
                          <Icon size={14} color={m.iconColor} style={{ flexShrink: 0 }} />
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: m.valColor || '#0F172A', marginTop: '5px' }}>{m.val}</div>
                        <div style={{ fontSize: '10px', color: m.subColor, marginTop: '3px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {m.subColor === '#059669' && <TrendingUp size={10} />} {m.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px' }} className="main-content-grid">
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Attendance Chart */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Haftalik Davomat Grafikasi</h4>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>Barcha 12 ta fakultet</span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', flexShrink: 0 }}>Live</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
                        {[
                          { day: 'Du', val: 88 },
                          { day: 'Se', val: 94 },
                          { day: 'Ch', val: 91 },
                          { day: 'Pa', val: 96 },
                          { day: 'Ju', val: 89 },
                          { day: 'Sh', val: 85 },
                        ].map((d, i) => (
                          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '13%' }}>
                            <span style={{ fontSize: '9px', color: '#059669', fontWeight: '700' }}>{d.val}%</span>
                            <div style={{
                              width: '100%',
                              height: `${d.val}px`,
                              background: i === 3 ? 'linear-gradient(180deg, #10B981, #059669)' : '#A7F3D0',
                              borderRadius: '5px 5px 0 0'
                            }} />
                            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignment Activity */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Topshiriqlar Faoliyati</h4>
                        <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: '700' }}>Gemini AI</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { text: 'Algoritmlar va Ma\'lumotlar Tuzilmasi', count: '412 topshirildi', color: '#059669', icon: FileText },
                          { text: 'Sun\'iy Intellekt va Mashinali O\'qitish', count: '298 topshirildi', color: '#2563EB', icon: FileText },
                        ].map((a) => {
                          const Icon = a.icon;
                          return (
                            <div key={a.text} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '9px', fontSize: '12px', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                <Icon size={14} color={a.color} style={{ flexShrink: 0 }} />
                                <span style={{ color: '#1E293B', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</span>
                              </div>
                              <span style={{ fontSize: '10px', color: a.color, fontWeight: '700', flexShrink: 0 }}>{a.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Faculty Performance */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>Fakultetlar Samaradorligi</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          { name: 'Kompyuter Injiniringi', pct: 98, color: '#059669' },
                          { name: 'Raqamli Iqtisodiyot', pct: 92, color: '#2563EB' },
                        ].map((row) => (
                          <div key={row.name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                              <span style={{ color: '#334155', fontWeight: '600' }}>{row.name}</span>
                              <span style={{ color: row.color, fontWeight: '700' }}>{row.pct}%</span>
                            </div>
                            <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '3px' }}>
                              <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: '3px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Classes */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>Jonli Darslar & Faollik</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                        {[
                          { icon: Video, color: '#D97706', text: 'Prof. Alimov • Game PIN #9102' },
                          { icon: GraduationCap, color: '#059669', text: 'Doc. Abdullayeva • 32 quiz' },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                              <Icon size={13} color={item.color} style={{ flexShrink: 0 }} />
                              <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Callout */}
        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <button onClick={onOpenDemo} className="btn-primary">
            Ushbu dashboardni demo ko'rish <ArrowUpRight size={17} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 1000px) {
          .floating-card-left, .floating-card-right, .floating-card-bottom { display: none !important; }
        }
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-sidebar { display: none !important; }
          .main-content-grid { grid-template-columns: 1fr !important; }
          .dashboard-admin-text { display: none !important; }
          .dashboard-search-box { max-width: 120px !important; }
        }
        @media (max-width: 480px) {
          .dashboard-metrics-row { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .dashboard-main-area { padding: 12px !important; }
          .dashboard-top-bar { padding: 10px 12px !important; }
        }
        @media (max-width: 400px) {
          .dashboard-metrics-row { grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
        }
      `}</style>
    </section>
  );
}
