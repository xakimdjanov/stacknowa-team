import React from 'react';
import { Building, ShieldCheck, Users, GraduationCap, Layers, UserCheck, CheckCircle2, Award, Sparkles, Video, BarChart3, FileText, Check } from 'lucide-react';

export default function Solution() {
  const hierarchyNodes = [
    { title: 'University Admin', role: 'OTM Boshqaruvi', icon: Building, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { title: 'Faculty', role: 'Fakultet Dekanati', icon: Layers, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { title: 'Department', role: 'Kafedra Mudirligi', icon: ShieldCheck, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { title: 'Teacher', role: 'O‘qituvchilar', icon: GraduationCap, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    { title: 'Group', role: 'Akademik Guruhlar', icon: Users, color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8' },
    { title: 'Student', role: 'Talabalar Portali', icon: UserCheck, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  ];

  const floatingCards = [
    { name: 'Teacher approval', icon: CheckCircle2, tag: 'Admin Control' },
    { name: 'Group management', icon: Users, tag: 'Structure' },
    { name: 'Assignment & AI Check', icon: FileText, tag: 'AI Evaluation' },
    { name: 'Attendance tracking', icon: Award, tag: 'Smart Tracking' },
    { name: 'Live Classroom', icon: Video, tag: 'Game PIN Quiz' },
    { name: 'University Analytics', icon: BarChart3, tag: 'Real-time KPIs' },
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
      {/* Subtle Glow Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#059669" /> YAGONA EKOTIZIM
          </span>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>
            Bitta platforma. Butun universitet.
          </h2>
          <p className="section-subheading">
            EduMind AI universitet rektorati, dekanatlar, o‘qituvchilar va talabalarni yagona raqamli ekotizimga bog‘laydi.
          </p>
        </div>

        {/* HIERARCHY FLOW VISUALIZATION */}
        <div style={{
          position: 'relative',
          maxWidth: '1080px',
          margin: '0 auto 60px',
          padding: '44px 28px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '28px',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Hierarchy Step Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '14px',
            position: 'relative',
            zIndex: 2
          }}>
            {hierarchyNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '18px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = node.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: node.bg,
                    border: `1px solid ${node.border}`,
                    color: node.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: '500' }}>
                    {node.role}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connected Floating Feature Pills Around Hierarchy */}
          <div style={{
            marginTop: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px'
          }}>
            {floatingCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#1E293B',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <Icon size={16} color="#059669" />
                  <span>{card.name}</span>
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    border: '1px solid #A7F3D0',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    marginLeft: '4px',
                    fontWeight: '700'
                  }}>
                    {card.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN STATEMENT */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.01em'
          }}>
            “Bir universitet. Bir ekotizim. <span style={{ color: '#059669' }}>Bitta platforma.</span>”
          </h3>
        </div>

      </div>
    </section>
  );
}
