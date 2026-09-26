import React from 'react';
import { Building, ShieldCheck, Users, GraduationCap, Layers, UserCheck, CheckCircle2, Award, Sparkles, Video, BarChart3, FileText } from 'lucide-react';

export default function Solution() {
  const hierarchyNodes = [
    { title: 'University Admin', role: 'OTM Boshqaruvi', icon: Building, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { title: 'Faculty', role: 'Fakultet Dekanati', icon: Layers, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { title: 'Department', role: 'Kafedra Mudirligi', icon: ShieldCheck, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { title: 'Teacher', role: 'O\'qituvchilar', icon: GraduationCap, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
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
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid #E2E8F0'
    }}>
      {/* Glow BG */}
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
        <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} color="#059669" /> YAGONA EKOTIZIM
          </span>
          <h2 className="section-heading" style={{ marginBottom: '14px' }}>
            Bitta platforma. Butun universitet.
          </h2>
          <p className="section-subheading">
            EduMind AI universitet rektorati, dekanatlar, o'qituvchilar va talabalarni yagona raqamli ekotizimga bog'laydi.
          </p>
        </div>

        {/* Hierarchy Box */}
        <div className="solution-hierarchy-box" style={{
          position: 'relative',
          maxWidth: '1080px',
          margin: '0 auto 40px',
          padding: '32px 20px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Hierarchy Grid */}
          <div className="solution-hierarchy-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
            position: 'relative',
            zIndex: 2
          }}>
            {hierarchyNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.title}
                  className="solution-hierarchy-item"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '18px 10px',
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
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: node.bg,
                    border: `1px solid ${node.border}`,
                    color: node.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px'
                  }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                    {node.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '3px', fontWeight: '500' }}>
                    {node.role}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pill Cards */}
          <div className="solution-pill-cards" style={{
            marginTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {floatingCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.name}
                  className="solution-pill-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#1E293B',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <Icon size={13} color="#059669" />
                  <span>{card.name}</span>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    border: '1px solid #A7F3D0',
                    padding: '1px 5px',
                    borderRadius: '6px',
                    fontWeight: '700'
                  }}>
                    {card.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statement */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontSize: 'clamp(17px, 3vw, 30px)',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.01em',
            lineHeight: '1.3'
          }}>
            "Bir universitet. Bir ekotizim. <span style={{ color: '#059669' }}>Bitta platforma.</span>"
          </h3>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .solution-hierarchy-box { padding: 18px 12px !important; border-radius: 18px !important; }
          .solution-hierarchy-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .solution-hierarchy-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .solution-hierarchy-item { padding: 14px 8px !important; border-radius: 12px !important; }
          .solution-pill-cards { gap: 5px !important; }
          .solution-pill-item { font-size: 11px !important; padding: 5px 9px !important; gap: 5px !important; }
        }
        @media (max-width: 400px) {
          .solution-hierarchy-grid { gap: 6px !important; }
          .solution-pill-item span:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}
