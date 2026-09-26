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
      backgroundColor: '#0B1220',
      color: '#FFFFFF',
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(52, 211, 153, 0.12) 0%, rgba(11, 18, 32, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#34D399" /> REAL-TIME ADMIN DASHBOARD
          </span>
          <h2 className="section-heading" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Universitetingizni real vaqt rejimida ko‘ring.
          </h2>
          <p className="section-subheading" style={{ color: '#9CA3AF' }}>
            Butun universitet faoliyati, akademik baholar va jonli davomat ko‘rsatkichlari bitta interaktiv dashboardda.
          </p>
        </div>

        {/* LARGE DASHBOARD MOCKUP CENTERED */}
        <div style={{ position: 'relative', maxWidth: '1140px', margin: '0 auto' }}>
          
          {/* FLOATING ACTION CARDS (3 as specified) */}
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: '-20px',
            zIndex: 10,
            background: '#131E32',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-left">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>Assignment submitted</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Axborot xavfsizligi • 120 talaba</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '40%',
            right: '-24px',
            zIndex: 10,
            background: '#131E32',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-right">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(96, 165, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
              <PlayCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>Live class started</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Game PIN #849201 • Prof. Karimov</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '15%',
            zIndex: 10,
            background: '#131E32',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }} className="floating-card-bottom">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <UserCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>Attendance updated</div>
              <div style={{ fontSize: '11px', color: '#34D399' }}>94% davomat qayd etildi</div>
            </div>
          </div>

          {/* MAIN DASHBOARD SHELL */}
          <div className="glass-card-dark" style={{
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 50px rgba(52, 211, 153, 0.15)'
          }}>
            
            {/* TOP DASHBOARD CONTROL BAR */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#9CA3AF' }}>
                  <Search size={14} />
                  <span>Universitet bo‘yicha qidiruv (talaba, o‘qituvchi, guruh)...</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Bell size={18} color="#9CA3AF" />
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#34D399', borderRadius: '50%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #34D399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#0B1220', fontSize: '13px' }}>
                    RA
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>Rektorat Admin</div>
                    <div style={{ fontSize: '10px', color: '#34D399' }}>Boshqaruvchi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DASHBOARD INNER CONTENT (Sidebar + Main Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }} className="dashboard-grid">
              
              {/* LEFT SIDEBAR (Exact 10 items from prompt) */}
              <div style={{
                backgroundColor: 'rgba(11, 18, 32, 0.6)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', padding: '0 12px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MENYU
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
                        backgroundColor: isActive ? 'rgba(52, 211, 153, 0.12)' : 'transparent',
                        color: isActive ? '#34D399' : '#9CA3AF',
                        border: isActive ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid transparent',
                        fontSize: '13px',
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={16} color={isActive ? '#34D399' : '#9CA3AF'} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* MAIN CONTENT AREA */}
              <div style={{ padding: '24px', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                
                {/* TOP 4 METRICS (Exact from prompt: 24,500 Students, 1,240 Teachers, 92% Attendance, 186 Active Classes) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '12px' }}>
                      <span>24,500 Students</span>
                      <Users size={16} color="#34D399" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', marginTop: '6px' }}>24,500</div>
                    <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={12} /> +12.4% bu oy
                    </div>
                  </div>

                  <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '12px' }}>
                      <span>1,240 Teachers</span>
                      <GraduationCap size={16} color="#60A5FA" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', marginTop: '6px' }}>1,240</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>100% aktiv akkreditatsiya</div>
                  </div>

                  <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '12px' }}>
                      <span>92% Attendance</span>
                      <UserCheck size={16} color="#34D399" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#34D399', marginTop: '6px' }}>92%</div>
                    <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>Avto QR va Live PIN</div>
                  </div>

                  <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '12px' }}>
                      <span>186 Active Classes</span>
                      <Video size={16} color="#F59E0B" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', marginTop: '6px' }}>186</div>
                    <div style={{ fontSize: '11px', color: '#F59E0B', marginTop: '4px' }}>Hozir jonli efirda</div>
                  </div>
                </div>

                {/* MAIN CONTENT GRID (Attendance Chart, Faculty Performance, Assignment Activity, Recent Live Classes, Teacher Activity) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="main-content-grid">
                  
                  {/* Left Column: Attendance Chart + Assignment Activity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Attendance Chart Mockup */}
                    <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FFF' }}>Haftalik Davomat va Ishtirok Grafikasi</h4>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Barcha 12 ta fakultet kesimida</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '4px 10px', borderRadius: '6px' }}>Real-time Sync</span>
                      </div>

                      {/* Mock Chart Visual Bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {[
                          { day: 'Dush', val: '88%' },
                          { day: 'Sesh', val: '94%' },
                          { day: 'Chorsh', val: '91%' },
                          { day: 'Pay', val: '96%' },
                          { day: 'Jum', val: '89%' },
                          { day: 'Shan', val: '85%' },
                        ].map((d, i) => (
                          <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '12%' }}>
                            <span style={{ fontSize: '10px', color: '#34D399', fontWeight: '700' }}>{d.val}</span>
                            <div style={{
                              width: '100%',
                              height: `${parseInt(d.val)}px`,
                              background: i === 3 ? 'linear-gradient(180deg, #34D399, #059669)' : 'rgba(52, 211, 153, 0.3)',
                              borderRadius: '6px 6px 0 0'
                            }} />
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignment Activity */}
                    <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>Topshiriqlar Faoliyati (Assignment Activity)</h4>
                        <span style={{ fontSize: '11px', color: '#60A5FA' }}>Gemini AI Baholash</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={16} color="#34D399" />
                            <span>Algoritmlar va Ma'lumotlar Tuzilmasi</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '700' }}>412 topshirildi</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={16} color="#60A5FA" />
                            <span>Sun'iy Intellekt va Neyron Tarmoqlar</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: '700' }}>298 topshirildi</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Faculty Performance, Recent Live Classes, Teacher Activity */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Faculty Performance */}
                    <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFF', marginBottom: '14px' }}>Fakultetlar Samaradorligi</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#E5E7EB' }}>Kompyuter Injiniringi</span>
                            <span style={{ color: '#34D399', fontWeight: '700' }}>98%</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                            <div style={{ width: '98%', height: '100%', background: '#34D399', borderRadius: '3px' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#E5E7EB' }}>Raqamli Iqtisodiyot</span>
                            <span style={{ color: '#60A5FA', fontWeight: '700' }}>92%</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                            <div style={{ width: '92%', height: '100%', background: '#60A5FA', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Live Classes & Teacher Activity */}
                    <div style={{ background: '#131E32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFF', marginBottom: '12px' }}>Jonli Darslar & O‘qituvchilar</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#D1D5DB' }}>
                          <Video size={14} color="#F59E0B" />
                          <span>Prof. Alimov • Game PIN #9102</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#D1D5DB' }}>
                          <GraduationCap size={14} color="#34D399" />
                          <span>Doc. Abdullayeva • 32 ta quiz baholadi</span>
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
