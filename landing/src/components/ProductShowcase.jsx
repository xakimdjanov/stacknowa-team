import React, { useState } from 'react';
import {
  LayoutDashboard, Building2, Layers, GraduationCap, Users, UserCheck,
  FileText, Video, LineChart, Settings, Bell, Search, Sparkles, CheckCircle2,
  Clock, TrendingUp, AlertCircle, PlayCircle, Filter, ArrowUpRight
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
      padding: '110px 0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid #E2E8F0'
    }}>
      {/* Background glow effects */}
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
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> REAL-TIME ADMIN DASHBOARD
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Universitetingizni real vaqt rejimida ko‘ring.
          </h2>
          <p className="section-subheading">
            Butun universitet faoliyati, akademik baholar va jonli davomat ko‘rsatkichlari bitta interaktiv SaaS boshqaruv panelida.
          </p>
        </div>

        {/* LARGE DASHBOARD MOCKUP CENTERED */}
        <div style={{ position: 'relative', maxWidth: '1140px', margin: '0 auto' }}>
          
          {/* FLOATING ACTION CARDS */}
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: '-20px',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #A7F3D0',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px -5px rgba(5, 150, 105, 0.15)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-left">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Topshiriq baholandi</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Axborot xavfsizligi • 120 talaba</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '40%',
            right: '-24px',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.15)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-right">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <PlayCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Live dars boshlandi</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Game PIN #849201 • Prof. Karimov</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '15%',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #FDE68A',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px -5px rgba(217, 119, 6, 0.15)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-bottom">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <UserCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Davomat yangilandi</div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>94% davomat qayd etildi</div>
            </div>
          </div>

          {/* MAIN DASHBOARD SHELL */}
          <div style={{
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.6)'
          }}>
            
            {/* TOP DASHBOARD CONTROL BAR */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#64748B' }}>
                  <Search size={14} />
                  <span>Universitet bo‘yicha qidiruv (talaba, o‘qituvchi, guruh)...</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Bell size={18} color="#64748B" />
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#059669', borderRadius: '50%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #E2E8F0', paddingLeft: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#FFFFFF', fontSize: '12px' }}>
                    RA
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Rektorat Admin</div>
                    <div style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>Boshqaruvchi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DASHBOARD INNER CONTENT (Sidebar + Main Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }} className="dashboard-grid">
              
              {/* LEFT SIDEBAR */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRight: '1px solid #E2E8F0',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', padding: '0 12px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ASOSIY MENYU
                </div>
                {sidebarNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                        color: isActive ? '#059669' : '#64748B',
                        border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={16} color={isActive ? '#059669' : '#64748B'} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* MAIN CONTENT AREA */}
              <div style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
                
                {/* TOP 4 METRICS */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
                      <span>Talabalar</span>
                      <Users size={16} color="#059669" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>24,500</div>
                    <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <TrendingUp size={12} /> +12.4% bu semestr
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
                      <span>O‘qituvchilar</span>
                      <GraduationCap size={16} color="#2563EB" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>1,240</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>100% akkreditatsiya</div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
                      <span>O‘rtacha Davomat</span>
                      <UserCheck size={16} color="#059669" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>92%</div>
                    <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>Avto QR va Live PIN</div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>
                      <span>Jonli Darslar</span>
                      <Video size={16} color="#D97706" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>186</div>
                    <div style={{ fontSize: '11px', color: '#D97706', marginTop: '4px', fontWeight: '600' }}>Hozir dars ketmoqda</div>
                  </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="main-content-grid">
                  
                  {/* Left Column: Attendance Chart + Assignment Activity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Attendance Chart Mockup */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Haftalik Davomat va Ishtirok Grafikasi</h4>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>Barcha 12 ta fakultet kesimida</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>Real-time Sync</span>
                      </div>

                      {/* Mock Chart Visual Bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                        {[
                          { day: 'Dush', val: '88%' },
                          { day: 'Sesh', val: '94%' },
                          { day: 'Chorsh', val: '91%' },
                          { day: 'Pay', val: '96%' },
                          { day: 'Jum', val: '89%' },
                          { day: 'Shan', val: '85%' },
                        ].map((d, i) => (
                          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '12%' }}>
                            <span style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>{d.val}</span>
                            <div style={{
                              width: '100%',
                              height: `${parseInt(d.val)}px`,
                              background: i === 3 ? 'linear-gradient(180deg, #10B981, #059669)' : '#A7F3D0',
                              borderRadius: '6px 6px 0 0'
                            }} />
                            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignment Activity */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Topshiriqlar Faoliyati (Assignments)</h4>
                        <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700' }}>Gemini AI Baholash</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={16} color="#059669" />
                            <span style={{ color: '#1E293B', fontWeight: '600' }}>Algoritmlar va Ma'lumotlar Tuzilmasi</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>412 topshirildi</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={16} color="#2563EB" />
                            <span style={{ color: '#1E293B', fontWeight: '600' }}>Sun'iy Intellekt va Mashinali O‘qitish</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700' }}>298 topshirildi</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Faculty Performance, Recent Live Classes, Teacher Activity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Faculty Performance */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>Fakultetlar Samaradorligi</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#334155', fontWeight: '600' }}>Kompyuter Injiniringi</span>
                            <span style={{ color: '#059669', fontWeight: '700' }}>98%</span>
                          </div>
                          <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px' }}>
                            <div style={{ width: '98%', height: '100%', background: '#059669', borderRadius: '3px' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#334155', fontWeight: '600' }}>Raqamli Iqtisodiyot</span>
                            <span style={{ color: '#2563EB', fontWeight: '700' }}>92%</span>
                          </div>
                          <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px' }}>
                            <div style={{ width: '92%', height: '100%', background: '#2563EB', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Live Classes & Teacher Activity */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>Jonli Darslar & Faollik</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <Video size={14} color="#D97706" />
                          <span style={{ fontWeight: '500' }}>Prof. Alimov • Game PIN #9102</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <GraduationCap size={14} color="#059669" />
                          <span style={{ fontWeight: '500' }}>Doc. Abdullayeva • 32 ta quiz baholadi</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Demo Callout underneath Showcase */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button onClick={onOpenDemo} className="btn-primary">
            Ushbu dashboardni demo ko‘rish <ArrowUpRight size={18} />
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .floating-card-left, .floating-card-right, .floating-card-bottom { display: none !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .main-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
