import React from 'react';
import { Building, ShieldCheck, Users, GraduationCap, Layers, UserCheck, CheckCircle2, Award, Sparkles, Video, BarChart3, FileText, Check } from 'lucide-react';

export default function Solution() {
  const hierarchyNodes = [
    { title: 'University Admin', role: 'OTM Boshqaruvi', icon: Building, color: '#34D399' },
    { title: 'Faculty', role: 'Fakultet Dekanati', icon: Layers, color: '#60A5FA' },
    { title: 'Department', role: 'Kafedra Mudirligi', icon: ShieldCheck, color: '#F59E0B' },
    { title: 'Teacher', role: 'O‘qituvchilar', icon: GraduationCap, color: '#A78BFA' },
    { title: 'Group', role: 'Akademik Guruhlar', icon: Users, color: '#EC4899' },
    { title: 'Student', role: 'Talabalar Portal', icon: UserCheck, color: '#34D399' },
  ];

  const floatingCards = [
    { name: 'Teacher approval', icon: CheckCircle2, tag: 'Admin Control' },
    { name: 'Group management', icon: Users, tag: 'Structure' },
    { name: 'Assignment', icon: FileText, tag: 'AI Evaluation' },
    { name: 'Attendance', icon: Award, tag: 'Smart Tracking' },
    { name: 'Live Classroom', icon: Video, tag: 'Game PIN Quiz' },
    { name: 'Analytics', icon: BarChart3, tag: 'Real-time KPIs' },
  ];

  return (
    <section style={{
      backgroundColor: '#0B1220',
      color: '#FFFFFF',
      padding: '110px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Glow Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, rgba(11, 18, 32, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(70px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#34D399" /> YAGONA EKOTIZIM
          </span>
          <h2 className="section-heading" style={{ color: '#FFFFFF', marginBottom: '16px' }}>
            Bitta platforma. Butun universitet.
          </h2>
          <p className="section-subheading" style={{ color: '#9CA3AF' }}>
            Smart Edu universitet boshqaruvi, o‘qituvchi va talabani yagona raqamli ekotizimga bog‘laydi.
          </p>
        </div>

        {/* HIERARCHY FLOW VISUALIZATION */}
        <div style={{
          position: 'relative',
          maxWidth: '1000px',
          margin: '0 auto 60px',
          padding: '40px 20px',
          background: 'rgba(19, 30, 50, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '28px',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Hierarchy Step Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            position: 'relative',
            zIndex: 2
          }}>
            {hierarchyNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.title}
                  style={{
                    backgroundColor: '#131E32',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px 14px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = node.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: `${node.color}15`,
                    color: node.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFF' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
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
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    color: '#E5E7EB',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  <Icon size={16} color="#34D399" />
                  <span>{card.name}</span>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: '#34D399',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    marginLeft: '4px'
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
            color: '#FFFFFF',
            letterSpacing: '-0.01em'
          }}>
            “Bir universitet. Bir ekotizim. <span style={{ color: '#34D399' }}>Bitta platforma.</span>”
          </h3>
        </div>

      </div>
    </section>
  );
}
